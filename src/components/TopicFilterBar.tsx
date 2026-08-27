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
    <div className="flex flex-wrap items-center gap-2 py-2 overflow-x-auto no-scrollbar">
      {/* All Option Pill */}
      <button
        type="button"
        onClick={() => onSelectTopic('all')}
        className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
          selectedTopicId === 'all'
            ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
            : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
        }`}
      >
        All Topics
      </button>

      {/* Dynamic Topic Pills */}
      {topics.map((topic) => (
        <button
          key={topic.id}
          type="button"
          onClick={() => onSelectTopic(topic.id)}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
            selectedTopicId === topic.id
              ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
              : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
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
            placeholder="New topic name..."
            className="px-3 py-1 bg-slate-950 border border-indigo-500/50 rounded-full text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="p-1 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white"
            title="Save Topic"
          >
            <Check className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setIsAdding(false)}
            className="p-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400"
            title="Cancel"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Add topic
        </button>
      )}
    </div>
  );
};
