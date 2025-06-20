"use client";
import React, { useState } from 'react';
import SingleAnsQ from '@/components/SingleAnsQ';
import MultipleAnsQ from '@/components/MultipleAnsQ';
import OpenAnsQ from '@/components/OpenAnsQ';
import StarRating from '@/components/StarRating';
import { useCompanionStore } from '@/store/store';
import { useRouter } from 'next/navigation';

const GuardFeedback: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const { addFeedback } = useCompanionStore();
  const router = useRouter();

  // New function to handle rating completion
  const handleRatingComplete = (rating: number, details: string) => {
    console.log('Rating complete:', { rating, details });
    // You can add the feedback to the store here if needed
    // addFeedback({ recommendationRating: rating, recommendationDetails: details });
    router.push('/guard-info-form'); // Navigate to the specified route
  };
  const questions = [
    {
      type: 'rating',
      text: 'How likely are you to recommend this service to a friend?',
      key: 'recommendationRating',
    },
  ];

  const handleAnswer = (questionKey: string, answer: any) => {
    const newAnswers = {
      ...answers,
      [questionKey]: answer,
    };
    setAnswers(newAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // All questions answered, process feedback and navigate
      console.log('Guard Feedback Answers:', newAnswers);
      addFeedback(newAnswers);
      router.push('/login'); // Navigate to the login page or wherever appropriate
    }
  };

  const renderQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex];
    switch (currentQuestion.type) {
      case 'single':
        return (
          <SingleAnsQ
            question={currentQuestion.text}
            options={currentQuestion.options || []}
            onAnswer={(answer) => handleAnswer(currentQuestion.key, answer)}
          />
        );
      case 'multiple':
        return (
          <MultipleAnsQ
            question={currentQuestion.text}
            options={currentQuestion.options || []}
            onAnswer={(answer) => handleAnswer(currentQuestion.key, answer)}
          />
        );
      case 'open':
        return (
          <OpenAnsQ
            question={currentQuestion.text}
            onAnswer={(answer) => handleAnswer(currentQuestion.key, answer)}
          />
        );
      case 'rating':
        return (
          <StarRating
            question={currentQuestion.text}
            onRatingChange={({ rating, details }) => handleRatingComplete(rating, details)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Guard Feedback</h1>
      <div className="w-full max-w-md">
        {renderQuestion()}
      </div>
    </div>
  );
};

export default GuardFeedback;