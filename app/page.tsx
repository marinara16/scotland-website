'use client';

import { useEffect, useState } from 'react';
import { checkAuth, setAuth, validatePassword } from '@/lib/auth';
import HomeScreen from '@/components/HomeScreen';

export default function Page() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    setAuthed(checkAuth());
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (validatePassword(input)) {
      setAuth();
      setAuthed(true);
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setInput('');
    }
  }

  if (authed === null) {
    return <div className="min-h-screen bg-stone-50" />;
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-10">
            <div className="text-5xl mb-4">🏴󠁧󠁢󠁳󠁣󠁴󠁿</div>
            <h1 className="text-2xl font-semibold text-stone-800 tracking-tight">Scotland 2026</h1>
            <p className="text-stone-500 mt-1 text-sm">Private itinerary · October 5–18</p>
          </div>

          <form onSubmit={handleSubmit} style={{ animation: shake ? 'shake 0.4s ease-in-out' : 'none' }}>
            <input
              type="password"
              value={input}
              onChange={(e) => { setInput(e.target.value); setError(false); }}
              placeholder="Enter password"
              autoFocus
              className={`w-full px-4 py-3 rounded-xl border text-base text-center tracking-widest bg-white focus:outline-none transition-colors ${
                error ? 'border-red-400 bg-red-50' : 'border-stone-200 focus:border-stone-400'
              }`}
            />
            {error && (
              <p className="text-red-500 text-sm text-center mt-2">Incorrect password</p>
            )}
            <button
              type="submit"
              className="w-full mt-3 py-3 rounded-xl bg-[#1e3a5f] text-white text-sm font-medium hover:bg-[#162c4a] transition-colors active:scale-[0.98]"
            >
              Enter
            </button>
          </form>
        </div>

        <style>{`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20% { transform: translateX(-8px); }
            40% { transform: translateX(8px); }
            60% { transform: translateX(-8px); }
            80% { transform: translateX(8px); }
          }
        `}</style>
      </div>
    );
  }

  return <HomeScreen />;
}
