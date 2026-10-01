'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Topic, Question, ConfidenceLevel } from '@/types';
import { MOCK_TOPICS, MOCK_QUESTIONS } from '@/lib/mockData';
import {
  getTopics,
  addTopic,
  getQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  updateQuestionFlags,
} from './actions';
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
  const [selectedTag, setSelectedTag] = useState<string>('all');
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
  const [practiceFilterAll, setPracticeFilterAll] = useState(false);
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

    const migratedQuestions = loadedQuestions.map((q) => ({
      ...q,
      is_flagged: q.is_flagged ?? false,
      is_important: q.is_important ?? false,
    }));
    setQuestions(migratedQuestions);

    // Restore last selected topic & question from localStorage
    if (typeof window !== 'undefined') {
      const savedTopic = localStorage.getItem('skillready_last_topic');
      if (savedTopic) setSelectedTopicId(savedTopic);

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

  const handleSelectTag = (tag: string) => {
    setSelectedTag(tag);
    if (typeof window !== 'undefined') {
      localStorage.setItem('skillready_last_tag', tag);
    }
  };

  const handleSelectQuestion = (question: Question) => {
    setSelectedQuestionId(question.id);
    setIsMobileDrawerOpen(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('skillready_last_q', question.id);
    }
  };

  // Filtered & sorted question list
  const getFilteredQuestions = useCallback(() => {
    return questions
      .filter((q) => {
        if (selectedTopicId !== 'all' && q.topic_id !== selectedTopicId) return false;
        if (selectedTag !== 'all') {
          if (!q.tags || !q.tags.includes(selectedTag)) return false;
        }
        if (markerFilter === 'flagged' && !q.is_flagged) return false;
        if (markerFilter === 'important' && !q.is_important) return false;
        if (confidenceFilter !== 'all' && q.confidence !== confidenceFilter) return false;
        if (searchQuery.trim()) {
          const qText = q.question.toLowerCase();
          const aText = q.answer.toLowerCase();
          const tagText = (q.tags || []).join(' ').toLowerCase();
          const notesText = (q.notes || '').toLowerCase();
          const sTerm = searchQuery.toLowerCase();
          if (!qText.includes(sTerm) && !aText.includes(sTerm) && !tagText.includes(sTerm) && !notesText.includes(sTerm)) {
            return false;
          }
        }
        return true;
      });
  }, [questions, selectedTopicId, selectedTag, markerFilter, confidenceFilter, searchQuery]);

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
  const handleToggleFlag = useCallback(async (q: Question) => {
    const updatedVal = !q.is_flagged;
    setQuestions((prev) => {
      const updated = prev.map((item) =>
        item.id === q.id ? { ...item, is_flagged: updatedVal } : item
      );
      if (typeof window !== 'undefined') {
        localStorage.setItem('skillready_questions', JSON.stringify(updated));
      }
      return updated;
    });
    await updateQuestionFlags(q.id, { is_flagged: updatedVal });
  }, []);

  const handleToggleImportant = useCallback(async (q: Question) => {
    const updatedVal = !q.is_important;
    setQuestions((prev) => {
      const updated = prev.map((item) =>
        item.id === q.id ? { ...item, is_important: updatedVal } : item
      );
      if (typeof window !== 'undefined') {
        localStorage.setItem('skillready_questions', JSON.stringify(updated));
      }
      return updated;
    });
    await updateQuestionFlags(q.id, { is_important: updatedVal });
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
        setTimeout(() => searchInputRef.current?.focus(), 50);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNextQuestion, handlePrevQuestion, handleToggleFlag, handleToggleImportant, selectedQuestion, isMobileDrawerOpen]);

  const currentTopicName = selectedQuestion
    ? topics.find((t) => t.id === selectedQuestion.topic_id)?.name || 'General'
    : 'Topics';

  return (
    <div className="min-h-screen bg-[#EEF3E8] text-[#1F2D1F] flex flex-col font-sans selection:bg-[#2F5D3A] selection:text-white w-full overflow-x-hidden relative">
      {/* Header */}
      <Header
        isAdmin={isAdmin}
        onAddQuestion={() => {
          setEditingQuestion(null);
          setIsQuestionModalOpen(true);
        }}
        onDownloadPDF={handleDownloadPDF}
        onDownloadMarkdown={handleDownloadMarkdown}
        onOpenBulkAdd={() => setIsBulkModalOpen(true)}
        onOpenPractice={() => {
          setPracticeFilterAll(true);
          setIsPracticeOpen(true);
        }}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 pb-6 h-[calc(100vh-95px)] min-h-0 overflow-hidden relative z-10 flex flex-col">
        {/* Mobile Top Bar (< 860px) */}
        <div className="min-[860px]:hidden mb-3 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={() => setIsMobileDrawerOpen(true)}
            aria-label="Open topics & questions drawer"
            className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-full bg-white border border-[#D9E4D0] text-[#1F2D1F] font-semibold text-xs shadow-subtle hover:bg-[#EEF3E8] transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5D3A] cursor-pointer"
          >
            <Menu className="w-5 h-5 text-[#2F5D3A]" aria-hidden="true" />
            <span>Questions</span>
          </button>

          <span className="text-xs font-semibold text-[#566656] bg-white border border-[#D9E4D0] px-3.5 py-1.5 rounded-full shadow-subtle">
            {currentTopicName} · {activeQuestions.length > 0 ? `${currentQuestionIndex + 1}/${activeQuestions.length}` : '0/0'}
          </span>
        </div>

        {isLoading ? (
          <div className="h-full bg-white rounded-[22px] border border-[#D9E4D0] animate-pulse shadow-subtle" />
        ) : (
          <div className="h-full flex gap-4 min-h-0 overflow-hidden">
            {/* Desktop Left Navigation Panel (>= 860px wide, ~350px width) */}
            <aside className="hidden min-[860px]:block w-[350px] shrink-0 h-full min-h-0">
              <NavigationPanel
                topics={topics}
                questions={questions}
                selectedTopicId={selectedTopicId}
                selectedTag={selectedTag}
                markerFilter={markerFilter}
                selectedQuestionId={selectedQuestionId}
                searchQuery={searchQuery}
                confidenceFilter={confidenceFilter}
                searchInputRef={searchInputRef}
                onSelectTopicId={handleSelectTopicId}
                onSelectTag={handleSelectTag}
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

            {/* Main Answer Panel */}
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
                onFilterByTag={(tag) => {
                  handleSelectTag(tag);
                }}
                onUpdateQuestion={(updated) => {
                  const newList = questions.map((q) => (q.id === updated.id ? updated : q));
                  saveQuestionsState(newList);
                }}
              />
            </section>
          </div>
        )}
      </div>

      {/* Mobile Left Drawer Overlay (< 860px) */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 min-[860px]:hidden animate-fadeIn">
          {/* Backdrop Dim Overlay */}
          <div
            className="fixed inset-0 bg-[#1F2D1F]/50 transition-opacity"
            onClick={() => setIsMobileDrawerOpen(false)}
            aria-hidden="true"
          />

          {/* Left Drawer Container (88% width) */}
          <div className="fixed top-0 left-0 bottom-0 z-50 w-[88%] max-w-[360px] bg-[#EEF3E8] p-3 shadow-2xl flex flex-col border-r border-[#D9E4D0]">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#D9E4D0] px-2">
              <span className="font-display font-bold text-base text-[#1F2D1F]">Questions</span>
              <button
                type="button"
                onClick={() => setIsMobileDrawerOpen(false)}
                aria-label="Close drawer"
                className="w-10 h-10 inline-flex items-center justify-center rounded-full text-[#566656] hover:text-[#1F2D1F] hover:bg-white cursor-pointer"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <div className="flex-1 min-h-0">
              <NavigationPanel
                topics={topics}
                questions={questions}
                selectedTopicId={selectedTopicId}
                selectedTag={selectedTag}
                markerFilter={markerFilter}
                selectedQuestionId={selectedQuestionId}
                searchQuery={searchQuery}
                confidenceFilter={confidenceFilter}
                searchInputRef={searchInputRef}
                onSelectTopicId={handleSelectTopicId}
                onSelectTag={handleSelectTag}
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
        practiceAll={practiceFilterAll}
      />

      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
    </div>
  );
}
