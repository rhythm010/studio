import React, { useState } from 'react';
import DisplaySection from './DisplaySection';
import SelectionSection from './SelectionSection';

const LandingPage: React.FC = () => {
  const [selectedGender, setSelectedGender] = useState<string | null>(null);

  const handleGenderChange = (gender: string | null) => {
    setSelectedGender(gender);
  };

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col pt-[4rem] pb-[3rem]">
      <div id="display_container" className="flex-1">
        <DisplaySection selectedGender={selectedGender} />
      </div>
      <div id="selection_container" className="flex-1 flex flex-col-reverse">
        <SelectionSection  onGenderChange={handleGenderChange}/>
      </div>
    </div>
  );
};

export default LandingPage;