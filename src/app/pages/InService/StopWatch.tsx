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

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now() - elapsedTime;
      timerRef.current = setInterval(() => {
        if (startTimeRef.current !== null) {
          setElapsedTime(Date.now() - startTimeRef.current);
        }
      }, 1000); // update every 1s for HH:MM:SS
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
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
        className="rounded-md border border-black flex items-center justify-center bg-white px-2 py-1"
        style={{ minWidth: '120px', minHeight: '36px', fontFamily: 'monospace', fontWeight: 700 }}
      >
        <span className="text-xl" style={{ letterSpacing: '1px' }}>{hours}</span>
        <span className="text-xl mx-0.5">:</span>
        <span className="text-xl" style={{ letterSpacing: '1px' }}>{minutes}</span>
        <span className="text-xl mx-0.5">:</span>
        <span className="text-xl" style={{ letterSpacing: '1px' }}>{seconds}</span>
      </div>
    </div>
  );
};

export default StopWatch;