import { ThemedText } from '@/shared/components/ThemedText';
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { AUTO_LANGUAGE, languages } from '@/shared/constants/constants';
import React from 'react';
import { useTheme } from '@/shared/hooks/useTheme';
import { useSettingsStore } from '@/entities/settings/stores/useSettingsStore';

type LanguageSettingsType = 'INTERFACE' | 'TRANSLATION' | 'VOICE';

export const LanguagePickList = ({ type }: { type: LanguageSettingsType }) => {
  const { colors } = useTheme();
  const {
    interfaceLanguage,
    setInterfaceLanguage,
    voiceLanguage,
    setVoiceLanguage,
    translationLanguage,
    setTranslationLanguage,
  } = useSettingsStore();

  const languageConfig = {
    INTERFACE: {
      currentLanguage: interfaceLanguage,
      setLanguage: setInterfaceLanguage,
      data: languages,
      title: 'Interface language',
    },
    TRANSLATION: {
      currentLanguage: translationLanguage,
      setLanguage: setTranslationLanguage,
      data: languages,
      title: 'Translation language',
    },
    VOICE: {
      currentLanguage: voiceLanguage,
      setLanguage: setVoiceLanguage,
      data: [AUTO_LANGUAGE, ...languages],
      title: 'Voice language',
    },
  };

  const config = languageConfig[type];

  return (
    <>
      <ThemedText style={styles.sectionTitle}>{config.title}</ThemedText>
      <FlatList
        data={config.data}
        horizontal
        keyExtractor={(item) => item.code}
        contentContainerStyle={styles.buttonGroup}
        renderItem={({ item: lang }) => (
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor:
                  config.currentLanguage === lang.code
                    ? colors.button
                    : colors.card,
              },
            ]}
            onPress={() => config.setLanguage(lang.code)}
          >
            <ThemedText
              style={[
                styles.buttonText,
                {
                  color:
                    config.currentLanguage === lang.code
                      ? colors.buttonText
                      : colors.text,
                },
              ]}
            >
              {lang.label}
            </ThemedText>
          </TouchableOpacity>
        )}
      />
    </>
  );
};
const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  button: {
    flex: 1,
    padding: 12,
    minWidth: 50,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
  },
});
