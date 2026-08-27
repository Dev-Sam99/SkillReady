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
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
      {/* All Option Pill */}
      <button
        type="button"
        onClick={() => onSelectTopic('all')}
        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap ${
          selectedTopicId === 'all'
            ? 'bg-stone-900 text-white shadow-sm'
            : 'bg-stone-100/80 text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
        }`}
      >
        All Questions
      </button>

      {/* Dynamic Topic Pills */}
      {topics.map((topic) => {
        const isSelected = selectedTopicId === topic.id;
        return (
          <button
            key={topic.id}
            type="button"
            onClick={() => onSelectTopic(topic.id)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap ${
              isSelected
                ? 'bg-stone-900 text-white shadow-sm'
                : 'bg-stone-100/80 text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
            }`}
          >
            {topic.name}
          </button>
        );
      })}

      {/* Inline Add Topic Button or Form */}
      {isAdding ? (
        <form onSubmit={handleAddSubmit} className="flex items-center gap-1.5 ml-1 animate-fadeIn">
          <input
            type="text"
            autoFocus
            value={newTopicName}
            onChange={(e) => setNewTopicName(e.target.value)}
            placeholder="Topic title..."
            className="px-2.5 py-1 bg-white border border-stone-200 rounded-md text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-900"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="p-1 rounded bg-stone-900 text-white hover:bg-stone-800"
            title="Save Topic"
          >
            <Check className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setIsAdding(false)}
            className="p-1 rounded bg-stone-100 text-stone-500 hover:text-stone-800"
            title="Cancel"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium text-stone-500 hover:text-stone-900 transition-colors ml-1"
        >
          <Plus className="w-3.5 h-3.5 text-stone-700" />
          <span>Add topic</span>
        </button>
      )}
    </div>
  );
};
