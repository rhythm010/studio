"use client"

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface SelectionSectionProps {
  onGenderChange: (gender: string) => void;
}


const SelectionSection: React.FC<SelectionSectionProps> = ({ onGenderChange }) => {
  const [selectedGender, setSelectedGender] = useState<string | null>('male');
  const [activeOption, setActiveOption] = useState<string | null>(null);
  const { t } = useTranslation('common');

  const handleGenderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const gender = event.target.value
    console.log('gender selected', gender);
    setSelectedGender(gender)
    onGenderChange(gender);
  };

  const handleTierClick = (tierId: string) => {
    console.log('tier clicked', tierId);
    setActiveOption(tierId);
  };

  return (<>
    <div className="w-full rounded-xl pr-3 pl-3">
      <button className="w-full bg-white text-center border border-gray-200 p-2 px-3 rounded-[0.5rem]">
        {t('submit')}
      </button>


    </div>
    <div id="selection_container" className="rounded-xl w-full p-3">

      <div id="gender_radio" className="bg-white flex justify-between items-center w-full border-r-4 rounded-t-[10px] p-4">
        <div className='w-1/2'>

          <label className="inline-flex items-center w-full justify-center ">
            <input type="radio" className="form-radio" name="gender" value="male" checked={selectedGender === 'male'} onChange={handleGenderChange} />            
            <span id="gender_male" className="ml-2">{t('male')}</span>
          </label>
        </div>
        <div className="bg-gray-300 w-[1px] h-8">
          </div>
        <div className='w-1/2'>

          <label className="inline-flex items-center w-full justify-center">            
            <input type="radio" className="form-radio" name="gender" value="female" onChange={handleGenderChange} />

            <span id="gender_female" className="ml-2">{t('female')}</span>
          </label>
        </div>        
      </div>

      <div id="tier_options_container" className='bg-white justify-normal flex-col w-full items-center rounded-b-[10px]'>
        {/* section - 1 */}
        <div
          id="option_1"
          className={`flex justify-between items-start border-b-gray-200 pt-4 pb-4 pr-2 pl-3 ${activeOption === 'option_1' ? 'bg-gray-900 text-white' : ''}`}
          onClick={() => handleTierClick('option_1')}
        >
          <div>
            <div id="selection_first_tier" className="text-xl font-bold">{t('first_tier_title')}</div>
            <div id="first_tier_description" className="font-thin text-xs">{t('first_tier_description')}</div>
          </div>
          <div id="price_first_tier" className="font-bold">{t('first_tier_price')}د.إ</div>
        </div>

        {/* section - 2 */}
        <div
          id="option_2"
          className={`flex justify-between items-start pt-4 pb-4 pr-2 pl-3 ${activeOption === 'option_2' ? 'bg-gray-900 text-white rounded-b-[10px]' : ''}`}
          onClick={() => handleTierClick('option_2')}
        >
          <div>
            <div id="selection_second_tier" className="text-xl font-bold">{t('second_tier_title')}</div>
            <div id="second_tier_description" className="font-light text-xs">{t('second_tier_description')}</div>
          </div>
          <div id="price_second_tier" className="font-bold">{t('second_tier_price')}د.إ</div>
        </div>

      </div>
    </div>

  </>


  );
};

export default SelectionSection;