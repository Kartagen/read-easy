import * as DocumentPicker from 'expo-document-picker';
import {
  isEpubFile,
  isFb2File,
  isMobiFile,
  isTxtFile,
  readFileWithEncoding,
} from '@/entities/books/helpers/file.helper';
import { Mobi } from '@/entities/books/helpers/mobi.hepler';
import { Alert } from 'react-native';
import { Toast } from 'toastify-react-native';
import { useManageBookStore } from '@/entities/books/hooks/useManageBookStore';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';

export const useLibrary = () => {
  const router = useRouter();
  const {
    processContent,
    loadBookContent,
    books,
    currentBook,
    setBook,
    setCurrentBook,
    toggleFavorite,
    deleteBook,
  } = useManageBookStore();

  const [searchQuery, setSearchQuery] = useState('');

  const filteredAndSortedBooks = useMemo(() => {
    return books
      .filter((book) =>
        book.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      .sort((a, b) => {
        // First sort by favorite status
        if (a.isFavorite && !b.isFavorite) {
          return -1;
        }
        if (!a.isFavorite && b.isFavorite) {
          return 1;
        }
        // Then sort by last read date
        if (a.lastRead && b.lastRead) {
          return (
            new Date(b.lastRead).getTime() - new Date(a.lastRead).getTime()
          );
        }
        if (a.lastRead) {
          return -1;
        }
        if (b.lastRead) {
          return 1;
        }

        // Finally sort by name
        return a.name.localeCompare(b.name);
      });
  }, [books, searchQuery]);

  const handleMobileFilePick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        try {
          let content = '';
          let bookType = 'text';
          const bookTitle = file.name;

          if (isTxtFile(file.name)) {
            bookType = 'text';
            content = await readFileWithEncoding(file.uri);
          } else if (isEpubFile(file.name)) {
            bookType = 'epub';
            content = await readFileWithEncoding(file.uri);
          } else if (isMobiFile(file.name)) {
            bookType = 'mobi';
            const mobi = new Mobi(file.uri);
            await mobi.parse();
            content = mobi.info.content
              .replace(/<p\b[^>]*>/gi, '\n')
              .replace(/<[^>]+>/g, '');
          } else if (isFb2File(file.name)) {
            bookType = 'fb2';
            content = await readFileWithEncoding(file.uri);
          } else {
            Alert.alert(
              'Error',
              'Unsupported file type. Please try another file.',
            );

            return;
          }

          const newBook = {
            id: Date.now().toString(),
            name: bookTitle,
            content,
            type: bookType,
            filePath: file.uri,
            fileSize: file.size || 0,
            isFavorite: false,
            lastRead: Date.now().toString(),
            totalPages: 0,
            currentPage: 0,
          };
          await setBook(newBook);
          await setCurrentBook(newBook.id);
          if (currentBook && currentBook.content) {
            await processContent(currentBook.content);
          } else if (currentBook && currentBook.filePath) {
            await loadBookContent();
          }
          router.push('/navigation/reader');
        } catch (error) {
          Toast.error('Error reading file:' + error);
        }
      }
    } catch (error) {
      Toast.error('Failed to pick document:' + error);
    }
  };

  const handleBookSelect = async (bookId: string) => {
    await setCurrentBook(bookId);
    router.push('/navigation/reader');
  };

  const handleDeleteBook = (bookId: string, bookName: string) => {
    Alert.alert(
      'Delete Book',
      `Are you sure you want to delete "${bookName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteBook(bookId),
        },
      ],
    );
  };

  const handleToggleFavorite = (bookId: string) => {
    toggleFavorite(bookId);
  };

  return {
    searchQuery,
    filteredAndSortedBooks,
    setSearchQuery,
    handleMobileFilePick,
    handleBookSelect,
    handleDeleteBook,
    handleToggleFavorite,
  };
};
