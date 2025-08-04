"use client"
import React, { useState, useEffect } from "react";
import StopWatch from "./StopWatch";
import { ref, onValue, off } from "firebase/database";
import SelectedMode from "./selectedMode/selectedMode";
import { useTranslation } from 'react-i18next';
import { useModal } from '../../../components/ui/Modal'; // Assuming useModal is exported from Modal.tsx
import ConfirmationModalContent from '../../../components/ConfirmationModalContent'; // Import the new component
import { useCompanionStore } from '../../../store/store';
import { getStoreRef, updateStoreInFirebase, sendMsgToClient, sendMsgToCompanion, checkIfSessionExistsAndMatch, updateInSelfFirebase } from '../../../lib/utils';
import { useRouter } from 'next/navigation'
import { database } from '@/lib/firebase';

const InService: React.FC = () => {

  const router = useRouter()
  const { t } = useTranslation('common');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [firebaseCurrentMode, setFirebaseCurrentMode] = useState<string>("WITH_YOU");
  const [manualSessionId, setManualSessionId] = useState(''); // State for manual session ID input
  const { openModal, closeModal } = useModal();
  const { isDevMode } = useCompanionStore();
  const setSessionId = useCompanionStore((state: any) => state.setSessionId);
  const sessionId = useCompanionStore((state: any) => state.sessionId);

  const startTimer = () => {
    setIsRunning(true);
  };

  const onEndService = () => {
    setIsRunning(false); // Stop the timer
    useCompanionStore.getState().setServiceRunning(false)
    // Use targeted update instead of full-store sync to avoid overwriting message queues
    updateInSelfFirebase('serviceRunning', false);
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
    const currentState = useCompanionStore.getState().ClientActivityMonitor;
    useCompanionStore.getState().setClientActivityMonitor({
      ...currentState,
      currentMode: activityMode, 
      modeTitle: `${activityMode} MODE ACTIVE`, 
      currentStatus: 'DEFAULT',
    });
  }

  // Handler for manual session ID input
  const handleManualSessionIdSubmit = async () => {
    if (!manualSessionId.trim()) {
      console.warn('Please enter a session ID');
      return;
    }

    try {
      const sessionExists = await checkIfSessionExistsAndMatch(manualSessionId);
      if (sessionExists) {
        setSessionId(manualSessionId);
        console.log('Successfully connected to session:', manualSessionId);
        setManualSessionId(''); // Clear input after successful connection
      } else {
        console.warn('Session not found or invalid');
      }
    } catch (error) {
      console.error('Error connecting to session:', error);
    }
  };

  // Handler for session restore from localStorage
  const handleSessionRestore = async () => {
    const restoredSessionId = localStorage.getItem('sessionId');
    if (restoredSessionId) {
      setManualSessionId(restoredSessionId);
      await handleManualSessionIdSubmit();
    }
  };

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
          // updateAcvityDataInStoreFromFirebase(activityMode, activityObjectFull);
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
  
      <div id="stopwatch_section" className="h-[50%] flex flex-col items-center justify-center border-gray-700 mt-16">
        <StopWatch
          isRunning={isRunning}
        />
      </div>

      {/* Connection Status Section */}
      <div className="flex flex-col items-center justify-center p-2">
        <div className="text-center">
          {sessionId ? (
                      <button className="mt-1 bg-green-500 text-white px-3 py-1.5 rounded-lg hover:bg-green-600 text-sm">
            Connected
          </button>
          ) : (
            <button
              onClick={handleSessionRestore}
              className="mt-1 bg-blue-500 text-white px-3 py-1.5 rounded-lg hover:bg-blue-600 text-sm"
            >
              Connect
            </button>
          )}
        </div>
      </div>

      <div id="action_section" className="flex items-center justify-evenly rounded-lg p-4 h-[10%] mb-4">
        <div id="end_service_button" className="flex flex-col items-center mx-2">
          {/* <button className="rounded-full w-16 h-16 border border-black mb-1"> */}
          <button
            onClick={openEndServiceModal} className="rounded-full mb-1 flex items-center justify-center text-red-500 text-2xl shadow-md"
            style={{ width: '2.8rem', height: '2.8rem' }}
          >
            {/* Red cross icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <span className="text-xs font-bold mt-2">{t("end_service")}</span>
        </div>
      </div>

      {/* Manual Session ID Input Container (Dev Mode Only) */}
      {isDevMode && (
        <div id="manual_session_id_input_container" style={{ display: 'flex', alignItems: 'center', marginTop: '20px', padding: '0 1rem' }}>
          <input
            type="text"
            placeholder="Enter Session ID"
            value={manualSessionId}
            onChange={(e) => setManualSessionId(e.target.value)}
            style={{ 
              marginRight: '10px', 
              padding: '0.5rem',
              flex: 1,
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
          <button
            onClick={handleManualSessionIdSubmit}
            style={{
              backgroundColor: 'rgb(31 41 55 / var(--tw-bg-opacity, 1))',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Connect to Session
          </button>
        </div>
      )}

      {/* Modal is now handled by the hook */}

    </div>
  );
};

export default InService;
