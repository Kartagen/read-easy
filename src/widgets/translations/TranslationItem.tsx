import { Translation } from '@/shared/types/types';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/shared/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { useTranslationStore } from '@/entities/translations/stores/useTranslationStore';
import { useTheme } from '@/shared/hooks/useTheme';

export const TranslationItem = ({ item }: { item: Translation }) => {
  const { colors } = useTheme();
  const removeTranslation = useTranslationStore(
    (state) => state.removeTranslation,
  );

  return (
    <View style={[styles.translationItem, { backgroundColor: colors.card }]}>
      <View style={styles.header}>
        <ThemedText style={styles.bookName}>
          {item.bookName.substring(0, 28)}
        </ThemedText>
        <TouchableOpacity
          onPress={() => removeTranslation(item.id)}
          style={styles.deleteButton}
        >
          <Ionicons name="trash-outline" size={20} color={colors.error} />
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <ThemedText style={styles.label}>Original:</ThemedText>
          <ThemedText style={styles.text}>{item.originalText}</ThemedText>
        </View>
        <View style={styles.textContainer}>
          <ThemedText style={styles.label}>Translation:</ThemedText>
          <ThemedText style={styles.text}>{item.translatedText}</ThemedText>
        </View>
      </View>
      <ThemedText style={styles.timestamp}>
        {new Date(item.timestamp).toLocaleString()}
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  translationItem: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  bookName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    padding: 4,
  },
  content: {
    gap: 12,
  },
  textContainer: {
    gap: 4,
  },
  label: {
    fontSize: 14,
    opacity: 0.7,
  },
  text: {
    fontSize: 16,
  },
  timestamp: {
    fontSize: 12,
    opacity: 0.5,
    marginTop: 12,
  },
});
