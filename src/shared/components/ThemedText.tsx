import React from 'react';
import {
  Text,
  TextProps,
  StyleSheet,
  NativeSyntheticEvent,
  TextInputSelectionChangeEventData,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface ThemedTextProps extends TextProps {
  children: React.ReactNode;
  onSelectionChange?: (
    event: NativeSyntheticEvent<TextInputSelectionChangeEventData>,
  ) => void;
}

export const ThemedText: React.FC<ThemedTextProps> = ({ style, ...props }) => {
  const { colors } = useTheme();

  return (
    <Text style={[styles.text, { color: colors.text }, style]} {...props} />
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
  },
});
