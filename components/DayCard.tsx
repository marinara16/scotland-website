import type { Day } from '@/lib/types';
import { CATEGORY_CONFIG } from '@/lib/colors';

interface Props {
  day: Day;
  onClick: () => void;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function DayCard({ day, onClick }: Props) {
  const date = new Date(day.date + 'T00:00:00');
  const dayName = DAYS[date.getDay()];
  const month = MONTHS[date.getMonth()];
  const dayNum = date.getDate();
  const config = CATEGORY_CONFIG[day.primaryCategory];

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white border border-stone-150 rounded-xl px-4 py-3.5 flex items-center gap-4 hover:border-stone-300 hover:shadow-sm transition-all active:scale-[0.99]"
    >
      {/* Date column */}
      <div className="flex-shrink-0 w-14 text-center">
        <div className="text-xs text-stone-400 font-medium uppercase tracking-wide">{dayName}</div>
        <div className="text-2xl font-semibold text-stone-800 leading-tight">{dayNum}</div>
        <div className="text-xs text-stone-400">{month}</div>
      </div>

      {/* Divider */}
      <div className="w-px h-10 bg-stone-100 flex-shrink-0" />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-xs font-medium text-stone-400">Day {day.dayNumber}</span>
        </div>
        <div className="font-medium text-stone-800 text-sm truncate">{day.location}</div>
        <div className="text-xs text-stone-400 mt-0.5 truncate">
          {day.stops.length} stop{day.stops.length !== 1 ? 's' : ''}
          {day.overnightHotel ? ` · ${day.overnightHotel.split(',')[0]}` : ''}
        </div>
      </div>

      {/* Category dot */}
      <div className="flex-shrink-0 flex flex-col items-center gap-1">
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: config.color }}
          title={config.label}
        />
        <svg className="w-4 h-4 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  );
}
