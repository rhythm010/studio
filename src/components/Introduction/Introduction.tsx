"use client";
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Introduction: React.FC = () => {
  const [isAgreed, setIsAgreed] = useState<boolean>(false);
  const [currentImage, setCurrentImage] = useState<number>(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const images = [
    'Image 1',
    'Image 2',
    'Image 3',
  ];

  const router = useRouter();

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };
  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.style.transform = `translateX(-${currentImage * 100}%)`;
    }
  }, [currentImage]);

  useEffect(() => {
    if (currentImage === images.length - 1) {
      setIsAgreed(true);
    }
  }, [currentImage, images.length]);

    const handleAgreeClick = () => {
      router.push('/landing');
    };

  return (
    <div className="flex flex-col items-center justify-between h-screen bg-gray-100 px-4 pb-20 pt-4">
      <div className="w-96 h-64 overflow-hidden relative mb-8">
        <div ref={sliderRef} className="flex transition-transform duration-500">
          {images.map((image, index) => (
            <div
              key={index}
              className="w-96 h-64 border border-black flex items-center justify-center text-xl font-bold flex-shrink-0"
            >
              {image}
            </div>
          ))}
        </div>

        <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4">
          <button
            onClick={prevImage}
            className="bg-gray-200 p-2 rounded-full"
          >
            &lt;
          </button>
          <button
            onClick={nextImage}
            className="bg-gray-200 p-2 rounded-full"
          >
            &gt;
          </button>
        </div>
      </div>

      <button
        className={`w-11/12 px-6 py-3 rounded-md self-center ${isAgreed ? 'bg-blue-500 hover:bg-blue-700 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'} fixed bottom-4 left-1/2 transform -translate-x-1/2 w-[90%]
        }`}
        disabled={!isAgreed}
        onClick={handleAgreeClick}
      >
        I Agree
      </button>
    </div>
  );
};

export default Introduction;