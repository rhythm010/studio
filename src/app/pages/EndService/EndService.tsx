"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import StarRating from '../../../components/StarRating'; // Assuming the path is correct

const EndService: React.FC = () => {
  const router = useRouter();
  const handleStarClick = () => {
    router.push('/login');
  };

  return (
    <div className="flex items-center justify-center h-screen w-screen">
      <StarRating label="How was the service?" onClick={handleStarClick} />
    </div>
  );
};

export default EndService;