'use client';

import React from 'react';
import { Question, Topic } from '@/types';
import { Play, Folder, Sparkles, MessageCircleQuestion } from 'lucide-react';
import { ConfidenceBadge } from './ConfidenceBadge';

interface HeroCardProps {
  questions: Question[];
  topics: Topic[];
  onStartSession: () => void;
  onPracticeTopic: () => void;
  onSelectQuestion: (q: Question) => void;
}

export const HeroCard: React.FC<HeroCardProps> = ({
  questions,
  topics,
  onStartSession,
  onPracticeTopic,
  onSelectQuestion,
}) => {
  const now = new Date();
  const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

  const dueQuestions = questions.filter((q) => {
    if (!q.last_reviewed) return true;
    const diff = now.getTime() - new Date(q.last_reviewed).getTime();
    return diff >= SEVEN_DAYS_MS;
  });

  const dueCount = dueQuestions.length;
  const headlineText =
    dueCount === 1
      ? '1 question is due today'
      : dueCount > 0
      ? `${dueCount} questions are due today`
      : 'All caught up! 0 questions due today';

  // Find weakest topic
  const topicWeakCounts = topics.map((t) => {
    const weakCount = questions.filter((q) => q.topic_id === t.id && q.confidence === 'weak').length;
    return { name: t.name, weakCount };
  });

  const weakestTopic = topicWeakCounts.sort((a, b) => b.weakCount - a.weakCount)[0];
  const weakestTopicName = weakestTopic?.name || 'General';
  const estimatedMins = Math.max(dueCount * 2, 5);

  const sampleQuestion = dueQuestions[0] || questions[0];

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/95 shadow-glass flex flex-col lg:flex-row items-stretch justify-between gap-6 sm:gap-8 w-full">
      {/* Left Column: Headline & Action Buttons */}
      <div className="flex-1 space-y-4 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tint border border-line/80 text-ink text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-sky" aria-hidden="true" />
            <span>Technical Interview Prep</span>
          </div>

          <h1 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl text-ink tracking-tight leading-tight">
            {headlineText}
          </h1>

          <p className="text-base font-medium text-slate leading-relaxed font-sans">
            ~{estimatedMins} mins estimated • Needs focus: <strong className="text-ink font-semibold">{weakestTopicName}</strong>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onStartSession}
            className="min-w-[44px] min-h-[44px] px-6 py-3 bg-deep hover:bg-[#155AA3] text-white rounded-full font-semibold text-sm shadow-md transition-all active:scale-95 flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-deep focus-visible:outline-none"
          >
            <Play className="w-5 h-5 fill-current" aria-hidden="true" />
            <span>Start practice session</span>
          </button>

          <button
            type="button"
            onClick={onPracticeTopic}
            className="min-w-[44px] min-h-[44px] px-6 py-3 bg-tint hover:bg-[#D5E8FD] text-ink rounded-full font-semibold text-sm transition-all active:scale-95 flex items-center gap-2 border border-line focus-visible:ring-2 focus-visible:ring-deep focus-visible:outline-none"
          >
            <Folder className="w-5 h-5 text-deep" aria-hidden="true" />
            <span>Practice a subject</span>
          </button>
        </div>
      </div>

      {/* Right Column: Sample Question Preview Card */}
      {sampleQuestion && (
        <div
          onClick={() => onSelectQuestion(sampleQuestion)}
          className="glass-inner-card p-5 rounded-2xl border border-white/90 shadow-2xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between lg:w-80 shrink-0 space-y-3"
        >
          <div className="flex items-center justify-between text-xs font-semibold text-slate border-b border-line/60 pb-2.5">
            <span className="flex items-center gap-1.5 text-deep">
              <MessageCircleQuestion className="w-4 h-4" aria-hidden="true" />
              <span>Next Due Question</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-tint text-ink font-semibold text-xs border border-line/60">
              {topics.find((t) => t.id === sampleQuestion.topic_id)?.name || 'General'}
            </span>
          </div>

          <p className="text-sm font-semibold text-ink leading-snug line-clamp-3 group-hover:text-deep transition-colors">
            {sampleQuestion.question}
          </p>

          <div className="pt-2 border-t border-line/60 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate">Current Rating:</span>
            <ConfidenceBadge confidence={sampleQuestion.confidence} interactive={false} />
          </div>
        </div>
      )}
    </div>
  );
};

