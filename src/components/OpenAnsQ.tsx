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
    onAnswer(text);
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const words = event.target.value.split(/\s+/).filter(word => word !== '');
    if (words.length <= 100) {
      setText(event.target.value);
    }
  };

  return (
    <div className="border border-black rounded-md p-6 flex flex-col w-full">
      <p className="mb-4">{question}</p>
      <textarea
        ref={textareaRef}
        className="border border-black rounded-md p-2 resize-none overflow-hidden w-full"
        placeholder="Enter your answer here..."
        value={text}
        onChange={handleChange}
        rows={1}
      />
      <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded" onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default OpenAnsQ;