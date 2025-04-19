interface DisplaySectionProps {
  selectedGender: string | null;
}

const DisplaySection: React.FC<DisplaySectionProps> = ({ selectedGender = 'male' }) => {
  const isCompanion1Hidden = selectedGender === 'male';
  return (
    <div className="flex h-full pt-[2rem]">
      <div id="companion_1" className={`flex-1 flex items-center justify-center border-white`}>
        <div className="image-wrapper">
          <img className="max-w-[11rem]" src="/displaySection/sideGuard.png" alt="Companion 1" />
        </div>
      </div>
      <div id="center_stage" className="border-white">
        <div className="image-wrapper p-7">
          <img id="client_img" className="absolute w-[11rem] left-[7.5rem] top-[12rem]" src={`/displaySection/${selectedGender === 'female' ? 'female' : 'male'}.png`} alt="Display" />
        </div>
      </div>
      <div id="companion_2" className="flex-1 flex items-center justify-center border-white">
        <div className="image-wrapper">
        <img className="max-w-[11rem]" src="/displaySection/sideGuard.png" alt="Companion 2" />
        </div>
      </div>
    </div>
  );
};

export default DisplaySection;