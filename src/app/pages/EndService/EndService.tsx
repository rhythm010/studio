"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import MultipleAnsQ from '../../../components/MultipleAnsQ';
import OpenAnsQ from '../../../components/OpenAnsQ';
import SingleAnsQ from '../../../components/SingleAnsQ';
import StarRating from '../../../components/StarRating';

const EndService: React.FC = () => {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ question: string, answer: any }[]>([]);

  const questions = [
    {
      type: 'MultipleAnsQ',
      question: 'How was the service?',
      options: ['Excellent', 'Good', 'Fair', 'Bad']
    },
    {
      type: 'OpenAnsQ',
      question: 'Do you want to add any additional comment?',
    },

    {
      type: 'SingleAnsQ',
      question: 'Was the guard on time?',
      confirmText: 'Yes',
      cancelText: 'No',
    },
    {
      type: "StarRating",
      question: 'Overall feedback for the service'
    }
  ];

  const handleAnswer = (answer: any) => {
    const currentQuestion = questions[currentQuestionIndex];
    setAnswers([...answers, { question: currentQuestion.question, answer }]);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      console.log('All answers:');
      answers.forEach(item => console.log(`Question: ${item.question}, Answer: ${item.answer}`));
      setTimeout(() => {
        router.push('/login');
      }, 1000); // 1 second delay
    }
  };

  const renderQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex];
    switch (currentQuestion.type) {
      case 'MultipleAnsQ':
        return (
          <MultipleAnsQ
            question={currentQuestion.question}
            options={currentQuestion.options}
            onOptionSelected={(option) => handleAnswer(option)}
          />
        );
      case 'OpenAnsQ':
        return (
          <OpenAnsQ
            question={currentQuestion.question}
            onAnswer={(value) => handleAnswer(value)}
          />
        );
      case 'SingleAnsQ':
        return <SingleAnsQ text={currentQuestion.question} onYes={() => handleAnswer('Yes')} onNo={() => handleAnswer('No')} confirmText={currentQuestion.confirmText} cancelText={currentQuestion.cancelText} />;
      case 'StarRating':
        return <StarRating label={currentQuestion.question} onRatingChange={(rating) => handleAnswer(rating)} />;
    }
  };

  return (
    <div className="flex items-center justify-center h-screen w-screen">
      {renderQuestion()}
    </div>
  );
};
export default EndService;