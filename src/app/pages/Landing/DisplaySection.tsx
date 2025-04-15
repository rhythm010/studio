const DisplaySection: React.FC = () => {
  return (
    <div className="flex h-full">
      <div className="flex-1 flex items-center justify-center border border-white ">
        Section 1
      </div>
      <div className="flex-1 flex items-center justify-center border border-white">
        Section 2
      </div>
      <div className="flex-1 flex items-center justify-center border border-white">
        Section 3
      </div>
    </div>
  );
};

export default DisplaySection;