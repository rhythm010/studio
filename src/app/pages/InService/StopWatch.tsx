"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface StopWatchProps {
  isRunning: boolean;
}

const StopWatch: React.FC<StopWatchProps> = ({ isRunning }) => {
  const [elapsedTime, setElapsedTime] = useState(0); // milliseconds
  const startTimeRef = useRef<number | null>(null); // timestamp when started
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // On start/stop, sync with system clock for accuracy
  useEffect(() => {
    if (isRunning) {
      // When starting, set the start time to now minus already elapsed
      startTimeRef.current = Date.now() - elapsedTime;
      timerRef.current = setInterval(() => {
        if (startTimeRef.current !== null) {
          setElapsedTime(Date.now() - startTimeRef.current);
        }
      }, 100); // update every 100ms for smoothness
    } else {
      // When stopped, clear the interval
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    // Cleanup on unmount or when isRunning changes
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning]);

  const { t } = useTranslation('common');

  const formatTime = (timeInMilliseconds: number) => {
    const totalSeconds = Math.floor(timeInMilliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return {
      hours: hours.toString().padStart(2, "0"),
      minutes: minutes.toString().padStart(2, "0"),
      seconds: seconds.toString().padStart(2, "0"),
    };
  };

  const { hours, minutes, seconds } = formatTime(elapsedTime);

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className="rounded-full border-2 border-black flex items-center justify-center text-6xl font-bold p-4"
      >
        {hours}:{minutes}<span className="text-2xl ml-1">{seconds}</span>
      </div>
    </div>
  );
};

export default StopWatch;