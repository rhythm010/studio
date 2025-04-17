import React from 'react';
import DisplaySection from './DisplaySection';
import SelectionSection from './SelectionSection';

const LandingPage: React.FC = () => {
  return (
    <div className="bg-gray-900 min-h-screen flex flex-col">
      <div id="display_container" className="flex-1">
        <DisplaySection />
      </div>
      <div id="selection_container" className="flex-1">
        <SelectionSection />
      </div>
    </div>
  );
};

export default LandingPage;