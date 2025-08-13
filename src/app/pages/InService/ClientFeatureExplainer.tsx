import React, { useState } from 'react';

interface ActiveInstruction {
  instruction?: string;
  status?: string;
}

interface ClientFeatureExplainerProps {
  title?: string;
  description?: { text?: string; image?: string };
  handleYes?: () => void;
  closeModal?: () => void;
  handleCancel?: () => void;
  instruction?: string;
  activeInstruction?: ActiveInstruction;
  currentStatus?: string;
}

const ClientFeatureExplainer: React.FC<ClientFeatureExplainerProps> = ({
  title = 'Instruction Title',
  description = { text: 'Instruction details go here.' },
  handleYes = () => {},
  closeModal = () => {},
  handleCancel = () => {},
  instruction = '',
  activeInstruction = { instruction: '', status: '' },
}) => {
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  const isCurrentInstructionActive = instruction === activeInstruction.instruction;
  const hasActiveInstruction = activeInstruction.instruction && activeInstruction.status;
  
  const handleCancelClick = () => {
    setShowCancelConfirmation(true);
  };

  const handleCancelConfirm = () => {
    handleCancel();
    setShowCancelConfirmation(false);
  };

  const handleCancelDeny = () => {
    setShowCancelConfirmation(false);
  };
  
  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-lg flex flex-col h-full max-h-[420px]">
      {isCurrentInstructionActive ? (
        // Cancel Instruction Flow
        <>
          {/* Cancel Instruction Title */}
          <div className="flex items-center justify-center w-full flex-shrink-0" style={{ minHeight: '50px' }}>
            <span className="text-black text-xl font-bold text-center w-full px-2">
              {showCancelConfirmation ? 'Confirm Cancellation' : `Cancel ${title}`}
            </span>
          </div>
          {/* Cancel Instruction Description */}
          <div className="flex items-start justify-center w-full flex-1 overflow-hidden">
            <div className="w-full text-center p-2 text-base">
              {showCancelConfirmation ? (
                <p className="font-light">Are you absolutely sure you want to cancel this instruction?</p>
              ) : (
                <p className="font-light">Are you sure you want to cancel this instruction?</p>
              )}
            </div>
          </div>
          {/* Cancel Buttons */}
          <div className="w-full flex-shrink-0 p-2 pt-0">
            {showCancelConfirmation ? (
              <div className="flex gap-2">
                <button
                  className="flex-1 bg-red-500 text-white py-2 text-base font-semibold rounded-lg hover:bg-red-600 focus:outline-none"
                  onClick={handleCancelConfirm}
                >
                  Yes, Cancel
                </button>
                <button
                  className="flex-1 bg-gray-500 text-white py-2 text-base font-semibold rounded-lg hover:bg-gray-600 focus:outline-none"
                  onClick={handleCancelDeny}
                >
                  No, Keep
                </button>
              </div>
            ) : (
              <button
                className="w-full bg-red-500 text-white py-2 text-base font-semibold rounded-lg hover:bg-red-600 focus:outline-none"
                onClick={handleCancelClick}
              >
                Cancel instruction
              </button>
            )}
          </div>
        </>
      ) : hasActiveInstruction ? (
        // Existing Active Instruction Flow
        <>
          {/* Existing Active Instruction Title */}
          <div className="flex items-center justify-center w-full flex-shrink-0" style={{ minHeight: '50px' }}>
            <span className="text-black text-xl font-bold text-center w-full px-2">
              Instruction in Progress
            </span>
          </div>
          {/* Existing Active Instruction Description */}
          <div className="flex items-start justify-center w-full flex-1 overflow-hidden">
            <div className="w-full text-center p-2 text-base">
              <p className="font-light">
                There is already an active instruction: <strong>{activeInstruction.instruction}</strong>
              </p>
              <p className="font-light mt-2">
                Please wait for the current instruction to complete before sending a new one.
              </p>
            </div>
          </div>
          {/* Close Button */}
          <div className="w-full flex-shrink-0 p-2 pt-0">
            <button
              className="w-full bg-gray-500 text-white py-2 text-base font-semibold rounded-lg hover:bg-gray-600 focus:outline-none"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </>
      ) : (
        // Normal Instruction Flow
        <>
          {/* Normal Instruction Title */}
          <div className="flex items-center justify-center w-full flex-shrink-0" style={{ minHeight: '50px' }}>
            <span className="text-black text-xl font-bold text-center w-full px-2">
              {title}
            </span>
          </div>
          {/* Normal Instruction Description */}
          <div className="flex items-center justify-center w-full flex-1 overflow-hidden p-2">
            <div className="w-full h-full flex items-center justify-center">
              {description.image ? (
                <img 
                  src={description.image} 
                  alt="Instruction" 
                  className="w-full h-full object-contain rounded-xl" 
                  style={{ 
                    maxHeight: '280px',
                    maxWidth: '100%',
                    borderRadius: '12px'
                  }}
                />
              ) : (
                <p className="font-light text-base text-center">{description.text}</p>
              )}
            </div>
          </div>
          {/* Send Button */}
          <div className="w-full flex-shrink-0 p-2 pt-0">
            <button
              className="w-full bg-black text-white py-2 text-base font-semibold rounded-lg hover:bg-gray-900 focus:outline-none"
              onClick={handleYes}
            >
              Send instruction
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ClientFeatureExplainer;