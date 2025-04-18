"use client";
import type { Metadata } from 'next';
import { Roboto, Geist_Mono } from 'next/font/google';
import { useState, useEffect } from 'react';
import i18next, { Namespace } from 'i18next';
import { useTranslation } from 'react-i18next';
import { initReactI18next } from 'react-i18next';
import arCommon from '../../public/locales/ar/common.json';
import enCommon from '../../public/locales/en/common.json';
import LandingPage from './pages/Landing/LandingPage';
import { ModalProvider } from '@/components/ui/Modal';
import './globals.css';
import Header from '@/components/Header';
import Home from './page';

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

export const Translation = ({ ns }: { ns: Namespace }) => useTranslation(ns);

function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isEnglish, setIsEnglish] = useState(true);
  const { t, i18n } = useTranslation('common');

  useEffect(() => {
    i18n.changeLanguage(isEnglish ? 'en' : 'ar');
  }, [isEnglish, i18n]);

  const changeLanguage = () => {
    setIsEnglish(!isEnglish);
  };

  const lang = isEnglish ? 'en' : 'ar';


  return (
    <html lang={lang} className={`${roboto.variable} font-sans`}>
      <body className={`${geistMono.variable} antialiased`}>
        <ModalProvider>
          <main className="container mx-auto">
            <div className='fixed top-0 left-0 w-full z-50'>
              <Header />
            </div>
            <div className=''><LandingPage /></div>
          </main>
          {/* <Home /> */}
        </ModalProvider>

      </body>
    </html>
  );
}











export default RootLayout;