import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/shared/components/ThemedText';
import { useSettingsStore } from '@/entities/settings/stores/useSettingsStore';
import { useTheme } from '@/shared/hooks/useTheme';
import Slider from '@react-native-community/slider';
import { LanguagePickList } from '@/widgets/settings/LanguagePickList';
import { useSettings } from '@/entities/settings/hooks/useSettings';

const Settings = () => {
  const { colors } = useTheme();
  const {
    localFontSize,
    updateFontSize,
    localLineSpacing,
    updateLineSpacing,
    localMarginWidth,
    updateMarginWidth,
    localVoiceSpeed,
    updateVoiceSpeed,
    localVoicePitch,
    updateVoicePitch,
  } = useSettings();
  const {
    theme: currentTheme,
    setTheme,
    fontFamily,
    setFontFamily,
    resetSettings,
  } = useSettingsStore();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Theme</ThemedText>
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor:
                  currentTheme === 'light' ? colors.button : colors.card,
              },
            ]}
            onPress={() => setTheme('light')}
          >
            <ThemedText
              style={[
                styles.buttonText,
                {
                  color:
                    currentTheme === 'light' ? colors.buttonText : colors.text,
                },
              ]}
            >
              Light
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor:
                  currentTheme === 'dark' ? colors.button : colors.card,
              },
            ]}
            onPress={() => setTheme('dark')}
          >
            <ThemedText
              style={[
                styles.buttonText,
                {
                  color:
                    currentTheme === 'dark' ? colors.buttonText : colors.text,
                },
              ]}
            >
              Dark
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor:
                  currentTheme === 'system' ? colors.button : colors.card,
              },
            ]}
            onPress={() => setTheme('system')}
          >
            <ThemedText
              style={[
                styles.buttonText,
                {
                  color:
                    currentTheme === 'system' ? colors.buttonText : colors.text,
                },
              ]}
            >
              System
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Text Settings</ThemedText>
        <View style={styles.sliderContainer}>
          <ThemedText>Font Size: {localFontSize}</ThemedText>
          <Slider
            style={styles.slider}
            minimumValue={12}
            maximumValue={24}
            step={1}
            value={localFontSize}
            onValueChange={updateFontSize}
            minimumTrackTintColor={colors.button}
            maximumTrackTintColor={colors.border}
            thumbTintColor={colors.button}
          />
        </View>

        <View style={styles.sliderContainer}>
          <ThemedText>Line Spacing: {localLineSpacing.toFixed(1)}</ThemedText>
          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={2}
            step={0.1}
            value={localLineSpacing}
            onValueChange={updateLineSpacing}
            minimumTrackTintColor={colors.button}
            maximumTrackTintColor={colors.border}
            thumbTintColor={colors.button}
          />
        </View>

        <View style={styles.sliderContainer}>
          <ThemedText>Margin Width: {localMarginWidth}</ThemedText>
          <Slider
            style={styles.slider}
            minimumValue={8}
            maximumValue={32}
            step={1}
            value={localMarginWidth}
            onValueChange={updateMarginWidth}
            minimumTrackTintColor={colors.button}
            maximumTrackTintColor={colors.border}
            thumbTintColor={colors.button}
          />
        </View>

        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor:
                  fontFamily === 'system' ? colors.button : colors.card,
              },
            ]}
            onPress={() => setFontFamily('system')}
          >
            <ThemedText
              style={[
                styles.buttonText,
                {
                  color:
                    fontFamily === 'system' ? colors.buttonText : colors.text,
                },
              ]}
            >
              System
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor:
                  fontFamily === 'serif' ? colors.button : colors.card,
              },
            ]}
            onPress={() => setFontFamily('serif')}
          >
            <ThemedText
              style={[
                styles.buttonText,
                {
                  color:
                    fontFamily === 'serif' ? colors.buttonText : colors.text,
                },
              ]}
            >
              Serif
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor:
                  fontFamily === 'monospace' ? colors.button : colors.card,
              },
            ]}
            onPress={() => setFontFamily('monospace')}
          >
            <ThemedText
              style={[
                styles.buttonText,
                {
                  color:
                    fontFamily === 'monospace'
                      ? colors.buttonText
                      : colors.text,
                },
              ]}
            >
              Mono
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <LanguagePickList type={'INTERFACE'} />
        <LanguagePickList type={'TRANSLATION'} />
        <LanguagePickList type={'VOICE'} />
      </View>

      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Voice Settings</ThemedText>
        <View style={styles.sliderContainer}>
          <ThemedText>Speed: {localVoiceSpeed.toFixed(1)}</ThemedText>
          <Slider
            style={styles.slider}
            minimumValue={0.5}
            maximumValue={2}
            step={0.1}
            value={localVoiceSpeed}
            onValueChange={updateVoiceSpeed}
            minimumTrackTintColor={colors.button}
            maximumTrackTintColor={colors.border}
            thumbTintColor={colors.button}
          />
        </View>

        <View style={styles.sliderContainer}>
          <ThemedText>Pitch: {localVoicePitch.toFixed(1)}</ThemedText>
          <Slider
            style={styles.slider}
            minimumValue={0.5}
            maximumValue={2}
            step={0.1}
            value={localVoicePitch}
            onValueChange={updateVoicePitch}
            minimumTrackTintColor={colors.button}
            maximumTrackTintColor={colors.border}
            thumbTintColor={colors.button}
          />
        </View>
      </View>

      <TouchableOpacity
        style={[styles.resetButton, { backgroundColor: colors.button }]}
        onPress={resetSettings}
      >
        <ThemedText
          style={[styles.resetButtonText, { color: colors.buttonText }]}
        >
          Reset to Default Settings
        </ThemedText>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
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
  sliderContainer: {
    marginBottom: 16,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  resetButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Settings;
