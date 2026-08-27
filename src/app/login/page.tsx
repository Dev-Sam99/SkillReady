'use client';

import React, { useState } from 'react';
import { loginAdmin } from '../authActions';
import { useRouter } from 'next/navigation';
import { SkillReadyWordmark } from '@/components/SkillReadyWordmark';
import { Lock, ArrowLeft, KeyRound } from 'lucide-react';

export default function LoginPage() {
  const [password, setPassword] = useState('');
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
      setError(res.error || 'Invalid password');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafaf8] text-stone-900 flex flex-col justify-between font-sans selection:bg-stone-900 selection:text-white">
      {/* Header */}
      <header className="px-6 py-5 border-b border-stone-200/80">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <SkillReadyWordmark />
          <a
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-stone-500 hover:text-stone-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to App
          </a>
        </div>
      </header>

      {/* Login Card */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white border border-stone-200/80 p-8 rounded-2xl shadow-sm w-full max-w-sm space-y-6 animate-fadeIn">
          <div className="space-y-1.5 text-center">
            <div className="w-10 h-10 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center mx-auto text-stone-900 mb-2">
              <Lock className="w-5 h-5 stroke-[1.8]" />
            </div>
            <h1 className="text-xl font-serif-display font-semibold text-stone-900">
              Admin Authentication
            </h1>
            <p className="text-xs text-stone-500 font-sans">
              Enter your master password to unlock editing, bulk management, and PDF exports.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
            <div>
              <label className="block text-stone-600 mb-1.5 font-medium">ADMIN PASSWORD *</label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="password"
                  required
                  autoFocus
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-900"
                />
              </div>
            </div>

            {error && (
              <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs font-sans">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-full font-medium transition-all shadow-sm active:scale-95 text-xs"
            >
              {isLoading ? 'Authenticating...' : 'Sign In as Admin'}
            </button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs font-mono text-stone-400">
        SkillReady Admin Session Guard
      </footer>
    </div>
  );
}
