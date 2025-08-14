"use client";
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { INTRODUCTION_CONTENT } from '@/lib/constants';

const Introduction = () => {
  const LOADING_TIME_SECONDS = 3;
  const INTERVAL_MS = 100;
  const router = useRouter();
  const [currentImage, setCurrentImage] = useState<number>(0);
  const [isAgreed, setIsAgreed] = useState<boolean>(false);
  const [hasReachedImage3, setHasReachedImage3] = useState<boolean>(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation('common');
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleNext = () => {
    setCurrentImage((prev) => (prev + 1) % INTRODUCTION_CONTENT.length);
  };

  const handlePrev = () => {
    setCurrentImage((prev) => (prev - 1 + INTRODUCTION_CONTENT.length) % INTRODUCTION_CONTENT.length);
  };

  const handleAgreeClick = () => {
    router.push('/landing');
  }

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.style.transform = `translateX(-${currentImage * 100
        }%)`;
    }
  }, [currentImage]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    setProgress(0); // Reset progress on image change
    setIsLoading(true); // Set loading to true on image change    
    timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          clearInterval(timer);
          setIsLoading(false); // Set loading to false when progress is 100
          return 100;
        }
        const newProgress = oldProgress + (100 / (LOADING_TIME_SECONDS * 1000 / INTERVAL_MS));
        return Math.min(newProgress, 100);
      });
    }, INTERVAL_MS);
    return () => {
      setProgress(0); // Reset progress if not on the last image
    }
  }, [currentImage, INTRODUCTION_CONTENT.length]);
  useEffect(() => {
    if (currentImage === INTRODUCTION_CONTENT.length - 1 || hasReachedImage3) {
      setIsAgreed(true);
      setHasReachedImage3(true);
    } else {
      setIsAgreed(false);
    }
  }, [currentImage]);

  const buttonText = currentImage < INTRODUCTION_CONTENT.length - 1 ? t('introductionNextButton') : t('introductionAgreeButton');

  const handleButtonClick = () => {
    if (buttonText === 'Next') handleNext();
    else handleAgreeClick();
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 px-4 pt-4 overflow-x-hidden"> {/* Changed justify-between to justify-center */}
      <div className="flex flex-col items-center mb-8"> {/* New container for image and dots */}
        <div
          id="image-section"
          className="w-96 h-[540px] overflow-hidden relative mx-auto"
          onTouchStart={(event) => setTouchStartX(event.touches[0].clientX)}
          onTouchEnd={(event) => {
            const touchEndX = event.changedTouches[0].clientX;
            if (touchStartX !== null) {
              const swipeDistance = touchEndX - touchStartX;
              if (swipeDistance > 50) handlePrev(); // Swipe right
              if (swipeDistance < -50) handleNext(); // Swipe left
              setTouchStartX(null);
            }
          }}
        > {/* Removed mb-8 from this div */}
          <div id="image-section" ref={sliderRef} className="flex transition-transform duration-500">
            {INTRODUCTION_CONTENT.map((content, index) => (
              <div
                key={index}
                className="w-96 h-[540px] border border-black flex items-center justify-center text-2xl shrink-0"
              >
                {content.image.startsWith('/') ? (
                  <img 
                    src={content.image} 
                    alt={`Introduction ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  content.image
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-center mt-4"> {/* Removed mb-8 from this div */}
          {INTRODUCTION_CONTENT.map((_, index) => (
            <span
              key={index}
              className={`dot h-2 w-2 mx-1 rounded-full ${index === currentImage ? 'bg-gray-800' : 'bg-gray-400'}`}
            ></span>
          ))}
        </div>
        {/* Introduction Text */}
        <div className="text-center mt-6 px-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {INTRODUCTION_CONTENT[currentImage].text}
          </h2>
        </div>
      </div> {/* Closing the new container */}
      <div className="fixed bottom-0 left-0 right-0 flex flex-col items-center mb-4 px-4 w-full">
        {/* <button
        className={`w-full px-4 py-2 rounded-md ${isAgreed || buttonText === 'Next' ? 'bg-gray-800' : 'bg-gray-800 cursor-not-allowed'
          } text-white font-bold`}
        onClick={() => {
          if (currentImage < images.length - 1) handleNext();
          else handleAgreeClick();
        }}
        disabled={buttonText === 'I Agree' && !hasReachedImage3}
      >
        {buttonText}
 </button> */}
        <div
          onClick={() => {
            if (!isLoading) {
              if (currentImage < INTRODUCTION_CONTENT.length - 1) handleNext();
              else handleAgreeClick();
            }
          }}
          className="w-full rounded-md bg-gray-300 overflow-hidden mt-4 h-10 relative flex items-center justify-center">
          <div className="h-full bg-gray-800 rounded-md transition-all duration-100 absolute top-0 left-0 h-10"
            style={{ width: `${progress}%` }}>
          </div>
          <span className={`absolute inset-0 flex items-center justify-center font-bold ${progress > 50 ? 'text-white' : 'text-black'}`}>{buttonText}</span>

        </div>
      </div>
    </div>
  );
};

export default Introduction;