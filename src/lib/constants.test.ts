import assert from 'node:assert';
import { test, describe } from 'node:test';
import {
  getNextReviewDate,
  isQuestionDue,
  isQuestionOverdue,
  endOfTodayLocal,
  SCHEDULE_RULES,
} from './constants';

describe('Scheduling Rules & Due Calculation', () => {
  test('returns 1 day for weak rating', () => {
    const baseDate = new Date('2026-10-01T10:00:00.000Z');
    const nextDate = getNextReviewDate('weak', baseDate);
    assert.strictEqual(nextDate.getDate(), 2);
    assert.strictEqual(SCHEDULE_RULES.weak.days, 1);
  });

  test('returns 3 days for medium rating', () => {
    const baseDate = new Date('2026-10-01T10:00:00.000Z');
    const nextDate = getNextReviewDate('medium', baseDate);
    assert.strictEqual(nextDate.getDate(), 4);
    assert.strictEqual(SCHEDULE_RULES.medium.days, 3);
  });

  test('returns 7 days for solid rating', () => {
    const baseDate = new Date('2026-10-01T10:00:00.000Z');
    const nextDate = getNextReviewDate('solid', baseDate);
    assert.strictEqual(nextDate.getDate(), 8);
    assert.strictEqual(SCHEDULE_RULES.solid.days, 7);
  });

  test('never-reviewed (null) is due', () => {
    assert.strictEqual(isQuestionDue(null), true);
    assert.strictEqual(isQuestionDue(undefined), true);
  });

  test('question with nextReviewAt earlier or equal to today end is due', () => {
    const now = new Date('2026-10-01T12:00:00.000Z');
    const dueToday = new Date('2026-10-01T15:00:00.000Z');
    const dueTomorrow = new Date('2026-10-02T10:00:00.000Z');

    assert.strictEqual(isQuestionDue(dueToday, now), true);
    assert.strictEqual(isQuestionDue(dueTomorrow, now), false);
  });

  test('question with nextReviewAt before today is overdue', () => {
    const now = new Date('2026-10-01T12:00:00.000Z');
    const yesterday = new Date('2026-09-30T10:00:00.000Z');
    const today = new Date('2026-10-01T10:00:00.000Z');

    assert.strictEqual(isQuestionOverdue(yesterday, now), true);
    assert.strictEqual(isQuestionOverdue(today, now), false);
  });

  test('endOfTodayLocal sets time to 23:59:59.999', () => {
    const now = new Date('2026-10-01T12:00:00.000Z');
    const end = endOfTodayLocal(now);
    assert.strictEqual(end.getHours(), 23);
    assert.strictEqual(end.getMinutes(), 59);
    assert.strictEqual(end.getSeconds(), 59);
    assert.strictEqual(end.getMilliseconds(), 999);
  });
});
