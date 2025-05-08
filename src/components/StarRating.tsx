"use client";
import React, { useState } from 'react';
import { Icons } from './icons';


interface StarRatingProps {
 label: string; // Text label for the rating
  onRatingChange: (rating: number) => void; // Added onClick prop
}

const StarRating: React.FC<StarRatingProps> = ({ label, onRatingChange }) => {
  const [rating, setRating] = useState<number>(0);

  const handleStarClick = (selectedRating: number) => {
 onRatingChange(selectedRating); // Invoke the onClick prop
    console.log('rating selected:', selectedRating)
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="text-sm font-medium text-gray-700">{label}</div>
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleStarClick(star)}
            className="focus:outline-none"
            aria-label={`Rate ${star} stars`}
          >
            {star <= rating ? ( 
              <Icons.starFilled className="h-6 w-6 text-yellow-400" /> 
            ) : (
              <Icons.starOutline className="h-6 w-6 text-gray-400" /> 
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StarRating;
