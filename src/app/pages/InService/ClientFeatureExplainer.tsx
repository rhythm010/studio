import React, { useState } from 'react';

interface ActiveInstruction {
  instruction?: string;
  status?: string;
}

interface ClientFeatureExplainerProps {
  title?: string;
  description?: { text?: string; image?: string };
  sendBtnText?: string;
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
  sendBtnText = 'Send instruction',
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
          {/* Normal Instruction Description */}
          <div className="flex flex-col items-center justify-center w-full flex-1 overflow-hidden p-2">
            {description.text && (
              <div className="w-full text-center mb-4 -mt-2">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <p className="font-bold text-md text-gray-700">{description.text}</p>
                </div>
              </div>
            )}
            {description.image && (
              <div className="w-full flex items-center justify-center flex-1">
                <img 
                  src={description.image} 
                  alt="Instruction" 
                  className="w-full object-contain rounded-xl" 
                  style={{ 
                    maxHeight: '280px',
                    maxWidth: '100%',
                    borderRadius: '12px'
                  }}
                />
              </div>
            )}
          </div>
          {/* Send Button */}
          <div className="w-full flex-shrink-0 p-2 pt-0">
            <button
              className="w-full bg-black text-white py-2 text-base font-semibold rounded-lg hover:bg-gray-900 focus:outline-none"
              onClick={handleYes}
            >
              {sendBtnText}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ClientFeatureExplainer;