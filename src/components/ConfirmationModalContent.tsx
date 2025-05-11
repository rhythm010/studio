import React from 'react';
import { useTranslation } from 'react-i18next';

interface ConfirmationModalContentProps {
  text: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModalContent: React.FC<ConfirmationModalContentProps> = ({ text, onConfirm, onCancel }) => {
  const { t } = useTranslation('common');
  return (
    <div className="flex flex-col items-center justify-center p-6">
      <p className="mb-6 text-center text-lg font-bold">{text}</p>
      <div className="flex space-x-4">
        <button
          className="px-6 py-3 bg-gray-800 text-white rounded-lg border border-green-500 hover:bg-gray-700"

 onClick={onConfirm}
        >
          {t('yes')}
        </button>
        <button
          className="px-6 py-3 bg-white text-black rounded-lg border border-gray-300 shadow-md hover:bg-gray-100"
          
 onClick={onCancel}
        >
          No
          {t('no')}
        </button>
      </div>
    </div>
  );
};

export default ConfirmationModalContent;