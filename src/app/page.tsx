'use client';

import React, { useState, useEffect } from 'react';
import { Topic, Question, ConfidenceLevel } from '@/types';
import { MOCK_TOPICS, MOCK_QUESTIONS } from '@/lib/mockData';
import { getTopics, addTopic, getQuestions, createQuestion, updateQuestion, deleteQuestion } from './actions';
import { TopicFilterBar } from '@/components/TopicFilterBar';
import { QuestionCard } from '@/components/QuestionCard';
import { QuestionModal } from '@/components/QuestionModal';
import { DashboardStats } from '@/components/DashboardStats';
import { ReviewDueSection } from '@/components/ReviewDueSection';
import { SkillReadyLogo } from '@/components/SkillReadyLogo';
import { Search, Plus, RefreshCw, FolderPlus, Sun, Moon } from 'lucide-react';

export default function Home() {
  const [topics, setTopics] = useState<Topic[]>(MOCK_TOPICS);
  const [questions, setQuestions] = useState<Question[]>(MOCK_QUESTIONS);
  const [selectedTopicId, setSelectedTopicId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    fetchInitialData();
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      document.documentElement.classList.remove('dark');
    }
  };

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

  const currentTopicQuestions = selectedTopicId === 'all' 
    ? questions 
    : questions.filter(q => q.topic_id === selectedTopicId);
  const currentSolidCount = currentTopicQuestions.filter(q => q.confidence === 'solid').length;
  const topicProgressPct = currentTopicQuestions.length > 0 
    ? Math.round((currentSolidCount / currentTopicQuestions.length) * 100) 
    : 0;

  const currentTopicName = selectedTopicId === 'all' 
    ? 'All Topics' 
    : topics.find(t => t.id === selectedTopicId)?.name || 'Topic';

  return (
    <div className="min-h-screen bg-[var(--bg-app)] text-[var(--text-primary)] flex flex-col font-sans transition-colors duration-200">
      {/* Solva / Editorial Light SaaS Header */}
      <header className="bg-white/80 dark:bg-[#121316]/90 border-b border-stone-200/80 dark:border-zinc-800/80 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SkillReadyLogo className="w-6 h-6" />
            <div>
              <h1 className="text-base font-mono font-bold tracking-tight text-stone-900 dark:text-zinc-100 flex items-center gap-2">
                SkillReady <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-100 dark:bg-zinc-800 text-stone-600 dark:text-zinc-400 font-mono border border-stone-200 dark:border-zinc-700">v1.0</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="p-1.5 rounded border border-stone-200 dark:border-zinc-800 text-stone-500 dark:text-zinc-400 hover:text-stone-800 dark:hover:text-zinc-200 transition-colors"
              title="Toggle Light/Dark Theme"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={() => {
                setEditingQuestion(null);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-medium rounded text-xs transition-all active:scale-95 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Add Question</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5 animate-fadeIn">
        {/* Dashboard Analytics */}
        <DashboardStats questions={questions} topics={topics} />

        {/* Review Due Alert */}
        <ReviewDueSection
          questions={questions}
          onSelectQuestion={(q) => {
            setEditingQuestion(q);
            setIsModalOpen(true);
          }}
        />

        {/* Topic Filter & Search Bar */}
        <div className="space-y-3 bg-white dark:bg-[#121316] border border-stone-200/80 dark:border-zinc-800/60 p-4 rounded-lg shadow-sm">
          <TopicFilterBar
            topics={topics}
            selectedTopicId={selectedTopicId}
            onSelectTopic={setSelectedTopicId}
            onAddTopic={handleAddTopic}
          />

          {/* Search bar & Progress */}
          <div className="pt-2 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 font-mono">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400 dark:text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search in ${currentTopicName}...`}
                className="w-full pl-9 pr-3 py-1.5 bg-stone-50/80 dark:bg-[#08090a] border border-stone-200 dark:border-zinc-800 rounded text-xs text-stone-800 dark:text-zinc-200 placeholder-stone-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
              />
            </div>

            {/* Topic Progress Bar */}
            <div className="flex items-center gap-3 bg-stone-50/80 dark:bg-[#08090a] px-3 py-1.5 rounded border border-stone-200 dark:border-zinc-800 text-xs">
              <span className="text-stone-500 dark:text-zinc-500">{currentTopicName}:</span>
              <div className="w-28 bg-stone-200 dark:bg-zinc-900 rounded-full h-1.5 overflow-hidden border border-stone-300/40 dark:border-zinc-800">
                <div
                  className="bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-500 dark:to-teal-400 h-full rounded-full transition-all duration-300"
                  style={{ width: `${topicProgressPct}%` }}
                />
              </div>
              <span className="text-emerald-700 dark:text-emerald-400 font-bold">{topicProgressPct}%</span>
            </div>
          </div>
        </div>

        {/* Question Cards Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-stone-500 dark:text-zinc-500">
            <span>{filteredQuestions.length} Questions</span>
            <button
              onClick={fetchInitialData}
              className="flex items-center gap-1 text-stone-400 hover:text-stone-700 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors"
            >
              <RefreshCw className="w-3 h-3" /> Sync
            </button>
          </div>

          {filteredQuestions.length > 0 ? (
            <div className="grid grid-cols-1 gap-3">
              {filteredQuestions.map((q) => (
                <QuestionCard
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
            /* Friendly Designed Empty State */
            <div className="bg-white dark:bg-[#121316] border border-dashed border-stone-300 dark:border-zinc-800 rounded-lg p-10 text-center space-y-3 font-mono animate-fadeIn">
              <div className="w-10 h-10 rounded-full bg-stone-100 dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
                <FolderPlus className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xs font-semibold text-stone-800 dark:text-zinc-300 uppercase tracking-wider">No Questions Found</h3>
                <p className="text-xs text-stone-500 dark:text-zinc-500 max-w-xs mx-auto">
                  {selectedTopicId === 'all'
                    ? 'No questions added yet. Start by adding your first interview Q&A!'
                    : `No questions recorded under "${currentTopicName}" yet.`}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingQuestion(null);
                  setIsModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30 rounded text-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add First Question
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Add / Edit Question Modal */}
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
