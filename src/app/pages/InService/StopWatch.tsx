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
    if (isRunning) {
      intervalId = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1000);
      }, 1000);
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
        className="w-[15rem] h-[15rem] rounded-full border-2 border-black flex items-center justify-center text-6xl font-bold"
      >
        {hours}:{minutes}<span className="text-2xl ml-1">{seconds}</span>
      </div>
    </div>
  );
};

export default StopWatch;