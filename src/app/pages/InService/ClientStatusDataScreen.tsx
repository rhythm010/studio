import React from 'react';
import { ACTIVITY_STATUS, MSG_STATUS } from '@/lib/constants';

interface ClientStatusDataScreenProps {
  currentStatus: string;
  currentPosition?: number;
  approxTime?: number;
  secondaryDivText?: string | null;
  clientQueueObj?: any;
}

const ClientStatusDataScreen: React.FC<ClientStatusDataScreenProps> = ({
  currentStatus,
  currentPosition = 0,
  approxTime = 2,
  secondaryDivText = '',
  clientQueueObj = {},
}) => {
  // Only show when instruction is actioned or clientQueueObj does not have status key
  const shouldShow = !clientQueueObj.status || clientQueueObj.status === MSG_STATUS.ACTIONED;
  
  if (!shouldShow) {
    return null;
  }

  return (
    <div
      id="queue_position_container"
      className="flex items-center justify-center rounded-lg mb-4 mx-4 p-4 bg-white shadow-lg"
      style={{ height: '30%', flexShrink: 0 }}
    >
      {currentStatus === ACTIVITY_STATUS.QUEUE && (
        <div className="flex items-center justify-center w-full h-full">
          {/* Left side - Queue Position */}
          <div className="flex flex-col items-center justify-center flex-1">
            <div className="text-sm font-light mb-2">Queue Position</div>
            <div className="text-6xl font-bold">{currentPosition}</div>
          </div>
          
          {/* Grey divider line */}
          <div className="w-px h-16 bg-gray-300 mx-8"></div>
          
          {/* Right side - Approximate Time */}
          <div className="flex flex-col items-center justify-center flex-1">
            <div className="text-sm font-light mb-2">Approx Time</div>
            <div className="text-6xl font-bold">
              <span className="font-bold">{approxTime}</span>
              <span className="text-sm font-light"> min</span>
            </div>
          </div>
        </div>
      )}

      {currentStatus === ACTIVITY_STATUS.QUEUE_CALL && (
        <h3 className="text-2xl font-bold">
          Your turn is next
        </h3>
      )}

      {/* Secondary Status Info Div */}
      {currentStatus !== ACTIVITY_STATUS.QUEUE && 
       currentStatus !== ACTIVITY_STATUS.QUEUE_CALL &&  
       secondaryDivText && (
        <div id="secondary_status_info" className="text-center">
          <p className="text-md text-gray-600">{secondaryDivText}</p>
        </div>
      )}
    </div>
  );
};

export default ClientStatusDataScreen; 