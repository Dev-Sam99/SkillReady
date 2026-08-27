'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Topic, Question, ConfidenceLevel } from '@/types';
import { MOCK_TOPICS, MOCK_QUESTIONS } from '@/lib/mockData';
import { getTopics, addTopic, getQuestions, createQuestion, updateQuestion, deleteQuestion } from './actions';
import { checkIsAdmin, logoutAdmin } from './authActions';
import { TopicFilterBar } from '@/components/TopicFilterBar';
import { QuestionRow } from '@/components/QuestionRow';
import { QuestionModal } from '@/components/QuestionModal';
import { BulkAddModal } from '@/components/BulkAddModal';
import { PracticeMode } from '@/components/PracticeMode';
import { DashboardStats } from '@/components/DashboardStats';
import { ReviewDueSection } from '@/components/ReviewDueSection';
import { SkillReadyWordmark } from '@/components/SkillReadyWordmark';
import { Search, Plus, Layers, Play, Download, Lock, LogOut } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [topics, setTopics] = useState<Topic[]>(MOCK_TOPICS);
  const [questions, setQuestions] = useState<Question[]>(MOCK_QUESTIONS);
  const [selectedTopicId, setSelectedTopicId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  // Modal States
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [isPracticeModalOpen, setIsPracticeModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  useEffect(() => {
    fetchInitialData();
    verifyAdminSession();
  }, []);

  const verifyAdminSession = async () => {
    const adminStatus = await checkIsAdmin();
    setIsAdmin(adminStatus);
  };

  const fetchInitialData = async () => {
    const topicsRes = await getTopics();
    if (topicsRes.data) setTopics(topicsRes.data);

    const questionsRes = await getQuestions();
    if (questionsRes.data) setQuestions(questionsRes.data);
  };

  const handleLogout = async () => {
    await logoutAdmin();
    setIsAdmin(false);
  };

  const requireAdmin = (): boolean => {
    if (!isAdmin) {
      router.push('/login');
      return false;
    }
    return true;
  };

  const handleAddTopic = async (name: string) => {
    if (!requireAdmin()) return;
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
    if (!requireAdmin()) return;
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
    if (!requireAdmin()) return;
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === id ? { ...q, confidence: newConfidence, last_reviewed: new Date().toISOString() } : q
      )
    );

    await updateQuestion(id, { confidence: newConfidence });
  };

  const handleDeleteQuestion = async (id: string) => {
    if (!requireAdmin()) return;
    setQuestions((prev) => prev.filter((q) => q.id !== id));
    await deleteQuestion(id);
  };

  const handleDownloadPDF = () => {
    if (!requireAdmin()) return;
    const url = `/api/export-pdf?topicId=${encodeURIComponent(selectedTopicId)}`;
    window.open(url, '_blank');
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <SkillReadyWordmark />

          <div className="flex items-center gap-2.5">
            {/* Visible to everyone: Practice Mode */}
            <button
              type="button"
              onClick={() => setIsPracticeModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-mono font-medium rounded-full text-xs transition-all active:scale-95 shadow-sm"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Practice Mode</span>
            </button>

            {/* Admin-only Action Buttons */}
            {isAdmin && (
              <>
                <button
                  type="button"
                  onClick={handleDownloadPDF}
                  className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 border border-stone-200/80 hover:bg-stone-100/60 text-stone-700 font-mono font-medium rounded-full text-xs transition-all"
                  title="Download Formatted PDF Summary"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>PDF Export</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsBulkModalOpen(true)}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 border border-stone-200/80 hover:bg-stone-100/60 text-stone-700 font-mono font-medium rounded-full text-xs transition-all"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Bulk Add</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEditingQuestion(null);
                    setIsQuestionModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-stone-900 hover:bg-stone-800 text-white font-mono font-medium rounded-full text-xs transition-all active:scale-95 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Add Question</span>
                </button>
              </>
            )}

            {/* Admin Session Control Link */}
            {isAdmin ? (
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1 text-xs font-mono text-stone-400 hover:text-red-600 transition-colors ml-2"
                title="Admin Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            ) : (
              <a
                href="/login"
                className="inline-flex items-center gap-1 text-xs font-mono text-stone-400 hover:text-stone-900 transition-colors ml-2"
                title="Admin Login"
              >
                <Lock className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Admin Login</span>
              </a>
            )}
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
            if (isAdmin) {
              setEditingQuestion(q);
              setIsQuestionModalOpen(true);
            }
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
                      if (isAdmin) {
                        setEditingQuestion(q);
                        setIsQuestionModalOpen(true);
                      }
                    }}
                    onDelete={handleDeleteQuestion}
                    onConfidenceCycle={handleConfidenceCycle}
                  />
                ))}
              </div>
            ) : (
              <div className="p-16 text-center space-y-4 animate-fadeIn">
                <div className="space-y-1.5">
                  <h3 className="text-xl font-serif-display font-medium text-stone-900">
                    No Questions Recorded
                  </h3>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto font-sans leading-relaxed">
                    {selectedTopicId === 'all'
                      ? 'No interview questions logged yet.'
                      : `No questions filed under "${currentTopicName}" yet.`}
                  </p>
                </div>
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingQuestion(null);
                      setIsQuestionModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-full text-xs font-medium transition-all shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Add First Question</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modals */}
      <QuestionModal
        isOpen={isQuestionModalOpen}
        onClose={() => setIsQuestionModalOpen(false)}
        onSave={handleSaveQuestion}
        initialQuestion={editingQuestion}
        topics={topics}
        defaultTopicId={selectedTopicId}
      />

      <BulkAddModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        onSuccess={fetchInitialData}
        topics={topics}
        defaultTopicId={selectedTopicId}
      />

      <PracticeMode
        isOpen={isPracticeModalOpen}
        onClose={() => setIsPracticeModalOpen(false)}
        questions={questions}
        topics={topics}
      />
    </div>
  );
}
