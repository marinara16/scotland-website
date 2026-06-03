import type { Metadata, Viewport } from 'next';
import './globals.css';
import ServiceWorkerRegistrar from '@/components/ServiceWorkerRegistrar';

export const metadata: Metadata = {
  title: 'Scotland Road Trip 2026',
  description: 'Private travel itinerary — Scotland, October 5–18, 2026',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Scotland 2026',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#1e3a5f',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-stone-50 text-stone-900 antialiased font-sans">
        <ServiceWorkerRegistrar />
        {children}
      </body>
    </html>
  );
}
