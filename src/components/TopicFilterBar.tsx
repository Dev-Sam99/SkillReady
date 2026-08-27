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
    <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar border-b border-stone-200 dark:border-zinc-800">
      {/* All Option Pill */}
      <button
        type="button"
        onClick={() => onSelectTopic('all')}
        className={`px-3 py-1.5 text-xs font-mono transition-all relative whitespace-nowrap ${
          selectedTopicId === 'all'
            ? 'text-emerald-700 dark:text-emerald-400 font-semibold'
            : 'text-stone-500 hover:text-stone-800 dark:text-zinc-400 dark:hover:text-zinc-200'
        }`}
      >
        All Topics
        {selectedTopicId === 'all' && (
          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 dark:bg-emerald-400 rounded-full animate-fadeIn" />
        )}
      </button>

      {/* Dynamic Topic Pills */}
      {topics.map((topic) => {
        const isSelected = selectedTopicId === topic.id;
        return (
          <button
            key={topic.id}
            type="button"
            onClick={() => onSelectTopic(topic.id)}
            className={`px-3 py-1.5 text-xs font-mono transition-all relative whitespace-nowrap ${
              isSelected
                ? 'text-emerald-700 dark:text-emerald-400 font-semibold'
                : 'text-stone-500 hover:text-stone-800 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            {topic.name}
            {isSelected && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 dark:bg-emerald-400 rounded-full animate-fadeIn" />
            )}
          </button>
        );
      })}

      {/* Inline Add Topic Button or Form */}
      {isAdding ? (
        <form onSubmit={handleAddSubmit} className="flex items-center gap-1.5 ml-2 animate-fadeIn">
          <input
            type="text"
            autoFocus
            value={newTopicName}
            onChange={(e) => setNewTopicName(e.target.value)}
            placeholder="Topic title..."
            className="px-2.5 py-1 bg-white dark:bg-zinc-950 border border-stone-300 dark:border-zinc-700 rounded text-xs font-mono text-stone-900 dark:text-zinc-100 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="p-1 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30"
            title="Save Topic"
          >
            <Check className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setIsAdding(false)}
            className="p-1 rounded bg-stone-100 text-stone-500 hover:text-stone-800 dark:bg-zinc-900 dark:text-zinc-400"
            title="Cancel"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-1 px-2.5 py-1 text-xs font-mono text-stone-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors ml-2"
        >
          <Plus className="w-3 h-3 text-emerald-600" />
          <span>Add topic</span>
        </button>
      )}
    </div>
  );
};
