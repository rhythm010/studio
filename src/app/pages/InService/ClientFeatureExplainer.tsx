import React from 'react';

interface ClientFeatureExplainerProps {
  title?: string;
  description?: { text?: string; image?: string };
  handleYes?: () => void;
  closeModal?: () => void;
  isActive?: boolean;
}

const ClientFeatureExplainer: React.FC<ClientFeatureExplainerProps> = ({
  title = 'Instruction Title',
  description = { text: 'Instruction details go here.' },
  handleYes = () => {},
  closeModal = () => {},
  isActive = false,
}) => {
  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-lg flex flex-col h-[400px] min-h-[350px]">
      {/* Instruction Title Section */}
      <div className="flex items-center justify-center w-full" style={{ flex: '0 0 25%' }}>
        <span className="text-black text-2xl font-bold text-center w-full p-4">
          {title}
        </span>
      </div>
      {/* Instruction Description Section */}
      <div className="flex items-start justify-center w-full" style={{ flex: '1 1 75%'}}>
        <div className="w-full text-center p-4 text-lg">
          {description.image ? (
            <img src={description.image} alt="Instruction" className="mx-auto max-w-full h-auto" />
          ) : (
            <p className="font-light">{description.text}</p>
          )}
        </div>
      </div>
      {/* Go Ahead Button - Only show if not active */}
      {!isActive && (
        <div className="w-full">
          <button
            className="w-full bg-black text-white py-3 text-lg font-semibold rounded-lg hover:bg-gray-900 focus:outline-none"
            onClick={handleYes}
          >
            Send instruction
          </button>
        </div>
      )}
    </div>
  );
};

export default ClientFeatureExplainer;