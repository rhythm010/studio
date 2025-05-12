"use client";

import { useEffect, useState } from 'react';

interface DisplaySectionProps {
  selectedGender: string | null;
 selectedOption: string | null;
}

const DisplaySection: React.FC<DisplaySectionProps> = ({ selectedGender, selectedOption }) => {
  const [activeOption, setActiveOption] = useState<string | null>(null);
  const [currentGender, setCurrentGender] = useState<string>(selectedGender || 'male');
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [shouldBeVisible, setShouldBeVisible] = useState(true);

  useEffect(() => {
    if (selectedGender && selectedGender !== currentGender) {
      setIsFadingOut(true); // Start fading out

      setTimeout(() => {
        setCurrentGender(selectedGender); // Update currentGender
        setIsFadingOut(false); // Start fading in
        setShouldBeVisible(true)
      }, 500);
    }
  }, [selectedGender]);

  useEffect(() => {
    if (selectedOption) {
      setActiveOption(selectedOption);
    }
  }, [selectedOption]);

  useEffect(() => {
    if(isFadingOut){
      setShouldBeVisible(false)
    }
    else {
      setTimeout(()=>{
        setShouldBeVisible(true)
      },50)
      
    }
  },[isFadingOut])


  const isCompanion1Hidden = currentGender === 'male';

  console.log('selected option');
  console.log(selectedOption);

  return (
    <div className="relative h-full pt-[2rem]">
          <div id="companion_1" className={`flex items-center justify-center absolute ${ selectedOption === 'option_2' ? 'left-[calc(0rem-1rem)]': 'left-0'} top-[8rem] h-full`}>
              <div className="image-wrapper">
                  <img className="max-w-[11rem]" src="/displaySection/sideGuard_white_shirt.png" alt="Companion 1" />
              </div>
          </div>
          {/* Extra companion - left */}
         {selectedOption === 'option_2' && <div id="companion_1_extra" className={`flex items-center justify-center absolute left-[2rem] top-[calc(8rem+2rem)] h-full`}>
              <div className="image-wrapper">
                  <img className="max-w-[11rem]" src="/displaySection/sideGuard_white_shirt.png" alt="Companion 1" />
              </div>
          </div>}
          <div id="center_stage" className="border-white w-full h-full">
              <div className="image-wrapper p-7">
                  <img id="client_img" 
                  className={`absolute w-[11rem] left-1/2 top-[8rem] -translate-x-1/2 transition-opacity duration-500 ${isFadingOut ? 'opacity-0' : (shouldBeVisible ? 'opacity-100' : 'opacity-0')}`} src={`/displaySection/${currentGender}.png`} alt="Display" />
              </div>
          </div>
          <div id="companion_2" className={`flex items-center justify-center absolute ${ selectedOption === 'option_2' ? 'right-[calc(0rem-1rem)]': 'right-0'} top-[8rem] h-full`}>
              <div className="image-wrapper">
                  <img className="max-w-[11rem]" src="/displaySection/sideGuard_white_shirt.png" alt="Companion 2" />
              </div>
          </div>
          {/* Extra companion - right */}
          {selectedOption === 'option_2' && <div id="companion_2_etra" className="flex items-center justify-center absolute right-[2rem] top-[calc(8rem+2rem)] h-full">
              <div className="image-wrapper">
                  <img className="max-w-[11rem]" src="/displaySection/sideGuard_white_shirt.png" alt="Companion 2" />
              </div>
          </div>}
      </div>

  );
};

export default DisplaySection;