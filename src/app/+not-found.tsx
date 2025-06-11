import { Link, Stack } from 'expo-router';
import { StyleSheet } from 'react-native';
import { ThemedView } from '@/shared/components/ThemedView';
import { ThemedText } from '@/shared/components/ThemedText';
import React from 'react';

const NotFound = () => {
  return (
    <React.Fragment>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <ThemedView style={styles.container}>
        <ThemedText style={styles.title}>
          This screen doesn&#39;t exist.
        </ThemedText>
        <Link href="/navigation/library" style={styles.link}>
          <ThemedText style={styles.link}>Go to home screen!</ThemedText>
        </Link>
      </ThemedView>
    </React.Fragment>
  );
};

export default NotFound;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
