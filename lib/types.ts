export type Category =
  | 'accommodation'
  | 'activity'
  | 'hiking'
  | 'tour'
  | 'restaurant'
  | 'travel'
  | 'leisure'
  | 'idea';

export type BookingStatus = 'booked-timed' | 'booked-allday' | 'free' | 'tickets-needed';

export interface Stop {
  id: string;
  time: string;
  title: string;
  category: Category;
  bookingStatus: BookingStatus;
  address: string;
  highlightNote: string;
  expandedNote: string;
  lat?: number;
  lng?: number;
}

export interface Day {
  id: string;
  dayNumber: number;
  date: string;
  location: string;
  overnightHotel: string;
  primaryCategory: Category;
  stops: Stop[];
}

export interface Itinerary {
  tripTitle: string;
  travelers: number;
  days: Day[];
}
