"use client";
import { Roboto } from 'next/font/google';
import i18next from 'i18next'; 
import { useTranslation } from 'react-i18next';
import { initReactI18next } from 'react-i18next';
import arCommon from '../../public/locales/ar/common.json';
import enCommon from '../../public/locales/en/common.json';
import { ModalProvider, Modal } from '@/components/ui/Modal';
import  './globals.css';
import Header from '@/components/Header';
import { TooltipProvider } from '@/components/ui/tooltip';
import React, { useEffect } from 'react';
import { useCompanionStore } from '@/store/store';
import { database } from '@/lib/firebase';
import { ref, onValue, off } from 'firebase/database';
import { listenToCompaionRecieveQueue, storePaths } from '@/lib/utils';
import './globals.css';

const roboto = Roboto({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
});

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
  const sessionId = useCompanionStore((state) => state.sessionId);

  useEffect(() => {
    let unsubscribe: () => void = () => {}; // Initialize with a no-op function
    if (sessionId) {
      // Only listen if sessionId exists
      listenToCompaionRecieveQueue();
    }
  }, [sessionId]); // Re-run effect when sessionId changes

  

  return (
      <html lang='en' className={roboto.className}>
      <body className="">
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
