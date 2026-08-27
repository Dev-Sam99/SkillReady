'use client';

import React, { useState } from 'react';
import { Topic } from '@/types';
import { Plus, Check, X } from 'lucide-react';

interface TopicFilterBarProps {
  topics: Topic[];
  selectedTopicId: string;
  onSelectTopic: (id: string) => void;
  onAddTopic: (name: string) => Promise<void>;
}

export const TopicFilterBar: React.FC<TopicFilterBarProps> = ({
  topics,
  selectedTopicId,
  onSelectTopic,
  onAddTopic,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTopicName, setNewTopicName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicName.trim() || isSubmitting) return;

    setIsSubmitting(true);
    await onAddTopic(newTopicName.trim());
    setNewTopicName('');
    setIsAdding(false);
    setIsSubmitting(false);
  };

  return (
    <div className="flex flex-wrap items-center gap-2 py-1 overflow-x-auto no-scrollbar">
      {/* All Option Pill */}
      <button
        type="button"
        onClick={() => onSelectTopic('all')}
        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all border ${
          selectedTopicId === 'all'
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40 shadow-sm shadow-emerald-500/10'
            : 'bg-zinc-900/60 text-zinc-400 border-zinc-800/80 hover:text-zinc-200 hover:border-zinc-700'
        }`}
      >
        <span className="text-zinc-600 mr-1">$</span>all_topics
      </button>

      {/* Dynamic Topic Pills */}
      {topics.map((topic) => (
        <button
          key={topic.id}
          type="button"
          onClick={() => onSelectTopic(topic.id)}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all border ${
            selectedTopicId === topic.id
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40 shadow-sm shadow-emerald-500/10'
              : 'bg-zinc-900/60 text-zinc-400 border-zinc-800/80 hover:text-zinc-200 hover:border-zinc-700'
          }`}
        >
          {topic.name}
        </button>
      ))}

      {/* Inline Add Topic Button or Form */}
      {isAdding ? (
        <form onSubmit={handleAddSubmit} className="flex items-center gap-1.5 animate-fadeIn">
          <input
            type="text"
            autoFocus
            value={newTopicName}
            onChange={(e) => setNewTopicName(e.target.value)}
            placeholder="topic_name..."
            className="px-3 py-1 bg-zinc-950 border border-emerald-500/50 rounded-lg text-xs font-mono text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="p-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40"
            title="Save Topic"
          >
            <Check className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setIsAdding(false)}
            className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-zinc-200"
            title="Cancel"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-zinc-400 hover:text-emerald-400 bg-zinc-900/40 hover:bg-zinc-900 border border-dashed border-zinc-800 hover:border-emerald-500/40 transition-colors"
        >
          <Plus className="w-3 h-3 text-emerald-500" />
          <span>new_topic</span>
        </button>
      )}
    </div>
  );
};
