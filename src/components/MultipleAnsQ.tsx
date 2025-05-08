import React, { useState } from 'react';

interface MultipleAnsQProps {
  question: string;
  options?: string[];
  onOptionSelected: (option: string) => void;
}

const MultipleAnsQ: React.FC<MultipleAnsQProps> = ({
  question,
  options,
  onOptionSelected,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleOptionClick = (option: string) => {
    if (selectedOption === option) {
      setSelectedOption(null);
      onOptionSelected("");
    } else {
      setSelectedOption(option);
      onOptionSelected(option);
    }
  };

  return (
    <div className="border border-black rounded-md p-6 flex flex-col items-center">
      <p className="mb-4 text-center">{question}</p>
      <div className="grid grid-cols-2 gap-4">
        {options?.map((option) => (
          <button
            key={option}
            className={`border border-black rounded-md p-2 ${
              selectedOption === option ? 'bg-gray-300 text-black' : 'bg-white text-black'
            }`}
            onClick={() => handleOptionClick(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MultipleAnsQ;