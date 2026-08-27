'use server';

import { supabase } from '@/lib/supabase';
import { ConfidenceLevel } from '@/types';
import { revalidatePath } from 'next/cache';

const isSupabaseConfigured = () => {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')
  );
};

// TOPIC ACTIONS
export async function getTopics() {
  if (!isSupabaseConfigured()) {
    return { data: null, error: 'SUPABASE_NOT_CONFIGURED' };
  }
  const { data, error } = await supabase
    .from('topics')
    .select('*')
    .order('name');
  return { data, error };
}

export async function addTopic(name: string) {
  if (!isSupabaseConfigured()) {
    return { data: { id: `t-${Date.now()}`, name }, error: null };
  }

  const { data, error } = await supabase
    .from('topics')
    .insert([{ name: name.trim() }])
    .select()
    .single();

  revalidatePath('/');
  return { data, error };
}

// QUESTION ACTIONS
export async function getQuestions(topicId?: string) {
  if (!isSupabaseConfigured()) {
    return { data: null, error: 'SUPABASE_NOT_CONFIGURED' };
  }

  let query = supabase.from('questions').select('*, topics(*)').order('created_at', { ascending: false });
  if (topicId && topicId !== 'all') {
    query = query.eq('topic_id', topicId);
  }

  const { data, error } = await query;
  return { data, error };
}

export async function createQuestion(formData: {
  topic_id: string;
  question: string;
  answer: string;
  confidence: ConfidenceLevel;
}) {
  if (!isSupabaseConfigured()) {
    return { data: { id: `q-${Date.now()}`, ...formData, last_reviewed: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() }, error: null };
  }

  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('questions')
    .insert([
      {
        topic_id: formData.topic_id,
        question: formData.question.trim(),
        answer: formData.answer.trim(),
        confidence: formData.confidence,
        last_reviewed: now,
        created_at: now,
        updated_at: now,
      },
    ])
    .select()
    .single();

  revalidatePath('/');
  return { data, error };
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
  if (!isSupabaseConfigured()) {
    return { data: null, error: null };
  }

  const now = new Date().toISOString();
  const updatePayload: Record<string, any> = {
    ...formData,
    updated_at: now,
  };

  // If confidence is changed or explicitly reviewed, auto-update last_reviewed
  if (formData.confidence !== undefined) {
    updatePayload.last_reviewed = now;
  }

  const { data, error } = await supabase
    .from('questions')
    .update(updatePayload)
    .eq('id', id)
    .select()
    .single();

  revalidatePath('/');
  return { data, error };
}

export async function deleteQuestion(id: string) {
  if (!isSupabaseConfigured()) {
    return { error: null };
  }

  const { error } = await supabase.from('questions').delete().eq('id', id);
  revalidatePath('/');
  return { error };
}
