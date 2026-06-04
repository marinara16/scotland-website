'use client';

import { useState } from 'react';
import type { Day, Stop } from '@/lib/types';
import { CATEGORY_CONFIG, BOOKING_STATUS_CONFIG } from '@/lib/colors';

async function submitFlag(stopId: string, note: string) {
  await fetch('/api/flag', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ stopId, note }),
  });
}

async function submitUnflag(stopId: string) {
  await fetch('/api/flag', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ stopId, unflag: true }),
  });
}

interface Props {
  day: Day;
  allDays: Day[];
  onBack: () => void;
  onSelectDay: (d: Day) => void;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function DayDetail({ day, allDays, onBack, onSelectDay }: Props) {
  const [expandedStops, setExpandedStops] = useState<Set<string>>(new Set());
  const [stops, setStops] = useState<Stop[]>(day.stops);
  const date = new Date(day.date + 'T00:00:00');

  function toggleStop(id: string) {
    setExpandedStops((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleFlagChange(stopId: string, flag?: { note: string; flaggedAt: string }) {
    setStops((prev) => prev.map((s) => s.id === stopId ? { ...s, flag } : s));
  }

  const prevDay = allDays.find((d) => d.dayNumber === day.dayNumber - 1);
  const nextDay = allDays.find((d) => d.dayNumber === day.dayNumber + 1);

  return (
    <div className="min-h-screen bg-stone-50 pb-8">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-stone-100">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <button onClick={onBack} className="p-1 -ml-1 text-stone-500 hover:text-stone-800 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex-1">
            <div className="text-xs text-stone-400 font-medium">Day {day.dayNumber}</div>
            <h1 className="text-base font-semibold text-stone-800 leading-tight">{day.location}</h1>
          </div>
          <div className="text-right text-sm text-stone-400">
            {date.getDate()} {MONTHS[date.getMonth()]}
          </div>
        </div>
      </header>

      {/* Hotel strip */}
      {day.overnightHotel && (
        <div className="max-w-2xl mx-auto px-4 pt-3">
          <div className="flex items-center gap-2 text-xs text-stone-500 bg-[#eef2f7] rounded-lg px-3 py-2">
            <span>🏨</span>
            <span>{day.overnightHotel}</span>
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="max-w-2xl mx-auto px-4 pt-4 space-y-0">
        {stops.map((stop, index) => (
          <StopItem
            key={stop.id}
            stop={stop}
            isLast={index === stops.length - 1}
            isExpanded={expandedStops.has(stop.id)}
            onToggle={() => toggleStop(stop.id)}
            onFlagChange={handleFlagChange}
          />
        ))}
      </div>

      {/* Day navigation */}
      <div className="max-w-2xl mx-auto px-4 pt-6 flex gap-3">
        {prevDay ? (
          <button
            onClick={() => onSelectDay(prevDay)}
            className="flex-1 py-3 rounded-xl border border-stone-200 bg-white text-sm text-stone-600 hover:border-stone-300 transition-colors text-left px-4"
          >
            <div className="text-xs text-stone-400 mb-0.5">← Day {prevDay.dayNumber}</div>
            <div className="font-medium truncate">{prevDay.location}</div>
          </button>
        ) : <div className="flex-1" />}
        {nextDay ? (
          <button
            onClick={() => onSelectDay(nextDay)}
            className="flex-1 py-3 rounded-xl border border-stone-200 bg-white text-sm text-stone-600 hover:border-stone-300 transition-colors text-right px-4"
          >
            <div className="text-xs text-stone-400 mb-0.5">Day {nextDay.dayNumber} →</div>
            <div className="font-medium truncate">{nextDay.location}</div>
          </button>
        ) : <div className="flex-1" />}
      </div>
    </div>
  );
}

function StopItem({
  stop,
  isLast,
  isExpanded,
  onToggle,
  onFlagChange,
}: {
  stop: Stop;
  isLast: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  onFlagChange: (stopId: string, flag?: { note: string; flaggedAt: string }) => void;
}) {
  const config = CATEGORY_CONFIG[stop.category];
  const booking = BOOKING_STATUS_CONFIG[stop.bookingStatus];
  const [showFlagForm, setShowFlagForm] = useState(false);
  const [flagNote, setFlagNote] = useState(stop.flag?.note ?? '');
  const [flagSaving, setFlagSaving] = useState(false);

  async function handleFlag() {
    setFlagSaving(true);
    await submitFlag(stop.id, flagNote);
    onFlagChange(stop.id, { note: flagNote, flaggedAt: new Date().toISOString() });
    setShowFlagForm(false);
    setFlagSaving(false);
  }

  async function handleUnflag() {
    setFlagSaving(true);
    await submitUnflag(stop.id);
    onFlagChange(stop.id, undefined);
    setFlagNote('');
    setFlagSaving(false);
  }

  return (
    <div className="flex gap-3">
      {/* Timeline column */}
      <div className="flex flex-col items-center w-6 flex-shrink-0">
        <div
          className="w-3 h-3 rounded-full mt-4 flex-shrink-0 ring-2 ring-white"
          style={{ backgroundColor: config.color }}
        />
        {!isLast && <div className="w-px flex-1 bg-stone-200 mt-1" />}
      </div>

      {/* Card */}
      <div className="flex-1 pb-4">
        <div className="text-xs text-stone-400 font-medium mb-1">{stop.time}</div>

        {/* Flag banner — always visible when flagged */}
        {stop.flag && (
          <div className="mb-1.5 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5 flex items-start justify-between gap-2">
            <div className="flex items-start gap-2 flex-1 min-w-0">
              <span className="text-sm flex-shrink-0">🚩</span>
              <p className="text-xs text-red-700 leading-relaxed">{stop.flag.note || 'Flagged for review'}</p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); handleUnflag(); }}
              disabled={flagSaving}
              className="text-xs text-red-400 hover:text-red-600 flex-shrink-0 font-medium transition-colors"
            >
              {flagSaving ? '…' : 'Resolve'}
            </button>
          </div>
        )}

        <button
          onClick={onToggle}
          className={`w-full text-left bg-white rounded-xl p-4 transition-all active:scale-[0.99] ${
            stop.flag ? 'border border-red-200 hover:border-red-300' : 'border border-stone-150 hover:border-stone-300'
          }`}
        >
          {/* Top row */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: config.color + '18', color: config.color }}
                >
                  {config.label}
                </span>
                {stop.bookingStatus !== 'none' && <span className="text-sm">{booking.icon}</span>}
              </div>
              <div className="font-semibold text-stone-800 mt-1.5 text-sm leading-snug">{stop.title}</div>
            </div>
            <svg
              className={`w-4 h-4 text-stone-400 flex-shrink-0 mt-1 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          {/* Highlight note — always visible */}
          {stop.highlightNote && (
            <p className="text-stone-500 text-xs mt-2 leading-relaxed">{stop.highlightNote}</p>
          )}

          {/* Expanded content */}
          {isExpanded && (
            <div className="mt-3 pt-3 border-t border-stone-100 space-y-2">
              {stop.expandedNote && (
                <p className="text-stone-600 text-xs leading-relaxed">{stop.expandedNote}</p>
              )}
              {stop.address && (
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-1.5 text-xs text-stone-400 flex-1 min-w-0">
                    <svg className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{stop.address}</span>
                  </div>
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(stop.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex-shrink-0 flex items-center gap-1 text-xs text-[#1e3a5f] font-medium border border-[#1e3a5f] rounded-lg px-2.5 py-1 hover:bg-[#1e3a5f] hover:text-white transition-colors"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Maps
                  </a>
                </div>
              )}
              {stop.bookingStatus !== 'none' && (
                <div className="flex items-center gap-1.5 text-xs text-stone-400">
                  <span>{booking.icon}</span>
                  <span>{booking.label}</span>
                </div>
              )}
              {stop.category === 'hiking' && stop.trailUrl && (
                <a
                  href={stop.trailUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-white bg-[#4caf50] rounded-lg px-3 py-1.5 hover:bg-[#388e3c] transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  View Trail on AllTrails
                </a>
              )}

              {/* Flag / unflag */}
              {!stop.flag && (
                <div className="pt-1">
                  {!showFlagForm ? (
                    <button
                      onClick={(e) => { e.stopPropagation(); setShowFlagForm(true); }}
                      className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-red-500 transition-colors"
                    >
                      <span>🚩</span> Flag this stop
                    </button>
                  ) : (
                    <div onClick={(e) => e.stopPropagation()} className="space-y-2">
                      <textarea
                        value={flagNote}
                        onChange={(e) => setFlagNote(e.target.value)}
                        placeholder="What's the issue? e.g. Can we do this instead?"
                        onKeyDown={(e) => e.stopPropagation()}
                        rows={2}
                        autoFocus
                        className="w-full px-3 py-2 text-xs border border-red-200 rounded-lg bg-red-50 focus:outline-none focus:border-red-400 resize-none"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleFlag}
                          disabled={flagSaving}
                          className="text-xs bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors"
                        >
                          {flagSaving ? 'Saving…' : '🚩 Flag'}
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); setShowFlagForm(false); setFlagNote(''); }}
                          className="text-xs text-stone-400 hover:text-stone-600 px-3 py-1.5 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </button>
      </div>
    </div>
  );
}
