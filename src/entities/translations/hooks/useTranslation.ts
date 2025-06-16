import { useSettingsStore } from '@/entities/settings/stores/useSettingsStore';
import { useTranslationStore } from '@/entities/translations/stores/useTranslationStore';
import { useState } from 'react';
import { Toast } from 'toastify-react-native';
import { NativeModules } from 'react-native';
import { UseTranslationProps } from '@/shared/types/types';

export const useTranslation = ({
  isOnline,
  selectedText,
  currentBook,
}: UseTranslationProps) => {
  const [showTranslationModal, setShowTranslationModal] = useState(false);
  const [translatedText, setTranslatedText] = useState('');

  const translationLanguage = useSettingsStore(
    (state) => state.translationLanguage,
  );
  const addTranslation = useTranslationStore((state) => state.addTranslation);

  const handleTranslation = async () => {
    const online = await isOnline();
    if (online) {
      try {
        handleOnlineTranslation();
      } catch (error) {
        Toast.error('error' + error);
        handleOfflineTranslation();
      }
    } else {
      handleOfflineTranslation();
    }
  };

  const handleOnlineTranslation = async () => {
    if (selectedText) {
      const apiKey = process.env.EXPO_PUBLIC_DEEPL_API_KEY;
      const params = new URLSearchParams();
      params.append('text', selectedText.replace(/\\newLine/g, ' '));
      params.append('target_lang', translationLanguage.substring(0, 2));
      const response = await fetch('https://api-free.deepl.com/v2/translate', {
        method: 'POST',
        headers: {
          Authorization: 'DeepL-Auth-Key ' + apiKey,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      }).catch((error) => Toast.error('Error:', error));
      const result = await response?.json();
      if (!result.translations) {
        Toast.error('result', result);
        throw new Error(result.error?.message || 'Failed to get translation');
      }
      setTranslatedText(result.translations[0].text);
    }
  };

  const handleOfflineTranslation = () => {
    if (selectedText) {
      NativeModules.Translator.translateWord(
        selectedText.replace(/\\newLine/g, ' '),
        translationLanguage.substring(0, 2),
      )
        .then((translated: string) => {
          setTranslatedText(translated);
        })
        .catch((error: Error) => {
          Toast.error('Translation error:' + error);
          setTranslatedText('Translation failed');
        });
    }
  };

  const handleSaveTranslation = () => {
    if (selectedText && translatedText && currentBook) {
      addTranslation({
        bookName: currentBook.name,
        originalText: selectedText.replace(/\\newLine/g, ' '),
        translatedText,
      });
      setShowTranslationModal(false);
      setTranslatedText('');
    }
  };

  return {
    showTranslationModal,
    setShowTranslationModal,
    translatedText,
    handleTranslation,
    handleSaveTranslation,
  };
};
