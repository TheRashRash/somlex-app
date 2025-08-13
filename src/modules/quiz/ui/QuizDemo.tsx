import React from 'react';
import { QuizScreenEnhanced } from './QuizScreenEnhanced';
import { Word } from '../../vocabulary/data/types';

// Sample vocabulary for demo
const demoVocabulary: Word[] = [
  { id: '1', categoryId: 'greetings', wordSo: 'Salaan', wordEn: 'Hello', partOfSpeech: 'noun', phonetic: 'sa-la-an', difficulty: 'beginner', examples: [{ so: 'Salaan wanaagsan', en: 'Good greeting' }] },
  { id: '2', categoryId: 'greetings', wordSo: 'Nabadgelyo', wordEn: 'Goodbye', partOfSpeech: 'noun', phonetic: 'na-bad-gel-yo', difficulty: 'beginner', examples: [{ so: 'Nabadgelyo walaalo', en: 'Goodbye brothers' }] },
  { id: '3', categoryId: 'family', wordSo: 'Hooyo', wordEn: 'Mother', partOfSpeech: 'noun', phonetic: 'hoo-yo', difficulty: 'beginner', examples: [{ so: 'Hooyada ayaa la jeclahay', en: 'Mother is loved' }] },
  { id: '4', categoryId: 'family', wordSo: 'Aabo', wordEn: 'Father', partOfSpeech: 'noun', phonetic: 'aa-bo', difficulty: 'beginner', examples: [{ so: 'Aabaha waa nin wanaagsan', en: 'Father is a good man' }] },
  { id: '5', categoryId: 'numbers', wordSo: 'Hal', wordEn: 'One', partOfSpeech: 'noun', phonetic: 'hal', difficulty: 'beginner', examples: [{ so: 'Hal qof ayaa yimid', en: 'One person came' }] },
  { id: '6', categoryId: 'numbers', wordSo: 'Laba', wordEn: 'Two', partOfSpeech: 'noun', phonetic: 'la-ba', difficulty: 'beginner', examples: [{ so: 'Laba buug ayaan hayaa', en: 'I have two books' }] },
  { id: '7', categoryId: 'colors', wordSo: 'Cas', wordEn: 'Red', partOfSpeech: 'adjective', phonetic: 'cas', difficulty: 'beginner', examples: [{ so: 'Tufaax cas', en: 'Red apple' }] },
  { id: '8', categoryId: 'colors', wordSo: 'Cagaar', wordEn: 'Green', partOfSpeech: 'adjective', phonetic: 'ca-ga-ar', difficulty: 'beginner', examples: [{ so: 'Dhir cagaar ah', en: 'Green plant' }] },
];

interface QuizDemoProps {
  onBack?: () => void;
  category?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

export const QuizDemo: React.FC<QuizDemoProps> = ({ onBack, category = 'all', difficulty = 'beginner' }) => {
  return (
    <QuizScreenEnhanced
      onBack={onBack}
      category={category}
      difficulty={difficulty}
      words={demoVocabulary}
    />
  );
};

export default QuizDemo;
