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

  if (!isNeonConfigured()) {
    return { data: { id: `t-${Date.now()}`, name }, error: null };
  }

  try {
    const rows = await sql`
      INSERT INTO topics (name) 
      VALUES (${name.trim()}) 
      ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
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
    return { count: 0, error: 'UNAUTHORIZED: Admin access required' };
  }

  if (!topicId || !textContent.trim()) {
    return { count: 0, error: 'Topic and Q&A content are required' };
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
    return { count: 0, error: 'No valid Q: / A: formatted blocks found' };
  }

  if (!isNeonConfigured()) {
    return { count: parsedPairs.length, error: null };
  }

  try {
    let insertedCount = 0;
    for (const pair of parsedPairs) {
      await sql`
        INSERT INTO questions (topic_id, question, answer, confidence, last_reviewed)
        VALUES (${topicId}::uuid, ${pair.question}, ${pair.answer}, 'weak', NOW())
      `;
      insertedCount++;
    }

    revalidatePath('/');
    return { count: insertedCount, error: null };
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Error bulk adding questions:', error);
    return { count: 0, error: err.message };
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
