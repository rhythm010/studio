"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import MultipleAnsQ from '../../../components/MultipleAnsQ';
import OpenAnsQ from '../../../components/OpenAnsQ';
import SingleAnsQ from '../../../components/SingleAnsQ';
import StarRating from '../../../components/StarRating';
import { useCompanionStore } from '../../../store/store';


const EndService: React.FC = () => {
  const router = useRouter();
  const addFeedback = useCompanionStore((state) => state.addFeedback);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ question: string, answer: any }[]>([]); // Keep local state for now for logging
  const questions = [
    {
      qId: '1',
      type: 'MultipleAnsQ',
      question: 'How was the service?',
      options: ['Excellent', 'Good', 'Fair', 'Bad']
    },
    {
      qId: '2',
      type: 'OpenAnsQ',
      question: 'Do you want to add any additional comment?',
    },

    {
      qId: '3',
      type: 'SingleAnsQ',
      question: 'Was the guard on time?',
      confirmText: 'Yes',
      cancelText: 'No',
    },
    {
      qId: '4',
      type: "StarRating",
      question: 'Overall feedback for the service'
    }
  ];

  const handleAnswer = (response: any) => {
    const currentQuestion = questions[currentQuestionIndex];

    // Create FeedbackDetails object and add to store
    const feedbackDetails = {
      question: currentQuestion.question,
      response: response,
    };
    addFeedback(feedbackDetails);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      console.log('All questions answered. Feedback stored in the store.');
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