import { Book } from '@/shared/types/types';
import { Swipeable } from 'react-native-gesture-handler';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/shared/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { SwipeActions } from '@/features/swipeActions/SwipeActions';
import { useLibrary } from '@/entities/books/hooks/useLibrary';
import { useTheme } from '@/shared/hooks/useTheme';

export const BookItem = ({ item }: { item: Book }) => {
  const { colors } = useTheme();
  const { handleBookSelect } = useLibrary();

  return (
    <Swipeable
      renderRightActions={() => <SwipeActions item={item} />}
      rightThreshold={40}
    >
      <TouchableOpacity
        style={[styles.bookItem, { backgroundColor: colors.card }]}
        onPress={() => handleBookSelect(item.id)}
      >
        <View style={styles.bookHeader}>
          <ThemedText style={styles.bookTitle}>{item.name}</ThemedText>
          {item.isFavorite && (
            <Ionicons
              name="star"
              size={20}
              color={colors.accent}
              style={styles.favoriteIcon}
            />
          )}
        </View>
        <ThemedText style={styles.bookInfo}>
          {item.type === 'epub'
            ? 'EPUB'
            : item.type === 'mobi'
              ? 'MOBI'
              : item.type === 'fb2'
                ? 'FB2'
                : 'Text'}{' '}
          • {item.totalPages || 0} pages
        </ThemedText>
        <ThemedText style={styles.bookInfo}>
          Last page: {item.currentPage + 1}
        </ThemedText>
        {item.lastRead && (
          <ThemedText style={styles.lastRead}>
            Last read: {new Date(item.lastRead).toLocaleDateString()}
          </ThemedText>
        )}
      </TouchableOpacity>
    </Swipeable>
  );
};
const styles = StyleSheet.create({
  bookHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  bookItem: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  favoriteIcon: {
    marginLeft: 8,
  },
  bookInfo: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 4,
  },
  lastRead: {
    fontSize: 12,
    opacity: 0.5,
  },
});
