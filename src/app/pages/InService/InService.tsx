"use client"
import React, { useState, useEffect } from "react";
import { ACTIVITY_STATUS, ACTIVITY_MODES } from '@/lib/constants';
import StopWatch from "./StopWatch";
import { ref, onValue, off } from "firebase/database";
import SelectedMode from "./selectedMode/selectedMode";
import { useTranslation } from 'react-i18next';
import { useModal } from '../../../components/ui/Modal'; // Assuming useModal is exported from Modal.tsx
import ConfirmationModalContent from '../../../components/ConfirmationModalContent'; // Import the new component
import { useCompanionStore } from '../../../store/store';
import { getStoreRef, updateStoreInFirebase, sendMsgToClient, sendMsgToCompanion } from '../../../lib/utils';
import { useRouter } from 'next/navigation'
import { database } from '@/lib/firebase';

const InService: React.FC = () => {

  const router = useRouter()
  const { t } = useTranslation('common');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [firebaseCurrentMode, setFirebaseCurrentMode] = useState<string>("WITH_YOU");
  const { openModal, closeModal } = useModal();
  const startTimer = () => {
    setIsRunning(true);
  };

  const onEndService = () => {
    setIsRunning(false); // Stop the timer
    useCompanionStore.getState().setServiceRunning(false)
    updateStoreInFirebase();
    closeModal();
    router.push('/end-service')
  }

  const openEndServiceModal = () => {
    const handleYes = () => onEndService();
    const handleNo = () => closeModal();
    // handling no
    openModal(
      <ConfirmationModalContent text={t('end_service_confirmation')} onConfirm={handleYes} onCancel={handleNo} />
    );
  }
  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  const updateAcvityDataInStoreFromFirebase = (activityMode: string, activityObjectFull: any) => {
    useCompanionStore.getState().setClientActivityMonitor({
       currentMode: activityMode, 
       modeTitle:`${activityMode} MODE ACTIVE`, 
       currentStatus:'DEFAULT'
      
    }); // Update the local store
  }
  const handleCancelInService = async () => {
    // Create a random message
    const randomMessage = {
      id: Math.random().toString(36).substring(2, 15),
      type: "text",
      content: "This is a test message from InService page",
      timestamp: Date.now(),
    };

    // Send the message to the client
    // sendMsgToClient("test", randomMessage);
    sendMsgToCompanion(randomMessage.type, {content: 'a value'}, 'PRIMARY' );
    console.log("Sent a test message to the client.");
  };

  useEffect(() => {
    // commenting it: this is causing multiple re-renders for the in service component
    // let intervalId: NodeJS.Timeout | null = null;
    // if (isRunning) {
    //   intervalId = setInterval(() => {
    //     setElapsedTime((prevTime) => prevTime + 10);
    //   }, 10);
    // } else if (!isRunning && intervalId) {
    //   clearInterval(intervalId);
    // }
    // return () => {
    //   if (intervalId) {
    //     clearInterval(intervalId);
    //   }
    // };
  }, [isRunning]);

  useEffect(() => {
    if (useCompanionStore.getState().getSessionId()) {
      console.log('session id is updated inside use effect')
      const clientCompanionDetailsRef = ref(database, `storeObjects/${useCompanionStore.getState().getSessionId()}/clientCompanionDetails`);
      const listener:any = onValue(clientCompanionDetailsRef, (snapshot) => {
        if(snapshot.exists()){
          const clientCompanionVal = snapshot.val();
          useCompanionStore.getState().setClientCompanionDetails(clientCompanionVal);
        } else {
          console.log('no snapshot value is there');
        }
      });

      // Clean up the listener when the component unmounts
      return () => off(clientCompanionDetailsRef, listener);
    }
  }, [useCompanionStore.getState().getSessionId()]); // Empty dependency array ensures this effect runs only once on mount


  useEffect(() => {
    startTimer();
  }, []);

  useEffect(() => {
    console.log('Session ID before ref:', useCompanionStore.getState().getSessionId());
    const modeRef = ref(database, `storeObjects/${useCompanionStore.getState().getSessionId()}/ClientActivityMonitor`);

    console.log('mode ref');
    console.log(modeRef);
    // console.log(`storeObjects/${useCompanionStore.getState().getSessionId()}/ClientActivityMonitor`);

    // look for activity monitor value change 

    // see if mode is changed or not

    // if not, then see if status is changed

    // if not 

    const listener: any = onValue(modeRef, (snapshot) => {
      if (snapshot.exists()) {
        const activityMode = snapshot.val().currentMode;
        const activityObjectFull = snapshot.val();
        if (activityMode !== firebaseCurrentMode) {
          setFirebaseCurrentMode(activityMode);
          updateAcvityDataInStoreFromFirebase(activityMode, activityObjectFull);
        }
      } else {
        setFirebaseCurrentMode(""); // Or a default value if appropriate
      }
    });

    return () => off(modeRef, listener);
  }, [useCompanionStore.getState().getSessionId()]);




  return (
    <div className="flex flex-col h-screen pt-[6rem]">
      <div className="h-[50%]">
      <SelectedMode />
      </div>
  
      <div id="stopwatch_section" className="h-[40%] flex flex-col items-center justify-center border-gray-700 mt-4">
        <StopWatch
          isRunning={isRunning}
          startStop={handleStartStop}
          elapsedTime={elapsedTime}
          setElapsedTime={setElapsedTime}
        />
      </div>

      <div id="action_section" className="flex items-center justify-evenly rounded-lg m-4 p-4 h-[10%] mb-20 mt-10">
        {/* Three rounded buttons */}
        {/* <div id="assist_button" className="flex flex-col items-center mx-2">
          <button onClick={() => openModal()} 
           className="rounded-full w-16 h-16 mb-1 shadow-md flex items-center justify-center">
            <img src="/icons/icon_light_bulb.png" alt="Assist Icon" className="w-8 h-8" />
          </button>
          <span className="text-sm font-bold mt-4">{t("Assist")}</span>
        </div> */}
        {/* <div id="play_pause_button" className="flex flex-col items-center">
          <button onClick={handleStartStop} className="rounded-full w-16 h-16 mb-1 flex items-center justify-center text-2xl shadow-md">
            {isRunning ? (
              <img src="/icons/icon_pause.png" alt="Pause Icon" className="w-8 h-8" />
            ) : (<img src="/icons/icon_play.png" alt="Play Icon" className="w-8 h-8" />)}
          </button>
          <span className="text-sm font-bold mt-4">{isRunning ? t('timer_stop') : t('timer_start')}</span>
        </div> */}
        <div id="end_service_button" className="flex flex-col items-center mx-2">
          {/* <button className="rounded-full w-16 h-16 border border-black mb-1"> */}
          <button
            onClick={openEndServiceModal} className="rounded-full w-16 h-16 mb-1 flex items-center justify-center text-red-500 text-2xl shadow-md"
          >
            {/* Red cross icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <span className="text-sm font-bold mt-4">{t("end_service")}</span>
        </div>
      </div>
               <button
            id="cancel_in_service"
            onClick={handleCancelInService} // Attach the click handler here
            className="rounded-full w-16 h-16 mb-1 flex items-center justify-center text-red-500 text-2xl shadow-md"
          >
            {/* Cancel icon */}
            Cancel 
          </button>
      {/* Modal is now handled by the hook */}

    </div>
  );
};

export default InService;
