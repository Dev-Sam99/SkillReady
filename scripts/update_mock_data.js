const fs = require('fs');
const path = require('path');

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

const topics = [];
const questions = [];

files.forEach((file, tIdx) => {
  const topicId = 'topic-' + String(tIdx + 1).padStart(2, '0');
  const topicName = nameMap[file] || file.replace('.md', '').replace(/_/g, ' ');
  topics.push({ id: topicId, name: topicName });

  const filePath = path.join(dir, file);
  const content = fs.readFileSync(filePath, 'utf8');

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

  let qCount = 0;
  for (const block of blocks) {
    const qMatch = block.match(/Q:\s*([\s\S]*?)(?=A:|$)/i);
    const aMatch = block.match(/A:\s*([\s\S]*)/i);
    if (qMatch && aMatch && qMatch[1].trim() && aMatch[1].trim()) {
      qCount++;
      questions.push({
        id: 'q-' + String(tIdx + 1).padStart(2, '0') + '-' + String(qCount).padStart(2, '0'),
        topic_id: topicId,
        question: qMatch[1].trim(),
        answer: aMatch[1].trim(),
        confidence: 'weak',
        last_reviewed: null,
        created_at: new Date('2026-09-24T12:00:00Z').toISOString(),
        updated_at: new Date('2026-09-24T12:00:00Z').toISOString()
      });
    }
  }
});

const fileContent = `import type { Question, Topic } from '@/types';

export const MOCK_TOPICS: Topic[] = ${JSON.stringify(topics, null, 2)};

export const MOCK_QUESTIONS: Question[] = ${JSON.stringify(questions, null, 2)};
`;

const outputPath = path.join(__dirname, '../src/lib/mockData.ts');
fs.writeFileSync(outputPath, fileContent, 'utf8');
console.log(`Successfully imported ${topics.length} topics and ${questions.length} questions into src/lib/mockData.ts`);
