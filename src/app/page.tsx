'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Topic, Question, ConfidenceLevel } from '@/types';
import { MOCK_TOPICS, MOCK_QUESTIONS } from '@/lib/mockData';
import { getTopics, addTopic, getQuestions, createQuestion, updateQuestion, deleteQuestion } from './actions';
import { checkIsAdmin, logoutAdmin } from './authActions';

import { Header } from '@/components/Header';
import { NavigationPanel } from '@/components/NavigationPanel';
import { AnswerPanel } from '@/components/AnswerPanel';
import { QuestionModal } from '@/components/QuestionModal';
import { BulkAddModal } from '@/components/BulkAddModal';
import { PracticeMode } from '@/components/PracticeMode';
import { ShortcutsModal } from '@/components/ShortcutsModal';
import { Menu, X } from 'lucide-react';

export default function Home() {
  const [topics, setTopics] = useState<Topic[]>(MOCK_TOPICS);
  const [questions, setQuestions] = useState<Question[]>(MOCK_QUESTIONS);
  const [selectedTopicId, setSelectedTopicId] = useState<string>('all');
  const [markerFilter, setMarkerFilter] = useState<'all' | 'flagged' | 'important'>('all');
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [confidenceFilter, setConfidenceFilter] = useState<'all' | ConfidenceLevel>('all');
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Mobile drawer state
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Modals state
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [isPracticeOpen, setIsPracticeOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  // Refs
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const answerContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetchInitialData();
    verifyAdminSession();
  }, []);

  const verifyAdminSession = async () => {
    const adminStatus = await checkIsAdmin();
    setIsAdmin(adminStatus);
  };

  const fetchInitialData = async () => {
    setIsLoading(true);
    let loadedTopics = MOCK_TOPICS;
    let loadedQuestions = MOCK_QUESTIONS;

    const topicsRes = await getTopics();
    if (topicsRes.data && topicsRes.data.length > 0) {
      loadedTopics = topicsRes.data;
    } else if (typeof window !== 'undefined') {
      const savedTopics = localStorage.getItem('skillready_topics');
      if (savedTopics) {
        try { loadedTopics = JSON.parse(savedTopics); } catch { /* ignore */ }
      }
    }
    setTopics(loadedTopics);

    const questionsRes = await getQuestions();
    if (questionsRes.data && questionsRes.data.length > 0) {
      loadedQuestions = questionsRes.data;
    } else if (typeof window !== 'undefined') {
      const savedQuestions = localStorage.getItem('skillready_questions');
      if (savedQuestions) {
        try { loadedQuestions = JSON.parse(savedQuestions); } catch { /* ignore */ }
      }
    }

    // Ensure migration for flagged / important booleans
    const migratedQuestions = loadedQuestions.map((q) => ({
      ...q,
      is_flagged: q.is_flagged ?? false,
      is_important: q.is_important ?? false,
    }));
    setQuestions(migratedQuestions);

    // Restore last selected topic & question from localStorage
    if (typeof window !== 'undefined') {
      const savedTopic = localStorage.getItem('skillready_last_topic');
      if (savedTopic) {
        setSelectedTopicId(savedTopic);
      }
      const savedMarker = localStorage.getItem('skillready_last_marker');
      if (savedMarker && (savedMarker === 'all' || savedMarker === 'flagged' || savedMarker === 'important')) {
        setMarkerFilter(savedMarker as 'all' | 'flagged' | 'important');
      }
      const savedQId = localStorage.getItem('skillready_last_q');
      if (savedQId && migratedQuestions.some((q) => q.id === savedQId)) {
        setSelectedQuestionId(savedQId);
      } else if (migratedQuestions.length > 0) {
        setSelectedQuestionId(migratedQuestions[0].id);
      }
    } else if (migratedQuestions.length > 0) {
      setSelectedQuestionId(migratedQuestions[0].id);
    }

    setIsLoading(false);
  };

  const saveTopicsState = (newTopics: Topic[]) => {
    setTopics(newTopics);
    if (typeof window !== 'undefined') {
      localStorage.setItem('skillready_topics', JSON.stringify(newTopics));
    }
  };

  const saveQuestionsState = (newQuestions: Question[]) => {
    setQuestions(newQuestions);
    if (typeof window !== 'undefined') {
      localStorage.setItem('skillready_questions', JSON.stringify(newQuestions));
    }
  };

  const handleSelectTopicId = (topicId: string) => {
    setSelectedTopicId(topicId);
    if (typeof window !== 'undefined') {
      localStorage.setItem('skillready_last_topic', topicId);
    }
  };

  const handleSelectMarkerFilter = (filter: 'all' | 'flagged' | 'important') => {
    setMarkerFilter(filter);
    if (typeof window !== 'undefined') {
      localStorage.setItem('skillready_last_marker', filter);
    }
  };

  const handleSelectQuestion = (question: Question) => {
    setSelectedQuestionId(question.id);
    setIsMobileDrawerOpen(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('skillready_last_q', question.id);
    }
  };

  // Filtered & sorted question list for navigation / index calculations
  const getFilteredQuestions = useCallback(() => {
    return questions
      .filter((q) => {
        if (selectedTopicId !== 'all' && q.topic_id !== selectedTopicId) {
          return false;
        }
        if (markerFilter === 'flagged' && !q.is_flagged) return false;
        if (markerFilter === 'important' && !q.is_important) return false;
        if (confidenceFilter !== 'all' && q.confidence !== confidenceFilter) return false;
        if (searchQuery.trim()) {
          const qText = q.question.toLowerCase();
          const aText = q.answer.toLowerCase();
          const sTerm = searchQuery.toLowerCase();
          if (!qText.includes(sTerm) && !aText.includes(sTerm)) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (confidenceFilter !== 'all') {
          const order: Record<ConfidenceLevel, number> = { weak: 0, medium: 1, solid: 2 };
          return order[a.confidence] - order[b.confidence];
        }
        return 0; // Stable order to prevent index shifting on confidence cycle
      });
  }, [questions, selectedTopicId, markerFilter, confidenceFilter, searchQuery]);

  const activeQuestions = getFilteredQuestions();
  const currentQuestionIndex = activeQuestions.findIndex((q) => q.id === selectedQuestionId);
  const selectedQuestion = currentQuestionIndex >= 0 ? activeQuestions[currentQuestionIndex] : activeQuestions[0] || null;

  // Next / Prev navigation
  const handleNextQuestion = useCallback(() => {
    if (activeQuestions.length === 0) return;
    const nextIdx = currentQuestionIndex + 1;
    if (nextIdx < activeQuestions.length) {
      handleSelectQuestion(activeQuestions[nextIdx]);
    }
  }, [activeQuestions, currentQuestionIndex]);

  const handlePrevQuestion = useCallback(() => {
    if (activeQuestions.length === 0) return;
    const prevIdx = currentQuestionIndex - 1;
    if (prevIdx >= 0) {
      handleSelectQuestion(activeQuestions[prevIdx]);
    }
  }, [activeQuestions, currentQuestionIndex]);

  // Actions
  const handleToggleFlag = useCallback((q: Question) => {
    setQuestions((prev) => {
      const updated = prev.map((item) =>
        item.id === q.id ? { ...item, is_flagged: !item.is_flagged } : item
      );
      if (typeof window !== 'undefined') {
        localStorage.setItem('skillready_questions', JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  const handleToggleImportant = useCallback((q: Question) => {
    setQuestions((prev) => {
      const updated = prev.map((item) =>
        item.id === q.id ? { ...item, is_important: !item.is_important } : item
      );
      if (typeof window !== 'undefined') {
        localStorage.setItem('skillready_questions', JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  const handleCycleConfidence = async (q: Question) => {
    const nextLevel: Record<ConfidenceLevel, ConfidenceLevel> = {
      weak: 'medium',
      medium: 'solid',
      solid: 'weak',
    };
    const newConf = nextLevel[q.confidence];
    const updated = questions.map((item) =>
      item.id === q.id
        ? { ...item, confidence: newConf, updated_at: new Date().toISOString() }
        : item
    );
    saveQuestionsState(updated);
    await updateQuestion(q.id, { confidence: newConf });
  };

  const handleDeleteQuestion = async (q: Question) => {
    await deleteQuestion(q.id);
    const updated = questions.filter((item) => item.id !== q.id);
    saveQuestionsState(updated);

    if (selectedQuestionId === q.id) {
      const remaining = activeQuestions.filter((item) => item.id !== q.id);
      if (remaining.length > 0) {
        setSelectedQuestionId(remaining[0].id);
      } else {
        setSelectedQuestionId(null);
      }
    }
  };

  const handleAddTopic = async (name: string): Promise<{ success: boolean; error?: string }> => {
    const res = await addTopic(name);
    if (res.data) {
      saveTopicsState([...topics, res.data]);
      return { success: true };
    }
    return { success: false, error: res.error || 'Failed to add topic' };
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

      const updatedList = questions.map((q) =>
        q.id === formData.id
          ? res.data || {
              ...q,
              topic_id: formData.topic_id,
              question: formData.question,
              answer: formData.answer,
              confidence: formData.confidence,
              updated_at: new Date().toISOString(),
            }
          : q
      );
      saveQuestionsState(updatedList);
    } else {
      const res = await createQuestion({
        topic_id: formData.topic_id,
        question: formData.question,
        answer: formData.answer,
        confidence: formData.confidence,
      });

      const newQ = res.data || {
        id: `q-${Date.now()}`,
        topic_id: formData.topic_id,
        question: formData.question,
        answer: formData.answer,
        confidence: formData.confidence,
        is_flagged: false,
        is_important: false,
        last_reviewed: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      saveQuestionsState([newQ, ...questions]);
      setSelectedQuestionId(newQ.id);
    }
  };

  const handleLogout = async () => {
    await logoutAdmin();
    setIsAdmin(false);
  };

  const handleDownloadPDF = async () => {
    try {
      const targetUrl = `/api/export-pdf?topicId=${selectedTopicId}`;
      const response = await fetch(targetUrl);
      if (!response.ok) throw new Error('PDF generation failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `SkillReady_Questions_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (err) {
      console.error('Download PDF error:', err);
      alert('Failed to generate PDF export.');
    }
  };

  const handleDownloadMarkdown = () => {
    const targetTopic = selectedTopicId === 'all'
      ? 'All Subjects'
      : topics.find((t) => t.id === selectedTopicId)?.name || 'Interview Questions';

    let mdContent = `# SkillReady Cheat Sheet: ${targetTopic}\n\n`;
    mdContent += `*Generated on ${new Date().toLocaleDateString()} — ${activeQuestions.length} Questions*\n\n---\n\n`;

    activeQuestions.forEach((q, idx) => {
      const topicName = topics.find((t) => t.id === q.topic_id)?.name || 'General';
      mdContent += `### ${idx + 1}. [${q.confidence.toUpperCase()}] [${topicName}] ${q.question}\n\n`;
      mdContent += `**Answer:**\n${q.answer}\n\n`;
      if (q.notes) {
        mdContent += `> **Personal Note:** ${q.notes}\n\n`;
      }
      mdContent += `---\n\n`;
    });

    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SkillReady_${targetTopic.replace(/\s+/g, '_')}_CheatSheet.md`;
    document.body.appendChild(link);
    link.click();
    URL.revokeObjectURL(url);
    link.remove();
  };

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      if (e.key === 'j' || e.key === 'J') {
        e.preventDefault();
        handleNextQuestion();
      } else if (e.key === 'k' || e.key === 'K') {
        e.preventDefault();
        handlePrevQuestion();
      } else if ((e.key === 'f' || e.key === 'F') && selectedQuestion) {
        e.preventDefault();
        handleToggleFlag(selectedQuestion);
      } else if ((e.key === 's' || e.key === 'S') && selectedQuestion) {
        e.preventDefault();
        handleToggleImportant(selectedQuestion);
      } else if (e.key === ' ') {
        e.preventDefault();
        answerContainerRef.current?.scrollBy({ top: 150, behavior: 'smooth' });
      } else if (e.key === '/') {
        e.preventDefault();
        if (isMobileDrawerOpen) setIsMobileDrawerOpen(false);
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNextQuestion, handlePrevQuestion, handleToggleFlag, handleToggleImportant, selectedQuestion, isMobileDrawerOpen]);

  const currentTopicName = selectedQuestion
    ? topics.find((t) => t.id === selectedQuestion.topic_id)?.name || 'General'
    : 'Topics';

  return (
    <div className="h-screen bg-page-bg text-ink flex flex-col font-sans selection:bg-deep selection:text-white w-full overflow-hidden relative">
      {/* 3 Fixed Blurred Background Blobs */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#7CC4FA] blur-[70px] opacity-75 rounded-full pointer-events-none z-0" />
      <div className="fixed top-[40%] right-[-10%] w-[550px] h-[550px] bg-[#BFD3E6] blur-[70px] opacity-70 rounded-full pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-[#A5D8FF] blur-[70px] opacity-75 rounded-full pointer-events-none z-0" />

      {/* Glass Header Pill */}
      <Header
        isAdmin={isAdmin}
        onAddQuestion={() => {
          setEditingQuestion(null);
          setIsQuestionModalOpen(true);
        }}
        onDownloadPDF={handleDownloadPDF}
        onDownloadMarkdown={handleDownloadMarkdown}
        onOpenBulkAdd={() => setIsBulkModalOpen(true)}
        onOpenPractice={() => setIsPracticeOpen(true)}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        onLogout={handleLogout}
      />

      {/* Mobile-Only Top Navigation Bar (< 860px) */}
      <div className="min-[860px]:hidden px-3 sm:px-6 mb-3 flex items-center justify-between z-20">
        <button
          type="button"
          onClick={() => setIsMobileDrawerOpen(true)}
          aria-label="Open topics & questions drawer"
          className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-full bg-white/90 border border-line text-ink font-semibold text-xs shadow-2xs hover:bg-white transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep"
        >
          <Menu className="w-5 h-5 text-deep" aria-hidden="true" />
          <span>Menu</span>
        </button>

        <span className="text-xs font-semibold text-slate font-sans bg-white/80 border border-line/60 px-3.5 py-1.5 rounded-full shadow-2xs">
          {currentTopicName} · {activeQuestions.length > 0 ? `${currentQuestionIndex + 1}/${activeQuestions.length}` : '0/0'}
        </span>
      </div>

      {/* Main Split-Pane Workspace Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 pb-4 h-[calc(100vh-85px)] min-h-0 overflow-hidden relative z-10">
        {isLoading ? (
          <div className="h-full bg-white/70 backdrop-blur-md rounded-3xl border border-white/95 animate-pulse shadow-glass" />
        ) : (
          <div className="h-full flex gap-4 min-h-0 overflow-hidden">
            {/* Desktop Left Navigation Panel (>= 860px wide, ~350px width) */}
            <aside className="hidden min-[860px]:block w-[350px] shrink-0 h-full min-h-0">
              <NavigationPanel
                topics={topics}
                questions={questions}
                selectedTopicId={selectedTopicId}
                markerFilter={markerFilter}
                selectedQuestionId={selectedQuestionId}
                searchQuery={searchQuery}
                confidenceFilter={confidenceFilter}
                searchInputRef={searchInputRef}
                onSelectTopicId={handleSelectTopicId}
                onSelectMarkerFilter={handleSelectMarkerFilter}
                onSelectQuestion={handleSelectQuestion}
                onSearchChange={setSearchQuery}
                onConfidenceFilterChange={setConfidenceFilter}
                onAddQuestion={() => {
                  setEditingQuestion(null);
                  setIsQuestionModalOpen(true);
                }}
              />
            </aside>

            {/* Main Answer Panel (Desktop Right Pane / Mobile Full Screen) */}
            <section ref={answerContainerRef} className="flex-1 min-w-0 h-full min-h-0">
              <AnswerPanel
                question={selectedQuestion}
                topicName={currentTopicName}
                currentIndex={currentQuestionIndex >= 0 ? currentQuestionIndex : 0}
                totalCount={activeQuestions.length}
                onCycleConfidence={handleCycleConfidence}
                onToggleFlag={handleToggleFlag}
                onToggleImportant={handleToggleImportant}
                onEdit={(q) => {
                  setEditingQuestion(q);
                  setIsQuestionModalOpen(true);
                }}
                onDelete={handleDeleteQuestion}
                onPrev={handlePrevQuestion}
                onNext={handleNextQuestion}
                onAddQuestion={() => {
                  setEditingQuestion(null);
                  setIsQuestionModalOpen(true);
                }}
              />
            </section>
          </div>
        )}
      </main>

      {/* Mobile Left Drawer Overlay (< 860px) */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 min-[860px]:hidden animate-fadeIn">
          {/* Backdrop Dim Overlay */}
          <div
            className="fixed inset-0 bg-ink/50 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileDrawerOpen(false)}
            aria-hidden="true"
          />

          {/* Left Drawer Container (86-88% width) */}
          <div className="fixed top-0 left-0 bottom-0 z-50 w-[88%] max-w-[360px] bg-page-bg p-3 shadow-2xl flex flex-col animate-slideInLeft border-r border-line">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-line px-2">
              <span className="font-display font-bold text-base text-ink">Topics & Questions</span>
              <button
                type="button"
                onClick={() => setIsMobileDrawerOpen(false)}
                aria-label="Close drawer"
                className="w-10 h-10 inline-flex items-center justify-center rounded-full text-slate hover:text-ink hover:bg-tint"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <div className="flex-1 min-h-0">
              <NavigationPanel
                topics={topics}
                questions={questions}
                selectedTopicId={selectedTopicId}
                markerFilter={markerFilter}
                selectedQuestionId={selectedQuestionId}
                searchQuery={searchQuery}
                confidenceFilter={confidenceFilter}
                searchInputRef={searchInputRef}
                onSelectTopicId={handleSelectTopicId}
                onSelectMarkerFilter={handleSelectMarkerFilter}
                onSelectQuestion={handleSelectQuestion}
                onSearchChange={setSearchQuery}
                onConfidenceFilterChange={setConfidenceFilter}
                onAddQuestion={() => {
                  setIsMobileDrawerOpen(false);
                  setEditingQuestion(null);
                  setIsQuestionModalOpen(true);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <QuestionModal
        isOpen={isQuestionModalOpen}
        onClose={() => setIsQuestionModalOpen(false)}
        onSave={handleSaveQuestion}
        initialQuestion={editingQuestion}
        topics={topics}
        defaultTopicId={selectedTopicId !== 'all' ? selectedTopicId : topics[0]?.id || ''}
      />

      <BulkAddModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        onSuccess={async (newQuestions, targetTopicId) => {
          await fetchInitialData();
          if (newQuestions && newQuestions.length > 0) {
            setQuestions((prev) => {
              const merged = [...newQuestions, ...prev];
              const uniqueMap = new Map();
              merged.forEach((q) => uniqueMap.set(q.id, q));
              const uniqueQuestions = Array.from(uniqueMap.values());
              if (typeof window !== 'undefined') {
                localStorage.setItem('skillready_questions', JSON.stringify(uniqueQuestions));
              }
              return uniqueQuestions;
            });
          }
          if (targetTopicId) {
            setSelectedTopicId(targetTopicId);
          }
        }}
        topics={topics}
        defaultTopicId={selectedTopicId !== 'all' ? selectedTopicId : topics[0]?.id || ''}
        onAddTopic={handleAddTopic}
      />

      <PracticeMode
        isOpen={isPracticeOpen}
        onClose={() => setIsPracticeOpen(false)}
        questions={questions}
        topics={topics}
      />

      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
    </div>
  );
}
