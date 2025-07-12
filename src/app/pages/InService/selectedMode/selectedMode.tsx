import React, { useEffect, useState } from 'react';
import { useCompanionStore } from '@/store/store';
import { database } from '@/lib/firebase'; // Assuming you have your firebase instance exported as 'database'
import { ref, onValue, off } from 'firebase/database';
import { storePaths, updateValueInPrimaryCompanion } from '@/lib/utils'; // Assuming storePaths is in utils.ts
import ActivityStatusQueue from '../ActivityStatusQueue/ActivityStatusQueue';
import { ACTIVITY_STATUS, ACTIVITY_MODES } from '@/lib/constants';

const selectedMode: React.FC = () => {
  // Define local states
  // Click handler for the Restaurant Mode button

  const [currentMode, setCurrentMode] = useState<string>('');
  const [currentStatus, setCurrentStatus] = useState<string>('');
  const [currentStatusValues, setCurrentStatusValues] = useState<any | {}>({});
  const clientActivityMonitor = useCompanionStore((state) => state.ClientActivityMonitor);

  const syncLocalModeWithFirebase = () => {
    useCompanionStore.getState().setClientActivityMonitor({
      currentMode: currentMode,
      currentStatus: currentStatus,
      // Assuming you want to update statusInfo based on the fetched currentStatusValues
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
      // Update local state if the value is different to avoid unnecessary re-renders
      // if (modeValue !== currentMode) {
      setCurrentMode(modeValue);
      // }
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
      // Update local state if the value is different to avoid unnecessary re-renders
      // if (modeValue !== currentStatus) {
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

  const handleRestaurantButtonClick = async () => {
    // Add an empty object to the CompanionMsgQueue in Firebase for the primary companion
    await updateValueInPrimaryCompanion({ path: storePaths.CompanionMsgQueue, val: {id:'123', val:'something'} });
    console.log('Added empty object to CompanionMsgQueue for primary companion');
  };

  return (
    <div className="flex flex-col m-4 rounded-lg mt-24">
      {/* Top Section: Mode Type (40% height) */}
      <div id="title_section" className="flex flex-grow-[0.4] flex-shrink-0 items-center justify-center border border-black mb-3">
        <h2 className="text-lg font-bold">{`${clientActivityMonitor.currentMode} MODE`}</h2>
      </div>

      {/* Middle Section: Status - Conditionally render based on mode (remaining height) */}
      {/* Using flex-grow to take up the remaining space */}
      <div id="status_section" className="flex flex-grow flex-col items-center justify-center border border-black mb-3">
        <h3 className="text-md font-semibold">Current Status: {clientActivityMonitor.currentStatus} </h3>
        {/* Placeholder for status content */}
        <div>
          {/* QUEUE MODE AND QUEUE STATUS */}
          {clientActivityMonitor.currentMode === 'QUEUE' && clientActivityMonitor.currentStatus === 'QUEUE' && (
            <div className="flex flex-col items-center justify-center">
              <p>Approx. Time: {clientActivityMonitor.statusInfo.QUEUE?.approxTime}</p>
            </div>)}

          {/* CAFE MODE AND DEFAULT STATUS */}

          {clientActivityMonitor.currentMode === 'CAFE' && clientActivityMonitor.currentStatus === 'DEFAULT' && (
            <div className="flex flex-col items-center justify-center">
              <p>default status for cafe</p>
            </div>)}

          {/* CAFE MODE AND QUEUE STATUS */}
          {clientActivityMonitor.currentMode === 'CAFE' && clientActivityMonitor.currentStatus === 'QUEUE' && (
            <div className="flex flex-col items-center justify-center">
              <p>getting into queue</p>
              <p>position: {clientActivityMonitor.statusInfo.QUEUE?.currentPosition}</p>
            </div>)}
          {/* CAFE MODE AND PAYMENT STATUS */}
          {clientActivityMonitor.currentMode === 'CAFE' && clientActivityMonitor.currentStatus === 'PAYMENT_CALL' && (
            <div className="flex flex-col items-center justify-center">
              <p>come and pake payment</p>
            </div>)}
          {/* CAFE MODE AND WAIT_ITEM STATUS */}
          {clientActivityMonitor.currentMode === 'CAFE' && clientActivityMonitor.currentStatus === 'WAIT_ITEM' && (
            <div className="flex flex-col items-center justify-center">
              <p>waiting for items to collect</p>
            </div>)}
          {/* CAFE MODE AND WAIT_OP STATUS */}
          {clientActivityMonitor.currentMode === 'CAFE' && clientActivityMonitor.currentStatus === 'WAIT_OP' && (
            <div className="flex flex-col items-center justify-center">
              <p>waiting at OP</p>
            </div>)}

        </div>
        {((clientActivityMonitor.currentMode === ACTIVITY_MODES.CAFE && clientActivityMonitor.currentStatus === ACTIVITY_STATUS.QUEUE) ||
          (clientActivityMonitor.currentMode === ACTIVITY_MODES.QUEUE)) && <div>
            <ActivityStatusQueue />
          </div>}
      </div>



      {/* Bottom Section: Circular Buttons */}
      {/* Bottom Section: Action Buttons (40% height) */}
      <div id="action_section" className="flex flex-grow-[0.4] flex-shrink-0 items-center justify-evenly p-2 border border-black">
        {(currentStatusValues?.actionButtons?.addItem ||
          clientActivityMonitor.statusInfo[clientActivityMonitor.currentStatus]?.actionButtons?.addItem) && 
          <button className="rounded-full w-12 h-12 bg-gray-300 flex items-center justify-center border border-black"
           onClick={handleRestaurantButtonClick}>
            add Item
          </button>}
        {/* Button 3 */}
        {(currentStatusValues?.actionButtons?.cancel ||
          clientActivityMonitor.statusInfo[clientActivityMonitor.currentStatus]?.actionButtons?.cancel
        ) && <button className="rounded-full w-12 h-12 bg-gray-300 flex items-center justify-center border border-black">
            cancel 
          </button>}
        {<button className="rounded-full w-12 h-12 bg-gray-300 flex items-center justify-center border border-black">
          End Mode
        </button>}
      </div>
    </div>
  );
};

export default selectedMode;