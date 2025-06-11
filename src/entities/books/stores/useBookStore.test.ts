import { act } from '@testing-library/react';
import { useBookStore } from './useBookStore';

jest.mock('toastify-react-native', () => ({
  Toast: {
    error: jest.fn(),
  },
}));

describe('useBookStore', () => {
  beforeEach(() => {
    useBookStore.setState({ books: [] });
  });

  it('adds a book', () => {
    act(() => {
      useBookStore.getState().setBook({
        id: '1',
        name: 'Book 1',
        content: 'Some content',
        type: 'text',
        filePath: '/path/to/book.txt',
        fileSize: 123,
        currentPage: 0,
        lastRead: new Date().toDateString(),
        totalPages: 10,
        isFavorite: false,
      });
    });
    expect(useBookStore.getState().books.length).toBe(1);
  });

  it('toggles favorite', () => {
    act(() => {
      useBookStore.getState().setBook({
        id: '1',
        name: 'Book 1',
        content: 'Some content',
        type: 'text',
        filePath: '/path/to/book.txt',
        fileSize: 123,
        currentPage: 0,
        lastRead: new Date().toDateString(),
        totalPages: 10,
        isFavorite: false,
      });
      useBookStore.getState().toggleFavorite('1');
    });
    expect(useBookStore.getState().books[0].isFavorite).toBe(true);
  });

  it('deletes a book', () => {
    act(() => {
      useBookStore.getState().setBook({
        id: '1',
        name: 'Book 1',
        content: 'Some content',
        type: 'text',
        filePath: '/path/to/book.txt',
        fileSize: 123,
        currentPage: 0,
        lastRead: new Date().toDateString(),
        totalPages: 10,
        isFavorite: false,
      });
      useBookStore.getState().deleteBook('1');
    });
    expect(useBookStore.getState().books.length).toBe(0);
  });
});
