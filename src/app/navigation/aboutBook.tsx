import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/shared/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/shared/hooks/useTheme';
import { formatFileSize } from '@/entities/books/helpers/formatFileSize.helper';
import { useAboutBook } from '@/entities/books/hooks/useAboutBook';

export default function AboutBook() {
  const { colors } = useTheme();
  const { book, handleShare, handleDelete, progress } = useAboutBook();
  if (!book) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ThemedText style={styles.message}>No book selected</ThemedText>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <ThemedText style={styles.title}>{book.name}</ThemedText>
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.button }]}
            onPress={handleShare}
          >
            <Ionicons
              name="share-outline"
              size={24}
              color={colors.buttonText}
            />
            <ThemedText
              style={[styles.actionButtonText, { color: colors.buttonText }]}
            >
              Share
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.error }]}
            onPress={handleDelete}
          >
            <Ionicons
              name="trash-outline"
              size={24}
              color={colors.buttonText}
            />
            <ThemedText
              style={[styles.actionButtonText, { color: colors.buttonText }]}
            >
              Delete
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <ThemedText style={styles.sectionTitle}>Book Information</ThemedText>
        <View style={styles.infoRow}>
          <ThemedText style={styles.infoLabel}>File Name:</ThemedText>
          <ThemedText style={styles.infoValue}>
            {book.name.substring(0, 20)}
          </ThemedText>
        </View>
        <View style={styles.infoRow}>
          <ThemedText style={styles.infoLabel}>File Size:</ThemedText>
          <ThemedText style={styles.infoValue}>
            {formatFileSize(book.fileSize)}
          </ThemedText>
        </View>
        <View style={styles.infoRow}>
          <ThemedText style={styles.infoLabel}>Total Pages:</ThemedText>
          <ThemedText style={styles.infoValue}>{book.totalPages}</ThemedText>
        </View>
        <View style={styles.infoRow}>
          <ThemedText style={styles.infoLabel}>Current Page:</ThemedText>
          <ThemedText style={styles.infoValue}>
            {(book?.currentPage ?? 0) + 1}
          </ThemedText>
        </View>
        <View style={styles.infoRow}>
          <ThemedText style={styles.infoLabel}>Last Read:</ThemedText>
          <ThemedText style={styles.infoValue}>
            {book.lastRead
              ? new Date(book.lastRead).toLocaleDateString()
              : 'Never'}
          </ThemedText>
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <ThemedText style={styles.sectionTitle}>Reading Progress</ThemedText>
        <View style={styles.progressContainer}>
          <View
            style={[styles.progressBar, { backgroundColor: colors.border }]}
          >
            <View
              style={[
                styles.progressFill,
                {
                  backgroundColor: colors.button,
                  width: `${progress}%`,
                },
              ]}
            />
          </View>
          <ThemedText style={styles.progressText}>
            {Math.round(progress)}% Complete
          </ThemedText>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    margin: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  section: {
    padding: 20,
    margin: 16,
    marginTop: 0,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  infoLabel: {
    fontSize: 16,
    opacity: 0.7,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    marginTop: 8,
    fontSize: 16,
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
    padding: 32,
  },
});
