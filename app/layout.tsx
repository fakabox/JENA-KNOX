import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'What Happened to the Fun — Jena Knox',
  description: 'Listen to previews from What Happened to the Fun, the new 15-track album by Jena Knox.',
  openGraph: {
    title: 'What Happened to the Fun — Jena Knox',
    description: 'Discover the new 15-track album and listen to every preview.',
    images: ['/og.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'What Happened to the Fun — Jena Knox',
    description: 'Discover the new 15-track album and listen to every preview.',
    images: ['/og.jpg'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body>
    </html>
  );
}
