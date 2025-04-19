'use client';
import { useModal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';

interface HeaderProps {
  showBack?: boolean;
  showReset?: boolean;

}

function Header({ showBack = true, showReset = true }: HeaderProps) {
  const { openModal } = useModal();
  const onReset = () => {
      openModal('Reset Modal', 'md')
  }

  return (
    <div className="bg-gray-800 p-2 shadow-lg w-full flex items-center justify-between">
        {showBack && (
          <div >
            <Button className='bg-gray-800 hover:bg-gray-700' variant="default" size="sm">
                <Icons.backArrow className="mr-2 h-4 w-4" />
              </Button>
          </div>
        )}
        <div>
          <h1 className="text-white">PagePilot</h1>
        </div>
        {showReset && ( 
            
          <div>
            <Button className='bg-gray-800 hover:bg-gray-700' variant="default" size="sm" onClick={onReset}>
              <Icons.reset className="mr-2 h-4 w-4" />
            </Button>
          </div>
        )}
    </div>
  );
}

export default Header;