"use client";
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Introduction = () => {
  const router = useRouter();
  const [currentImage, setCurrentImage] = useState<number>(0);
  const [isAgreed, setIsAgreed] = useState<boolean>(false);
  const [hasReachedImage3, setHasReachedImage3] = useState<boolean>(false);
  const images = ['Image 1', 'Image 2', 'Image 3'];
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleNext = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };
  
  const handleAgreeClick = () => {
    router.push('/landing');
  }

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.style.transform = `translateX(-${
        currentImage * 100
      }%)`;
    }
  }, [currentImage]);

  useEffect(() => {
    if (currentImage === images.length - 1) {
      setIsAgreed(true);
      setHasReachedImage3(true);
    } else {
        if(!hasReachedImage3){
            setIsAgreed(false);
        }
    }
  }, [currentImage]);

  return (
    <div className="flex flex-col items-center justify-between h-screen bg-gray-100 px-4 pb-20 pt-4">
      <div className="w-96 h-64 overflow-hidden relative mb-8">
        <div ref={sliderRef} className="flex transition-transform duration-500">
          {images.map((image, index) => (
            <div
              key={index}
              className="w-96 h-64 border border-black flex items-center justify-center text-2xl shrink-0"
            >
              {image}
            </div>
          ))}
        </div>
        <div className="absolute left-0 top-0 w-full h-full flex items-center justify-between px-4">
          <button onClick={handlePrev} className="p-2 rounded-full bg-gray-200 hover:bg-gray-300">
            {'<'}
          </button>
          <button onClick={handleNext} className="p-2 rounded-full bg-gray-200 hover:bg-gray-300">
            {'>'}
          </button>
        </div>
      </div>
      <button
        disabled={!isAgreed}
        className={`fixed bottom-0 left-1/2 -translate-x-1/2 mb-4 w-[90%] px-4 py-2 rounded-md ${
          isAgreed ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400 cursor-not-allowed'
        } text-white font-bold`}
        onClick={handleAgreeClick}
      >
        I Agree
      </button>
    </div>
  );
};

export default Introduction;