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
    console.log('rating selected:', selectedRating)
  };

  return ( // Main container with flex column
    <div className="flex flex-col items-center space-y-2">
      <div className="text-lg font-bold text-gray-700">{label}</div>
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((starIndex) => (
          <button
            key={starIndex}
            onClick={() => handleStarClick(starIndex)}
            onMouseEnter={() => setHoverRating(starIndex)}
            onMouseLeave={() => setHoverRating(0)}
            className="focus:outline-none mr-1"

          >
            {(hoverRating || selectedRating) >= starIndex ? (
              <Icons.starFilled className="h-8 w-8 text-yellow-400" />
            ) : (
              <Icons.starOutline className="h-8 w-8 text-gray-400" />
            )}
          </button>
        ))}
      </div> {/* end of star rating div */}
      {/* Feedback Textarea (conditional rendering) */}
      {selectedRating > 0 && selectedRating <= 3 && (
        <div id="feedback-text" className="w-full mt-[50px] left-0 right-0">
 
          <textarea
            className="w-full p-2 border rounded-md resize-none"
 placeholder="What went wrong ?"
          ></textarea>


        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white shadow-md mt-[50px]"> {/* Fixed position for submit button */}
        <button className="px-4 py-2 bg-gray-800 text-white rounded-md w-full shadow-md" onClick={() => onRatingChange(selectedRating)}>Submit</button>
      </div>
    </div>
  );
};
export default StarRating;