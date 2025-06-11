import { useStatisticsStore } from '@/entities/statistics/stores/useStatisticsStore';

export const useStatistics = () => {
  const getAllStatistics = useStatisticsStore(
    (state) => state.getAllStatistics,
  );
  const statistics = getAllStatistics();

  const totalReadingTime = statistics.reduce(
    (acc, stat) => acc + stat.totalReadingTime,
    0,
  );
  const totalPagesRead = statistics.reduce(
    (acc, stat) => acc + stat.pagesRead,
    0,
  );
  const totalBooks = statistics.length;

  return {
    totalReadingTime,
    totalPagesRead,
    totalBooks,
    statistics,
  };
};
