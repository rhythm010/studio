import React, { useEffect, useState } from 'react';
import { useCompanionStore } from '@/store/store';
import { database } from '@/lib/firebase'; // Assuming you have your firebase instance exported as 'database'
import { ref, onValue, off } from 'firebase/database';
import { storePaths, updateValueInPrimaryCompanion } from '@/lib/utils'; // Assuming storePaths is in utils.ts
import { cn } from '@/lib/utils'; // Assuming cn is in utils.ts
import { ACTIVITY_STATUS, ACTIVITY_MODES } from '@/lib/constants';

const selectedMode: React.FC = () => {
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
    await updateValueInPrimaryCompanion({ path: storePaths.CompanionMsgQueue, val: { id: '123', val: 'something' } });
    console.log('Added empty object to CompanionMsgQueue for primary companion');
  };

  return (
    <div className="flex flex-col m-4 rounded-lg h-full">
      {/* Top Section: Mode Type (40% height) */}
      <div
        className="flex flex-grow-[0.2] flex-shrink-0 items-center justify-center mb-3">
        <h2 className="text-lg font-bold">{`${clientActivityMonitor.currentMode} MODE`}</h2>
      </div>

      {/* Middle Section: Status - Conditionally render based on mode (remaining height) */}
      <div id="section_2"
        className={cn(
          "flex flex-grow flex-col items-center mb-3",
          "h-full overflow-hidden", // Ensure it takes 100% of the available height and prevent overflow
          "rounded-xl shadow-lg" // Added rounded corners and elevated style
        )}
      >

        <div>
          {/* QUEUE MODE AND QUEUE STATUS */}
         
          { ((clientActivityMonitor.currentMode === ACTIVITY_MODES.CAFE && clientActivityMonitor.currentStatus === ACTIVITY_STATUS.QUEUE) ||
          (clientActivityMonitor.currentMode === ACTIVITY_MODES.QUEUE)) && (
              <div id="queue_container" className="flex flex-col items-center justify-between h-full">
                <div id="companion_status" className="text-sm font-normal self-start">companion position</div>
                <div id="companion_pos_val" className="text-[7rem] leading-none">{clientActivityMonitor.statusInfo.QUEUE?.currentPosition}</div>
                <div id="companion_pos_time" className="self-end">
                  <span className="text-sm font-thin">Approx. Time: </span>
                  <span className="text-[2rem]">{clientActivityMonitor.statusInfo.QUEUE?.approxTime}</span>
                  <span className="text-sm font-thin">min</span>
                </div>
              </div>
            )}

          {/* CAFE MODE AND DEFAULT STATUS */}

          {clientActivityMonitor.currentMode === ACTIVITY_MODES.CAFE && clientActivityMonitor.currentStatus === 'DEFAULT' && (
            <div className="flex flex-col items-center justify-center">
              <p>default status for cafe</p>
            </div>)}

          {clientActivityMonitor.currentMode === ACTIVITY_MODES.CAFE && clientActivityMonitor.currentStatus === 'PAYMENT_CALL' &&
            (
              <div id="payment_container" className="flex flex-col items-center justify-center h-full">
                <img src="/icons/mode_cafe_status_payment.png"
                  alt="Payment Status Icon" className="w-[12rem] h-[12rem] object-contain"
                  style={{ animation: 'blink 2s infinite', borderRadius: '10%' }} // Apply the blinking animation and rounded corners
                />
              </div>
            )}
          {/* CAFE MODE AND WAIT_ITEM STATUS */}

          {clientActivityMonitor.currentMode === ACTIVITY_MODES.CAFE && clientActivityMonitor.currentStatus === 'WAIT_ITEM' && (
            <div id="payment_container" className="flex flex-col items-center justify-center h-full">
              <img src="/icons/cafe_wait_item_english.png"
                alt="Payment Status Icon" className="w-[12rem] h-[12rem] object-contain"
                style={{ animation: 'blink 2s infinite', borderRadius: '10%' }} // Apply the blinking animation and rounded corners
              />
            </div>
          )}
          {/* CAFE MODE AND WAIT_OP STATUS */}

          {clientActivityMonitor.currentMode === ACTIVITY_MODES.CAFE && clientActivityMonitor.currentStatus === 'WAIT_OP' && (
            <div id="queue_container_wait_OP" className="flex flex-col items-center justify-center h-full p-[3rem]">
              {/* <div id="companion_status" className="text-sm font-normal self-start">companion position</div> */}
              <div id="companion_at_service_txt" className="text-[3rem] font-bold text-center">Waiting for instructions</div>
            </div>
          )}

        </div>
        {/* clientActivityMonitor.currentMode === ACTIVITY_MODES.WITH_YOU && */}
        { clientActivityMonitor.currentMode === ACTIVITY_MODES.WITH_YOU &&
          (
            <div id="with_you_container" className="flex flex-col items-center justify-between h-full">
              {/* <div id="companion_status" className="text-sm font-normal self-start">companion position</div> */}
              <div id="with_you_val" className="text-[3rem] font-bold text-center">With you</div>
            </div>
          )
        }
      </div>

      {/* Bottom Section: Circular Buttons */}
      {/* Bottom Section: Action Buttons (40% height) */}
      <div id="action_section" className={cn(
        "flex flex-grow-[0.4] flex-shrink-0 items-center justify-evenly p-2",
        "" // Added rounded corners and elevated style
      )}
      >
        
        {/* Add Item Button */}
        {/* <div id="add_item_button" className="flex flex-col items-center mx-2">
          <button className="rounded-full w-12 h-12 mb-1 shadow-md flex items-center justify-center"
            onClick={handleRestaurantButtonClick}
          >
            <img src="/icons/add_item.png" alt="Add Item Icon" className="w-6 h-6 object-contain" />
          </button>
          <span className="text-sm font-bold mt-4">Add Item</span>
        </div> */}
        
        { (currentStatusValues?.actionButtons?.cancel ||
          clientActivityMonitor.statusInfo[clientActivityMonitor.currentStatus]?.actionButtons?.cancel) &&
          <div id="cancel_status_button" className="flex flex-col items-center mx-2">
          <button className="rounded-full w-12 h-12 mb-1 shadow-md flex items-center justify-center">
            <img src="/icons/cancel_mode.png" alt="Add Item Icon" className="w-6 h-6 object-contain" />
          </button>
         
          <span className="text-sm font-bold mt-4">Cancel</span>
        </div>
        }

        
        
       { (currentStatusValues?.actionButtons?.complete ||
          clientActivityMonitor.statusInfo[clientActivityMonitor.currentStatus]?.actionButtons?.complete) && 
        <div id="end_mode_button" className="flex flex-col items-center mx-2">
          
          <button className="rounded-full w-12 h-12 mb-1 shadow-md flex items-center justify-center">
            
            <img src="/icons/complete_mode.png" alt="Add Item Icon" className="w-6 h-6 object-contain" />
          </button>
          <span className="text-sm font-bold mt-4">Done</span>
        </div>
        }

      </div>
    </div>
  );
};

export default selectedMode;