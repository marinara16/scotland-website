'use client';

import { useState } from 'react';

interface Section {
  title: string;
  icon: string;
  items: { label: string; value: string }[];
}

const INFO_SECTIONS: Section[] = [
  {
    title: 'Driving',
    icon: '🚗',
    items: [
      { label: 'Drive on the', value: 'LEFT side of the road' },
      { label: 'Speed limits', value: '30 mph town / 60 mph single-track / 70 mph dual carriageway' },
      { label: 'Single-track roads', value: 'Use passing places. Uphill traffic has priority. Wave a thanks.' },
      { label: 'Fuel', value: 'Fill up in towns — remote Highland stations are rare and expensive' },
      { label: 'Parking', value: 'Many Highland spots use timed entry with pre-booked parking. Check Discover Scotland app.' },
      { label: 'Speed cameras', value: 'Average speed cameras on A9. Don\'t exceed 60mph between cameras.' },
    ],
  },
  {
    title: 'Packing',
    icon: '🎒',
    items: [
      { label: 'Waterproofs', value: 'Essential. Scotland can rain any month. Pack jacket and trousers.' },
      { label: 'Layers', value: 'October is cold. Base layer, fleece, and windproof outer. Temperatures 5–13°C.' },
      { label: 'Walking boots', value: 'Waterproof with ankle support. Many walks have boggy ground.' },
      { label: 'Adapter', value: 'UK three-pin plug adapter (Type G)' },
      { label: 'Power bank', value: 'Useful in remote areas. Signal can be patchy.' },
      { label: 'Midges', value: 'October is mostly midge-free — you\'re lucky with the timing.' },
      { label: 'Sunscreen', value: 'Still worth packing — Scottish autumn sun can be surprisingly strong' },
      { label: 'Whisky notebook', value: 'Recommended. You\'ll taste a lot. Write them down.' },
    ],
  },
  {
    title: 'Emergency Contacts',
    icon: '🆘',
    items: [
      { label: 'Emergency', value: '999 — Police, Fire, Ambulance, Mountain Rescue, Coastguard' },
      { label: 'Non-emergency police', value: '101' },
      { label: 'NHS 24', value: '111 — Medical advice, not emergencies' },
      { label: 'Mountain Rescue', value: 'Call 999, ask for Police, then Mountain Rescue' },
      { label: 'Rental car breakdown', value: 'Check your rental agreement for the emergency number' },
      { label: 'RAC breakdown', value: '0800 197 3592' },
      { label: 'Travel insurance', value: 'Check your policy card for 24hr assistance number' },
    ],
  },
  {
    title: 'Practical Info',
    icon: '💷',
    items: [
      { label: 'Currency', value: 'British Pound (£). Scottish banknotes are legal tender across UK.' },
      { label: 'Tipping', value: '10–12.5% in restaurants. Not expected in pubs.' },
      { label: 'WiFi', value: 'Good in cities, patchy in Highlands. Download offline maps.' },
      { label: 'Mobile signal', value: 'EE has best Highland coverage. Consider a UK SIM.' },
      { label: 'Electricity', value: '230V / 50Hz. UK three-pin plugs.' },
      { label: 'Visa', value: 'USA/Canada/EU citizens: no visa required for short stays (up to 6 months)' },
      { label: 'Entry requirements', value: 'Passport required for international travel. No special requirements for Scotland.' },
      { label: 'Opening hours', value: 'Most attractions 9/10am–5pm. Many closed Mondays in October.' },
      { label: 'Sunday trading', value: 'Reduced hours — plan ahead for Sunday shopping or refuelling.' },
    ],
  },
  {
    title: 'Highland Code',
    icon: '🏔️',
    items: [
      { label: 'Right to roam', value: 'Scotland has extensive right to roam laws — you can walk almost anywhere responsibly.' },
      { label: 'Leave no trace', value: 'Take all litter home. Use designated fire spots only.' },
      { label: 'Wild camping', value: 'Legal in Scotland. Pitch away from roads, houses, and loch shores.' },
      { label: 'Gates', value: 'Always close farm gates behind you.' },
      { label: 'Dogs', value: 'Keep on lead near livestock. Strict rules during lambing (March–May — not your problem).' },
    ],
  },
  {
    title: 'App Notes',
    icon: '📱',
    items: [
      { label: 'Offline use', value: 'This app works offline once loaded. Data is cached via service worker.' },
      { label: 'Add to home screen', value: 'Use your browser\'s "Add to Home Screen" for a fullscreen app experience.' },
      { label: 'Map offline', value: 'Mapbox tiles require signal. Download offline maps in the Apple Maps or Maps.me app.' },
      { label: 'Content updates', value: 'Changes made in the admin panel push to GitHub and redeploy in ~60 seconds.' },
    ],
  },
];

export default function InfoTab() {
  const [openSection, setOpenSection] = useState<string | null>('Driving');

  return (
    <div className="py-5 space-y-2">
      {INFO_SECTIONS.map((section) => (
        <div key={section.title} className="bg-white border border-stone-150 rounded-xl overflow-hidden">
          <button
            onClick={() => setOpenSection(openSection === section.title ? null : section.title)}
            className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-stone-50 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-lg">{section.icon}</span>
              <span className="font-medium text-stone-800 text-sm">{section.title}</span>
            </div>
            <svg
              className={`w-4 h-4 text-stone-400 transition-transform ${openSection === section.title ? 'rotate-180' : ''}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {openSection === section.title && (
            <div className="border-t border-stone-100 divide-y divide-stone-50">
              {section.items.map((item) => (
                <div key={item.label} className="px-4 py-3 flex gap-3">
                  <div className="text-xs text-stone-400 font-medium w-28 flex-shrink-0 pt-0.5">{item.label}</div>
                  <div className="text-xs text-stone-700 leading-relaxed flex-1">{item.value}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
