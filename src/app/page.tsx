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
import { Search, PlusCircle, Zap, RefreshCw, BookOpen } from 'lucide-react';

export default function Home() {
  const [topics, setTopics] = useState<Topic[]>(MOCK_TOPICS);
  const [questions, setQuestions] = useState<Question[]>(MOCK_QUESTIONS);
  const [selectedTopicId, setSelectedTopicId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch topics and questions on mount
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    const topicsRes = await getTopics();
    if (topicsRes.data) setTopics(topicsRes.data);

    const questionsRes = await getQuestions();
    if (questionsRes.data) setQuestions(questionsRes.data);

    setLoading(false);
  };

  // Topic Addition
  const handleAddTopic = async (name: string) => {
    const res = await addTopic(name);
    if (res.data) {
      setTopics((prev) => [...prev, res.data]);
    }
  };

  // Save / Edit Question
  const handleSaveQuestion = async (formData: {
    id?: string;
    topic_id: string;
    question: string;
    answer: string;
    confidence: ConfidenceLevel;
  }) => {
    if (formData.id) {
      // Update
      const res = await updateQuestion(formData.id, {
        topic_id: formData.topic_id,
        question: formData.question,
        answer: formData.answer,
        confidence: formData.confidence,
      });

      if (res.data) {
        setQuestions((prev) => prev.map((q) => (q.id === formData.id ? res.data : q)));
      } else {
        // Local state update fallback
        setQuestions((prev) =>
          prev.map((q) =>
            q.id === formData.id
              ? { ...q, ...formData, updated_at: new Date().toISOString(), last_reviewed: new Date().toISOString() }
              : q
          )
        );
      }
    } else {
      // Create
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

  // Confidence Cycle
  const handleConfidenceCycle = async (id: string, newConfidence: ConfidenceLevel) => {
    // Optimistic UI update
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === id ? { ...q, confidence: newConfidence, last_reviewed: new Date().toISOString() } : q
      )
    );

    await updateQuestion(id, { confidence: newConfidence });
  };

  // Delete Question
  const handleDeleteQuestion = async (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
    await deleteQuestion(id);
  };

  // Filtered Questions list
  const filteredQuestions = questions.filter((q) => {
    const matchesTopic = selectedTopicId === 'all' || q.topic_id === selectedTopicId;
    const matchesSearch =
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTopic && matchesSearch;
  });

  // Calculate Progress bar for current selected topic
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Header / Branding */}
      <header className="bg-slate-900/80 border-b border-slate-800 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-600/30">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                SkillReady <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono font-medium">v1.0</span>
              </h1>
              <p className="text-xs text-slate-400">Interview Q&A Tracker & Spaced Repetition</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setEditingQuestion(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold shadow-md shadow-indigo-600/30 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Add Question</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Dashboard Overview */}
        <DashboardStats questions={questions} topics={topics} />

        {/* Review Due Spaced Repetition Banner */}
        <ReviewDueSection
          questions={questions}
          onSelectQuestion={(q) => {
            setEditingQuestion(q);
            setIsModalOpen(true);
          }}
        />

        {/* Topic Filter Bar */}
        <div className="space-y-3 bg-slate-900/60 border border-slate-800 p-4 rounded-2xl shadow-lg">
          <TopicFilterBar
            topics={topics}
            selectedTopicId={selectedTopicId}
            onSelectTopic={setSelectedTopicId}
            onAddTopic={handleAddTopic}
          />

          {/* Search bar & Topic Progress Bar */}
          <div className="pt-3 border-t border-slate-800/80 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search questions in ${currentTopicName}...`}
                className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>

            {/* Per-topic Progress Bar */}
            <div className="flex items-center gap-3 bg-slate-950/60 px-3.5 py-1.5 rounded-xl border border-slate-800 text-xs">
              <span className="text-slate-400 font-medium">{currentTopicName} Progress:</span>
              <div className="w-28 bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-400 h-full rounded-full transition-all duration-300"
                  style={{ width: `${topicProgressPct}%` }}
                />
              </div>
              <span className="font-mono text-emerald-400 font-bold">{topicProgressPct}%</span>
            </div>
          </div>
        </div>

        {/* Question List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Showing {filteredQuestions.length} Questions</span>
            <button
              onClick={fetchInitialData}
              className="flex items-center gap-1 text-slate-400 hover:text-slate-200"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Sync Data
            </button>
          </div>

          {filteredQuestions.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
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
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
              <BookOpen className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="text-base font-semibold text-slate-300">No Questions Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No interview questions match your current search query or selected topic filter.
              </p>
              <button
                type="button"
                onClick={() => {
                  setEditingQuestion(null);
                  setIsModalOpen(true);
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold"
              >
                + Add Question
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
