import * as Speech from 'expo-speech';
import { Word } from '../data/types';

interface TTSOptions {
  language?: string;
  pitch?: number;
  rate?: number;
  volume?: number;
  onStart?: () => void;
  onDone?: () => void;
  onError?: (error: any) => void;
  onStopped?: () => void;
}

export class TTSManager {
  private static instance: TTSManager;
  private currentSpeakingWord: string | null = null;
  private isInitialized = false;

  private constructor() {}

  static getInstance(): TTSManager {
    if (!TTSManager.instance) {
      TTSManager.instance = new TTSManager();
    }
    return TTSManager.instance;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Check if speech is available
      const voices = await Speech.getAvailableVoicesAsync();
      console.log('Available TTS voices:', voices.length);
      this.isInitialized = true;
    } catch (error) {
      console.warn('TTS initialization failed:', error);
      this.isInitialized = false;
    }
  }

  async speakSomaliWord(
    word: string, 
    options: TTSOptions = {}
  ): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    // Stop any current speech
    if (this.currentSpeakingWord) {
      await this.stop();
    }

    const defaultOptions: TTSOptions = {
      language: 'so', // Somali language code
      pitch: 1.0,
      rate: 0.75, // Slower rate for language learning
      volume: 1.0,
      ...options
    };

    this.currentSpeakingWord = word;

    try {
      await Speech.speak(word, {
        language: defaultOptions.language,
        pitch: defaultOptions.pitch,
        rate: defaultOptions.rate,
        volume: defaultOptions.volume,
        onStart: () => {
          defaultOptions.onStart?.();
        },
        onDone: () => {
          this.currentSpeakingWord = null;
          defaultOptions.onDone?.();
        },
        onError: (error) => {
          this.currentSpeakingWord = null;
          console.error('TTS Error:', error);
          defaultOptions.onError?.(error);
        },
        onStopped: () => {
          this.currentSpeakingWord = null;
          defaultOptions.onStopped?.();
        },
      });
    } catch (error) {
      this.currentSpeakingWord = null;
      console.error('Speech synthesis failed:', error);
      options.onError?.(error);
      throw error;
    }
  }

  async speakWordWithExample(
    word: Word,
    options: TTSOptions = {}
  ): Promise<void> {
    // Speak the word first
    await this.speakSomaliWord(word.wordSo, {
      ...options,
      onDone: async () => {
        // Small pause between word and example
        setTimeout(async () => {
          if (word.examples && word.examples.length > 0) {
            await this.speakSomaliWord(word.examples[0].so, options);
          }
        }, 800);
      }
    });
  }

  async speakExample(
    exampleText: string,
    options: TTSOptions = {}
  ): Promise<void> {
    await this.speakSomaliWord(exampleText, {
      ...options,
      rate: 0.6, // Even slower for example sentences
    });
  }

  async stop(): Promise<void> {
    try {
      await Speech.stop();
      this.currentSpeakingWord = null;
    } catch (error) {
      console.error('Error stopping speech:', error);
    }
  }

  isSpeaking(): boolean {
    return this.currentSpeakingWord !== null;
  }

  getCurrentWord(): string | null {
    return this.currentSpeakingWord;
  }

  async getAvailableVoices(): Promise<Speech.Voice[]> {
    try {
      return await Speech.getAvailableVoicesAsync();
    } catch (error) {
      console.error('Error getting voices:', error);
      return [];
    }
  }

  // Check if Somali TTS is supported
  async isSomaliSupported(): Promise<boolean> {
    try {
      const voices = await this.getAvailableVoices();
      return voices.some(voice => 
        voice.language.includes('so') || 
        voice.language.includes('som')
      );
    } catch (error) {
      return false;
    }
  }

  // Fallback to a similar language if Somali is not available
  async getBestLanguageCode(): Promise<string> {
    const isSupported = await this.isSomaliSupported();
    if (isSupported) return 'so';
    
    // Fallback languages that might work for Somali pronunciation
    const fallbacks = ['ar', 'sw', 'am', 'en'];
    const voices = await this.getAvailableVoices();
    
    for (const lang of fallbacks) {
      if (voices.some(voice => voice.language.includes(lang))) {
        console.log(`Using fallback language: ${lang} for Somali TTS`);
        return lang;
      }
    }
    
    return 'en'; // Ultimate fallback
  }
}

// Export singleton instance
export const ttsManager = TTSManager.getInstance();

// Hook for React components
export const useTTS = () => {
  const speakWord = async (word: string, options?: TTSOptions) => {
    const bestLang = await ttsManager.getBestLanguageCode();
    return ttsManager.speakSomaliWord(word, {
      ...options,
      language: bestLang
    });
  };

  const speakWordWithExample = async (word: Word, options?: TTSOptions) => {
    const bestLang = await ttsManager.getBestLanguageCode();
    return ttsManager.speakWordWithExample(word, {
      ...options,
      language: bestLang
    });
  };

  const stop = () => ttsManager.stop();
  const isSpeaking = () => ttsManager.isSpeaking();

  return {
    speakWord,
    speakWordWithExample,
    stop,
    isSpeaking,
  };
};
