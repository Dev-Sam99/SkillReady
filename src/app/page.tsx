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
import { Search, Plus, Terminal, RefreshCw, Layers } from 'lucide-react';

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
    <div className="min-h-screen bg-[#08090a] text-zinc-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-black">
      {/* Sleek Dark Developer Header */}
      <header className="bg-[#0b0c0e]/90 border-b border-zinc-800/80 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500/10 border border-emerald-500/30 p-2 rounded-lg text-emerald-400">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-mono font-bold tracking-tight text-zinc-100 flex items-center gap-2">
                SkillReady <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">v1.0</span>
              </h1>
              <p className="text-[11px] font-mono text-zinc-500">Terminal-Grade Interview Preparation & Spaced Repetition Engine</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setEditingQuestion(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-black font-mono font-bold rounded-lg text-xs shadow-lg shadow-emerald-600/20 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Question</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
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

        {/* Topic Filter & Search Toolbar */}
        <div className="space-y-3 bg-[#0e0f12] border border-zinc-800/80 p-4 rounded-xl shadow-xl">
          <TopicFilterBar
            topics={topics}
            selectedTopicId={selectedTopicId}
            onSelectTopic={setSelectedTopicId}
            onAddTopic={handleAddTopic}
          />

          {/* Search bar & Progress */}
          <div className="pt-3 border-t border-zinc-800/60 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 font-mono">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`grep "${currentTopicName.toLowerCase()}"...`}
                className="w-full pl-9 pr-4 py-2 bg-[#050607] border border-zinc-800/80 rounded-lg text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
              />
            </div>

            {/* Topic Progress Bar */}
            <div className="flex items-center gap-3 bg-[#050607] px-3.5 py-2 rounded-lg border border-zinc-800/80 text-xs">
              <span className="text-zinc-500">{currentTopicName}:</span>
              <div className="w-28 bg-zinc-900 rounded-full h-1.5 overflow-hidden border border-zinc-800">
                <div
                  className="bg-emerald-400 h-full rounded-full transition-all duration-300"
                  style={{ width: `${topicProgressPct}%` }}
                />
              </div>
              <span className="text-emerald-400 font-bold">{topicProgressPct}%</span>
            </div>
          </div>
        </div>

        {/* Question Cards Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-500">
            <span>Query Results: {filteredQuestions.length} entries</span>
            <button
              onClick={fetchInitialData}
              className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reload DB
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
            <div className="bg-[#0e0f12] border border-zinc-800/80 rounded-xl p-12 text-center space-y-3 font-mono">
              <Layers className="w-8 h-8 text-zinc-700 mx-auto" />
              <h3 className="text-sm font-semibold text-zinc-300">0_RESULTS_RETURNED</h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                No entries match the query criteria. Clear filters or add a new question card.
              </p>
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
