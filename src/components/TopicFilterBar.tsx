'use client';

import React, { useState } from 'react';
import { Topic } from '@/types';
import { Plus, Check, X, Pencil, Trash2, SlidersHorizontal } from 'lucide-react';

interface TopicFilterBarProps {
  topics: Topic[];
  selectedTopicId: string;
  isAdmin?: boolean;
  onSelectTopic: (id: string) => void;
  onAddTopic: (name: string) => Promise<{ success: boolean; error?: string }>;
  onUpdateTopic?: (id: string, name: string) => Promise<{ success: boolean; error?: string }>;
  onDeleteTopic?: (id: string) => Promise<{ success: boolean; error?: string }>;
}

export const TopicFilterBar: React.FC<TopicFilterBarProps> = ({
  topics,
  selectedTopicId,
  isAdmin = false,
  onSelectTopic,
  onAddTopic,
  onUpdateTopic,
  onDeleteTopic,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTopicName, setNewTopicName] = useState('');
  const [editingTopicId, setEditingTopicId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!newTopicName.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const result = await onAddTopic(newTopicName.trim());
    setIsSubmitting(false);

    if (result.success) {
      setNewTopicName('');
      setIsAdding(false);
    } else {
      setErrorMessage(result.error || 'Failed to add topic');
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent, topicId: string) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!editingName.trim() || isSubmitting || !onUpdateTopic) return;

    setIsSubmitting(true);
    const result = await onUpdateTopic(topicId, editingName.trim());
    setIsSubmitting(false);

    if (result.success) {
      setEditingTopicId(null);
      setEditingName('');
    } else {
      setErrorMessage(result.error || 'Failed to rename topic');
    }
  };

  const handleDelete = async (topicId: string, topicName: string) => {
    if (!onDeleteTopic) return;
    if (confirm(`Are you sure you want to delete topic "${topicName}" and all its questions?`)) {
      setErrorMessage(null);
      const result = await onDeleteTopic(topicId);
      if (!result.success) {
        setErrorMessage(result.error || 'Failed to delete topic');
      }
    }
  };

  const topicCountText = topics.length === 1 ? '1 topic' : `${topics.length} topics`;

  const sortedTopics = React.useMemo(() => {
    if (selectedTopicId === 'all') return topics;
    const selected = topics.find((t) => t.id === selectedTopicId);
    if (!selected) return topics;
    return [selected, ...topics.filter((t) => t.id !== selectedTopicId)];
  }, [topics, selectedTopicId]);

  return (
    <div className="space-y-2 w-full min-w-0">
      {errorMessage && (
        <div className="text-xs font-semibold text-[#B42318] bg-[#FEE4E2] border border-[#FECDCA] px-3.5 py-2 rounded-full flex items-center justify-between">
          <span>⚠️ {errorMessage}</span>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-[#B42318] hover:text-[#912018] min-w-[32px] min-h-[32px] inline-flex items-center justify-center rounded-full"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      )}

      {/* Accessible Horizontal Scroll Tablist with Snap */}
      <div
        role="tablist"
        aria-label="Topic filter options"
        className="flex items-center gap-2 overflow-x-auto pb-1.5 snap-x snap-mandatory no-scrollbar scroll-smooth w-full min-w-0"
      >
        {/* Filter Indicator Icon */}
        <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-tint text-deep shrink-0">
          <SlidersHorizontal className="w-5 h-5" aria-hidden="true" />
        </div>

        {/* All Option Pill */}
        <button
          type="button"
          role="tab"
          aria-selected={selectedTopicId === 'all'}
          onClick={() => onSelectTopic('all')}
          className={`min-h-[44px] px-5 py-2.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap snap-start flex items-center justify-center focus-visible:ring-2 focus-visible:ring-deep focus-visible:outline-none ${
            selectedTopicId === 'all'
              ? 'bg-deep text-white font-semibold shadow-xs'
              : 'bg-white/90 text-ink border border-line hover:border-deep/40 hover:bg-white'
          }`}
        >
          All questions ({topicCountText})
        </button>

        {/* Dynamic Topic Pills */}
        {sortedTopics.map((topic) => {
          const isSelected = selectedTopicId === topic.id;
          const isEditing = editingTopicId === topic.id;

          if (isEditing) {
            return (
              <form
                key={topic.id}
                onSubmit={(e) => handleUpdateSubmit(e, topic.id)}
                className="flex items-center gap-1.5 bg-white border border-deep px-4 py-2 rounded-full min-h-[44px] snap-start shadow-xs"
              >
                <input
                  type="text"
                  autoFocus
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  className="w-32 text-sm font-semibold text-ink bg-transparent focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="p-1 rounded-full text-[#166534] hover:bg-[#DCFCE7] min-w-[32px] min-h-[32px] inline-flex items-center justify-center"
                  title="Save Name"
                >
                  <Check className="w-4 h-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => setEditingTopicId(null)}
                  className="p-1 rounded-full text-slate hover:bg-line/40 min-w-[32px] min-h-[32px] inline-flex items-center justify-center"
                  title="Cancel"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              </form>
            );
          }

          return (
            <div
              key={topic.id}
              className={`group inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap snap-start min-h-[44px] ${
                isSelected
                  ? 'bg-deep text-white font-semibold shadow-xs'
                  : 'bg-white/90 text-ink border border-line hover:border-deep/40 hover:bg-white'
              }`}
            >
              <button
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => onSelectTopic(topic.id)}
                className="focus-visible:ring-2 focus-visible:ring-deep focus-visible:outline-none rounded-full"
              >
                {topic.name}
              </button>

              {isAdmin && (
                <div className="flex items-center gap-1 ml-1 pl-1.5 border-l border-line/60 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingTopicId(topic.id);
                      setEditingName(topic.name);
                    }}
                    className={`p-1 rounded-full hover:bg-tint ${isSelected ? 'text-white hover:text-deep' : 'text-slate hover:text-ink'}`}
                    title="Rename Topic"
                  >
                    <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(topic.id, topic.name);
                    }}
                    className={`p-1 rounded-full hover:bg-[#FEE4E2] ${isSelected ? 'text-white hover:text-[#B42318]' : 'text-slate hover:text-[#B42318]'}`}
                    title="Delete Topic"
                  >
                    <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {/* Inline Add Topic Button or Form */}
        {isAdding ? (
          <form onSubmit={handleAddSubmit} className="flex items-center gap-2 ml-1 snap-start animate-fadeIn">
            <input
              type="text"
              autoFocus
              value={newTopicName}
              onChange={(e) => setNewTopicName(e.target.value)}
              placeholder="New topic..."
              className="px-4 py-2.5 bg-white border border-line rounded-full text-sm text-ink placeholder-slate focus:outline-none focus:ring-2 focus:ring-deep min-h-[44px] shadow-xs"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="min-w-[44px] min-h-[44px] p-2.5 rounded-full bg-deep text-white flex items-center justify-center hover:bg-[#155AA3] shadow-xs"
            >
              <Check className="w-4 h-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="min-w-[44px] min-h-[44px] p-2.5 rounded-full border border-line bg-white text-slate flex items-center justify-center hover:bg-tint"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </form>
        ) : (
          isAdmin && (
            <button
              type="button"
              onClick={() => setIsAdding(true)}
              className="min-w-[44px] min-h-[44px] px-4 py-2.5 rounded-full text-sm font-semibold text-slate hover:text-ink border border-dashed border-line bg-white/60 hover:bg-white flex items-center gap-1.5 transition-all whitespace-nowrap snap-start focus-visible:ring-2 focus-visible:ring-deep focus-visible:outline-none"
            >
              <Plus className="w-4 h-4 text-deep" aria-hidden="true" />
              <span>Topic</span>
            </button>
          )
        )}
      </div>
    </div>
  );
};
