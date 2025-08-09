import React from 'react';

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
  const isCurrentInstructionActive = instruction === activeInstruction.instruction;
  
  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-lg flex flex-col h-[400px] min-h-[350px]">
      {isCurrentInstructionActive ? (
        // Cancel Instruction Flow
        <>
          {/* Cancel Instruction Title */}
          <div className="flex items-center justify-center w-full" style={{ flex: '0 0 25%' }}>
            <span className="text-black text-2xl font-bold text-center w-full p-4">
              Cancel {title}
            </span>
          </div>
          {/* Cancel Instruction Description */}
          <div className="flex items-start justify-center w-full" style={{ flex: '1 1 75%'}}>
            <div className="w-full text-center p-4 text-lg">
              <p className="font-light">Are you sure you want to cancel this instruction?</p>
            </div>
          </div>
          {/* Cancel Button */}
          <div className="w-full">
            <button
              className="w-full bg-red-500 text-white py-3 text-lg font-semibold rounded-lg hover:bg-red-600 focus:outline-none"
              onClick={handleCancel}
            >
              Cancel instruction
            </button>
          </div>
        </>
      ) : (
        // Normal Instruction Flow
        <>
          {/* Normal Instruction Title */}
          <div className="flex items-center justify-center w-full" style={{ flex: '0 0 25%' }}>
            <span className="text-black text-2xl font-bold text-center w-full p-4">
              {title}
            </span>
          </div>
          {/* Normal Instruction Description */}
          <div className="flex items-start justify-center w-full" style={{ flex: '1 1 75%'}}>
            <div className="w-full text-center p-4 text-lg">
              {description.image ? (
                <img src={description.image} alt="Instruction" className="mx-auto max-w-full h-auto" />
              ) : (
                <p className="font-light">{description.text}</p>
              )}
            </div>
          </div>
          {/* Send Button */}
          <div className="w-full">
            <button
              className="w-full bg-black text-white py-3 text-lg font-semibold rounded-lg hover:bg-gray-900 focus:outline-none"
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