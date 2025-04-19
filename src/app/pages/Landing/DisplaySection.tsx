const DisplaySection: React.FC = () => {
  return (
    <div className="flex h-full pt-[2rem]">
      <div id="companion_1" className="flex-1 flex items-center justify-center border-white">
        <div className="image-wrapper">
          <img className="max-w-[11rem]" src="/displaySection/sideGuard.png" alt="Display" />
        </div>
      </div>
      <div id="center_stage" className="flex-1 flex items-center justify-center border-white">
        <div className="image-wrapper p-7">
          <img src="/displaySection/male.png" alt="Display" />
        </div>
      </div>
      <div id="companion_2" className="flex-1 flex items-center justify-center border-white">
        <div className="image-wrapper">
        <img className="max-w-[11rem]" src="/displaySection/sideGuard.png" alt="Display" />
        </div>
      </div>
    </div>
  );
};

export default DisplaySection;