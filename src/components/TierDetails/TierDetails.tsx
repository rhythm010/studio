import React from "react";
import { Check } from "lucide-react";

interface TierDetailsProps {
  title?: string;
  onClose?: () => void;
}

const TierDetails: React.FC<TierDetailsProps> = ({ title, onClose }) => {
  return (
    <div className="flex flex-col h-full">
      <div className="shadow-lg flex flex-col items-center w-full">
        <h3 className="text-lg font-semibold text-center">{title}</h3>
        <p className="mt-4 text-center">Please confirm your selection</p>
      </div>

      <footer className="shadow-top h-16 mt-auto w-full">
        <button
          className="w-full h-full bg-blue-500 text-white rounded"
          onClick={onClose}
        >
          <Check className="h-4 w-4 m-auto"/>
        </button>
      </footer>
    </div>
  );
};

export default TierDetails;