import type {Metadata} from 'next';
import Link from 'next/link';
import {Geist, Geist_Mono} from 'next/font/google';
import './globals.css';
import { Home, Info, Mail } from 'lucide-react';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'PagePilot PWA',
  description: 'A simple PWA built with Next.js and Firebase',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <header className="bg-primary text-primary-foreground p-4">
          <nav className="container mx-auto flex items-center justify-between">
            <Link href="/" className="font-bold text-lg">
              PagePilot
            </Link>
            <ul className="flex space-x-4">
              <li>
                <Link href="/" className="flex items-center space-x-2 hover:text-accent">
                  <Home className="h-5 w-5" />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link href="/about" className="flex items-center space-x-2 hover:text-accent">
                  <Info className="h-5 w-5" />
                  <span>About</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="flex items-center space-x-2 hover:text-accent">
                  <Mail className="h-5 w-5" />
                  <span>Contact in ril</span>
                </Link>
              </li>
            </ul>
          </nav>
        </header>
        <main className="container mx-auto py-8">{children}</main>
        <footer className="bg-secondary text-foreground p-4 text-center">
          <p>&copy; {new Date().getFullYear()} PagePilot. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}
