import { useEffect, useState } from 'react';
import * as Network from 'expo-network';
import { useBookStore } from '@/entities/books/stores/useBookStore';
import { useReaderNavigation } from '@/entities/reader/hooks/useReaderNavigation';
import { useSpeech } from '@/entities/reader/hooks/useSpeech';
import { useTranslation } from '@/entities/translations/hooks/useTranslation';
import { useManageStatisticsStore } from '@/entities/statistics/hooks/useManageStatisticsStore';
import { useReaderStore } from '@/entities/reader/stores/useReaderStore';
import { useManageBookStore } from '@/entities/books/hooks/useManageBookStore';
import { useSettingsStore } from '@/entities/settings/stores/useSettingsStore';
import { Toast } from 'toastify-react-native';
import * as Speech from 'expo-speech';

export const useReader = () => {
  const [selectedText, setSelectedText] = useState('');
  const [words, setWords] = useState<string[]>([]);
  const [useOffline, setUseOffline] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);
  const [inputField, setInputField] = useState<string>('');

  const isOnline = async () => {
    const state = await Network.getNetworkStateAsync();

    return !!(state.isConnected && state.isInternetReachable && !useOffline);
  };
  const currentBook = useBookStore((state) => state.currentBook);

  const {
    currentPage,
    currentPageContent,
    changePage,
    gesture,
    animatedStyle,
  } = useReaderNavigation({ setIsLoading, setSelectedIndexes });

  const {
    isSpeaking,
    setIsSpeaking,
    currentWordIndex,
    setCurrentWordIndex,
    handleSpeech,
    handleResetPosition,
  } = useSpeech({
    isOnline,
    selectedText,
    currentPageContent,
    currentPage,
    currentBook,
    words,
    changePage,
  });

  const {
    showTranslationModal,
    setShowTranslationModal,
    translatedText,
    handleTranslation,
    handleSaveTranslation,
  } = useTranslation({
    isOnline,
    selectedText,
    currentBook,
  });

  const { startReadingSession, endReadingSession, updatePagesRead } =
    useManageStatisticsStore();
  const loadLastBook = useBookStore((state) => state.loadLastBook);
  const {
    isUsingSpeech,
    isUsingTranslate,
    isUsingGoTo,
    isUsingSearch,
    setUsingSpeech,
    setUsingTranslate,
    setUsingSearch,
    setUsingGoTo,
  } = useReaderStore();
  const { loadBookContent, processContent } = useManageBookStore();

  const { fontSize, fontFamily, lineSpacing, marginWidth } = useSettingsStore();

  const handleChangeNetwork = () => {
    setUseOffline(!useOffline);
  };

  const handleClose = () => {
    setUsingSpeech(false);
    setUsingTranslate(false);
    setUsingSearch(false);
    setUsingGoTo(false);
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
    }
    setInputField('');
    setSelectedText('');
    setSelectedIndexes([]);
    setCurrentWordIndex(0);
  };

  const handleWordPress = (index: number) => {
    setSelectedIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );

    const newSelectedText = selectedIndexes.includes(index)
      ? words
          .filter((_, i) =>
            selectedIndexes.filter((idx) => idx !== index).includes(i),
          )
          .join(' ')
      : words
          .filter((_, i) => [...selectedIndexes, index].includes(i))
          .join(' ');

    setSelectedText(newSelectedText);
  };

  const handleInput = (text: string) => {
    if (isUsingGoTo && currentBook) {
      const onlyNumbers = text.replace(/[^0-9]/g, '');
      const num = parseInt(onlyNumbers, 10);
      if (onlyNumbers === '' || isNaN(num)) {
        setInputField('');
      } else if (num < 1) {
        setInputField('1');
      } else if (num > currentBook.totalPages + 1) {
        setInputField(currentBook.totalPages.toString());
      } else {
        setInputField(onlyNumbers);
      }
    } else {
      setInputField(text);
    }
  };

  const handleFind = () => {
    if (currentBook && currentBook.pages) {
      const pages = currentBook.pages;
      for (let i = currentPage + 1; i < pages.length; i++) {
        if (pages[i].includes(inputField)) {
          changePage(i + 1, true);

          return;
        }
      }
    }
  };

  useEffect(() => {
    const loadBook = async () => {
      setIsLoading(true);
      try {
        await loadLastBook();
      } catch (error) {
        Toast.error('Error loading last book:' + error);
      } finally {
        setIsLoading(false);
      }
    };
    loadBook();
  }, []);

  // Load book content when book changes
  useEffect(() => {
    const loadContent = async () => {
      if (currentBook?.filePath) {
        setIsLoading(true);
        try {
          await loadBookContent();
        } catch (error) {
          Toast.error('Error loading book content:' + error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    loadContent();
  }, [currentBook?.filePath]);

  // Update pages when text settings change
  useEffect(() => {
    const updatePageSettings = async () => {
      if (currentBook?.content) {
        setIsLoading(true);
        try {
          await processContent(currentBook.content);
        } catch (error) {
          Toast.error('Error updating pages:' + error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    updatePageSettings();
  }, [fontSize, lineSpacing, marginWidth, fontFamily]);

  useEffect(() => {
    if (currentPageContent) {
      setWords(currentPageContent.split(/\s+/));
    }
  }, [currentPageContent]);

  useEffect(() => {
    if (words && inputField) {
      const wordIndex = words.findIndex((word) => word.includes(inputField));
      if (wordIndex) {
        setSelectedIndexes((selected) => [...selected, wordIndex]);
      }
    }
  }, [words]);

  useEffect(() => {
    if (currentBook) {
      startReadingSession(
        currentBook.id,
        currentBook.name,
        currentBook.totalPages || 0,
      );
    }

    return () => {
      if (currentBook) {
        endReadingSession(currentBook.id, currentPage);
      }
    };
  }, [currentBook?.id]);

  // Add this effect to update pages read
  useEffect(() => {
    if (currentBook) {
      updatePagesRead(currentBook.id, currentPage);
    }
  }, [currentPage]);

  return {
    words,
    changePage,
    currentPageContent,
    handleWordPress,
    marginWidth,
    selectedIndexes,
    isSpeaking,
    currentWordIndex,
    currentBook,
    isLoading,
    isUsingSpeech,
    isUsingTranslate,
    isUsingGoTo,
    isUsingSearch,
    inputField,
    gesture,
    animatedStyle,
    currentPage,
    showTranslationModal,
    setShowTranslationModal,
    selectedText,
    translatedText,
    handleSaveTranslation,
    useOffline,
    handleChangeNetwork,
    handleResetPosition,
    handleClose,
    handleFind,
    handleInput,
    handleSpeech,
    handleTranslation,
  };
};
