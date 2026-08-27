'use server';

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
  } catch (error: any) {
    console.error('Error fetching topics:', error);
    return { data: null, error: error.message };
  }
}

export async function addTopic(name: string) {
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
  } catch (error: any) {
    console.error('Error adding topic:', error);
    return { data: null, error: error.message };
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
  } catch (error: any) {
    console.error('Error fetching questions:', error);
    return { data: null, error: error.message };
  }
}

export async function createQuestion(formData: {
  topic_id: string;
  question: string;
  answer: string;
  confidence: ConfidenceLevel;
}) {
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
  } catch (error: any) {
    console.error('Error creating question:', error);
    return { data: null, error: error.message };
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
  if (!isNeonConfigured()) {
    return { data: null, error: null };
  }

  try {
    let rows;
    if (formData.confidence !== undefined) {
      // Confidence update -> update last_reviewed timestamp
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
  } catch (error: any) {
    console.error('Error updating question:', error);
    return { data: null, error: error.message };
  }
}

export async function deleteQuestion(id: string) {
  if (!isNeonConfigured()) {
    return { error: null };
  }

  try {
    await sql`DELETE FROM questions WHERE id = ${id}::uuid`;
    revalidatePath('/');
    return { error: null };
  } catch (error: any) {
    console.error('Error deleting question:', error);
    return { error: error.message };
  }
}
