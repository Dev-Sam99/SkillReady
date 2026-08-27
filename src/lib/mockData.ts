import type { Question, Topic } from '@/types';

export const MOCK_TOPICS: Topic[] = [
  { id: '11111111-1111-1111-1111-111111111111', name: 'Data Structures & Algorithms' },
  { id: '22222222-2222-2222-2222-222222222222', name: 'System Design' },
  { id: '33333333-3333-3333-3333-333333333333', name: 'Behavioral' },
  { id: '44444444-4444-4444-4444-444444444444', name: 'Frontend React / Next.js' },
];

export const MOCK_QUESTIONS: Question[] = [
  {
    id: 'q1',
    topic_id: '11111111-1111-1111-1111-111111111111',
    question: 'How do you detect a cycle in a Linked List (Floyd Cycle Detection)?',
    answer: 'Use two pointers (slow and fast). Move slow pointer by 1 step and fast pointer by 2 steps. If there is a cycle, the two pointers will meet at the same node in O(N) time and O(1) space.',
    confidence: 'solid',
    last_reviewed: '2026-08-26T10:00:00Z',
    created_at: '2026-08-01T00:00:00Z',
    updated_at: '2026-08-26T10:00:00Z',
  },
  {
    id: 'q2',
    topic_id: '22222222-2222-2222-2222-222222222222',
    question: 'What is the CAP Theorem and how does it apply to Distributed Databases?',
    answer: 'CAP theorem states that a distributed system can only provide two of three guarantees simultaneously: Consistency, Availability, and Partition Tolerance. In the event of a network partition (P), a database must choose between Consistency (CP, e.g. MongoDB/HBase) or Availability (AP, e.g. Cassandra/DynamoDB).',
    confidence: 'medium',
    last_reviewed: '2026-08-15T12:00:00Z', // > 7 days ago!
    created_at: '2026-08-05T00:00:00Z',
    updated_at: '2026-08-15T12:00:00Z',
  },
  {
    id: 'q3',
    topic_id: '33333333-3333-3333-3333-333333333333',
    question: 'Tell me about a time you had a technical disagreement with a teammate.',
    answer: 'Use the STAR framework (Situation, Task, Action, Result). Focus on gathering benchmark data/metrics to make an objective decision rather than emotional arguments, leading to an aligned architecture choice.',
    confidence: 'weak',
    last_reviewed: null, // Never reviewed!
    created_at: '2026-08-10T00:00:00Z',
    updated_at: '2026-08-10T00:00:00Z',
  },
  {
    id: 'q4',
    topic_id: '44444444-4444-4444-4444-444444444444',
    question: 'Explain the difference between Server Components and Client Components in Next.js App Router.',
    answer: 'Server Components execute only on the server, reducing client bundle size and allowing direct database access without exposing secret keys. Client Components run on client + pre-rendered server, enabling state, effects, and DOM event listeners ("use client").',
    confidence: 'solid',
    last_reviewed: '2026-08-25T14:00:00Z',
    created_at: '2026-08-12T00:00:00Z',
    updated_at: '2026-08-25T14:00:00Z',
  }
];
