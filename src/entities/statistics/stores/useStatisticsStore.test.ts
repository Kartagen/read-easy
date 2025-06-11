/**
 * @jest-environment jsdom
 */
import { act, renderHook } from '@testing-library/react';
import { useManageStatisticsStore } from '../hooks/useManageStatisticsStore';
import { useStatisticsStore } from './useStatisticsStore';

describe('useBookStatistics Hook', () => {
  beforeEach(() => {
    act(() => {
      useStatisticsStore.setState({ statistics: {} });
    });
  });

  it('starts a reading session and updates statistics correctly', () => {
    const { result } = renderHook(() => useManageStatisticsStore());

    act(() => {
      result.current.startReadingSession('1', 'Book 1', 100);
    });

    const stats = useStatisticsStore.getState().getBookStatistics('1');
    expect(stats).toBeDefined();
    expect(stats?.bookName).toBe('Book 1');
    expect(stats?.totalPages).toBe(100);
    expect(stats?.readingSessions).toHaveLength(1);
    expect(stats?.readingSessions[0].endTime).toBe(0); // Сесія ще не закінчена
  });

  it('ends a reading session and calculates metrics', () => {
    const { result } = renderHook(() => useManageStatisticsStore());

    act(() => {
      result.current.startReadingSession('1', 'Book 1', 100);
    });
    act(() => {
      result.current.endReadingSession('1', 10);
    });

    const stats = useStatisticsStore.getState().getBookStatistics('1');
    expect(stats?.pagesRead).toBe(10);
    expect(stats?.totalReadingTime).toBeGreaterThan(0);
    expect(stats?.readingSessions).toHaveLength(1);
    expect(stats?.readingSessions[0].endTime).not.toBe(0);
    expect(stats?.readingSessions[0].pagesRead).toBe(10);
  });

  it('updates pages read correctly', () => {
    const { result } = renderHook(() => useManageStatisticsStore());

    act(() => {
      result.current.startReadingSession('1', 'Book 1', 100);
      result.current.updatePagesRead('1', 5);
    });

    const stats = useStatisticsStore.getState().getBookStatistics('1');
    expect(stats?.pagesRead).toBe(5);
  });
});
