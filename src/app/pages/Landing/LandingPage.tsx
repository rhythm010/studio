import React from 'react';
import DisplaySection from './DisplaySection';
import SelectionSection from './SelectionSection';

const LandingPage: React.FC = () => {
  return (
    <div className="bg-gray-900 min-h-screen flex flex-col pt-[4rem] pb-[3rem]">
      <div id="display_container" className="flex-1">
        <DisplaySection />
      </div>
      <div id="selection_container" className="flex-1 flex flex-col-reverse">
        <SelectionSection />
      </div>
    </div>
  );
};

export default LandingPage;