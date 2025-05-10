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
    if (currentImage === images.length - 1 || hasReachedImage3) {
      setIsAgreed(true);
      setHasReachedImage3(true);
    } else {
            setIsAgreed(false);
    }
  }, [currentImage]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 px-4 pt-4"> {/* Changed justify-between to justify-center */}
      <div className="flex flex-col items-center mb-8"> {/* New container for image and dots */}
        <div id="image-section" className="w-96 h-64 overflow-hidden relative mx-auto"> {/* Removed mb-8 from this div */}
          <div id="image-section" ref={sliderRef} className="flex transition-transform duration-500">
            {images.map((image, index) => (
              <div
                key={index}
                className="w-96 h-64 border border-black flex items-center justify-center text-2xl shrink-0"
              >
                {image}
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-center mt-4"> {/* Removed mb-8 from this div */}
        {images.map((_, index) => (
          <span
            key={index}
            className={`dot h-2 w-2 mx-1 rounded-full ${index === currentImage ? 'bg-gray-800' : 'bg-gray-400'}`}
          ></span>
        ))}
        </div>
      </div> {/* Closing the new container */}
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