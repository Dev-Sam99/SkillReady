'use client';

import React, { useState, useEffect } from 'react';
import { Topic, Question, ConfidenceLevel } from '@/types';
import { MOCK_TOPICS, MOCK_QUESTIONS } from '@/lib/mockData';
import { getTopics, addTopic, getQuestions, createQuestion, updateQuestion, deleteQuestion } from './actions';
import { TopicFilterBar } from '@/components/TopicFilterBar';
import { QuestionRow } from '@/components/QuestionRow';
import { QuestionModal } from '@/components/QuestionModal';
import { DashboardStats } from '@/components/DashboardStats';
import { ReviewDueSection } from '@/components/ReviewDueSection';
import { SkillReadyWordmark } from '@/components/SkillReadyWordmark';
import { Search, Plus, FolderPlus, RefreshCw } from 'lucide-react';

export default function Home() {
  const [topics, setTopics] = useState<Topic[]>(MOCK_TOPICS);
  const [questions, setQuestions] = useState<Question[]>(MOCK_QUESTIONS);
  const [selectedTopicId, setSelectedTopicId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    const topicsRes = await getTopics();
    if (topicsRes.data) setTopics(topicsRes.data);

    const questionsRes = await getQuestions();
    if (questionsRes.data) setQuestions(questionsRes.data);
  };

  const handleAddTopic = async (name: string) => {
    const res = await addTopic(name);
    if (res.data) {
      setTopics((prev) => [...prev, res.data]);
    }
  };

  const handleSaveQuestion = async (formData: {
    id?: string;
    topic_id: string;
    question: string;
    answer: string;
    confidence: ConfidenceLevel;
  }) => {
    if (formData.id) {
      const res = await updateQuestion(formData.id, {
        topic_id: formData.topic_id,
        question: formData.question,
        answer: formData.answer,
        confidence: formData.confidence,
      });

      if (res.data) {
        setQuestions((prev) => prev.map((q) => (q.id === formData.id ? res.data : q)));
      } else {
        setQuestions((prev) =>
          prev.map((q) =>
            q.id === formData.id
              ? { ...q, ...formData, updated_at: new Date().toISOString(), last_reviewed: new Date().toISOString() }
              : q
          )
        );
      }
    } else {
      const res = await createQuestion({
        topic_id: formData.topic_id,
        question: formData.question,
        answer: formData.answer,
        confidence: formData.confidence,
      });

      if (res.data) {
        setQuestions((prev) => [res.data, ...prev]);
      } else {
        const newQ: Question = {
          id: `q-${Date.now()}`,
          ...formData,
          last_reviewed: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setQuestions((prev) => [newQ, ...prev]);
      }
    }
  };

  const handleConfidenceCycle = async (id: string, newConfidence: ConfidenceLevel) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === id ? { ...q, confidence: newConfidence, last_reviewed: new Date().toISOString() } : q
      )
    );

    await updateQuestion(id, { confidence: newConfidence });
  };

  const handleDeleteQuestion = async (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
    await deleteQuestion(id);
  };

  const filteredQuestions = questions.filter((q) => {
    const matchesTopic = selectedTopicId === 'all' || q.topic_id === selectedTopicId;
    const matchesSearch =
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTopic && matchesSearch;
  });

  const currentTopicName = selectedTopicId === 'all' 
    ? 'All Topics' 
    : topics.find(t => t.id === selectedTopicId)?.name || 'Topic';

  return (
    <div className="min-h-screen bg-[#fafaf8] text-stone-900 flex flex-col font-sans selection:bg-stone-900 selection:text-white">
      {/* Solva Editorial Header Navbar */}
      <header className="bg-white/90 border-b border-stone-200/70 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
          <SkillReadyWordmark />

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={fetchInitialData}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 border border-stone-200/80 hover:bg-stone-100/60 text-stone-700 font-medium rounded-full text-xs transition-all active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Sync</span>
            </button>

            {/* Solid Black Rounded-Full Pill Action Button */}
            <button
              type="button"
              onClick={() => {
                setEditingQuestion(null);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white font-medium rounded-full text-xs transition-all active:scale-95 shadow-sm"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add Question</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
        {/* Editorial Title & Hero */}
        <div className="space-y-1">
          <h2 className="text-3xl md:text-4xl font-serif-display font-semibold text-stone-900 tracking-tight">
            Interview Prep & Spaced Repetition
          </h2>
          <p className="text-sm text-stone-500 font-sans">
            Curate technical questions, track mastery confidence, and systematically revise key topics.
          </p>
        </div>

        {/* Soft Stat Cards */}
        <DashboardStats questions={questions} topics={topics} />

        {/* Review Due Alert Banner */}
        <ReviewDueSection
          questions={questions}
          onSelectQuestion={(q) => {
            setEditingQuestion(q);
            setIsModalOpen(true);
          }}
        />

        {/* Main Table View Container */}
        <div className="bg-white border border-stone-200/80 rounded-2xl shadow-sm overflow-hidden space-y-0">
          {/* Top Controls: Topic Filter Pills & Top-Right Search */}
          <div className="p-4 border-b border-stone-200/70 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <TopicFilterBar
              topics={topics}
              selectedTopicId={selectedTopicId}
              onSelectTopic={setSelectedTopicId}
              onAddTopic={handleAddTopic}
            />

            {/* Top-Right Minimal Search Box */}
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${currentTopicName}...`}
                className="w-full pl-9 pr-3.5 py-1.5 bg-stone-50/70 border border-stone-200/80 rounded-lg text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-900"
              />
            </div>
          </div>

          {/* Clean Data Table View */}
          <div className="overflow-x-auto">
            {/* Table Header Columns */}
            <div className="grid grid-cols-12 gap-4 px-5 py-3 bg-stone-50/50 border-b border-stone-200/60 text-xs font-mono font-medium text-stone-400 uppercase tracking-wider">
              <div className="col-span-12 md:col-span-6">Question</div>
              <div className="col-span-6 md:col-span-2">Topic</div>
              <div className="col-span-3 md:col-span-2">Confidence</div>
              <div className="col-span-3 md:col-span-2 text-right md:text-left">Last Reviewed</div>
            </div>

            {/* Table Content Rows */}
            {filteredQuestions.length > 0 ? (
              <div className="divide-y divide-stone-200/60">
                {filteredQuestions.map((q) => (
                  <QuestionRow
                    key={q.id}
                    question={q}
                    topicName={topics.find((t) => t.id === q.topic_id)?.name}
                    onEdit={(q) => {
                      setEditingQuestion(q);
                      setIsModalOpen(true);
                    }}
                    onDelete={handleDeleteQuestion}
                    onConfidenceCycle={handleConfidenceCycle}
                  />
                ))}
              </div>
            ) : (
              /* Centered Editorial Empty State */
              <div className="p-16 text-center space-y-4 animate-fadeIn">
                <div className="w-12 h-12 rounded-full bg-stone-100 border border-stone-200/80 flex items-center justify-center mx-auto text-stone-700">
                  <FolderPlus className="w-6 h-6 stroke-[1.5]" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-xl font-serif-display font-medium text-stone-900">
                    No Questions Recorded
                  </h3>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto font-sans leading-relaxed">
                    {selectedTopicId === 'all'
                      ? 'Your prep log is currently empty. Click the button below to add your first question.'
                      : `No questions filed under "${currentTopicName}" yet.`}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingQuestion(null);
                    setIsModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-full text-xs font-medium transition-all shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Add First Question</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal */}
      <QuestionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveQuestion}
        initialQuestion={editingQuestion}
        topics={topics}
        defaultTopicId={selectedTopicId}
      />
    </div>
  );
}
