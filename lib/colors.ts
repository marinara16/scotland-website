import type { Category } from './types';

export const CATEGORY_CONFIG: Record<
  Category,
  { label: string; color: string; dot: string; mapColor: string; bg: string; border: string }
> = {
  accommodation: {
    label: 'Accommodation',
    color: '#1e3a5f',
    dot: 'bg-[#1e3a5f]',
    mapColor: '#1e3a5f',
    bg: 'bg-[#eef2f7]',
    border: 'border-[#1e3a5f]',
  },
  activity: {
    label: 'Activity',
    color: '#2d5a27',
    dot: 'bg-[#2d5a27]',
    mapColor: '#2d5a27',
    bg: 'bg-[#eef4ed]',
    border: 'border-[#2d5a27]',
  },
  hiking: {
    label: 'Hiking',
    color: '#c45c1a',
    dot: 'bg-[#c45c1a]',
    mapColor: '#c45c1a',
    bg: 'bg-[#faf0e8]',
    border: 'border-[#c45c1a]',
  },
  tour: {
    label: 'Tour',
    color: '#0d9488',
    dot: 'bg-[#0d9488]',
    mapColor: '#0d9488',
    bg: 'bg-[#e6f7f6]',
    border: 'border-[#0d9488]',
  },
  restaurant: {
    label: 'Restaurant',
    color: '#be185d',
    dot: 'bg-[#be185d]',
    mapColor: '#be185d',
    bg: 'bg-[#fce8f1]',
    border: 'border-[#be185d]',
  },
  travel: {
    label: 'Travel',
    color: '#546e7a',
    dot: 'bg-[#546e7a]',
    mapColor: '#546e7a',
    bg: 'bg-[#f0f3f4]',
    border: 'border-[#546e7a]',
  },
  leisure: {
    label: 'Leisure',
    color: '#7b68a8',
    dot: 'bg-[#7b68a8]',
    mapColor: '#7b68a8',
    bg: 'bg-[#f4f2f9]',
    border: 'border-[#7b68a8]',
  },
  idea: {
    label: 'Idea',
    color: '#d4a017',
    dot: 'bg-[#d4a017]',
    mapColor: '#d4a017',
    bg: 'bg-[#fdf8e8]',
    border: 'border-[#d4a017]',
  },
};

export const BOOKING_STATUS_CONFIG = {
  'booked-timed': { icon: '🕐', label: 'Booked (Timed Entry)' },
  'booked-allday': { icon: '✅', label: 'Booked' },
  'free': { icon: '🆓', label: 'Free' },
  'parking-fee': { icon: '🅿️', label: 'Parking Fee' },
  'tickets-needed': { icon: '🔴', label: 'Tickets Still Needed' },
  'just-show-up': { icon: '🚶', label: 'Just Show Up' },
  'pay-on-day': { icon: '💷', label: 'Pay on the Day' },
};
