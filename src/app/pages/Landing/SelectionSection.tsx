"use client";

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useModal } from '@/components/ui/Modal';
import MatchingPage from '../Matching/MatchingPage';
import { useRouter } from 'next/navigation';
import { useCompanionStore } from '@/store/store';

interface SelectionSectionProps {
  onGenderChange: (gender: string) => void;
  onOptionChange: (option: string | null) => void;
}

interface TierOption {
    id: string;
  title: string;
}

const SelectionSection: React.FC<SelectionSectionProps> = ({ onGenderChange, onOptionChange }) => {
  const [selectedGender, setSelectedGender] = useState<string | null>('male');
  const [activeOption, setActiveOption] = useState<string | null>(null);
    const { openModal, closeModal } = useModal();
  const { t } = useTranslation('common');
  const { setServiceSelection } = useCompanionStore();
  const router = useRouter();
    
  const handleGenderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const gender = event.target.value
    console.log('gender selected', gender);
    setSelectedGender(gender)
    onGenderChange(gender);
  };

  const handleTierClick = (tier: TierOption | string) => {
    if (typeof tier === 'string') {
      // Handle the case where only string is passed
      console.log('tier clicked', tier);
      setActiveOption(tier);
      onOptionChange(tier);
    } else {
      // Handle the case where a TierOption object is passed
      console.log('tier clicked', tier.id);
      setActiveOption(tier.id);
      onOptionChange(tier.id);
    }};

    const submitClickHandler = () =>{ 
 setServiceSelection({gender: selectedGender ?? '', package: activeOption === 'option_1' ? 'silver' : 'gold'})
 openModal(<MatchingPage />); // Open the modal
        setTimeout(() => {
            closeModal();
            router.push("/in-service");
        }, 3000);
    }

  return (
    <>
    <div className="w-full rounded-xl pr-3 pl-3">
      <button className="w-full bg-white text-center border border-gray-200 p-2 px-3 rounded-[0.5rem]"
        onClick={submitClickHandler}
      >
        {t('submit')}
      </button>

    </div>
    <div id="selection_container" className="rounded-xl w-full p-3">

    {/* Gender Selection  */}
      <div id="gender_radio" className="bg-white flex justify-between items-center w-full border-r-4 rounded-t-[10px] p-4">
        <div className='w-1/2'>
          
          <label className="inline-flex items-center w-full justify-center">
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

    {/* Tier Selection  */}
      <div id="tier_options_container" className='bg-white justify-normal flex-col w-full items-center rounded-b-[10px]'>
        {/* section - 1 */}
        <div
            id="option_1"
            className={`flex justify-between items-start border-b-gray-200 pt-4 pb-4 pr-2 pl-3 cursor-pointer ${
                activeOption === 'option_1' ? 'bg-gray-900 text-white' : ''
            }`}
            onClick={() => handleTierClick({ id: 'option_1', title: t('first_tier_title')})}
        >
          <div >
              <div id="selection_first_tier" className="text-xl font-bold">{t('first_tier_title')}</div>
              <div id="first_tier_description" className="font-thin text-xs">{t('first_tier_description')}</div>
            </div>
          <div id="price_first_tier" className="font-bold">{t('first_tier_price')}د.إ</div>
        </div>

          {/* section - 2 */}
        <div
          id="option_2"
          className={`flex justify-between items-start pt-4 pb-4 pr-2 pl-3 ${
            activeOption === 'option_2' ? 'bg-gray-900 text-white' : ''
            }`}
          onClick={() => handleTierClick({ id: 'option_2', title: t('second_tier_title')})}
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