import React, { useEffect } from 'react';
import { useCompanionStore } from '@/store/store';
import { database } from '@/lib/firebase'; // Assuming you have your firebase instance exported as 'database'
import { ref, onValue, off } from 'firebase/database';
import { storePaths } from '@/lib/utils'; // Assuming storePaths is in utils.ts

const selectedMode: React.FC = () => {
  const clientActivityMonitor = useCompanionStore((state) => state.ClientActivityMonitor);
  const actionButtonObj:any = clientActivityMonitor.statusInfo[clientActivityMonitor.currentStatus].actionButtons;

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
      // You might want to update the store here if needed:
      // useCompanionStore.getState().setClientActivityMonitor({ currentMode: modeValue });
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
    const currentModePath = `${storePaths.ClientActivityMonitor.statusInfo.QUEUE.path}`;
    const modeRef = ref(database, `storeObjects/${sessionId}/${currentModePath}`);

    const listener = onValue(modeRef, (snapshot) => {
      const modeValue = snapshot.val();
      console.log("Firebase QUEUE status changed:", modeValue);
      // You might want to update the store here if needed:
      // useCompanionStore.getState().setClientActivityMonitor({ currentMode: modeValue });
    });

    return () => off(modeRef, 'value', listener as any); // Explicitly specify 'value' event type
  }, [useCompanionStore.getState().getSessionId()]); // Re-run effect if session ID changes
  

  return (
    <div className="flex flex-col h-[30vh] border border-black m-4 rounded-lg mt-24">
      {/* Top Section: Mode Type */}
      <div className="h-1/4 flex items-center justify-center border-b border-black">
        <h2 className="text-lg font-bold">{clientActivityMonitor.modeTitle}</h2>
      </div>



      {/* Middle Section: Status - Conditionally render based on mode */}
      <div className="h-1/2 flex flex-col items-center justify-center border-b border-black">
        <h3 className="text-md font-semibold">Current Status: {clientActivityMonitor.currentStatus} </h3>
        {/* Placeholder for status content */}
        <div>
          {/* QUEUE MODE AND QUEUE STATUS */}
          {clientActivityMonitor.currentMode === 'QUEUE' && clientActivityMonitor.currentStatus === 'QUEUE' && (
            <div className="flex flex-col items-center justify-center">
              <p>Current Position: {clientActivityMonitor.statusInfo.QUEUE.currentPosition}</p>
              <p>Approx. Time: {clientActivityMonitor.statusInfo.QUEUE.approxTime}</p>
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
      </div>



      {/* Bottom Section: Circular Buttons */}
      <div className="h-1/3 flex items-center justify-evenly p-2">
        {/* Button 2 */}
        { actionButtonObj.addItem && <button className="rounded-full w-12 h-12 bg-gray-300 flex items-center justify-center border border-black">
          add Item
        </button>}
        {/* Button 3 */}
        {actionButtonObj.cancel && <button className="rounded-full w-12 h-12 bg-gray-300 flex items-center justify-center border border-black">
          cancel
        </button>}
      </div>
    </div>
  );
};

export default selectedMode;