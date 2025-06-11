import { act } from '@testing-library/react';
import { useTranslationStore } from './useTranslationStore';

describe('useTranslationStore', () => {
  beforeEach(() => {
    useTranslationStore.setState({ translations: [] });
  });

  it('adds a translation', () => {
    act(() => {
      useTranslationStore.getState().addTranslation({
        bookName: 'Book 1',
        originalText: 'Hello',
        translatedText: 'Привіт',
      });
    });
    const translations = useTranslationStore.getState().translations;
    expect(translations.length).toBe(1);
    expect(translations[0].bookName).toBe('Book 1');
    expect(translations[0].originalText).toBe('Hello');
    expect(translations[0].translatedText).toBe('Привіт');
  });

  it('removes a translation', () => {
    act(() => {
      useTranslationStore.getState().addTranslation({
        bookName: 'Book 1',
        originalText: 'Hello',
        translatedText: 'Привіт',
      });
    });
    const id = useTranslationStore.getState().translations[0].id;
    act(() => {
      useTranslationStore.getState().removeTranslation(id);
    });
    expect(useTranslationStore.getState().translations.length).toBe(0);
  });
});
