import React from 'react';

interface TierDetailsProps {
  title: string
  onClose: () => void;
}

const TierDetails: React.FC<TierDetailsProps> = ({ title, onClose }) => {
  return (
    <div className='flex flex-col items-center'>
      <h3 className="text-lg font-semibold text-center">{title}</h3>
      <p className="mt-4 text-center">Please confirm your selection</p>
       <button className="mt-6 px-4 py-2 bg-blue-500 text-white rounded" onClick={onClose}>
        Okay
      </button>
    </div>
  );
};

export default TierDetails;