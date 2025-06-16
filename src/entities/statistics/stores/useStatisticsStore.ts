import { create } from 'zustand';
import { StatisticsStore } from '@/shared/types/types';

export const useStatisticsStore = create<StatisticsStore>((set, get) => ({
  statistics: {},

  setBookStatistics: (bookId, newStats) => {
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
