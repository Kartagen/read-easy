import { ThemedText } from '@/shared/components/ThemedText';
import React from 'react';
import { View } from 'react-native';
import { useSettingsStore } from '@/entities/settings/stores/useSettingsStore';
import { useTheme } from '@/shared/hooks/useTheme';

interface RenderedTextProps {
  words: string[];
  currentPageContent: string;
  handleWordPress: (n: number) => void;
  selectedIndexes: number[];
  isSpeaking: boolean;
  currentWordIndex: number;
}

export const RenderedText = ({
  words,
  currentPageContent,
  handleWordPress,
  selectedIndexes,
  isSpeaking,
  currentWordIndex,
}: RenderedTextProps) => {
  const { colors } = useTheme();
  const { fontSize, fontFamily, lineSpacing } = useSettingsStore();
  if (!words.length) {
    return <ThemedText>{currentPageContent}</ThemedText>;
  }

  return words.map((word, index) =>
    words[index + 1] && words[index + 1].includes('\\newLine') ? (
      <React.Fragment key={index}>
        <ThemedText
          selectable={false}
          onPress={() => handleWordPress(index)}
          style={[
            {
              fontSize,
              fontFamily,
              lineHeight: fontSize * lineSpacing,
              backgroundColor: selectedIndexes.includes(index)
                ? colors.button + '40'
                : isSpeaking && index === currentWordIndex
                  ? colors.button + '20'
                  : 'transparent',
              marginRight: 'auto',
            },
          ]}
        >
          {word.replace('\\newLine', '   ') + ' '}
        </ThemedText>
        <View style={{ width: '100%', height: 0 }} />
      </React.Fragment>
    ) : (
      <ThemedText
        key={index}
        selectable={false}
        onPress={() => handleWordPress(index)}
        style={[
          {
            fontSize,
            fontFamily,
            lineHeight: fontSize * lineSpacing,
            backgroundColor: selectedIndexes.includes(index)
              ? colors.button + '40'
              : isSpeaking && index === currentWordIndex
                ? colors.button + '20'
                : 'transparent',
            marginRight: 'auto',
          },
        ]}
      >
        {word.replace('\\newLine', '   ') + ' '}
      </ThemedText>
    ),
  );
};
