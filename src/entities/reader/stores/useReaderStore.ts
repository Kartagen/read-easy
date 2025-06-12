import { create } from 'zustand';
import { ReaderState } from '@/shared/types/types';

export const useReaderStore = create<ReaderState>((set) => ({
  isUsingSpeech: false,
  isUsingTranslate: false,
  isUsingGoTo: false,
  isUsingSearch: false,
  setUsingSpeech: (value) => set({ isUsingSpeech: value }),
  setUsingTranslate: (value) => set({ isUsingTranslate: value }),
  setUsingGoTo: (value) => set({ isUsingGoTo: value }),
  setUsingSearch: (value) => set({ isUsingSearch: value }),
}));
