import React, { useMemo } from 'react';
import { useCompanionStore } from '@/store/store';

const selectedMode: React.FC = () => {
  const { modeTitle, currentMode } = {modeTitle: '1', currentMode: '2'};
  console.log('Selected Mode:', { modeTitle, currentMode });
  return (
    <div className="flex flex-col h-[30vh] border border-black m-4 rounded-lg mt-24">
      {/* Top Section: Mode Type */}
      <div className="h-1/4 flex items-center justify-center border-b border-black">
        <h2 className="text-lg font-bold">{modeTitle}</h2>
      </div>

      {/* Middle Section: Status - Conditionally render based on mode */}
      <div className="h-1/2 flex flex-col items-center justify-center border-b border-black">
        <h3 className="text-md font-semibold">Status:</h3>
        {/* Placeholder for status content */}
       <div>
       {modeTitle === 'QUEUE' && (
        <div className="flex flex-col items-center justify-center">
          {/* <p>Current Position: {clientActivityMonitor.statusInfo.QUEUE.currentPosition}</p> */}
          {/* <p>Approx. Time: {clientActivityMonitor.statusInfo.QUEUE.approxTime}</p> */}
        </div>) /* You will need to handle statusInfo separately if needed */ }
       </div>
      </div>
      {/* Bottom Section: Circular Buttons */}
      <div className="h-1/3 flex items-center justify-evenly p-2">
        {/* Button 1 */}
        <button className="rounded-full w-12 h-12 bg-gray-300 flex items-center justify-center border border-black">
          {/* Icon or text for button 1 */}
        </button>
        {/* Button 2 */}
        <button className="rounded-full w-12 h-12 bg-gray-300 flex items-center justify-center border border-black">
          {/* Icon or text for button 2 */}
        </button>
        {/* Button 3 */}
        <button className="rounded-full w-12 h-12 bg-gray-300 flex items-center justify-center border border-black">
          {/* Icon or text for button 3 */}
        </button>
      </div>
    </div>
  );
};

export default selectedMode;