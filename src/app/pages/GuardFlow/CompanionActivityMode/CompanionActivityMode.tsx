import React, { useState, useEffect } from 'react';
import { useCompanionStore } from '@/store/store';
import { ACTIVITY_MODES, ACTIVITY_STATUS } from '@/lib/constants';
import { updateValueInClient, storePaths } from '@/lib/utils';

const CompanionActivityMode: React.FC = () => {
  const companionFlow = useCompanionStore((state) => state.CompanionAcvitiyMonitor);

  // Base button styling derived from "Activate cafe mode" but smaller
  const buttonStyle = "w-20 h-10 bg-gray-300 flex items-center justify-center border border-black text-xs text-center px-2 py-1";

  // Method to handle button clicks and set activity status
  const setCompanionActivityStatus = (status: string) => {
    useCompanionStore.setState(state => ({
      ...state,
      CompanionAcvitiyMonitor: {
        ...state.CompanionAcvitiyMonitor,
        companionCurrentStatus: status
      }
    }));

    updateValueInClient({
      path: storePaths.ClientActivityMonitor.currentStatus,
      val: status,
    });
  };

  const updateQueueValue = (delta: number) => {
    useCompanionStore.setState((state) => {
      const newPosition = state.CompanionAcvitiyMonitor.QUEUE.currentPosition + delta;
      const clampedPosition = Math.max(0, Math.min(15, newPosition)); // Ensure value is between 0 and 15
      return {
        ...state,
        CompanionAcvitiyMonitor: {
          ...state.CompanionAcvitiyMonitor,
          QUEUE: {
            ...state.CompanionAcvitiyMonitor.QUEUE,
            currentPosition: clampedPosition,
          },
        },
      }});
  };

  useEffect(() => {
    updateValueInClient({
      path: storePaths.ClientActivityMonitor.statusInfo.QUEUE.currentPosition,
      val: companionFlow.QUEUE.currentPosition,
    });
  }, [companionFlow.QUEUE.currentPosition, updateValueInClient]);

  const endQueue = () => {
    useCompanionStore.setState(state => ({
      ...state,
      CompanionAcvitiyMonitor: {
        ...state.CompanionAcvitiyMonitor,
        companionCurrentStatus: ACTIVITY_STATUS.DEFAULT, // Reset to empty string
      },
    }));

    // Optionally update the value in the client's Firebase store as well
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 border border-black rounded-lg">
      {companionFlow?.selectedMode && <div style={{ marginTop: '10px', fontSize: '1rem' }}>
        Current Active Mode: {companionFlow?.selectedMode}
      </div>}
      {/* Mode container */}
      <div id="activity_status_buttons" className="grid grid-cols-2 gap-8 items-center">
        {/* Row 1 */}
        {
          (companionFlow?.selectedMode === ACTIVITY_MODES.CAFE ||
            companionFlow?.selectedMode === ACTIVITY_MODES.QUEUE
          ) && <div className="flex items-center">
            {/* Button 1 */}
            <button className={buttonStyle}
              onClick={() => setCompanionActivityStatus(ACTIVITY_STATUS.QUEUE)}>
              Get into Q
            </button>
            {/* Arrow 1 to 2 */}
          </div>}
        {/* Button 2 */}
        {companionFlow?.selectedMode === ACTIVITY_MODES.CAFE && <button className={buttonStyle}
          onClick={() => setCompanionActivityStatus(ACTIVITY_STATUS.PAYMENT_CALL)}>
          Payment Call
        </button>}

        {/* Row 2 */}
        <div className="flex items-center">
          {/* Button 3 */}
          {companionFlow?.selectedMode === ACTIVITY_MODES.CAFE && <button className={buttonStyle}
            onClick={() => setCompanionActivityStatus(ACTIVITY_STATUS.WAIT_ITEM)}>
            item waiting
          </button>}
          {/* Button 4 */}
          {companionFlow?.selectedMode === ACTIVITY_MODES.CAFE && <button className={buttonStyle}
            onClick={() => setCompanionActivityStatus(ACTIVITY_STATUS.WAIT_OP)}>
            waiting OP
          </button>}
          {/* Arrow 4 to 3 */}
          <div className="arrow left"></div>
          {/* Arrow 4 to 3 */}

        </div>
      </div>

      <div id="activity_status_container">
        {companionFlow.companionCurrentStatus}
        {companionFlow.companionCurrentStatus === ACTIVITY_STATUS.QUEUE && (<div id="Queue_mode"
        style={{ border: '1px solid black', marginTop: '20px',
        width: '70%', maxWidth: '500px', textAlign: 'center', paddingBottom: '5px' }}>
        <div style={{ borderBottom: '1px solid black', paddingBottom: '5px', padding: '10px' }}>
          <h3 style={{ fontSize: '1.5rem' }}>Queue Mode Active</h3>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <button style={{ fontSize: '2rem', padding: '10px 20px' }} onClick={() => updateQueueValue(-1)}>-</button>
          <div style={{ fontSize: '3rem', fontWeight: 'bold' }}>{companionFlow.QUEUE.currentPosition}</div>
          <button style={{ fontSize: '2rem', padding: '10px 20px' }} onClick={() => updateQueueValue(1)}>+</button>
        </div>
        <button
          style={{
            backgroundColor: 'rgb(31 41 55 / var(--tw-bg-opacity, 1))',
            padding: '0.5rem',
            marginTop: '10px',
            color: 'white',
          }}
          onClick={endQueue} // Call the new endQueue function
        >
          End Queue mode
        </button>
      </div>)}
      </div>

    </div>
  );
};
export default CompanionActivityMode;
