const DisplaySection: React.FC = () => {
  return (
    <div className="flex h-full">
      <div className="flex-1 flex items-center justify-center border-white">
        <div className="image-wrapper p-7">
          <img src="/displaySection/sideGuard.png" alt="Display" />
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center border-white">
        <div className="image-wrapper p-7">
          <img src="/displaySection/male.png" alt="Display" />
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center border-white">
        <div className="image-wrapper p-7">
        <img src="/displaySection/sideGuard.png" alt="Display" />
        </div>
      </div>
    </div>
  );
};

export default DisplaySection;