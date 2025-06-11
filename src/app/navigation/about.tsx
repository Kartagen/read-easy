import React from 'react';
import {
  View,
  StyleSheet,
  Linking,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { ThemedText } from '@/shared/components/ThemedText';
import { useTheme } from '@/shared/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';

const About = () => {
  const { colors } = useTheme();

  const handleGithubPress = () => {
    Linking.openURL('https://github.com/Kartagen');
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <ThemedText style={styles.title}>ReadEasy</ThemedText>
          <ThemedText style={styles.version}>Version 1.0.0</ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>About</ThemedText>
          <ThemedText style={styles.description}>
            ReadEasy is a modern e-book reader application that supports
            multiple formats including TXT, EPUB, MOBI, and FB2. It features
            text-to-speech capabilities, translation tools, and a user-friendly
            interface for an enhanced reading experience.
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Developer</ThemedText>
          <View style={styles.developerInfo}>
            <ThemedText style={styles.developerName}>Vysochyn Illia</ThemedText>
            <TouchableOpacity
              style={styles.githubLink}
              onPress={handleGithubPress}
            >
              <Ionicons name="logo-github" size={24} color={colors.text} />
              <ThemedText style={styles.githubText}>@Kartagen</ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Features</ThemedText>
          <View style={styles.featureList}>
            <View style={styles.featureItem}>
              <Ionicons name="book-outline" size={20} color={colors.text} />
              <ThemedText style={styles.featureText}>
                Multiple book formats support
              </ThemedText>
            </View>
            <View style={styles.featureItem}>
              <Ionicons
                name="volume-high-outline"
                size={20}
                color={colors.text}
              />
              <ThemedText style={styles.featureText}>
                Text-to-speech functionality
              </ThemedText>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="language-outline" size={20} color={colors.text} />
              <ThemedText style={styles.featureText}>
                Translation tools
              </ThemedText>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="moon-outline" size={20} color={colors.text} />
              <ThemedText style={styles.featureText}>
                Dark mode support
              </ThemedText>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Copyright</ThemedText>
          <ThemedText style={styles.copyright}>
            © 2025 Vysochyn Illia. All rights reserved.
          </ThemedText>
          <ThemedText style={styles.copyright}>
            This application is licensed under the MIT License.
          </ThemedText>
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
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  version: {
    fontSize: 16,
    opacity: 0.7,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.8,
  },
  developerInfo: {
    marginTop: 8,
  },
  developerName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  githubLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  githubText: {
    fontSize: 16,
    opacity: 0.8,
  },
  featureList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 16,
    opacity: 0.8,
  },
  copyright: {
    fontSize: 14,
    opacity: 0.6,
    marginBottom: 4,
  },
});

export default About;
