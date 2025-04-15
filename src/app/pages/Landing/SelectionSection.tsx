import React from 'react';

interface SelectionSectionProps {
  title?: string;
  options?: string[];
}

const SelectionSection: React.FC<SelectionSectionProps> = () => {
  return (
    <div>
      <h2>{'title'}</h2>
      
    </div>
  );
};

export default SelectionSection;