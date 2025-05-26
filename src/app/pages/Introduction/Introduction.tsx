"use client";
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

const Introduction = () => {
  const router = useRouter();
  const [currentImage, setCurrentImage] = useState<number>(0);
  const [isAgreed, setIsAgreed] = useState<boolean>(false);
  const [hasReachedImage3, setHasReachedImage3] = useState<boolean>(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const { t } = useTranslation('common');
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
      sliderRef.current.style.transform = `translateX(-${currentImage * 100
        }%)`;
    }
  }, [currentImage]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    setProgress(0); // Reset progress on image change
    timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) return 100;
        const newProgress = oldProgress + (100 / 30); // 100% over 30 intervals (3 seconds with 100ms interval)
        return Math.min(newProgress, 100);
      });
    }, 100);

 return () => {
      setProgress(0); // Reset progress if not on the last image
    }
  }, [currentImage, images.length]);
  useEffect(() => {
    if (currentImage === images.length - 1 || hasReachedImage3) {
      setIsAgreed(true);
      setHasReachedImage3(true);
    } else {
      setIsAgreed(false);
    }
  }, [currentImage]);

  const buttonText = currentImage < images.length - 1 ? t('introductionNextButton') : t('introductionAgreeButton');

  const handleButtonClick = () => {
    if (buttonText === 'Next') handleNext();
    else handleAgreeClick();
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 px-4 pt-4 overflow-x-hidden"> {/* Changed justify-between to justify-center */}
      <div className="flex flex-col items-center mb-8"> {/* New container for image and dots */}
        <div className="w-96 h-4 bg-gray-300 rounded-full overflow-hidden mb-4">
          <div className="h-full bg-gray-800 rounded-full transition-all duration-100"
               style={{ width: `${progress}%` }}></div>
        </div>
        <div
          id="image-section"
          className="w-96 h-64 overflow-hidden relative mx-auto"
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
        className={`fixed bottom-0 left-1/2 -translate-x-1/2 mb-4 w-[90%] px-4 py-2 rounded-md ${isAgreed || buttonText === 'Next' ? 'bg-gray-800' : 'bg-gray-800 cursor-not-allowed'
          } text-white font-bold`}
        onClick={() => {
          if (currentImage < images.length - 1) handleNext();
          else handleAgreeClick();
        }}
        disabled={buttonText === 'I Agree' && !hasReachedImage3}
      >
        {buttonText}
      </button>
    </div>
  );
};

export default Introduction;