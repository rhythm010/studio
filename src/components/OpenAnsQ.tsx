import React, { useState, useRef, useEffect } from 'react';

interface OpenAnsQProps {
  question: string;
  onAnswer: (answer: string) => void;
}

const OpenAnsQ: React.FC<OpenAnsQProps> = ({ question, onAnswer }) => {
  const [text, setText] = useState<string>('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [text]);

  const handleSubmit = () => {
    if (text.trim() !== '') onAnswer(text);
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const words = event.target.value.split(/\s+/).filter(word => word !== '');
    if (words.length <= 100) {
      setText(event.target.value);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <div className="rounded-md p-6 flex flex-col items-center w-full max-w-md shadow-md">
        <p className="mb-4 text-center font-bold text-lg">{question}</p>
        <textarea
          ref={textareaRef}
          className="border rounded-md p-2 resize-none overflow-hidden w-full min-h-[100px]"
          placeholder="Share your thoughts..."
          value={text}
          onChange={handleChange}
          rows={1}
        />
        <button className="mt-4 px-4 py-2 bg-gray-800 text-white rounded w-full" onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default OpenAnsQ;