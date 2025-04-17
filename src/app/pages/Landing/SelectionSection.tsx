"use client"

import React, { useState } from 'react';

interface SelectionSectionProps {
  title?: string;
  options?: string[];
}

const SelectionSection: React.FC<SelectionSectionProps> = () => {
  const [activeOption, setActiveOption] = useState<string | null>(null);
  return (
    <div id="selection_container" className="rounded-xl w-full p-3">
      <div id="gender_radio" className="bg-white flex justify-between items-center w-full border-r-4 rounded-t-[10px] p-4">
        <div className='w-1/2'>
          <label className="inline-flex items-center w-full justify-center ">
            <input type="radio" className="form-radio" name="options" value="option1" />
            <span className="ml-2">Male</span>
          </label>
        </div>
        <div className="bg-gray-300 w-[1px] h-8">
          </div>
        <div className='w-1/2'>
          <label className="inline-flex items-center w-full justify-center">
            <input type="radio" className="form-radio" name="options" value="option2" />
            <span className="ml-2">Female</span>
          </label>
        </div>
        </div>
        
        <div className='bg-white justify-normal flex-col w-full items-center rounded-b-[10px]'>
          {/* section - 1 */}
          <div
            id="option_1"
            className={`flex justify-between items-start p-1 border border-b-gray-200 ${activeOption === 'option_1' ? 'bg-gray-100' : ''}`}
            onClick={() => setActiveOption('option_1')}
          >
            <div>
              <div className="text-xl font-bold">header</div>
              <div className="font-light">description</div>
            </div>
            <div className="font-bold">د.إ</div>
          </div>

          {/* section - 2 */}
          <div
            id="option_2"
            className={`flex justify-between items-start p-1 ${activeOption === 'option_2' ? 'bg-gray-100 rounded-b-[10px]' : ''}`}
            onClick={() => setActiveOption('option_2')}
          >
            <div>
              <div className="text-xl font-bold">header</div>
              <div className="font-light">description</div>
            </div>
            <div className="font-bold">
              د.إ 
            </div>
          </div>
        </div>
      </div>
  );
};

export default SelectionSection;