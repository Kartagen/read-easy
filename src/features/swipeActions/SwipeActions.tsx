import { Book } from '@/shared/types/types';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { useLibrary } from '@/entities/books/hooks/useLibrary';
import { useTheme } from '@/shared/hooks/useTheme';

export const SwipeActions = ({ item }: { item: Book }) => {
  const { colors } = useTheme();
  const { handleToggleFavorite, handleDeleteBook } = useLibrary();

  return (
    <View style={styles.swipeActions}>
      <TouchableOpacity
        style={[styles.swipeAction, styles.favoriteAction]}
        onPress={() => handleToggleFavorite(item.id)}
      >
        <Ionicons
          name={item.isFavorite ? 'star' : 'star-outline'}
          size={24}
          color={colors.text}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.swipeAction, styles.deleteAction]}
        onPress={() => handleDeleteBook(item.id, item.name)}
      >
        <Ionicons name="trash-outline" size={24} color={colors.text} />
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  swipeActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  swipeAction: {
    width: 80,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteAction: {
    backgroundColor: '#FFD700',
  },
  deleteAction: {
    backgroundColor: '#FF4444',
  },
});
