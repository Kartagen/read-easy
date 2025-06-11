import { create } from 'zustand';
import { TranslationStore } from '@/shared/types/types';

export const useTranslationStore = create<TranslationStore>((set) => ({
  translations: [],
  addTranslation: (translation) =>
    set((state) => ({
      translations: [
        {
          ...translation,
          id: Date.now().toString(),
          timestamp: Date.now(),
        },
        ...state.translations,
      ],
    })),
  removeTranslation: (id) =>
    set((state) => ({
      translations: state.translations.filter((t) => t.id !== id),
    })),
}));
