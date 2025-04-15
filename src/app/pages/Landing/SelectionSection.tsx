import React from 'react';

interface SelectionSectionProps {
  title?: string;
  options?: string[];
}

const SelectionSection: React.FC<SelectionSectionProps> = () => {
  return (
    <div className="bg-white rounded-lg w-full">
      <div className="flex justify-between items-center w-full">
        <div className='w-1/2'>
          <label className="inline-flex items-center w-full justify-center">
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

    </div>
  );
};

export default SelectionSection;