'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Switch } from '@/components/ui/switch';

interface HeaderProps {
  showBack?: boolean;
}

function Header({ showBack = true }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const onToggle = (checked: boolean) => {
    console.log('Toggle state:', checked);
  };

  return (
    <div className="bg-gray-800 p-2 shadow-lg w-full flex items-center justify-between">
      {showBack && (
        <div>
          <Button className="bg-gray-800 hover:bg-gray-700" variant="default" size="sm">
            <Icons.backArrow className="mr-2 h-4 w-4" />
          </Button>
        </div>
      )}
      <div>
        <h1 className="text-white">PagePilot</h1>
      </div>
      <div>
        <Tooltip open={isMenuOpen}>
          <TooltipTrigger asChild>
            <Button className="bg-gray-800 hover:bg-gray-700" variant="default" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <Icons.menu className="mr-2 h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="flex flex-col items-start">
            <div className='flex flex-row items-center space-x-2'><Switch id="airplane-mode" onCheckedChange={onToggle}/><label htmlFor="airplane-mode">toggle</label></div>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}

export default Header;
