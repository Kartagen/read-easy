import { create } from 'zustand';
import { Toast } from 'toastify-react-native';
import { Book, BookMetadata, BookState } from '@/shared/types/types';
import {
  BOOKS_STORAGE_KEY,
  DEFAULT_BOOK,
  LAST_BOOK_KEY,
} from '@/shared/constants/constants';
import { storageHelper } from '@/entities/books/helpers/storage.helper';

export const useBookStore = create<BookState>((set, get) => ({
  books: [],
  currentBook: null,
  setBook: async (book) => {
    const bookWithDefaults = { ...DEFAULT_BOOK, ...book };
    const currentBooks = get().books;
    // Prevent duplicates by filePath or name
    const existingBookIndex = currentBooks.findIndex(
      (b) =>
        b.filePath === bookWithDefaults.filePath ||
        b.name === bookWithDefaults.name,
    );
    let updatedBooks;
    if (existingBookIndex >= 0) {
      // Update the existing book
      updatedBooks = [...currentBooks];
      updatedBooks[existingBookIndex] = {
        ...updatedBooks[existingBookIndex],
        ...bookWithDefaults,
      };
    } else {
      updatedBooks = [...currentBooks, bookWithDefaults];
    }
    set({ books: updatedBooks, currentBook: bookWithDefaults });
    await storageHelper.set(BOOKS_STORAGE_KEY, updatedBooks);
    await storageHelper.set(LAST_BOOK_KEY, bookWithDefaults.id);
  },
  setCurrentBook: async (bookId) => {
    const books = get().books;
    const book = books.find((b) => b.id === bookId);
    if (book) {
      set({ currentBook: book });
      await storageHelper.set(LAST_BOOK_KEY, bookId);
    }
  },
  setCurrentPage: async (page) => {
    const currentBook = get().currentBook;
    if (currentBook) {
      const updatedBook = {
        ...currentBook,
        currentPage: page,
        lastRead: new Date().toISOString(),
      };
      const books = get().books;
      const updatedBooks = books.map((b: Book) =>
        b.id === currentBook.id ? updatedBook : b,
      );
      set({ currentBook: updatedBook, books: updatedBooks });
      await storageHelper.set(BOOKS_STORAGE_KEY, updatedBooks);
      await storageHelper.set(LAST_BOOK_KEY, updatedBook.id);
    }
  },
  setType: async (type) => {
    const currentBook = get().currentBook;
    if (currentBook) {
      const updatedBook = {
        ...currentBook,
        type,
        lastRead: new Date().toISOString(),
      };
      const books = get().books;
      const updatedBooks = books.map((b: Book) =>
        b.id === currentBook.id ? updatedBook : b,
      );
      set({ currentBook: updatedBook, books: updatedBooks });
      await storageHelper.set(BOOKS_STORAGE_KEY, updatedBooks);
      await storageHelper.set(LAST_BOOK_KEY, updatedBook.id);
    }
  },
  loadSavedState: async () => {
    try {
      const savedBooks = await storageHelper.get(BOOKS_STORAGE_KEY);
      if (Array.isArray(savedBooks)) {
        set({ books: savedBooks });

        const lastBookId = await storageHelper.get(LAST_BOOK_KEY);
        if (lastBookId) {
          const lastBook = savedBooks.find(
            (b: BookMetadata) => b.id === lastBookId,
          );
          if (lastBook) {
            set({ currentBook: lastBook });
          }
        }
      } else {
      }
    } catch (error) {
      Toast.error('Error loading saved state:' + error);
    }
  },
  loadLastBook: async () => {
    try {
      const lastBookId = await storageHelper.get(LAST_BOOK_KEY);
      if (lastBookId) {
        const books = get().books;
        const lastBook = books.find((b) => b.id === lastBookId);
        if (lastBook) {
          set({ currentBook: lastBook });
        }
      }
    } catch (error) {
      Toast.error('Error loading last book:' + error);
    }
  },
  toggleFavorite: async (bookId: string) => {
    const books = get().books;
    const updatedBooks = books.map((b: Book) =>
      b.id === bookId ? { ...b, isFavorite: !b.isFavorite } : b,
    );
    set({ books: updatedBooks });
    await storageHelper.set(BOOKS_STORAGE_KEY, updatedBooks);
  },
  deleteBook: async (bookId: string) => {
    const books = get().books;
    const updatedBooks = books.filter((b: Book) => b.id !== bookId);
    set({ books: updatedBooks });
    if (get().currentBook?.id === bookId) {
      set({ currentBook: null });
    }
    await storageHelper.set(BOOKS_STORAGE_KEY, updatedBooks);
  },
}));
