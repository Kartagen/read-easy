import AsyncStorage from '@react-native-async-storage/async-storage';
import { Toast } from 'toastify-react-native';
import { Book, BookMetadata } from '@/shared/types/types';

export const storageHelper = {
  async set(key: string, value: Book[] | string): Promise<void> {
    try {
      if (Array.isArray(value)) {
        const booksMetadata = value.map((book) => ({
          id: book.id,
          name: book.name,
          type: book.type,
          fileSize: book.fileSize,
          currentPage: book.currentPage || 0,
          totalPages: book.totalPages || 0,
          filePath: book.filePath,
          lastRead: book.lastRead || new Date().toISOString(),
          isFavorite: book.isFavorite || false,
        }));
        await AsyncStorage.setItem(key, JSON.stringify(booksMetadata));
      } else {
        await AsyncStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error: unknown) {
      Toast.error('Error saving data:' + error);
      // If storage is full, try to clear some space
      if (error instanceof Error && error.message?.includes('SQLITE_FULL')) {
        try {
          const keys = await AsyncStorage.getAllKeys();
          // Keep only the most recent books if we have more than 10
          if (keys.length > 10) {
            const sortedKeys = [...keys].sort((a: string, b: string) => {
              const aTime = parseInt(a.split('_').pop() || '0');
              const bTime = parseInt(b.split('_').pop() || '0');

              return bTime - aTime;
            });
            const keysToRemove = sortedKeys.slice(10);
            await AsyncStorage.multiRemove(keysToRemove);
            // Try saving again
            await this.set(key, value);
          }
        } catch (cleanupError) {
          Toast.error('Error cleaning up storage:' + cleanupError);
        }
      }
    }
  },

  async get(key: string): Promise<BookMetadata[] | string | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      if (jsonValue == null) {
        return null;
      }

      const parsed = JSON.parse(jsonValue);
      if (Array.isArray(parsed)) {
        return parsed.map((book) => ({
          id: book.id,
          name: book.name,
          type: book.type,
          fileSize: book.fileSize,
          currentPage: book.currentPage || 0,
          totalPages: book.totalPages || 0,
          filePath: book.filePath,
          lastRead: book.lastRead || new Date().toISOString(),
          isFavorite: book.isFavorite || false,
        }));
      }

      return parsed;
    } catch (error) {
      Toast.error('Error reading data:' + error);

      return null;
    }
  },

  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      Toast.error('Error removing data:' + error);
    }
  },

  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      Toast.error('Error clearing data:' + error);
    }
  },
};
