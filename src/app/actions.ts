'use server';

import { checkIsAdmin } from './authActions';
import { sql, isNeonConfigured } from '@/lib/db';
import { ConfidenceLevel, Question, Topic } from '@/types';
import { revalidatePath } from 'next/cache';

// TOPIC ACTIONS
export async function getTopics() {
  if (!isNeonConfigured()) {
    return { data: null, error: 'DATABASE_URL_NOT_CONFIGURED' };
  }
  try {
    const rows = await sql`SELECT id, name, created_at FROM topics ORDER BY name ASC`;
    return { data: rows as Topic[], error: null };
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Error fetching topics:', error);
    return { data: null, error: err.message };
  }
}

export async function addTopic(name: string) {
  const isAdmin = await checkIsAdmin();
  if (!isAdmin) {
    return { data: null, error: 'UNAUTHORIZED: Admin access required' };
  }

  const cleanName = name.trim();
  if (!cleanName) {
    return { data: null, error: 'Topic name cannot be empty' };
  }

  if (!isNeonConfigured()) {
    return { data: { id: `t-${Date.now()}`, name: cleanName }, error: null };
  }

  try {
    // Check duplicate case-insensitively
    const existing = await sql`SELECT id, name FROM topics WHERE LOWER(name) = LOWER(${cleanName})`;
    if (existing.length > 0) {
      return { data: null, error: `Topic "${existing[0].name}" already exists` };
    }

    const rows = await sql`
      INSERT INTO topics (name) 
      VALUES (${cleanName}) 
      RETURNING id, name, created_at
    `;
    revalidatePath('/');
    return { data: rows[0] as Topic, error: null };
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Error adding topic:', error);
    return { data: null, error: err.message };
  }
}

export async function updateTopic(id: string, newName: string) {
  const isAdmin = await checkIsAdmin();
  if (!isAdmin) {
    return { data: null, error: 'UNAUTHORIZED: Admin access required' };
  }

  const cleanName = newName.trim();
  if (!cleanName) {
    return { data: null, error: 'Topic name cannot be empty' };
  }

  if (!isNeonConfigured()) {
    return { data: { id, name: cleanName }, error: null };
  }

  try {
    // Check duplicate case-insensitively (excluding current topic ID)
    const existing = await sql`
      SELECT id, name FROM topics 
      WHERE LOWER(name) = LOWER(${cleanName}) AND id != ${id}::uuid
    `;
    if (existing.length > 0) {
      return { data: null, error: `Another topic with name "${existing[0].name}" already exists` };
    }

    const rows = await sql`
      UPDATE topics 
      SET name = ${cleanName} 
      WHERE id = ${id}::uuid 
      RETURNING id, name, created_at
    `;
    revalidatePath('/');
    return { data: rows[0] as Topic, error: null };
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Error updating topic:', error);
    return { data: null, error: err.message };
  }
}

export async function deleteTopic(id: string) {
  const isAdmin = await checkIsAdmin();
  if (!isAdmin) {
    return { error: 'UNAUTHORIZED: Admin access required' };
  }

  if (!isNeonConfigured()) {
    return { error: null };
  }

  try {
    // Cascade delete topic (Prisma CASCADE relation will delete attached questions if setup in DB, or manual delete)
    await sql`DELETE FROM questions WHERE topic_id = ${id}::uuid`;
    await sql`DELETE FROM topics WHERE id = ${id}::uuid`;
    revalidatePath('/');
    return { error: null };
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Error deleting topic:', error);
    return { error: err.message };
  }
}

// QUESTION ACTIONS
export async function getQuestions(topicId?: string) {
  if (!isNeonConfigured()) {
    return { data: null, error: 'DATABASE_URL_NOT_CONFIGURED' };
  }

  try {
    let rows;
    if (topicId && topicId !== 'all') {
      rows = await sql`
        SELECT id, topic_id, question, answer, confidence, last_reviewed, created_at, updated_at 
        FROM questions 
        WHERE topic_id = ${topicId}::uuid
        ORDER BY created_at DESC
      `;
    } else {
      rows = await sql`
        SELECT id, topic_id, question, answer, confidence, last_reviewed, created_at, updated_at 
        FROM questions 
        ORDER BY created_at DESC
      `;
    }
    return { data: rows as Question[], error: null };
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Error fetching questions:', error);
    return { data: null, error: err.message };
  }
}

export async function createQuestion(formData: {
  topic_id: string;
  question: string;
  answer: string;
  confidence: ConfidenceLevel;
}) {
  const isAdmin = await checkIsAdmin();
  if (!isAdmin) {
    return { data: null, error: 'UNAUTHORIZED: Admin access required' };
  }

  if (!isNeonConfigured()) {
    return {
      data: {
        id: `q-${Date.now()}`,
        ...formData,
        last_reviewed: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      error: null,
    };
  }

  try {
    const rows = await sql`
      INSERT INTO questions (topic_id, question, answer, confidence, last_reviewed)
      VALUES (${formData.topic_id}::uuid, ${formData.question.trim()}, ${formData.answer.trim()}, ${formData.confidence}, NOW())
      RETURNING id, topic_id, question, answer, confidence, last_reviewed, created_at, updated_at
    `;
    revalidatePath('/');
    return { data: rows[0] as Question, error: null };
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Error creating question:', error);
    return { data: null, error: err.message };
  }
}

export async function bulkCreateQuestions(topicId: string, textContent: string) {
  const isAdmin = await checkIsAdmin();
  if (!isAdmin) {
    return { count: 0, data: null, error: 'UNAUTHORIZED: Admin access required' };
  }

  if (!topicId || !textContent.trim()) {
    return { count: 0, data: null, error: 'Topic and Q&A content are required' };
  }

  // Code-fence aware splitter: only split on "---" lines outside of ``` code blocks
  const lines = textContent.split(/\r?\n/);
  const blocks: string[] = [];
  let currentBlockLines: string[] = [];
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

  const parsedPairs: { question: string; answer: string }[] = [];

  for (const block of blocks) {
    const qMatch = block.match(/Q:\s*([\s\S]*?)(?=A:|$)/i);
    const aMatch = block.match(/A:\s*([\s\S]*)/i);

    if (qMatch && aMatch && qMatch[1].trim() && aMatch[1].trim()) {
      parsedPairs.push({
        question: qMatch[1].trim(),
        answer: aMatch[1].trim(),
      });
    }
  }

  if (parsedPairs.length === 0) {
    return { count: 0, data: null, error: 'No valid Q: / A: formatted blocks found' };
  }

  if (!isNeonConfigured()) {
    const mockCreatedQuestions: Question[] = parsedPairs.map((pair, idx) => ({
      id: `q-bulk-${Date.now()}-${idx}`,
      topic_id: topicId,
      question: pair.question,
      answer: pair.answer,
      confidence: 'weak',
      last_reviewed: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));
    return { count: mockCreatedQuestions.length, data: mockCreatedQuestions, error: null };
  }

  try {
    const createdQuestions: Question[] = [];
    for (const pair of parsedPairs) {
      const rows = await sql`
        INSERT INTO questions (topic_id, question, answer, confidence, last_reviewed)
        VALUES (${topicId}::uuid, ${pair.question}, ${pair.answer}, 'weak', NOW())
        RETURNING id, topic_id, question, answer, confidence, last_reviewed, created_at, updated_at
      `;
      if (rows[0]) createdQuestions.push(rows[0] as Question);
    }

    revalidatePath('/');
    return { count: createdQuestions.length, data: createdQuestions, error: null };
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Error bulk adding questions:', error);
    return { count: 0, data: null, error: err.message };
  }
}

export async function updateQuestion(
  id: string,
  formData: {
    topic_id?: string;
    question?: string;
    answer?: string;
    confidence?: ConfidenceLevel;
  }
) {
  // Anyone can self-rate confidence in practice mode; other edits require Admin
  if (formData.question !== undefined || formData.answer !== undefined || formData.topic_id !== undefined) {
    const isAdmin = await checkIsAdmin();
    if (!isAdmin) {
      return { data: null, error: 'UNAUTHORIZED: Admin access required' };
    }
  }

  if (!isNeonConfigured()) {
    return { data: null, error: null };
  }

  try {
    let rows;
    if (formData.confidence !== undefined) {
      rows = await sql`
        UPDATE questions 
        SET 
          topic_id = COALESCE(${formData.topic_id || null}::uuid, topic_id),
          question = COALESCE(${formData.question || null}, question),
          answer = COALESCE(${formData.answer || null}, answer),
          confidence = COALESCE(${formData.confidence || null}, confidence),
          last_reviewed = NOW(),
          updated_at = NOW()
        WHERE id = ${id}::uuid
        RETURNING id, topic_id, question, answer, confidence, last_reviewed, created_at, updated_at
      `;
    } else {
      rows = await sql`
        UPDATE questions 
        SET 
          topic_id = COALESCE(${formData.topic_id || null}::uuid, topic_id),
          question = COALESCE(${formData.question || null}, question),
          answer = COALESCE(${formData.answer || null}, answer),
          updated_at = NOW()
        WHERE id = ${id}::uuid
        RETURNING id, topic_id, question, answer, confidence, last_reviewed, created_at, updated_at
      `;
    }

    revalidatePath('/');
    return { data: rows[0] as Question, error: null };
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Error updating question:', error);
    return { data: null, error: err.message };
  }
}

export async function deleteQuestion(id: string) {
  const isAdmin = await checkIsAdmin();
  if (!isAdmin) {
    return { error: 'UNAUTHORIZED: Admin access required' };
  }

  if (!isNeonConfigured()) {
    return { error: null };
  }

  try {
    await sql`DELETE FROM questions WHERE id = ${id}::uuid`;
    revalidatePath('/');
    return { error: null };
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Error deleting question:', error);
    return { error: err.message };
  }
}

export async function importAllStudyMaterials() {
  const isAdmin = await checkIsAdmin();
  if (!isAdmin) {
    return { success: false, importedTopics: 0, importedQuestions: 0, error: 'UNAUTHORIZED: Admin access required' };
  }

  try {
    const fs = await import('fs');
    const path = await import('path');

    const dir = path.join(process.cwd(), 'study_materials');
    if (!fs.existsSync(dir)) {
      return { success: false, importedTopics: 0, importedQuestions: 0, error: 'study_materials directory not found' };
    }

    const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md'));

    const nameMap: Record<string, string> = {
      'Angular.md': 'Angular',
      'Behavioral_Questions.md': 'Behavioral Questions',
      'CSS.md': 'CSS',
      'DotNet.md': '.NET Framework & Core',
      'Git.md': 'Git & Version Control',
      'Javascript.md': 'JavaScript',
      'React.md': 'React',
      'SQL.md': 'SQL & Databases',
      'Typescript.md': 'TypeScript',
      'Unit_Testing_in_Angular.md': 'Unit Testing (Angular/Jasmine)',
    };

    let totalTopics = 0;
    let totalQuestions = 0;

    for (const file of files) {
      const topicName = nameMap[file] || file.replace('.md', '').replace(/_/g, ' ');
      const filePath = path.join(dir, file);
      const content = fs.readFileSync(filePath, 'utf8');

      let topicId: string;

      if (isNeonConfigured()) {
        const existingTopic = await sql`SELECT id FROM topics WHERE LOWER(name) = LOWER(${topicName})`;
        if (existingTopic.length > 0) {
          topicId = existingTopic[0].id;
        } else {
          const inserted = await sql`INSERT INTO topics (name) VALUES (${topicName}) RETURNING id`;
          topicId = inserted[0].id;
          totalTopics++;
        }
      } else {
        topicId = `topic-${file.replace('.md', '')}`;
        totalTopics++;
      }

      // Parse blocks (code-fence aware)
      const lines = content.split(/\r?\n/);
      const blocks: string[] = [];
      let currentBlockLines: string[] = [];
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

      for (const block of blocks) {
        const qMatch = block.match(/Q:\s*([\s\S]*?)(?=A:|$)/i);
        const aMatch = block.match(/A:\s*([\s\S]*)/i);

        if (qMatch && aMatch && qMatch[1].trim() && aMatch[1].trim()) {
          const qText = qMatch[1].trim();
          const aText = aMatch[1].trim();

          if (isNeonConfigured()) {
            const existingQ = await sql`
              SELECT id FROM questions 
              WHERE topic_id = ${topicId}::uuid AND LOWER(question) = LOWER(${qText})
            `;
            if (existingQ.length === 0) {
              await sql`
                INSERT INTO questions (topic_id, question, answer, confidence, last_reviewed)
                VALUES (${topicId}::uuid, ${qText}, ${aText}, 'weak', NOW())
              `;
              totalQuestions++;
            }
          } else {
            totalQuestions++;
          }
        }
      }
    }

    revalidatePath('/');
    return { success: true, importedTopics: totalTopics, importedQuestions: totalQuestions, error: null };
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Error importing study materials:', error);
    return { success: false, importedTopics: 0, importedQuestions: 0, error: err.message };
  }
}

