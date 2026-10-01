export type ConfidenceLevel = 'weak' | 'medium' | 'solid';
export type QuestionTypeTag = 'Theoretical' | 'Coding' | 'Architecture' | 'Behavioral';

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
  next_review_at?: string | null;
  is_flagged?: boolean;
  is_important?: boolean;
  category_tag?: QuestionTypeTag | string;
  tags?: string[];
  notes?: string;
  created_at: string;
  updated_at: string;
  topics?: Topic;
}

export interface ReviewLog {
  id: string;
  question_id: string;
  rating: ConfidenceLevel;
  reviewed_at: string;
}

export interface TopicWithStats extends Topic {
  totalCount: number;
  solidCount: number;
  progressPercentage: number;
}
