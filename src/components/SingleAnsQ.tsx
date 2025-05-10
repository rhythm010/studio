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
    <div id="question-container" className="rounded-md p-6 flex flex-col items-center w-full max-w-md m-[1.5rem] shadow-lg">
      <p className="mb-4 text-xl font-bold">{text}</p>
      <div className="flex justify-center w-full space-x-4">
        <Button onClick={onYes} className="flex-1">{confirmText}</Button>
        <Button variant="outline" onClick={onNo} className="flex-1">{cancelText}</Button>
      </div>
    </div>
  );
};

export default SingleAnsQ;