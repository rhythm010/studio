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
      <div id="stopwatch_section" className="h-[90%] flex flex-col items-center justify-center border-b border-gray-700">
        <StopWatch isRunning={isRunning} startStop={handleStartStop} elapsedTime={elapsedTime} setElapsedTime={setElapsedTime} />
      </div>

      <div id="action_section" className="h-[10%] flex items-center justify-evenly">
        <button className="header-button px-4 py-2 rounded">{t("in_service_feedback")}</button>
        <button className="header-button px-4 py-2 rounded" onClick={openEndServiceModal}>
          {t("end_service")}
        </button>
      </div>
      {/* Modal is now handled by the hook */}

    </div>
  );
};

export default InService;
