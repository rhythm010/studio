'use client'

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Switch } from '@/components/ui/switch';
import { useTranslation } from 'react-i18next';
import { useModal } from '@/components/ui/Modal';
import { useRouter } from 'next/navigation'
import { useCompanionStore } from '@/store/store';
import React from 'react';

interface HeaderProps {
  showBack?: boolean;
}

const Header: React.FC<HeaderProps> = ({ showBack = true }) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isDevMode, setIsDevMode] = useState<boolean>(false);
  const { closeModal } = useModal();

  React.useEffect(() => {
    // Function to close the tooltip when clicking outside
    const handleOutsideClick = (event: MouseEvent) => {
      const tooltipContent = document.querySelector('.radix-tooltip-content'); // Use the appropriate selector for your tooltip content
      const tooltipTrigger = document.querySelector('.radix-tooltip-trigger'); // Use the appropriate selector for your tooltip trigger

      if (isMenuOpen && tooltipContent && !tooltipContent.contains(event.target as Node) && tooltipTrigger && !tooltipTrigger.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    // Add event listener when the tooltip is open
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }

    // Clean up the event listener when the component unmounts or tooltip closes
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isMenuOpen]); // Depend on isMenuOpen state

  const { i18n, t } = useTranslation('common');

  const store = useCompanionStore();
  const router = useRouter();
  const handleModalOpen = () => {
    router.back()
  };

  const handleToggleChange = (checked: boolean) => {
    if (checked) {
      i18n.changeLanguage('ar');
    } else {
      i18n.changeLanguage('en');
    }
  };

  const handleReset = () => {
    router.push('/login')
  };

  const handleGetStore = () => {
    console.log('Current store state:', store);
  };

  const devModeChange = (val:boolean) => {
    useCompanionStore.getState().setIsDevMode(val);
    setIsDevMode(val);
    console.log(useCompanionStore.getState());
  };

  return (
    <header className="bg-gray-800 shadow-lg h-16 w-full flex items-center justify-between" style={{ zIndex: 9999, position: 'fixed', top: 0, left: 0, right: 0 }}>
      {showBack && isDevMode && (
        <div>
          <Button onClick={handleModalOpen} className="bg-gray-800 hover:bg-gray-700" variant="default" size="sm">
            <Icons.backArrow className="mr-2 h-4 w-4" />
          </Button>
        </div>
      )}
      <div id="header_title_text" className="flex flex-grow justify-center ml-4">
        <h1 className="text-white">{t('header_title_text')}</h1>
      </div>
      <div>
        <Tooltip open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <TooltipTrigger asChild>
            <Button className="bg-gray-800 hover:bg-gray-700" variant="default" size="sm" onClick={() => {
              setIsMenuOpen(!isMenuOpen);
            }}>
              <Icons.menu className="mr-2 h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="flex flex-col items-start">
            {/* Dev mode  */}
            <div className='flex flex-row items-center space-x-2'>
              <Switch id="dev-mode" checked={isDevMode} onCheckedChange={devModeChange} />
              <label htmlFor="dev-mode">dev-mode</label>
            </div>
            {/* Companion mode */}

            <Button onClick={() => router.push('/guard-info-form')} className='mt-2' size='sm' variant='ghost'>
              companion mode
            </Button>
            {isDevMode && (
              <>
                <div className='flex flex-row items-center space-x-2 mt-2'>
                  <Switch id="airplane-mode" onCheckedChange={handleToggleChange} />
                  <label htmlFor="airplane-mode">en-ar</label>
                </div>
                <Button onClick={() => router.push('/login')} className='mt-2' size='sm' variant='ghost'>
                  /login
                </Button>
                <Button onClick={() => router.push('/landing')} className='mt-2' size='sm' variant='ghost'>
                  /landing
                </Button>
                <Button onClick={() => router.push('/in-service')} className='mt-2' size='sm' variant='ghost'>
                  /in-service
                </Button>
                <Button onClick={() => router.push('/end-service')} className='mt-2' size='sm' variant='ghost'>
                  /End Service
                </Button>
                <Button onClick={() => router.push('/introduction')} className='mt-2' size='sm' variant='ghost'>
                  /Introduction
                </Button>
                <Button onClick={() => router.push('/guard-matching')} className='mt-2' size='sm' variant='ghost'>
                  /Guard-matching
                </Button>
                <Button onClick={() => router.push('/guard-feedback')} className='mt-2' size='sm' variant='ghost'>
                  /Guard Feedback
                </Button>
                <Button onClick={handleReset} className='mt-2' size='sm' variant='ghost'>reset</Button>
                <Button onClick={handleGetStore} className='mt-2' size='sm' variant='ghost'>getStore</Button>
              </>
            )}
          </TooltipContent>
        </Tooltip>
      </div>
    </header>
  );
};
export default Header;
