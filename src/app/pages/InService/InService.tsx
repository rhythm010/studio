"use client"
import React, {useState,useEffect} from "react";
import StopWatch from "./StopWatch";
import { useTranslation } from 'react-i18next';

const InService: React.FC = () => {

  const { t } = useTranslation('common');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [elapsedTime, setElapsedTime] = useState<number>(0)
    

    const startTimer = () => {
        setIsRunning(true);
    };

    const handleStartStop = () => {
        setIsRunning(!isRunning);
    };

    useEffect(() => {
        let intervalId: NodeJS.Timeout | null = null;
        if (isRunning) {
            intervalId = setInterval(() => {
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
    }, [isRunning]);

  useEffect(() => {
    startTimer();
  }, []);

  return (
      <div className="flex flex-col h-screen">
          <div id="stopwatch_section" className="h-[90%] flex flex-col items-center justify-center border-b border-gray-700">
              <StopWatch isRunning={isRunning} startStop={handleStartStop} elapsedTime={elapsedTime} setElapsedTime={setElapsedTime} />
            </div>
          <div id="action_section" className="h-[10%] flex items-center justify-center">
            <button className="header-button px-4 py-2 rounded">{t("in_service_feedback")}</button>
          </div>
      </div>
  );
};

export default InService;
