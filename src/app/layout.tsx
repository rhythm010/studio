"use client";
import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import i18next, { Namespace } from 'i18next';
import { useTranslation } from 'react-i18next';
import { initReactI18next } from 'react-i18next';
import arCommon from '../../public/locales/ar/common.json';
import enCommon from '../../public/locales/en/common.json';
import { ModalProvider, Modal } from '@/components/ui/Modal';
import  './globals.css';
import Header from '@/components/Header';
import { TooltipProvider } from '@/components/ui/tooltip';
import React from 'react';
import './globals.css';
const roboto = Roboto({
    weight: ['400', '700'],
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-roboto',
  });
// export const metadata: Metadata = {
//   title: 'PagePilot PWA',
//   description: 'A simple PWA built with Next.js',
//   manifest: '/manifest.json',
// };

i18next.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  resources: {
    en: {
      common: enCommon,
    },
    ar: {
      common: arCommon,
    },
  },
});

const RootLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { i18n } = useTranslation('common');

  return (
      <html lang='en' className={`${roboto.variable} font-sans`}>
      <body className={`${roboto.variable} antialiased`}>
        <ModalProvider>
          <Modal/>
          <TooltipProvider>
            <main className="min-h-screen flex flex-col items-center justify-center">
              <div className="container mx-auto">
                <div className='fixed top-0 left-0 w-full z-50'>
                  <Header />
                </div>
                {children}
              </div>
            </main>
          </TooltipProvider>
      </ModalProvider>
        </body>
    </html>
  );
};

export default RootLayout;