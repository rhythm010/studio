'use client';

import { useState, useEffect, } from 'react';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Switch } from '@/components/ui/switch';
import { useTranslation } from 'react-i18next';
import { useModal } from '@/components/ui/Modal';
import React from 'react';
interface HeaderProps {
  showBack?: boolean;
}

const Header: React.FC<HeaderProps> = ({ showBack = true }) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const { setModalContent, setIsModalOpen,setTitle , modalContent} = useModal();
  const { i18n, t } = useTranslation();

    useEffect(() => {
      if(modalContent) {
        setIsMenuOpen(false)
      }
    }, [modalContent])


  const handleModalOpen = () => {
    setTitle('Modal Title');
    setModalContent(<p>Hello from Modal!</p>);
    setIsModalOpen(true);
  };

  const handleToggleChange = (checked: boolean) => {
    if (checked) {
      i18n.changeLanguage('ar');
    } else {
      i18n.changeLanguage('en');
    }
  };

  const handleReset = () => {
    window.location.reload()
  };

  return (
    <div className="bg-gray-800 p-2 shadow-lg w-full flex items-center justify-between">
      {showBack && (
        <div>
          <Button onClick={handleModalOpen} className="bg-gray-800 hover:bg-gray-700" variant="default" size="sm">
            <Icons.backArrow className="mr-2 h-4 w-4" />
          </Button>
        </div>
      )}
      <div id="header_title_text">
        <h1 className="text-white">{t('header_title_text')}</h1>
      </div>
      <div>
        <Tooltip open={isMenuOpen}>
          <TooltipTrigger asChild>
            <Button className="bg-gray-800 hover:bg-gray-700" variant="default" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <Icons.menu className="mr-2 h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="flex flex-col items-start">
            <div className='flex flex-row items-center space-x-2'>
              <Switch id="airplane-mode" onCheckedChange={handleToggleChange}/>
              <label htmlFor="airplane-mode">en-ar</label>
            </div><Button onClick={handleReset} className='mt-5' size='sm' variant='ghost'>reset</Button>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};
export default Header;
