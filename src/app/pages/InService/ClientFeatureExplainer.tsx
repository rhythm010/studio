import React from 'react';

interface ClientFeatureExplainerProps {
  title?: string;
  description?: { text?: string; image?: string };
  handleYes?: () => void;
  closeModal?: () => void;
}

const ClientFeatureExplainer: React.FC<ClientFeatureExplainerProps> = ({
  title = 'Instruction Title',
  description = { text: 'Instruction details go here.' },
  handleYes = () => {},
  closeModal = () => {},
}) => {
  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-lg flex flex-col h-[400px] min-h-[350px]">
      {/* Instruction Title Section (30%) */}
      <div className="flex items-center justify-center border border-black w-full mb-3" style={{ flex: '0 0 20%' }}>
        <span className="text-black text-lg font-bold text-center w-full p-4">
          {title}
        </span>
      </div>
      {/* Instruction Description Section (70%) */}
      <div className="flex items-center justify-center w-full mb-3" style={{ flex: '1 1 80%', borderLeft: '1px solid black', borderRight: '1px solid black', borderBottom: '1px solid black' }}>
        <div className="w-full text-center p-4">
          {description.image ? (
            <img src={description.image} alt="Instruction" className="mx-auto max-w-full h-auto" />
          ) : (
            description.text
          )}
        </div>
      </div>
      {/* Go Ahead Button */}
      <div className="w-full">
        <button
          className="w-full bg-black text-white py-3 text-lg font-semibold rounded-b-lg hover:bg-gray-900 focus:outline-none"
          onClick={handleYes}
        >
          Go ahead
        </button>
      </div>
    </div>
  );
};

export default ClientFeatureExplainer;