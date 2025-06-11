import { useBookStore } from '@/entities/books/stores/useBookStore';
import { useRouter } from 'expo-router';
import { Share } from 'react-native';
import { Toast } from 'toastify-react-native';
import * as FileSystem from 'expo-file-system';

export const useAboutBook = () => {
  const book = useBookStore((state) => state.currentBook);
  const deleteBook = useBookStore((state) => state.deleteBook);
  const router = useRouter();

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this book: ${book?.name}`,
      });
    } catch (error) {
      Toast.error('Error sharing book:' + error);
    }
  };

  const handleDelete = async () => {
    try {
      if (book) {
        if (book.filePath) {
          await FileSystem.deleteAsync(book.filePath);
        }
        await deleteBook(book.id);
        router.replace('/navigation/library');
      }
    } catch (error) {
      Toast.error('Error deleting book:' + error);
    }
  };

  const progress =
    book && book.currentPage !== undefined && book.totalPages
      ? ((book.currentPage + 1) / book.totalPages) * 100
      : 0;

  return {
    book,
    handleShare,
    handleDelete,
    progress,
  };
};
