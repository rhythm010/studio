import React from 'react';
import { useTranslation } from 'react-i18next';

interface ConfirmationModalContentProps {
  text: string;
  title?: string;
  onConfirm: () => void;
  onCancel: () => void;
  yesText?: string;
  noText?: string;
}

const ConfirmationModalContent: React.FC<ConfirmationModalContentProps> = ({ text, title, onConfirm, onCancel, yesText, noText }) => {
  const { t } = useTranslation('common');
  return (
    <div className="flex flex-col items-center justify-center p-6">
      {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}
      <p className="mb-6 text-center text-lg">{text}</p>
      <div className="flex space-x-4">
        {(yesText !== '') && (
          <button
            className="px-6 py-3 bg-gray-800 text-white rounded-lg border border-green-500 hover:bg-gray-700"
            onClick={onConfirm}
          >
            {yesText || t('yes')}
          </button>
        )}
        <button
          className="px-6 py-3 bg-white text-black rounded-lg border border-gray-300 shadow-md hover:bg-gray-100"
          onClick={onCancel}
        >
          {noText || t('no')}
        </button>
      </div>
    </div>
  );
};

export default ConfirmationModalContent;