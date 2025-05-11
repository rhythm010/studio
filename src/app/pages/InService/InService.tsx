"use client"
import React, { useState, useEffect } from "react";
import StopWatch from "./StopWatch";
import { useTranslation } from 'react-i18next';
import { useModal } from '../../../components/ui/Modal'; // Assuming useModal is exported from Modal.tsx
import ConfirmationModalContent from '../../../components/ConfirmationModalContent'; // Import the new component
import { useRouter } from 'next/navigation'


``
const InService: React.FC = () => {

  const router = useRouter()
  const { t } = useTranslation('common');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const { openModal, closeModal } = useModal();
  const startTimer = () => {
    setIsRunning(true);
  };

  const openEndServiceModal = () => {
    const handleYes = () => {
      setIsRunning(false); // Stop the timer
      closeModal();
      router.push('/end-service')
    };
    const handleNo = () => {
      // handling no
      closeModal();
    };
    openModal(
      <ConfirmationModalContent text={t('end_service_confirmation')} onConfirm={handleYes} onCancel={handleNo} />
    );
  }
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
      <div id="stopwatch_section" className="h-[90%] flex flex-col items-center justify-center border-gray-700">
        <StopWatch
          isRunning={isRunning}
          startStop={handleStartStop}
          elapsedTime={elapsedTime}
          setElapsedTime={setElapsedTime}
        />
        <button
          onClick={handleStartStop}
        >
          {isRunning ? 'Stop' : 'Start'}
        </button>
      </div>

      <div id="action_section" className="flex items-center justify-evenly rounded-lg m-4 p-4 h-[10%] mb-72 shadow-lg">
        {/* Three rounded buttons */}
        <div id="assist_button" className="flex flex-col items-center mx-2">
          <button className="rounded-full w-16 h-16 border border-black mb-1">
            {/* Icon or empty */}
          </button>
          <span className="text-sm font-bold">{t("Assist")}</span>
        </div>
        <div id="play_pause_button" className="flex flex-col items-center">
          <button className="rounded-full w-16 h-16 border border-black mb-1">
            {/* Icon or empty */}
          </button>
          <span className="text-sm font-bold">{t("Feedback")}</span>
        </div>
        <div id="end_service_button" className="flex flex-col items-center mx-2">
          <button
            className="rounded-full w-16 h-16 border border-black mb-1"
            onClick={openEndServiceModal}
          >
            {/* Icon or empty */}
          </button>
          <span className="text-sm font-bold">{t("End Service")}</span>
        </div>
      </div>
      {/* Modal is now handled by the hook */}

    </div>
  );
};

export default InService;
