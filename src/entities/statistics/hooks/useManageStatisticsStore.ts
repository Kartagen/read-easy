import { BookStatistics } from '@/shared/types/types';
import { useStatisticsStore } from '@/entities/statistics/stores/useStatisticsStore';

export const useManageStatisticsStore = () => {
  const { statistics, setBookStatistics } = useStatisticsStore();

  const startReadingSession = (
    bookId: string,
    bookName: string,
    totalPages: number,
  ) => {
    const currentStats = statistics[bookId] || {
      bookId,
      bookName,
      totalReadingTime: 0,
      pagesRead: 0,
      totalPages,
      readingSessions: [],
    };

    const newStats: BookStatistics = {
      ...currentStats,
      lastReadDate: Date.now(),
      readingSessions: [
        ...currentStats.readingSessions,
        {
          startTime: Date.now(),
          endTime: 0,
          pagesRead: 0,
        },
      ],
    };

    setBookStatistics(bookId, newStats);
  };

  const endReadingSession = (bookId: string, currentPage: number) => {
    const currentStats = statistics[bookId];
    if (!currentStats) {
      return;
    }

    const lastSession =
      currentStats.readingSessions[currentStats.readingSessions.length - 1];
    if (!lastSession || lastSession.endTime !== 0) {
      return;
    }

    const sessionDuration = (Date.now() - lastSession.startTime) / 1000;

    const pagesReadBeforeSession = currentStats.pagesRead;
    const sessionPagesRead = currentPage - pagesReadBeforeSession;

    const newStats: BookStatistics = {
      ...currentStats,
      totalReadingTime: currentStats.totalReadingTime + sessionDuration,
      pagesRead: currentPage,
      readingSessions: currentStats.readingSessions.map((session, index) =>
        index === currentStats.readingSessions.length - 1
          ? { ...session, endTime: Date.now(), pagesRead: sessionPagesRead }
          : session,
      ),
    };

    setBookStatistics(bookId, newStats);
  };

  const updatePagesRead = (bookId: string, currentPage: number) => {
    const currentStats = useStatisticsStore.getState().statistics[bookId];
    if (!currentStats) {
      return;
    }

    const newStats: BookStatistics = {
      ...currentStats,
      pagesRead: currentPage,
    };
    setBookStatistics(bookId, newStats);
  };

  return {
    startReadingSession,
    endReadingSession,
    updatePagesRead,
    getBookStatistics: useStatisticsStore((state) => state.getBookStatistics),
    getAllStatistics: useStatisticsStore((state) => state.getAllStatistics),
    statistics: useStatisticsStore((state) => state.statistics),
  };
};
