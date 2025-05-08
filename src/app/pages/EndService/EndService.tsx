"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import SingleAnsQ from '../../../components/SingleAnsQ';
import MultipleAnsQ from '../../../components/MultipleAnsQ';

const EndService: React.FC = () => {
  const router = useRouter();

  const handleOptionSelected = (option: string) => {
    console.log("Selected option:", option);
  };

  const handleEndService = () => {
    router.push('/login');
  };

  return (
    <div className="flex items-center justify-center h-screen w-screen">
      <MultipleAnsQ question="How was the service?" options={['Excellent', 'Good', 'Fair', 'Bad']} onOptionSelected={handleOptionSelected} />

      {/* <SingleAnsQ text="Are you sure to end the service?" onYes={handleEndService} onNo={() => {}} confirmText="Yes" cancelText="No" /> */}
    </div>
  );
};
export default EndService;