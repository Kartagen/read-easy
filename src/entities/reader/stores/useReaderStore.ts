import { create } from 'zustand';
import { ReaderState } from '@/shared/types/types';

export const useReaderStore = create<ReaderState>((set) => ({
  isUsingSpeech: false,
  isUsingTranslate: false,
  setUsingSpeech: (value) => set({ isUsingSpeech: value }),
  setUsingTranslate: (value) => set({ isUsingTranslate: value }),
}));
