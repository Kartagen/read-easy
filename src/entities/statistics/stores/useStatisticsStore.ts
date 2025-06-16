import { create } from 'zustand';
import { BookStatistics, StatisticsStore } from '@/shared/types/types';
import { storageUtils } from '@/shared/utils/storage';
import { STATISTIC_KEY } from '@/shared/constants/constants';

export const useStatisticsStore = create<StatisticsStore>((set, get) => ({
  statistics: {},

  setBookStatistics: async (bookId, newStats) => {
    const savedStatistics = await storageUtils.get(
      STATISTIC_KEY,
      [] as unknown as Record<string, BookStatistics>,
    );
    await storageUtils.set(STATISTIC_KEY, {
      ...savedStatistics,
      [bookId]: newStats,
    });
    set((state) => ({
      statistics: {
        ...state.statistics,
        [bookId]: newStats,
      },
    }));
  },

  getBookStatistics: (bookId) => {
    return get().statistics[bookId];
  },

  getAllStatistics: () => {
    return Object.values(get().statistics);
  },

  deleteBookStatistics: (bookId) => {
    set((state) => {
      const { [bookId]: _, ...rest } = state.statistics;

      return { statistics: rest };
    });
  },
}));
storageUtils
  .get(STATISTIC_KEY, [] as unknown as Record<string, BookStatistics>)
  .then((savedStatistics) => {
    useStatisticsStore.setState({ statistics: savedStatistics });
  });
