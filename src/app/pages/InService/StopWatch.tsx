"use client";

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';


interface StopWatchProps {
  elapsedTime: number;
    isRunning: boolean;
    startStop: () => void;
  setElapsedTime:(time:number) => void
}

const StopWatch: React.FC<StopWatchProps> = ({ isRunning, startStop, elapsedTime ,setElapsedTime }) => {

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    if (isRunning) { intervalId = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 10);
      }, 10);
    } else if (!isRunning && intervalId) {
      clearInterval(intervalId);
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  },[isRunning]);
  const { t } = useTranslation('common');

  const formatTime = (timeInMilliseconds: number) => {
    const minutes = Math.floor(timeInMilliseconds / 60000);
    const seconds = Math.floor((timeInMilliseconds % 60000) / 1000);
    const milliseconds = Math.floor((timeInMilliseconds % 1000) / 10);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}<span class="text-sm">${milliseconds
        .toString()
        .padStart(2, "0")}</span>`;
  };

   return (
    <div className="flex flex-col items-center justify-center">
      <div
        className="w-[13rem] h-[13rem] rounded-full border-4 border-black flex items-center justify-center text-4xl font-bold"
      >
        <div dangerouslySetInnerHTML={{ __html: formatTime(elapsedTime) }} />
      </div>
    </div>
  );
};

export default StopWatch;