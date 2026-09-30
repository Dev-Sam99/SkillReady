'use client';

import React from 'react';
import { Topic, Question } from '@/types';
import { Folder, TrendingUp } from 'lucide-react';

interface TopicMasteryPanelProps {
  topics: Topic[];
  questions: Question[];
  onSelectTopic: (topicId: string) => void;
}

export const TopicMasteryPanel: React.FC<TopicMasteryPanelProps> = ({
  topics,
  questions,
  onSelectTopic,
}) => {
  const topicStats = topics.map((t) => {
    const topicQuestions = questions.filter((q) => q.topic_id === t.id);
    const total = topicQuestions.length;
    const reviewedCount = topicQuestions.filter((q) => q.last_reviewed !== null).length;
    const solid = topicQuestions.filter((q) => q.confidence === 'solid' && q.last_reviewed !== null).length;
    const pct = total > 0 && reviewedCount > 0 ? Math.round((solid / total) * 100) : 0;
    return { id: t.id, name: t.name, total, solid, reviewedCount, pct };
  });

  const getBarColor = (pct: number) => {
    if (pct >= 70) return 'bg-[#166534]';
    if (pct >= 40) return 'bg-[#93370D]';
    return 'bg-[#B42318]';
  };

  const pluralize = (count: number, singular: string, plural?: string) => {
    return `${count} ${count === 1 ? singular : plural || `${singular}s`}`;
  };

  return (
    <div className="glass-panel p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-white/95 shadow-glass space-y-4">
      <div className="flex items-center justify-between border-b border-line/60 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-tint flex items-center justify-center text-deep">
            <Folder className="w-5 h-5" strokeWidth={2} aria-hidden="true" />
          </div>
          <h3 className="font-display font-extrabold text-lg text-ink">
            Topic Mastery
          </h3>
        </div>
        <span className="text-sm font-semibold text-slate flex items-center gap-1 font-sans">
          <TrendingUp className="w-4 h-4 text-deep" aria-hidden="true" />
          {pluralize(topics.length, 'subject')}
        </span>
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto max-h-[360px] pr-1 no-scrollbar">
        {topicStats.map((stat) => (
          <div
            key={stat.id}
            onClick={() => onSelectTopic(stat.id)}
            className="p-3.5 bg-white/80 hover:bg-white border border-line/80 hover:border-deep/30 rounded-xl transition-all cursor-pointer group shadow-2xs space-y-2"
          >
            <div className="flex items-center justify-between text-sm font-semibold text-ink">
              <span className="truncate max-w-[180px] sm:max-w-[220px] group-hover:text-deep transition-colors">
                {stat.name}
              </span>
              <span className="font-sans text-sm font-semibold text-slate">
                {stat.solid} of {stat.total} solid
              </span>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-mist rounded-full h-3 overflow-hidden border border-line/50">
              <div
                className={`h-full transition-all duration-300 ${getBarColor(stat.pct)}`}
                style={{ width: `${Math.max(stat.pct, stat.total > 0 && stat.solid > 0 ? 5 : 0)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

