import React, { useState, useEffect } from 'react';
import { useCompanionStore } from '@/store/store';
import { ACTIVITY_MODES, ACTIVITY_STATUS } from '@/lib/constants';
import { updateValueInClient, storePaths } from '@/lib/utils';

const CompanionActivityMode: React.FC = () => {
  const companionFlow = useCompanionStore((state) => state.CompanionAcvitiyMonitor);

  // Base button styling derived from "Activate cafe mode" but smaller
  const buttonStyle = "w-20 h-10 bg-gray-300 flex items-center justify-center border border-black text-xs text-center px-2 py-1";

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
    <div className="flex flex-col items-center justify-center rounded-lg mb-2">

      <div id="activity_status_container">
        {companionFlow.companionCurrentStatus === ACTIVITY_STATUS.QUEUE && (<div id="Queue_mode"
        style={{ border: '1px solid grey',
        width: '100%', maxWidth: '500px', textAlign: 'center', paddingBottom: '5px', borderRadius: '14px' }}>
        <div style={{ borderBottom: '1px solid black', padding: '7px' }}>
          <div style={{ fontSize: '1rem' }}>Enter your position</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <button style={{ fontSize: '2rem', padding: '10px 20px' }} onClick={() => updateQueueValue(-1)}>-</button>
          <div style={{ fontSize: '3rem', fontWeight: 'bold' }}>{companionFlow.QUEUE.currentPosition}</div>
          <button style={{ fontSize: '2rem', padding: '10px 20px' }} onClick={() => updateQueueValue(1)}>+</button>
        </div>
        <button id="queue_position_status_btn"
          style={{
            backgroundColor: 'rgb(31 41 55 / var(--tw-bg-opacity, 1))',
            padding: '0.5rem',
            marginTop: '2px',
            color: 'white',
            borderRadius: '19px',
            fontSize:'0.8rem',
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
