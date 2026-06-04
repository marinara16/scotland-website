'use client';

import { useState, useEffect } from 'react';
import type { Day, Itinerary } from '@/lib/types';
import DayCard from './DayCard';
import DayDetail from './DayDetail';
import MapView from './MapView';
import InfoTab from './InfoTab';
import NavBar from './NavBar';

type Tab = 'home' | 'map' | 'info';

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [selectedDay, setSelectedDay] = useState<Day | null>(null);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/itinerary')
      .then((r) => r.json())
      .then((data: Itinerary) => { setItinerary(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading || !itinerary) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-stone-400 text-sm">Loading itinerary…</div>
      </div>
    );
  }

  const days = itinerary.days;
  const week1 = days.slice(0, 7);
  const week2 = days.slice(7, 14);

  if (selectedDay) {
    return (
      <DayDetail
        day={selectedDay}
        allDays={days}
        onBack={() => setSelectedDay(null)}
        onSelectDay={(d) => setSelectedDay(d)}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-stone-100 px-4 pt-safe-top">
        <div className="max-w-2xl mx-auto py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-stone-800 tracking-tight">Scotland 2026</h1>
            <p className="text-xs text-stone-400 mt-0.5">Oct 5–18 · 2 travellers</p>
          </div>
          <span className="text-2xl">🏴󠁧󠁢󠁳󠁣󠁴󠁿</span>
        </div>
      </header>

      {/* Tab content */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4">
        {activeTab === 'home' && (
          <div className="py-5 space-y-6">
            <WeekSection label="Week 1 — Oct 5–11" days={week1} onSelect={setSelectedDay} />
            <WeekSection label="Week 2 — Oct 12–18" days={week2} onSelect={setSelectedDay} />
          </div>
        )}
        {activeTab === 'map' && <MapView days={days} onSelectDay={setSelectedDay} />}
        {activeTab === 'info' && <InfoTab />}
      </main>

      <NavBar active={activeTab} onChange={setActiveTab} />
    </div>
  );
}

function WeekSection({
  label,
  days,
  onSelect,
}: {
  label: string;
  days: Day[];
  onSelect: (d: Day) => void;
}) {
  return (
    <section>
      <h2 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">{label}</h2>
      <div className="space-y-2">
        {days.map((day) => (
          <DayCard key={day.id} day={day} onClick={() => onSelect(day)} />
        ))}
      </div>
    </section>
  );
}
