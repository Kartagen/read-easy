import { useCallback, useEffect, useState } from 'react';
import { Toast } from 'toastify-react-native';
import { Gesture } from 'react-native-gesture-handler';
import {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useBookStore } from '@/entities/books/stores/useBookStore';
import { useWindowDimensions } from 'react-native';

export const useReaderNavigation = ({
  setIsLoading,
  setSelectedIndexes,
}: {
  setIsLoading: (b: boolean) => void;
  setSelectedIndexes: (b: number[]) => void;
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const currentBook = useBookStore((state) => state.currentBook);
  const updateCurrentPage = useBookStore((state) => state.setCurrentPage);
  const { width } = useWindowDimensions();
  const translateX = useSharedValue(0);
  const context = useSharedValue({ x: 0 });
  const currentPageContent = currentBook?.pages?.[currentPage] || '';

  const changePage = useCallback(
    (direction: number, isGoTo = false) => {
      if (!currentBook?.pages) {
        Toast.error('No pages available for navigation');

        return;
      }

      const nextPage = isGoTo ? direction - 1 : currentPage + direction;
      if (nextPage >= 0 && nextPage < currentBook.pages.length + 1) {
        setCurrentPage(nextPage);
        updateCurrentPage(nextPage);
        setSelectedIndexes([]);
      }
    },
    [currentBook?.pages, currentPage, updateCurrentPage],
  );

  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = { x: translateX.value };
    })
    .onUpdate((e) => {
      translateX.value = e.translationX + context.value.x;
    })
    .onEnd((e) => {
      const threshold = width / 4;
      const direction =
        e.translationX < -threshold ? 1 : e.translationX > threshold ? -1 : 0;
      if (direction !== 0) {
        runOnJS(changePage)(direction);
      }
      translateX.value = withSpring(0);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  useEffect(() => {
    if (currentBook?.currentPage !== undefined) {
      setCurrentPage(currentBook.currentPage);
    }

    if (currentBook?.pages && currentBook.pages.length > 0) {
      setIsLoading(false);
    }
  }, [currentBook]);

  return {
    currentPage,
    currentPageContent,
    changePage,
    gesture,
    animatedStyle,
  };
};
