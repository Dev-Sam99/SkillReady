import type { ConfidenceLevel } from '@/types';

export const SCHEDULE_RULES = {
  weak: { days: 1, label: 'Tomorrow' },
  medium: { days: 3, label: 'In 3 days' },
  solid: { days: 7, label: 'In 7 days' },
} as const;

export function getNextReviewDate(rating: ConfidenceLevel, fromDate: Date = new Date()): Date {
  const result = new Date(fromDate.getTime());
  const rule = SCHEDULE_RULES[rating] || SCHEDULE_RULES.weak;
  result.setDate(result.getDate() + rule.days);
  return result;
}

export function endOfTodayLocal(fromDate: Date = new Date()): Date {
  const d = new Date(fromDate.getTime());
  d.setHours(23, 59, 59, 999);
  return d;
}

export function startOfTodayLocal(fromDate: Date = new Date()): Date {
  const d = new Date(fromDate.getTime());
  d.setHours(0, 0, 0, 0);
  return d;
}

export function isQuestionDue(nextReviewAt: Date | string | null | undefined, fromDate: Date = new Date()): boolean {
  if (!nextReviewAt) return true; // Never reviewed counts as due
  const reviewDate = typeof nextReviewAt === 'string' ? new Date(nextReviewAt) : nextReviewAt;
  if (isNaN(reviewDate.getTime())) return true;
  return reviewDate <= endOfTodayLocal(fromDate);
}

export function isQuestionOverdue(nextReviewAt: Date | string | null | undefined, fromDate: Date = new Date()): boolean {
  if (!nextReviewAt) return false; // Never reviewed is due, but not overdue
  const reviewDate = typeof nextReviewAt === 'string' ? new Date(nextReviewAt) : nextReviewAt;
  if (isNaN(reviewDate.getTime())) return false;
  return reviewDate < startOfTodayLocal(fromDate);
}
