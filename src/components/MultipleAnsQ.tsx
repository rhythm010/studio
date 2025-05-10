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
    <div id="main-container" className="flex flex-col items-center justify-center min-h-screen p-5 w-[180rem]">
      <p className="mb-4 text-center font-bold text-[1.6rem]">{question}</p>
      <div className="grid grid-cols-2 gap-x-8 gap-y-4 w-full max-w-lg">
        {options?.map((option) => (
          <button
            key={option} // Use a unique key
            className={`rounded-md p-2 flex items-center justify-center text-center whitespace-normal shadow-md ${
 selectedOption === option ? 'bg-gray-400 text-black' : 'bg-white text-black'
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