'use client';

import { useEffect, useState, useCallback } from 'react';
import { checkAuth, validatePassword, setAuth } from '@/lib/auth';
import initialData from '@/data/itinerary.json';
import type { Itinerary, Day, Stop, Category, BookingStatus } from '@/lib/types';
import { CATEGORY_CONFIG, BOOKING_STATUS_CONFIG } from '@/lib/colors';

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

const EMPTY_STOP: Omit<Stop, 'id'> = {
  time: '',
  title: '',
  category: 'activity',
  bookingStatus: 'booked-allday',
  address: '',
  highlightNote: '',
  expandedNote: '',
};

export default function AdminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [pwError, setPwError] = useState(false);
  const [data, setData] = useState<Itinerary>(initialData as Itinerary);
  const [selectedDayId, setSelectedDayId] = useState<string>(initialData.days[0].id);
  const [editingStop, setEditingStop] = useState<Stop | null>(null);
  const [editingDay, setEditingDay] = useState(false);
  const [addingStop, setAddingStop] = useState(false);
  const [newStop, setNewStop] = useState<Omit<Stop, 'id'>>(EMPTY_STOP);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    setAuthed(checkAuth());
  }, []);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (validatePassword(password)) {
      setAuth();
      setAuthed(true);
    } else {
      setPwError(true);
      setPassword('');
    }
  }

  const selectedDay = data.days.find((d) => d.id === selectedDayId)!;

  async function handleSave(updatedData: Itinerary) {
    setSaveStatus('saving');
    setSaveError('');
    try {
      const res = await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itinerary: updatedData }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Save failed');
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 4000);
    } catch (err) {
      setSaveStatus('error');
      setSaveError(err instanceof Error ? err.message : 'Unknown error');
    }
  }

  function updateDay(dayId: string, fields: Pick<Day, 'location' | 'overnightHotel' | 'primaryCategory'>) {
    const updated = {
      ...data,
      days: data.days.map((day) =>
        day.id === dayId ? { ...day, ...fields } : day
      ),
    };
    setData(updated);
    setEditingDay(false);
    handleSave(updated);
  }

  function updateStop(dayId: string, updatedStop: Stop) {
    const updated = {
      ...data,
      days: data.days.map((day) =>
        day.id === dayId
          ? { ...day, stops: day.stops.map((s) => (s.id === updatedStop.id ? updatedStop : s)) }
          : day
      ),
    };
    setData(updated);
    setEditingStop(null);
    handleSave(updated);
  }

  function deleteStop(dayId: string, stopId: string) {
    if (!confirm('Delete this stop?')) return;
    const updated = {
      ...data,
      days: data.days.map((day) =>
        day.id === dayId ? { ...day, stops: day.stops.filter((s) => s.id !== stopId) } : day
      ),
    };
    setData(updated);
    handleSave(updated);
  }

  function addStop(dayId: string) {
    const id = `${dayId}-s${Date.now()}`;
    const stop: Stop = { id, ...newStop };
    const updated = {
      ...data,
      days: data.days.map((day) =>
        day.id === dayId ? { ...day, stops: [...day.stops, stop] } : day
      ),
    };
    setData(updated);
    setAddingStop(false);
    setNewStop(EMPTY_STOP);
    handleSave(updated);
  }

  function moveStop(dayId: string, stopId: string, direction: 'up' | 'down') {
    const day = data.days.find((d) => d.id === dayId)!;
    const idx = day.stops.findIndex((s) => s.id === stopId);
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === day.stops.length - 1) return;
    const newStops = [...day.stops];
    const target = direction === 'up' ? idx - 1 : idx + 1;
    [newStops[idx], newStops[target]] = [newStops[target], newStops[idx]];
    const updated = {
      ...data,
      days: data.days.map((d) => (d.id === dayId ? { ...d, stops: newStops } : d)),
    };
    setData(updated);
    handleSave(updated);
  }

  if (authed === null) return <div className="min-h-screen bg-stone-50" />;

  if (!authed) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <h1 className="text-xl font-semibold text-stone-800 mb-2 text-center">Admin</h1>
          <p className="text-stone-400 text-sm text-center mb-6">Scotland Trip Itinerary Editor</p>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setPwError(false); }}
              placeholder="Password"
              autoFocus
              className={`w-full px-4 py-3 rounded-xl border text-base text-center bg-white focus:outline-none ${pwError ? 'border-red-400' : 'border-stone-200'}`}
            />
            {pwError && <p className="text-red-500 text-xs text-center mt-2">Incorrect password</p>}
            <button type="submit" className="w-full mt-3 py-3 rounded-xl bg-[#1e3a5f] text-white text-sm font-medium">
              Enter
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-stone-100">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <div className="text-xs text-stone-400 font-medium">Scotland 2026</div>
            <h1 className="text-base font-semibold text-stone-800">Admin Panel</h1>
          </div>
          <div className="flex items-center gap-3">
            {saveStatus === 'saving' && (
              <span className="text-xs text-amber-600 font-medium animate-pulse">Saving…</span>
            )}
            {saveStatus === 'saved' && (
              <span className="text-xs text-green-600 font-medium">✓ Saved — redeploying</span>
            )}
            {saveStatus === 'error' && (
              <span className="text-xs text-red-500 font-medium" title={saveError}>⚠ Save failed</span>
            )}
            <a
              href="/"
              className="text-xs text-stone-400 hover:text-stone-600 border border-stone-200 rounded-lg px-3 py-1.5"
            >
              ← Trip
            </a>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-5 flex gap-4">
        {/* Day list sidebar */}
        <aside className="w-36 flex-shrink-0">
          <div className="space-y-1 sticky top-20">
            {data.days.map((day) => {
              const date = new Date(day.date + 'T00:00:00');
              const cfg = CATEGORY_CONFIG[day.primaryCategory];
              return (
                <button
                  key={day.id}
                  onClick={() => { setSelectedDayId(day.id); setEditingStop(null); setAddingStop(false); setEditingDay(false); }}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-xs transition-colors ${
                    selectedDayId === day.id
                      ? 'bg-[#1e3a5f] text-white'
                      : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: selectedDayId === day.id ? '#ffffff88' : cfg.color }} />
                    <span className="font-medium">Day {day.dayNumber}</span>
                  </div>
                  <div className="truncate opacity-75 text-[11px]">{day.location}</div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          <DayEditor
            day={selectedDay}
            editingDay={editingDay}
            setEditingDay={setEditingDay}
            onUpdateDay={(fields) => updateDay(selectedDay.id, fields)}
            editingStop={editingStop}
            setEditingStop={setEditingStop}
            addingStop={addingStop}
            setAddingStop={setAddingStop}
            newStop={newStop}
            setNewStop={setNewStop}
            onUpdateStop={(stop) => updateStop(selectedDay.id, stop)}
            onDeleteStop={(id) => deleteStop(selectedDay.id, id)}
            onAddStop={() => addStop(selectedDay.id)}
            onMoveStop={(id, dir) => moveStop(selectedDay.id, id, dir)}
          />
        </main>
      </div>
    </div>
  );
}

function DayEditor({
  day,
  editingDay,
  setEditingDay,
  onUpdateDay,
  editingStop,
  setEditingStop,
  addingStop,
  setAddingStop,
  newStop,
  setNewStop,
  onUpdateStop,
  onDeleteStop,
  onAddStop,
  onMoveStop,
}: {
  day: Day;
  editingDay: boolean;
  setEditingDay: (v: boolean) => void;
  onUpdateDay: (fields: Pick<Day, 'location' | 'overnightHotel' | 'primaryCategory'>) => void;
  editingStop: Stop | null;
  setEditingStop: (s: Stop | null) => void;
  addingStop: boolean;
  setAddingStop: (v: boolean) => void;
  newStop: Omit<Stop, 'id'>;
  setNewStop: (s: Omit<Stop, 'id'>) => void;
  onUpdateStop: (s: Stop) => void;
  onDeleteStop: (id: string) => void;
  onAddStop: () => void;
  onMoveStop: (id: string, dir: 'up' | 'down') => void;
}) {
  const date = new Date(day.date + 'T00:00:00');
  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const categories: Category[] = ['accommodation', 'activity', 'hiking', 'tour', 'restaurant', 'travel', 'leisure'];

  const [dayLocation, setDayLocation] = useState(day.location);
  const [dayHotel, setDayHotel] = useState(day.overnightHotel);
  const [dayCategory, setDayCategory] = useState<Category>(day.primaryCategory);

  // Sync local state whenever the selected day changes
  useEffect(() => {
    setDayLocation(day.location);
    setDayHotel(day.overnightHotel);
    setDayCategory(day.primaryCategory);
  }, [day.id]);

  const inputCls = 'w-full px-3 py-2 text-sm border border-stone-200 rounded-lg bg-white focus:outline-none focus:border-stone-400 transition-colors';

  return (
    <div>
      {/* Day header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h2 className="text-base font-semibold text-stone-800">
            Day {day.dayNumber} — {day.location}
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            {date.getDate()} {MONTHS[date.getMonth()]} · {day.stops.length} stops
            {day.overnightHotel ? ` · ${day.overnightHotel}` : ''}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => { setEditingDay(!editingDay); setAddingStop(false); setEditingStop(null); }}
            className="text-xs text-stone-500 border border-stone-200 px-3 py-2 rounded-lg hover:border-stone-400 transition-colors"
          >
            Edit Day
          </button>
          <button
            onClick={() => { setAddingStop(true); setEditingStop(null); setEditingDay(false); }}
            className="flex items-center gap-1.5 text-xs bg-[#1e3a5f] text-white px-3 py-2 rounded-lg hover:bg-[#162c4a] transition-colors"
          >
            <span>+</span> Add Stop
          </button>
        </div>
      </div>

      {/* Day-level edit form */}
      {editingDay && (
        <div className="mb-4 bg-white border border-blue-200 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-semibold text-stone-800">Edit Day Details</h3>
            <button onClick={() => setEditingDay(false)} className="text-stone-400 hover:text-stone-600 text-xs">Cancel</button>
          </div>
          <div>
            <label className="text-xs text-stone-500 font-medium mb-1 block">Location / Day Title</label>
            <input
              type="text"
              value={dayLocation}
              onChange={(e) => setDayLocation(e.target.value)}
              placeholder="e.g. Travel to Inverness"
              className={inputCls}
            />
          </div>
          <div>
            <label className="text-xs text-stone-500 font-medium mb-1 block">Overnight Hotel <span className="text-stone-400 font-normal">(leave blank if departing)</span></label>
            <input
              type="text"
              value={dayHotel}
              onChange={(e) => setDayHotel(e.target.value)}
              placeholder="e.g. Rocpool Reserve Hotel, Inverness"
              className={inputCls}
            />
          </div>
          <div>
            <label className="text-xs text-stone-500 font-medium mb-1 block">Primary Category <span className="text-stone-400 font-normal">(sets the dot colour on the calendar)</span></label>
            <select
              value={dayCategory}
              onChange={(e) => setDayCategory(e.target.value as Category)}
              className={inputCls}
            >
              {categories.map((c) => (
                <option key={c} value={c}>{CATEGORY_CONFIG[c].label}</option>
              ))}
            </select>
          </div>
          <button
            onClick={() => onUpdateDay({ location: dayLocation, overnightHotel: dayHotel, primaryCategory: dayCategory })}
            disabled={!dayLocation.trim()}
            className="w-full py-2.5 bg-[#1e3a5f] text-white text-sm font-medium rounded-lg hover:bg-[#162c4a] disabled:opacity-40 transition-colors"
          >
            Save Day
          </button>
        </div>
      )}

      {/* Add stop form */}
      {addingStop && (
        <div className="mb-4 bg-white border border-stone-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-stone-800">New Stop</h3>
            <button onClick={() => setAddingStop(false)} className="text-stone-400 hover:text-stone-600 text-xs">Cancel</button>
          </div>
          <StopForm
            stop={newStop}
            onChange={setNewStop as (s: Omit<Stop,'id'> | Stop) => void}
            onSubmit={onAddStop}
            submitLabel="Add Stop"
          />
        </div>
      )}

      {/* Stops list */}
      <div className="space-y-2">
        {day.stops.map((stop, index) => (
          <div key={stop.id}>
            {editingStop?.id === stop.id ? (
              <div className="bg-white border border-blue-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-stone-800">Edit Stop</h3>
                  <button onClick={() => setEditingStop(null)} className="text-stone-400 hover:text-stone-600 text-xs">Cancel</button>
                </div>
                <StopForm
                  stop={editingStop}
                  onChange={(s) => setEditingStop(s as Stop)}
                  onSubmit={() => onUpdateStop(editingStop)}
                  submitLabel="Save Changes"
                />
              </div>
            ) : (
              <StopRow
                stop={stop}
                isFirst={index === 0}
                isLast={index === day.stops.length - 1}
                onEdit={() => setEditingStop(stop)}
                onDelete={() => onDeleteStop(stop.id)}
                onMoveUp={() => onMoveStop(stop.id, 'up')}
                onMoveDown={() => onMoveStop(stop.id, 'down')}
              />
            )}
          </div>
        ))}

        {day.stops.length === 0 && !addingStop && (
          <div className="text-center py-10 text-stone-400 text-sm">
            No stops yet. Tap "Add Stop" to begin.
          </div>
        )}
      </div>
    </div>
  );
}

function StopRow({
  stop,
  isFirst,
  isLast,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
}: {
  stop: Stop;
  isFirst: boolean;
  isLast: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  const cfg = CATEGORY_CONFIG[stop.category];
  const booking = BOOKING_STATUS_CONFIG[stop.bookingStatus];

  return (
    <div className="bg-white border border-stone-150 rounded-xl p-3.5 flex items-start gap-3">
      {/* Reorder */}
      <div className="flex flex-col gap-0.5 flex-shrink-0 pt-0.5">
        <button
          onClick={onMoveUp}
          disabled={isFirst}
          className="p-1 text-stone-300 hover:text-stone-600 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
        <button
          onClick={onMoveDown}
          disabled={isLast}
          className="p-1 text-stone-300 hover:text-stone-600 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="text-xs text-stone-400 font-mono">{stop.time}</span>
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ backgroundColor: cfg.color + '18', color: cfg.color }}
          >
            {cfg.label}
          </span>
          <span className="text-xs">{booking.icon}</span>
        </div>
        <div className="text-sm font-medium text-stone-800 truncate">{stop.title}</div>
        {stop.highlightNote && (
          <div className="text-xs text-stone-400 mt-0.5 line-clamp-1">{stop.highlightNote}</div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-1.5 flex-shrink-0">
        <button
          onClick={onEdit}
          className="text-xs text-stone-500 hover:text-stone-800 border border-stone-200 rounded-lg px-2.5 py-1.5 transition-colors"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="text-xs text-red-400 hover:text-red-600 border border-red-100 rounded-lg px-2.5 py-1.5 transition-colors"
        >
          Del
        </button>
      </div>
    </div>
  );
}

function StopForm({
  stop,
  onChange,
  onSubmit,
  submitLabel,
}: {
  stop: Omit<Stop, 'id'> | Stop;
  onChange: (s: Omit<Stop, 'id'> | Stop) => void;
  onSubmit: () => void;
  submitLabel: string;
}) {
  const categories: Category[] = ['accommodation', 'activity', 'hiking', 'tour', 'restaurant', 'travel', 'leisure'];
  const statuses: BookingStatus[] = ['booked-timed', 'booked-allday', 'free', 'tickets-needed'];

  function field(key: keyof Omit<Stop, 'id'>, value: string) {
    onChange({ ...stop, [key]: value });
  }

  const inputCls = 'w-full px-3 py-2 text-sm border border-stone-200 rounded-lg bg-white focus:outline-none focus:border-stone-400 transition-colors';
  const labelCls = 'text-xs text-stone-500 font-medium mb-1 block';

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>Time</label>
          <input
            type="time"
            value={stop.time}
            onChange={(e) => field('time', e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Category</label>
          <select
            value={stop.category}
            onChange={(e) => field('category', e.target.value)}
            className={inputCls}
          >
            {categories.map((c) => (
              <option key={c} value={c}>{CATEGORY_CONFIG[c].label}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={labelCls}>Title</label>
        <input
          type="text"
          value={stop.title}
          onChange={(e) => field('title', e.target.value)}
          placeholder="Stop title"
          className={inputCls}
        />
      </div>

      <div>
        <label className={labelCls}>Booking Status</label>
        <select
          value={stop.bookingStatus}
          onChange={(e) => field('bookingStatus', e.target.value)}
          className={inputCls}
        >
          {statuses.map((s) => (
            <option key={s} value={s}>{BOOKING_STATUS_CONFIG[s].icon} {BOOKING_STATUS_CONFIG[s].label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelCls}>Address</label>
        <input
          type="text"
          value={stop.address}
          onChange={(e) => field('address', e.target.value)}
          placeholder="Full address"
          className={inputCls}
        />
      </div>

      <div>
        <label className={labelCls}>Highlight Note <span className="text-stone-400 font-normal">(always visible)</span></label>
        <input
          type="text"
          value={stop.highlightNote}
          onChange={(e) => field('highlightNote', e.target.value)}
          placeholder="Short summary shown on the card"
          className={inputCls}
        />
      </div>

      <div>
        <label className={labelCls}>Expanded Note <span className="text-stone-400 font-normal">(tap to reveal)</span></label>
        <textarea
          value={stop.expandedNote}
          onChange={(e) => field('expandedNote', e.target.value)}
          placeholder="Detailed notes, booking references, tips…"
          rows={3}
          className={`${inputCls} resize-none`}
        />
      </div>

      <button
        onClick={onSubmit}
        disabled={!stop.title.trim()}
        className="w-full py-2.5 bg-[#1e3a5f] text-white text-sm font-medium rounded-lg hover:bg-[#162c4a] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        {submitLabel}
      </button>
    </div>
  );
}
