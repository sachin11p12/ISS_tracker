import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ThemeSync } from '@/components/layout/ThemeSync';
import { APP_CONFIG } from '@/constants/config';

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ISS Live Tracker | Real-Time Space Station Telemetry & Astronauts',
  description: APP_CONFIG.DESCRIPTION,
  keywords: [
    'ISS Tracker',
    'International Space Station',
    'Live Space Station Map',
    'Astronauts in space',
    'Satellite Tracking',
    'NORAD 25544',
  ],
  authors: [{ name: 'Orbital Telemetry Operations' }],
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} min-h-screen bg-slate-50 font-sans text-slate-900 antialiased flex flex-col justify-between dark:bg-slate-950 dark:text-slate-100 selection:bg-cyan-500/20 selection:text-cyan-700 dark:selection:bg-cyan-500/30 dark:selection:text-cyan-200 transition-colors duration-200`}
      >
        <ThemeSync />
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
