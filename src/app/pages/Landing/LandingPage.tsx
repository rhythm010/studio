"use client";

import React, { useState } from 'react';
import DisplaySection from './DisplaySection';
import SelectionSection from './SelectionSection';

const LandingPage: React.FC = () => {
  const [selectedGender, setSelectedGender] = useState<string | null>('male');
  const [selectedOption, setSelectedOption] = useState<string | null>('option_1');

  const handleGenderChange = (gender: string | null) => {
    setSelectedGender(gender);
  };

  const handleOptionChange = (option: string | null) => {
    setSelectedOption(option);
  };


  return (
    <div className="bg-gray-900 min-h-screen flex flex-col pt-[4rem] pb-[3rem]">
      <div id="display_container" className="flex-1">
        <DisplaySection selectedGender={selectedGender} selectedOption={selectedOption} />
     </div>
      <div id="selection_container" className="flex-1 flex flex-col-reverse">
        {/* Assuming SelectionSection handles both gender and option changes and passes them */}
        <SelectionSection onGenderChange={handleGenderChange} onOptionChange={handleOptionChange} />
      </div>
    </div>
  );
};

export default LandingPage;