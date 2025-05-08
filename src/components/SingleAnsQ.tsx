import React from 'react';
import { Button } from './ui/button';

interface SingleAnsQProps {
  text: string;
  onYes: () => void;
  onNo: () => void;
  confirmText: string;
  cancelText: string;
}

const SingleAnsQ: React.FC<SingleAnsQProps> = ({
  text,
  onYes,
  onNo,
  confirmText,
  cancelText,
}) => {
  return (
    <div className="border border-black rounded-md p-6 flex flex-col items-center justify-center">
      <p className="mb-4">{text}</p>
      <div className="flex space-x-4">
        <Button onClick={onYes} className="hover:bg-white">{confirmText}</Button>
        <Button variant="outline" onClick={onNo}>{cancelText}</Button>
      </div>
    </div>
  );
};

export default SingleAnsQ;