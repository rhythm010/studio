"use client";

import React, { useEffect, useState } from 'react';
import { useCompanionStore } from '@/store/store';
import { database } from '@/lib/firebase'; // Assuming you have your firebase instance exported as 'database'
import { ref, onValue, off } from 'firebase/database';
import { storePaths, createClientInstructionProp, sendMsgToCompanion, listenToFirebaseKey, updateInSelfFirebase, updateValueInCompanion } from '@/lib/utils'; // Assuming storePaths and createClientInstructionProp are in utils.ts
import { ACTIVITY_STATUS, CLIENT_INSTRUCTION_MANUAL, COMPANION_ROLES, INSTRUCTION_STATUS_UI_MAP, CLIENT_MODE_STATUS_UI_MAP, MSG_STATUS } from '@/lib/constants';
import ClientFeatureExplainer from '../ClientFeatureExplainer';
import { useModal } from '@/components/ui/Modal';

const INSTRUCTION_ICONS: Record<string, JSX.Element> = {
  WAIT_OP: (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="black"><circle cx="12" cy="12" r="9" strokeWidth="2"/><path d="M12 7v5l3 3" strokeWidth="2" strokeLinecap="round"/></svg>
  ),
  QUEUE: (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="black"><circle cx="8" cy="8" r="3" strokeWidth="2"/><circle cx="16" cy="8" r="3" strokeWidth="2"/><circle cx="12" cy="16" r="3" strokeWidth="2"/></svg>
  ),
  BRING_STAFF: (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="black"><circle cx="12" cy="7" r="4" strokeWidth="2"/><path d="M5 21v-2a7 7 0 0 1 14 0v2" strokeWidth="2"/></svg>
  ),
  STAND_CLOSE: (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="black"><circle cx="12" cy="8" r="4" strokeWidth="2"/><rect x="6" y="16" width="12" height="4" rx="2" strokeWidth="2"/></svg>
  ),
  ORDER_CALL: (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="black"><path d="M12 19v-6" strokeWidth="2"/><path d="M8 13h8" strokeWidth="2"/><circle cx="12" cy="7" r="4" strokeWidth="2"/></svg>
  ),
  I_AM_DONE: (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="black"><path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
  ),
  CLOSE_ASSIST: (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="black"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round"/></svg>
  ),
  DEFAULT: (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="black"><circle cx="12" cy="12" r="10" strokeWidth="2"/></svg>
  ),
};

const selectedMode: React.FC = () => {
  // Define local states
  const [currentMode, setCurrentMode] = useState<string>('WITH_YOU');
  const [currentStatus, setCurrentStatus] = useState<string>('');
  const [currentStatusValues, setCurrentStatusValues] = useState<any | {}>({});
  const [clientQueueObj, setClientQueueObj] = useState<any>({});
  const [isModeChanging, setIsModeChanging] = useState<boolean>(false);
  const [previousMode, setPreviousMode] = useState<string>('WITH_YOU');
  const clientActivityMonitor = useCompanionStore((state: any) => state.ClientActivityMonitor);
  
  const { openModal, closeModal } = useModal();
  const setSendClientMsgQueue = useCompanionStore((state: any) => state.setSendClientMsgQueue);

  useEffect(() => {
    // Add a keyframes rule for the blinking animation
    const blinkingAnimation = `
      @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
      }
    `;

    // Add a style tag with the animation
    const animationStyle = document.createElement('style');
    animationStyle.innerHTML = blinkingAnimation;
    document.head.appendChild(animationStyle);

    // Cleanup function to remove the style tag when the component unmounts
    return () => {
      document.head.removeChild(animationStyle);
    };
  }, []); // Empty dependency array ensures this effect runs only once on the client-side

  const syncLocalModeWithFirebase = () => {
    const currentState = useCompanionStore.getState().ClientActivityMonitor;
    useCompanionStore.getState().setClientActivityMonitor({
      ...currentState,
      statusInfo: { ...clientActivityMonitor.statusInfo, [currentStatus]: currentStatusValues },
    });
  }

  // Effect to update store when local states currentMode or currentStatusValues change in firebase
  useEffect(() => {
    // Update the store's clientActivityMonitor with the latest local state values
    syncLocalModeWithFirebase();
  }, [currentMode, currentStatus, currentStatusValues]); // Re-run effect when local states change

  useEffect(() => {
    const sessionId = useCompanionStore.getState().getSessionId();
    if (!sessionId) {
      console.warn("Session ID is not available. Cannot listen to Firebase.");
      return;
    }

    // Get the Firebase path for currentMode using storePaths
    const currentModePath = `${storePaths.ClientActivityMonitor.currentMode}`;
    const modeRef = ref(database, `storeObjects/${sessionId}/${currentModePath}`);

    const listener = onValue(modeRef, (snapshot) => {
      const modeValue = snapshot.val();
      console.log("Firebase currentMode changed:", modeValue);
      
      // Check if mode is actually changing
      if (modeValue && modeValue !== currentMode) {
        setPreviousMode(currentMode);
        setIsModeChanging(true);
        
        // Clear sendClientMsgQueue in Firebase for client
        const emptyMsgQueue = {};
        updateInSelfFirebase(storePaths.ClientActivityMonitor.sendClientMsgQueue, emptyMsgQueue);
        
        // Clear sendClientMsgQueue in local store of client
        setSendClientMsgQueue(emptyMsgQueue);
        
        // Clear recieveCompanionMsgQueue in Firebase for companion
        updateValueInCompanion({ 
            path: storePaths.CompanionAcvitiyMonitor.recieveCompanionMsgQueue, 
            val: {test:1}, 
          }, 'PRIMARY');
        
        
        // Reset mode changing flag after a short delay
        setTimeout(() => setIsModeChanging(false), 3000);
      }
      
      setCurrentMode(modeValue);
      
      // Update currentMode in local store's ClientActivityMonitor
      const currentStore = useCompanionStore.getState();
      currentStore.setClientActivityMonitor({
        currentMode: modeValue
      });
    });

    return () => off(modeRef, 'value', listener as any); // Explicitly specify 'value' event type
  }, [useCompanionStore.getState().getSessionId(), currentMode]); // Re-run effect if session ID or currentMode changes

  useEffect(() => {
    const sessionId = useCompanionStore.getState().getSessionId();
    if (!sessionId) {
      console.warn("Session ID is not available. Cannot listen to Firebase.");
      return;
    }

    // Get the Firebase path for currentMode using storePaths
    const currentModePath = `${storePaths.ClientActivityMonitor.currentStatus}`;
    const modeRef = ref(database, `storeObjects/${sessionId}/${currentModePath}`);

    const listener = onValue(modeRef, (snapshot) => {
      const modeValue = snapshot.val();
      console.log("Firebase status changed:", modeValue);
      setCurrentStatus(modeValue);
      // }
    });

    return () => off(modeRef, 'value', listener as any); // Explicitly specify 'value' event type
  }, [useCompanionStore.getState().getSessionId()]); // Re-run effect if session ID changes

  // Effect to listen for changes in Firebase statusInfo based on currentStatus
  useEffect(() => {
    const sessionId = useCompanionStore.getState().getSessionId();
    if (!sessionId || !currentStatus) { // Only listen if sessionId and currentStatus are available
      console.warn("Session ID or currentStatus is not available. Cannot listen to Firebase statusInfo.");
      setCurrentStatusValues(null); // Reset status values if status is not available
      return;
    }

    // Get the Firebase path for statusInfo based on currentStatus
    const statusInfoRef = ref(database, `storeObjects/${sessionId}/${storePaths.ClientActivityMonitor.statusInfo.path}/${currentStatus}`);
   

    const listener = onValue(statusInfoRef, (snapshot) => {
      const statusInfoValue = snapshot.val();
      console.log(`Firebase statusInfo[${currentStatus}] changed:`, statusInfoValue);
      // Update local state with the new status info values
      setCurrentStatusValues(statusInfoValue);
    });

    // Clean up the listener when the component unmounts or currentStatus changes
    return () => {
      console.log(`Unsubscribing from Firebase statusInfo[${currentStatus}]`);
      off(statusInfoRef, 'value', listener as any);
    };
  }, [useCompanionStore.getState().getSessionId(), currentStatus]); // Re-run effect if session ID or currentStatus changes

  // Listen for changes to sendClientMsgQueue in Firebase
  useEffect(() => {
    const sessionId = useCompanionStore.getState().getSessionId();
    if (!sessionId) return;
    const unsubscribe = listenToFirebaseKey(sessionId, storePaths.ClientActivityMonitor.sendClientMsgQueue, (val) => {
      if (val && typeof val === 'object') {
        setClientQueueObj(val);
      } else {
        setClientQueueObj({});
      }
    });
    return unsubscribe;
  }, [useCompanionStore.getState().getSessionId()]);

  // Handler for instruction button click
  // Remove handleInstructionButtonClick

  const activateCompanionInstruction = (instruction: string) => {
    console.log('activateCompanionInstruction called');
    closeModal();
    const msgObj = {
      type: instruction,
      status: MSG_STATUS.UNREAD,
      timestamp: Date.now(),
    };
    setSendClientMsgQueue(msgObj); // local store first step - CLIENT - 1
    updateInSelfFirebase(storePaths.ClientActivityMonitor.sendClientMsgQueue, msgObj); // firebase update step - CLIENT - 2
    // Pass the instruction as the message type to sendMsgToCompanion
    sendMsgToCompanion(instruction, {}, COMPANION_ROLES.PRIMARY); // UPDATE IN COMPANION - 3
  };

  const clientInstructionLaunchHandler = (instruction: string) => {
    // Check if the instruction is already active
    const isInstructionActive = (clientQueueObj.type === instruction && 
                               (clientQueueObj.status === MSG_STATUS.UNREAD || clientQueueObj.status === MSG_STATUS.OPENED)) ||
                               currentStatus === instruction;
    
    // If instruction is already active, send DEFAULT instead
    const instructionToSend = isInstructionActive ? 'DEFAULT' : instruction;
    
    const explainerProps = createClientInstructionProp(instructionToSend);
    openModal(
      <ClientFeatureExplainer
        {...explainerProps}
        closeModal={closeModal}
        handleYes={() => activateCompanionInstruction(instructionToSend)}
      />
    );
  };



  // Helper to check if currentMode is a valid key for CLIENT_INSTRUCTION_MANUAL
  const isValidInstructionMode = (mode: any): mode is keyof typeof CLIENT_INSTRUCTION_MANUAL => {
    return mode && Object.prototype.hasOwnProperty.call(CLIENT_INSTRUCTION_MANUAL, mode);
  };

  // Helper function to get status text
  const getStatusText = () => {
    if (isModeChanging) {
      return CLIENT_MODE_STATUS_UI_MAP[currentMode]?.[currentStatus]?.text || currentStatus || 'Connecting with companions...';
    }
    
    if (clientQueueObj.status && clientQueueObj.status !== MSG_STATUS.ACTIONED && INSTRUCTION_STATUS_UI_MAP[clientQueueObj.type]?.[clientQueueObj.status]) {
      return INSTRUCTION_STATUS_UI_MAP[clientQueueObj.type][clientQueueObj.status].text;
    }
    
    return CLIENT_MODE_STATUS_UI_MAP[currentMode]?.[currentStatus]?.text || currentStatus || 'Connecting with companions...';
  };

  // Helper function to render queue position display
  const renderQueuePositionDisplay = () => {
    if (currentStatus !== ACTIVITY_STATUS.QUEUE && currentStatus !== ACTIVITY_STATUS.QUEUE_CALL) {
      return null;
    }

    return (
      <div
        id="queue_position_container"
        className="flex items-center justify-center border-2 border-black rounded-lg mb-4 mx-4 p-4"
      >
        {currentStatus === ACTIVITY_STATUS.QUEUE && (
          <h3 className="text-lg font-semibold">
            Current Position: {clientActivityMonitor.statusInfo?.QUEUE?.currentPosition || 0}
          </h3>
        )}

        {currentStatus === ACTIVITY_STATUS.QUEUE_CALL && (
          <h3 className="text-lg font-semibold">
            Your turn is next
          </h3>
        )}
      </div>
    );
  };

  // Helper function to render instruction buttons
  const renderInstructionButtons = () => {
    if (!isValidInstructionMode(currentMode)) {
      return null;
    }

    const instructionKeys = Object.keys(CLIENT_INSTRUCTION_MANUAL[currentMode]) as Array<keyof typeof CLIENT_INSTRUCTION_MANUAL[typeof currentMode]>;
    
    return instructionKeys.map((key) => {
      const instructionType = (CLIENT_INSTRUCTION_MANUAL[currentMode] as Record<string, string>)[key as string];
      
      // Only the current status should be active, not multiple buttons
      const isActive = currentStatus === instructionType;
      
      return (
        <div key={key as string} className="flex flex-col items-center justify-center">
          <button
            id={`instruction_button_${key}`}
            className={`rounded-full w-10 h-10 shadow-lg flex items-center justify-center ${
              isActive ? 'bg-green-500 hover:bg-green-600' : 'bg-white hover:bg-gray-200'
            }`}
            onClick={() => clientInstructionLaunchHandler(instructionType)}
          >
            {INSTRUCTION_ICONS[instructionType] || INSTRUCTION_ICONS.DEFAULT}
          </button>
          <span className="text-[0.7rem] font-bold text-center mt-3">{instructionType}</span>
        </div>
      );
    });
  };

  return (
    <div id="selected_mode_container" className="flex flex-col h-full w-full rounded-lg">
      {/* Top Section: Status Text (30% height) */}
      <div
        id="status_text_container"
        className="flex items-center justify-center shadow-lg rounded-lg mb-4 mx-4 bg-white"
        style={{ height: '30%' }}
      >
        <h2 className="text-2xl font-bold">
          {getStatusText()}
        </h2>
      </div>

      {/* Queue Position Display */}
      {renderQueuePositionDisplay()}

      {/* Bottom Section: Instruction Buttons (70% height) */}
      <div
        id="instruction_buttons_container"
        className="flex flex-row items-center justify-center flex-wrap gap-8 shadow-lg rounded-lg mx-4 p-4 bg-white"
        style={{ minHeight: '70%' }}
      >
        {renderInstructionButtons()}
      </div>
    </div>
  );
};

export default selectedMode;
