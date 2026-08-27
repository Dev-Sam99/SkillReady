export type ConfidenceLevel = 'weak' | 'medium' | 'solid';

export interface Topic {
  id: string;
  name: string;
  created_at?: string;
}

export interface Question {
  id: string;
  topic_id: string;
  question: string;
  answer: string;
  confidence: ConfidenceLevel;
  last_reviewed: string | null;
  created_at: string;
  updated_at: string;
  topics?: Topic;
}

export interface TopicWithStats extends Topic {
  totalCount: number;
  solidCount: number;
  progressPercentage: number;
}
