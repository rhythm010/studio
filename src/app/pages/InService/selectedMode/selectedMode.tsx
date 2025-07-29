"use client";

import React, { useEffect, useState } from 'react';
import { useCompanionStore } from '@/store/store';
import { database } from '@/lib/firebase'; // Assuming you have your firebase instance exported as 'database'
import { ref, onValue, off } from 'firebase/database';
import { storePaths, createClientInstructionProp, createCompanionMessageObject, sendMsgToCompanion, listenToFirebaseKey, getInstructionStatusText, updateInSelfFirebase } from '@/lib/utils'; // Assuming storePaths and createClientInstructionProp are in utils.ts
import { cn } from '@/lib/utils'; // Assuming cn is in utils.ts
import { ACTIVITY_STATUS, ACTIVITY_MODES, CLIENT_INSTRUCTION_MANUAL, COMPANION_ROLES, INSTRUCTION_STATUS_UI_MAP, CLIENT_MODE_STATUS_UI_MAP, MSG_STATUS } from '@/lib/constants';
import ClientFeatureExplainer from '../ClientFeatureExplainer';
import { useModal } from '@/components/ui/Modal';

const selectedMode: React.FC = () => {
  // Define local states
  const [currentMode, setCurrentMode] = useState<string>('CAFE');
  const [currentStatus, setCurrentStatus] = useState<string>('');
  const [currentStatusValues, setCurrentStatusValues] = useState<any | {}>({});
  const [clientQueueStatus, setClientQueueStatus] = useState<string>('');
  const [clientQueueObj, setClientQueueObj] = useState<any>({});
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
    useCompanionStore.getState().setClientActivityMonitor({
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
      setCurrentMode(modeValue);
    });

    return () => off(modeRef, 'value', listener as any); // Explicitly specify 'value' event type
  }, [useCompanionStore.getState().getSessionId()]); // Re-run effect if session ID changes

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
    console.log('key which is having issue');
    console.log(`storeObjects/${sessionId}/${storePaths.ClientActivityMonitor.statusInfo.path}/${currentStatus}`);

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
    // Update companion's local store
    useCompanionStore.getState().setRecieveCompanionMsgQueue({
      type: instruction,
      status: MSG_STATUS.UNREAD, // or any status you want to represent
      timestamp: Date.now(),
    });
    // Update client's sendClientMsgQueue in local store and Firebase
    const msgObj = {
      type: instruction,
      status: MSG_STATUS.UNREAD,
      timestamp: Date.now(),
    };
    setSendClientMsgQueue(msgObj);
    updateInSelfFirebase(storePaths.ClientActivityMonitor.sendClientMsgQueue, msgObj);
    // Pass the instruction as the message type to sendMsgToCompanion
    sendMsgToCompanion(instruction, {}, COMPANION_ROLES.PRIMARY);
  };

  const clientInstructionLaunchHandler = (instruction: string) => {
    const explainerProps = createClientInstructionProp(instruction);
    openModal(
      <ClientFeatureExplainer
        {...explainerProps}
        closeModal={closeModal}
        handleYes={() => activateCompanionInstruction(instruction)}
      />
    );
  };

  // Helper to check if currentMode is a valid key for CLIENT_INSTRUCTION_MANUAL
  const isValidInstructionMode = (mode: any): mode is keyof typeof CLIENT_INSTRUCTION_MANUAL => {
    return mode && Object.prototype.hasOwnProperty.call(CLIENT_INSTRUCTION_MANUAL, mode);
  };

  return (
    <div id="selected_mode_container" className="flex flex-col h-full w-full rounded-lg">
      {/* Top Section: Status Text (30% height) */}
      <div
        id="status_text_container"
        className="flex items-center justify-center border-2 border-black rounded-lg mb-4 mx-4"
        style={{ height: '30%' }}
      >
        <h2 className="text-2xl font-bold">
          {clientQueueObj.status && INSTRUCTION_STATUS_UI_MAP[clientQueueObj.type]?.[clientQueueObj.status]
            ? INSTRUCTION_STATUS_UI_MAP[clientQueueObj.type][clientQueueObj.status].text
            : CLIENT_MODE_STATUS_UI_MAP[currentMode]?.[currentStatus]?.text || currentStatus || 'Status'}
        </h2>
      </div>

      {/* Bottom Section: Instruction Buttons (70% height) */}
      <div
        id="instruction_buttons_container"
        className="flex flex-row items-center justify-center flex-wrap gap-8 border-2 border-black rounded-lg mx-4 p-4"
        style={{ minHeight: '70%' }}
      >
        {isValidInstructionMode(currentMode) &&
          (Object.keys(CLIENT_INSTRUCTION_MANUAL[currentMode]) as Array<keyof typeof CLIENT_INSTRUCTION_MANUAL[typeof currentMode]>).map((key) => (
            <button
              id={`instruction_button_${key}`}
              key={key as string}
              className="rounded-full w-16 h-16 shadow-md flex items-center justify-center bg-gray-200 hover:bg-gray-300 border-2 border-gray-400"
              onClick={() => clientInstructionLaunchHandler((CLIENT_INSTRUCTION_MANUAL[currentMode] as Record<string, string>)[key as string])}
            >
              <span className="text-xs font-bold text-center leading-tight">{(CLIENT_INSTRUCTION_MANUAL[currentMode] as Record<string, string>)[key as string]}</span>
            </button>
          ))}
      </div>
    </div>
  );
};

export default selectedMode;
