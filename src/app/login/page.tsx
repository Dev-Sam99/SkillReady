'use client';

import React, { useState } from 'react';
import { loginAdmin } from '../authActions';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { SkillReadyWordmark } from '@/components/SkillReadyWordmark';
import {
  Lock,
  ArrowLeft,
  KeyRound,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
  Loader2,
  AlertCircle,
  Zap,
  FileSpreadsheet,
  BarChart3,
  CheckCircle2,
} from 'lucide-react';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || isLoading) return;

    setIsLoading(true);
    setError('');

    const res = await loginAdmin(password);
    if (res.success) {
      router.push('/');
      router.refresh();
    } else {
      setError(res.error || 'Invalid password. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen max-h-screen overflow-hidden bg-[#EEF3E8] text-[#1F2D1F] flex flex-col justify-between font-sans selection:bg-[#2F5D3A] selection:text-white relative">
      {/* Ambient Grid Pattern & Soft Radial Glow */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.35] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#2F5D3A 0.75px, transparent 0.75px)`,
          backgroundSize: '24px 24px',
        }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[600px] h-[600px] bg-gradient-to-tr from-[#D9E4D0]/60 via-[#EAF3EB]/40 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* ------------------------------------------------------------- */}
      {/* 1. TOP NAVBAR                                                 */}
      {/* ------------------------------------------------------------- */}
      <header className="w-full px-6 sm:px-10 py-3 shrink-0 backdrop-blur-md bg-white/75 border-b border-[#D9E4D0]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <Link href="/" className="hover:opacity-90 transition">
            <SkillReadyWordmark logoSize={38} showTagline={true} />
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-[#1F2D1F] bg-white hover:bg-[#EAF3EB] border border-[#D9E4D0] rounded-full transition-all duration-200 active:scale-95 shadow-subtle cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#2F5D3A]" aria-hidden="true" />
            <span>Back to Questions</span>
          </Link>
        </div>
      </header>

      {/* ------------------------------------------------------------- */}
      {/* 2. CENTERED HYPER-FOCUSED AUTHENTICATION CARD (ZERO SCROLL)   */}
      {/* ------------------------------------------------------------- */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col items-center justify-center my-auto overflow-hidden">
        <div className="w-full max-w-md space-y-5">
          {/* Main Auth Card */}
          <div className="bg-white border-2 border-[#2F5D3A]/20 rounded-3xl p-7 sm:p-8 shadow-xl shadow-[#1F2D1F]/5 space-y-6">
            {/* Header */}
            <div className="text-center space-y-3">
              <div className="w-13 h-13 rounded-2xl bg-[#EAF3EB] text-[#2F5D3A] flex items-center justify-center border border-[#D9E4D0] mx-auto shadow-xs">
                <ShieldCheck className="w-7 h-7 stroke-[2.2]" aria-hidden="true" />
              </div>
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#EAF3EB] text-[#2F5D3A] text-[11px] font-bold mb-1">
                  <Sparkles className="w-3 h-3 text-[#2F5D3A]" />
                  <span>Admin Workspace</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2D1F] tracking-tight">
                  Sign in to SkillReady
                </h1>
                <p className="text-xs text-[#566656] leading-relaxed max-w-xs mx-auto">
                  Enter your master password to unlock editing, markdown question imports, and PDF exports.
                </p>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-[#1F2D1F]">
                  MASTER PASSWORD <span className="text-[#C2412D]">*</span>
                </label>
                <div className="relative flex items-center">
                  <KeyRound className="absolute left-3.5 w-4 h-4 text-[#566656] pointer-events-none" aria-hidden="true" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoFocus
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password..."
                    className="w-full pl-10 pr-10 py-3 bg-[#F7FAF6] border border-[#D9E4D0] rounded-xl text-xs font-medium text-[#1F2D1F] placeholder-[#889988] focus:outline-none focus:border-[#2F5D3A] focus:ring-2 focus:ring-[#2F5D3A]/20 focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3.5 text-[#566656] hover:text-[#2F5D3A] transition-colors p-1 cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" aria-hidden="true" />
                    ) : (
                      <Eye className="w-4 h-4" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-[#FBE5E0] border border-[#F5C2BA] rounded-xl text-[#C2412D] text-xs font-semibold flex items-center gap-2 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 shrink-0 text-[#C2412D]" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !password.trim()}
                className="w-full py-3.5 bg-[#2F5D3A] hover:bg-[#254B2E] active:scale-[0.99] text-white rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Unlock Admin Workspace</span>
                  </>
                )}
              </button>
            </form>

            {/* Admin Privileges Box */}
            <div className="p-3 bg-[#F5FAF4] border border-[#D9E4D0] rounded-xl text-[11px] space-y-1">
              <div className="font-bold text-[#2F5D3A] text-xs flex items-center gap-1.5 justify-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#2F5D3A]" />
                <span>Master Access Privileges</span>
              </div>
              <p className="text-[#566656] leading-relaxed text-[11px] text-center">
                Full editing control, markdown question imports, custom topics, and PDF cheat sheet exports.
              </p>
            </div>
          </div>

          {/* Bottom Feature Badges Pill Bar */}
          <div className="flex items-center justify-center gap-3 pt-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#D9E4D0] text-xs font-semibold text-[#1F2D1F] shadow-xs">
              <Zap className="w-3.5 h-3.5 text-[#2F5D3A]" />
              <span>Spaced Review</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#D9E4D0] text-xs font-semibold text-[#1F2D1F] shadow-xs">
              <FileSpreadsheet className="w-3.5 h-3.5 text-[#2F5D3A]" />
              <span>PDF Cheat Sheets</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#D9E4D0] text-xs font-semibold text-[#1F2D1F] shadow-xs">
              <BarChart3 className="w-3.5 h-3.5 text-[#2F5D3A]" />
              <span>Mastery Track</span>
            </div>
          </div>
        </div>
      </main>

      {/* ------------------------------------------------------------- */}
      {/* 3. FOOTER                                                     */}
      {/* ------------------------------------------------------------- */}
      <footer className="w-full py-2.5 px-4 shrink-0 border-t border-[#D9E4D0] bg-white/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[#566656] font-medium">
          <div>SkillReady · Spaced Repetition Tech System</div>
          <div className="flex items-center gap-3">
            <span className="hover:text-[#2F5D3A] transition cursor-pointer">Learn</span>
            <span>·</span>
            <span className="hover:text-[#2F5D3A] transition cursor-pointer">Practice</span>
            <span>·</span>
            <span className="hover:text-[#2F5D3A] transition cursor-pointer">Build</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
