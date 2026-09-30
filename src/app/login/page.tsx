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
    <div className="min-h-screen bg-mist text-ink flex flex-col justify-between font-sans selection:bg-deep selection:text-white relative">
      {/* Background Blobs */}
      <div className="sky-glass-blob-container" aria-hidden="true">
        <div className="sky-glass-blob blob-1" />
        <div className="sky-glass-blob blob-2" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen justify-between">
        {/* Header */}
        <header className="px-6 py-4 border-b border-line/60 glass-panel">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <SkillReadyWordmark />
            <a
              href="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate hover:text-ink transition-colors"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Back to app
            </a>
          </div>
        </header>

        {/* Login Card */}
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="glass-panel border border-white/95 p-8 rounded-3xl shadow-glass w-full max-w-sm space-y-6 animate-fadeIn">
            <div className="space-y-2 text-center">
              <div className="w-12 h-12 rounded-2xl bg-tint border border-line flex items-center justify-center mx-auto text-deep mb-2">
                <Lock className="w-6 h-6 stroke-[2]" aria-hidden="true" />
              </div>
              <h1 className="text-2xl font-display font-extrabold text-ink">
                Admin Authentication
              </h1>
              <p className="text-sm text-slate font-medium leading-relaxed">
                Enter your master password to unlock editing, bulk management, and PDF exports.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-sm font-sans">
              <div>
                <label className="block text-ink mb-1.5 font-semibold text-xs uppercase tracking-wider">
                  Admin password *
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate" aria-hidden="true" />
                  <input
                    type="password"
                    required
                    autoFocus
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-line rounded-xl text-ink placeholder-slate focus:outline-none focus:ring-2 focus:ring-deep shadow-2xs font-medium"
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 bg-[#FEE4E2] border border-[#FECDCA] rounded-xl text-[#B42318] text-xs font-semibold">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-deep hover:bg-[#155AA3] text-white rounded-full font-semibold transition-all shadow-md active:scale-95 text-sm focus-visible:ring-2 focus-visible:ring-deep focus-visible:outline-none"
              >
                {isLoading ? 'Authenticating...' : 'Sign in as admin'}
              </button>
            </form>
          </div>
        </main>

        {/* Footer */}
        <footer className="py-4 text-center text-xs font-semibold text-slate">
          SkillReady Admin Session Guard
        </footer>
      </div>
    </div>
  );
}
