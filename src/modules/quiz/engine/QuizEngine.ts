import { Word } from '../../vocabulary/data/types';
import { QuizQuestion, QuizResult, QuizConfig, QuizPerformance } from './types';

export class QuizEngine {
  private shuffle<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  private getRandomWords(words: Word[], count: number, exclude?: Word): Word[] {
    const filtered = exclude ? words.filter(w => w.id !== exclude.id) : words;
    return this.shuffle(filtered).slice(0, count);
  }

  /**
   * Generate quiz questions from a list of words
   */
  generateQuestions(
    words: Word[], 
    questionCount: number = 10,
    questionType: 'so-to-en' | 'en-to-so' | 'mixed' | 'audio' = 'mixed'
  ): QuizQuestion[] {
    if (words.length < 4) {
      throw new Error('Need at least 4 words to generate quiz questions');
    }

    const selectedWords = this.shuffle(words).slice(0, questionCount);
    const questions: QuizQuestion[] = [];

    selectedWords.forEach((word, index) => {
      // Determine question type
      let type: 'so-to-en' | 'en-to-so' | 'audio' = questionType === 'mixed' 
        ? this.getRandomQuestionType() 
        : questionType === 'audio' 
          ? 'audio' 
          : questionType;

      // Get wrong options (distractors)
      const wrongOptions = this.getRandomWords(words, 3, word);
      
      let question: string;
      let options: string[];
      let correctAnswer: string;

      switch (type) {
        case 'so-to-en':
          question = `What is the English translation of "${word.wordSo}"?`;
          correctAnswer = word.wordEn;
          options = this.shuffle([
            correctAnswer,
            ...wrongOptions.map(w => w.wordEn)
          ]);
          break;
        
        case 'en-to-so':
          question = `What is the Somali translation of "${word.wordEn}"?`;
          correctAnswer = word.wordSo;
          options = this.shuffle([
            correctAnswer,
            ...wrongOptions.map(w => w.wordSo)
          ]);
          break;
        
        case 'audio':
          question = `Listen to the pronunciation and select the correct word:`;
          correctAnswer = word.wordSo;
          options = this.shuffle([
            correctAnswer,
            ...wrongOptions.map(w => w.wordSo)
          ]);
          break;
      }

      questions.push({
        id: `q_${index + 1}`,
        wordId: word.id,
        question,
        options,
        correctAnswer,
        type
      });
    });

    return questions;
  }

  private getRandomQuestionType(): 'so-to-en' | 'en-to-so' | 'audio' {
    const types: ('so-to-en' | 'en-to-so' | 'audio')[] = ['so-to-en', 'en-to-so', 'audio'];
    // Weight: 40% each for translation questions, 20% for audio
    const weights = [0.4, 0.4, 0.2];
    const random = Math.random();
    
    let cumulative = 0;
    for (let i = 0; i < weights.length; i++) {
      cumulative += weights[i];
      if (random <= cumulative) {
        return types[i];
      }
    }
    
    return 'so-to-en'; // fallback
  }

  /**
   * Calculate score as percentage
   */
  calculateScore(results: QuizResult[]): number {
    if (results.length === 0) return 0;
    const correct = results.filter(r => r.isCorrect).length;
    return Math.round((correct / results.length) * 100);
  }

  /**
   * Get detailed performance analysis
   */
  getPerformanceAnalysis(results: QuizResult[], words: Word[]): QuizPerformance {
    if (results.length === 0) {
      return {
        totalQuestions: 0,
        correctAnswers: 0,
        accuracy: 0,
        totalTime: 0,
        averageTime: 0,
        grade: 'N/A',
        strengths: [],
        weaknesses: []
      };
    }

    const totalTime = results.reduce((sum, r) => sum + r.timeSpent, 0);
    const averageTime = totalTime / results.length;
    const accuracy = this.calculateScore(results);
    const correctAnswers = results.filter(r => r.isCorrect).length;
    
    // Analyze strengths and weaknesses by part of speech
    const analysis = this.analyzeByPartOfSpeech(results, words);
    
    return {
      totalQuestions: results.length,
      correctAnswers,
      accuracy,
      totalTime,
      averageTime: Math.round(averageTime / 1000), // Convert to seconds
      grade: this.getGrade(accuracy),
      strengths: analysis.strengths,
      weaknesses: analysis.weaknesses
    };
  }

  private analyzeByPartOfSpeech(results: QuizResult[], words: Word[]) {
    const partOfSpeechStats: { [key: string]: { correct: number; total: number } } = {};
    
    results.forEach(result => {
      const word = words.find(w => w.id === result.questionId.replace('q_', ''));
      const pos = word?.partOfSpeech || 'unknown';
      
      if (!partOfSpeechStats[pos]) {
        partOfSpeechStats[pos] = { correct: 0, total: 0 };
      }
      
      partOfSpeechStats[pos].total++;
      if (result.isCorrect) {
        partOfSpeechStats[pos].correct++;
      }
    });

    const strengths: string[] = [];
    const weaknesses: string[] = [];

    Object.entries(partOfSpeechStats).forEach(([pos, stats]) => {
      const accuracy = stats.correct / stats.total;
      const posLabel = this.getPartOfSpeechLabel(pos);
      
      if (accuracy >= 0.8 && stats.total >= 2) {
        strengths.push(`${posLabel} (${stats.correct}/${stats.total})`);
      } else if (accuracy < 0.5 && stats.total >= 2) {
        weaknesses.push(`${posLabel} (${stats.correct}/${stats.total})`);
      }
    });

    return { strengths, weaknesses };
  }

  private getPartOfSpeechLabel(pos: string): string {
    const labels: { [key: string]: string } = {
      'noun': 'Magacyada - Nouns',
      'verb': 'Ficillada - Verbs',
      'adjective': 'Tilmaanta - Adjectives',
      'adverb': 'Xaaladaha - Adverbs',
      'preposition': 'Jarrada - Prepositions',
      'pronoun': 'Badalyada - Pronouns',
      'conjunction': 'Xiriiriyaha - Conjunctions'
    };
    return labels[pos] || pos;
  }

  private getGrade(score: number): string {
    if (score >= 95) return 'A+';
    if (score >= 90) return 'A';
    if (score >= 85) return 'A-';
    if (score >= 80) return 'B+';
    if (score >= 75) return 'B';
    if (score >= 70) return 'B-';
    if (score >= 65) return 'C+';
    if (score >= 60) return 'C';
    if (score >= 55) return 'C-';
    if (score >= 50) return 'D';
    return 'F';
  }

  /**
   * Validate quiz configuration
   */
  validateConfig(config: QuizConfig, availableWords: number): boolean {
    if (config.questionCount < 1) return false;
    if (config.questionCount > availableWords) return false;
    if (config.timePerQuestion < 5 || config.timePerQuestion > 300) return false;
    return true;
  }

  /**
   * Generate adaptive questions based on previous performance
   */
  generateAdaptiveQuestions(
    words: Word[],
    previousResults: QuizResult[],
    questionCount: number = 10
  ): QuizQuestion[] {
    // Identify words that were answered incorrectly in previous sessions
    const incorrectWordIds = previousResults
      .filter(r => !r.isCorrect)
      .map(r => r.questionId);

    const difficultWords = words.filter(word => 
      incorrectWordIds.includes(word.id) || !word.difficulty || word.difficulty === 'advanced'
    );

    // Mix difficult words with new words
    const selectedWords = [...difficultWords];
    const remainingWords = words.filter(w => !selectedWords.includes(w));
    
    while (selectedWords.length < questionCount && remainingWords.length > 0) {
      selectedWords.push(remainingWords.shift()!);
    }

    return this.generateQuestions(selectedWords.slice(0, questionCount), questionCount);
  }

  /**
   * Get recommended study areas based on quiz results
   */
  getStudyRecommendations(results: QuizResult[], words: Word[]): string[] {
    const recommendations: string[] = [];
    
    const incorrectResults = results.filter(r => !r.isCorrect);
    if (incorrectResults.length === 0) {
      recommendations.push("Excellent work! Try a more challenging category.");
      return recommendations;
    }

    // Analyze common mistakes
    const slowAnswers = results.filter(r => r.timeSpent > 15000); // > 15 seconds
    if (slowAnswers.length > results.length * 0.4) {
      recommendations.push("Practice with flashcards to improve recognition speed");
    }

    if (incorrectResults.length > results.length * 0.5) {
      recommendations.push("Review the vocabulary words in this category");
      recommendations.push("Use the pronunciation feature to learn correct sounds");
    }

    const partOfSpeechIssues = this.analyzeByPartOfSpeech(results, words);
    if (partOfSpeechIssues.weaknesses.length > 0) {
      recommendations.push(`Focus on: ${partOfSpeechIssues.weaknesses.join(', ')}`);
    }

    return recommendations;
  }
}

// Export singleton instance
export const quizEngine = new QuizEngine();
