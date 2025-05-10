"use client";
import React, { useState } from 'react';
import { Icons } from './icons';


interface StarRatingProps {
 label: string; // Text label for the rating
  onRatingChange: (rating: number) => void; // Added onClick prop
}

const StarRating: React.FC<StarRatingProps> = ({ label, onRatingChange }) => {
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [selectedRating, setSelectedRating] = useState<number>(0);

  const handleStarClick = (selectedRating: number) => {
    setSelectedRating(selectedRating);
    // onRatingChange(selectedRating);
    console.log('rating selected:', selectedRating)
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="text-lg font-bold text-gray-700">{label}</div>
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((starIndex) => (
          <button
            key={starIndex}
            onClick={() => handleStarClick(starIndex)}
            onMouseEnter={() => setHoverRating(starIndex)}
            onMouseLeave={() => setHoverRating(0)}
            className="focus:outline-none"
          >
            {(hoverRating || selectedRating) >= starIndex ? (
              <Icons.starFilled className="h-8 w-8 text-yellow-400" />
            ) : (
              <Icons.starOutline className="h-8 w-8 text-gray-400" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StarRating;
