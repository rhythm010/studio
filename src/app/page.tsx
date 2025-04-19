'use client'

import { useTranslation } from 'react-i18next';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useModal } from '@/components/ui/Modal';

export const dynamic = 'force-dynamic';

const Home = () => {
  const { t } = useTranslation('common');
  const { locale } = useParams();
  const { openModal } = useModal()
  // i18n.changeLanguage(locale);

  const openTestModal = () => {
    openModal(
      <div className='flex flex-col'>
        <p>This is a modal</p>
        <Button onClick={() => openModal(undefined,undefined,(data)=>console.log(data))}>close</Button>
      </div>,
      "md",
      (data) => {
        if(data) {
          console.log("data from modal", data);
        }
      }
    );
  };

  return (
    <div className="container mx-auto p-4">
      <div className='flex gap-2'>
        <Button onClick={openTestModal}>
          Open Modal
        </Button>
      </div>
    </div>
  );
};

export default Home;
