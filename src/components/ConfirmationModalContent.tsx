import React from 'react';

interface ConfirmationModalContentProps {
  text: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModalContent: React.FC<ConfirmationModalContentProps> = ({ text, onConfirm, onCancel }) => {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <p className="mb-4 text-center">{text}</p>
      <div className="flex space-x-4">
        <button
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          
 onClick={onConfirm}
        >
          Yes
        </button>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          
 onClick={onCancel}
        >
          No
        </button>
      </div>
    </div>
  );
};

export default ConfirmationModalContent;