import type {Metadata} from 'next';
import Link from 'next/link';
import {Roboto, Geist_Mono} from 'next/font/google';
import './globals.css';
import { Home, Info, Mail } from 'lucide-react';
import LandingPage from './pages/Landing/LandingPage';

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const roboto = Roboto({
  weight: ['100', '300', '400', '500', '700', '900'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
});
export const metadata: Metadata = {
  title: 'PagePilot PWA',
  description: 'A simple PWA built with Next.js',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${roboto.variable} font-sans`}>
      <body className={`${geistMono.variable} antialiased`}>
        {/* <header className="bg-primary text-primary-foreground p-4">
          <nav className="container mx-auto flex items-center justify-between">
          </nav>
        </header> */}
        <main className="container mx-auto">
          <LandingPage />
        </main>
        {/* <footer className="bg-secondary text-foreground p-4 text-center">
          <p>&copy; {new Date().getFullYear()} PagePilot. All rights reserved.</p>
        </footer> */}
      </body>
    </html>
  );
}