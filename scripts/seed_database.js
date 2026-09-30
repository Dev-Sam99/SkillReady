const fs = require('fs');
const path = require('path');
const { neon } = require('@neondatabase/serverless');

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl || !databaseUrl.startsWith('postgres')) {
  console.log('No valid DATABASE_URL found. Skipping live database insertion. (Mock data updated successfully).');
  process.exit(0);
}

const sql = neon(databaseUrl);

const dir = path.join(__dirname, '../study_materials');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));

const nameMap = {
  'Angular.md': 'Angular',
  'Behavioral_Questions.md': 'Behavioral Questions',
  'CSS.md': 'CSS',
  'DotNet.md': '.NET Framework & Core',
  'Git.md': 'Git & Version Control',
  'Javascript.md': 'JavaScript',
  'React.md': 'React',
  'SQL.md': 'SQL & Databases',
  'Typescript.md': 'TypeScript',
  'Unit_Testing_in_Angular.md': 'Unit Testing (Angular/Jasmine)'
};

async function seed() {
  console.log('Seeding PostgreSQL database from study_materials...');

  for (const file of files) {
    const topicName = nameMap[file] || file.replace('.md', '').replace(/_/g, ' ');
    const filePath = path.join(dir, file);
    const content = fs.readFileSync(filePath, 'utf8');

    // Check if topic exists or create it
    let topicRows = await sql`SELECT id FROM topics WHERE LOWER(name) = LOWER(${topicName})`;
    let topicId;

    if (topicRows.length === 0) {
      topicRows = await sql`INSERT INTO topics (name) VALUES (${topicName}) RETURNING id`;
      console.log(`Created topic "${topicName}" (${topicRows[0].id})`);
    } else {
      console.log(`Found existing topic "${topicName}" (${topicRows[0].id})`);
    }
    topicId = topicRows[0].id;

    // Parse blocks
    const lines = content.split(/\r?\n/);
    const blocks = [];
    let currentBlockLines = [];
    let inCodeBlock = false;

    for (const line of lines) {
      if (line.trim().startsWith('```')) {
        inCodeBlock = !inCodeBlock;
        currentBlockLines.push(line);
      } else if (!inCodeBlock && line.trim() === '---') {
        if (currentBlockLines.length > 0) {
          blocks.push(currentBlockLines.join('\n').trim());
          currentBlockLines = [];
        }
      } else {
        currentBlockLines.push(line);
      }
    }
    if (currentBlockLines.length > 0) {
      blocks.push(currentBlockLines.join('\n').trim());
    }

    let addedCount = 0;
    for (const block of blocks) {
      const qMatch = block.match(/Q:\s*([\s\S]*?)(?=A:|$)/i);
      const aMatch = block.match(/A:\s*([\s\S]*)/i);

      if (qMatch && aMatch && qMatch[1].trim() && aMatch[1].trim()) {
        const questionText = qMatch[1].trim();
        const answerText = aMatch[1].trim();

        // Check if question already exists under this topic
        const existingQ = await sql`
          SELECT id FROM questions 
          WHERE topic_id = ${topicId}::uuid AND LOWER(question) = LOWER(${questionText})
        `;

        if (existingQ.length === 0) {
          await sql`
            INSERT INTO questions (topic_id, question, answer, confidence, last_reviewed)
            VALUES (${topicId}::uuid, ${questionText}, ${answerText}, 'weak', NOW())
          `;
          addedCount++;
        }
      }
    }
    console.log(`  -> Added ${addedCount} new questions for ${topicName}`);
  }

  console.log('Seeding completed successfully!');
}

seed().catch(err => {
  console.error('Error seeding database:', err);
  process.exit(1);
});
