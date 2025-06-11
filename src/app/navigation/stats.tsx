import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ThemedText } from '@/shared/components/ThemedText';
import { useTheme } from '@/shared/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { useStatistics } from '@/entities/statistics/hooks/useStatistics';
import {
  formatDate,
  formatTime,
} from '@/entities/statistics/helpers/formatDateTime.helper';

const Stats = () => {
  const { colors } = useTheme();
  const { totalReadingTime, totalPagesRead, totalBooks, statistics } =
    useStatistics();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <ThemedText style={styles.title}>Reading Statistics</ThemedText>
        </View>

        <View style={[styles.summaryCard, { backgroundColor: colors.card }]}>
          <View style={styles.summaryItem}>
            <Ionicons name="time-outline" size={24} color={colors.text} />
            <ThemedText style={styles.summaryValue}>
              {formatTime(totalReadingTime)}
            </ThemedText>
            <ThemedText style={styles.summaryLabel}>
              Total Reading Time
            </ThemedText>
          </View>
          <View style={styles.summaryItem}>
            <Ionicons name="book-outline" size={24} color={colors.text} />
            <ThemedText style={styles.summaryValue}>{totalBooks}</ThemedText>
            <ThemedText style={styles.summaryLabel}>Books Read</ThemedText>
          </View>
          <View style={styles.summaryItem}>
            <Ionicons
              name="document-text-outline"
              size={24}
              color={colors.text}
            />
            <ThemedText style={styles.summaryValue}>
              {totalPagesRead}
            </ThemedText>
            <ThemedText style={styles.summaryLabel}>Pages Read</ThemedText>
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Book Details</ThemedText>
          {statistics.map((stat) => (
            <View
              key={stat.bookId}
              style={[styles.bookCard, { backgroundColor: colors.card }]}
            >
              <ThemedText style={styles.bookName}>{stat.bookName}</ThemedText>
              <View style={styles.bookStats}>
                <View style={styles.statItem}>
                  <Ionicons name="time-outline" size={16} color={colors.text} />
                  <ThemedText style={styles.statValue}>
                    {formatTime(stat.totalReadingTime)}
                  </ThemedText>
                </View>
                <View style={styles.statItem}>
                  <Ionicons
                    name="document-text-outline"
                    size={16}
                    color={colors.text}
                  />
                  <ThemedText style={styles.statValue}>
                    {stat.pagesRead}/{stat.totalPages} pages
                  </ThemedText>
                </View>
                <View style={styles.statItem}>
                  <Ionicons
                    name="calendar-outline"
                    size={16}
                    color={colors.text}
                  />
                  <ThemedText style={styles.statValue}>
                    Last read: {formatDate(stat.lastReadDate)}
                  </ThemedText>
                </View>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${(stat.pagesRead / stat.totalPages) * 100}%`,
                      backgroundColor: colors.button,
                    },
                  ]}
                />
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  summaryCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  bookCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  bookName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  bookStats: {
    gap: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statValue: {
    fontSize: 14,
    opacity: 0.8,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 2,
    marginTop: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
});

export default Stats;
