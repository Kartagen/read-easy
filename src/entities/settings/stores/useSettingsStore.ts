import { create } from 'zustand';
import { storageUtils } from '@/shared/utils/storage';
import { DEFAULT_SETTINGS, STORAGE_KEY } from '@/shared/constants/constants';
import { SettingsState } from '@/shared/types/types';

export const useSettingsStore = create<SettingsState>((set) => ({
  ...DEFAULT_SETTINGS,

  setTheme: async (theme) => {
    set({ theme });
    const currentSettings = await storageUtils.get(
      STORAGE_KEY,
      DEFAULT_SETTINGS,
    );
    await storageUtils.set(STORAGE_KEY, { ...currentSettings, theme });
  },

  setFontSize: async (fontSize) => {
    set({ fontSize });
    const currentSettings = await storageUtils.get(
      STORAGE_KEY,
      DEFAULT_SETTINGS,
    );
    await storageUtils.set(STORAGE_KEY, { ...currentSettings, fontSize });
  },

  setFontFamily: async (fontFamily) => {
    set({ fontFamily });
    const currentSettings = await storageUtils.get(
      STORAGE_KEY,
      DEFAULT_SETTINGS,
    );
    await storageUtils.set(STORAGE_KEY, { ...currentSettings, fontFamily });
  },

  setLineSpacing: async (lineSpacing) => {
    set({ lineSpacing });
    const currentSettings = await storageUtils.get(
      STORAGE_KEY,
      DEFAULT_SETTINGS,
    );
    await storageUtils.set(STORAGE_KEY, { ...currentSettings, lineSpacing });
  },

  setMarginWidth: async (marginWidth) => {
    set({ marginWidth });
    const currentSettings = await storageUtils.get(
      STORAGE_KEY,
      DEFAULT_SETTINGS,
    );
    await storageUtils.set(STORAGE_KEY, { ...currentSettings, marginWidth });
  },

  setInterfaceLanguage: async (interfaceLanguage) => {
    set({ interfaceLanguage });
    const currentSettings = await storageUtils.get(
      STORAGE_KEY,
      DEFAULT_SETTINGS,
    );
    await storageUtils.set(STORAGE_KEY, {
      ...currentSettings,
      interfaceLanguage,
    });
  },

  setVoiceLanguage: async (voiceLanguage) => {
    set({ voiceLanguage });
    const currentSettings = await storageUtils.get(
      STORAGE_KEY,
      DEFAULT_SETTINGS,
    );
    await storageUtils.set(STORAGE_KEY, { ...currentSettings, voiceLanguage });
  },

  setTranslationLanguage: async (translationLanguage) => {
    set({ translationLanguage });
    const currentSettings = await storageUtils.get(
      STORAGE_KEY,
      DEFAULT_SETTINGS,
    );
    await storageUtils.set(STORAGE_KEY, {
      ...currentSettings,
      translationLanguage,
    });
  },

  setVoiceSpeed: async (voiceSpeed) => {
    set({ voiceSpeed });
    const currentSettings = await storageUtils.get(
      STORAGE_KEY,
      DEFAULT_SETTINGS,
    );
    await storageUtils.set(STORAGE_KEY, { ...currentSettings, voiceSpeed });
  },

  setVoicePitch: async (voicePitch) => {
    set({ voicePitch });
    const currentSettings = await storageUtils.get(
      STORAGE_KEY,
      DEFAULT_SETTINGS,
    );
    await storageUtils.set(STORAGE_KEY, { ...currentSettings, voicePitch });
  },

  resetSettings: async () => {
    set(DEFAULT_SETTINGS);
    await storageUtils.set(STORAGE_KEY, DEFAULT_SETTINGS);
  },
}));

// Load initial settings
storageUtils.get(STORAGE_KEY, DEFAULT_SETTINGS).then((savedSettings) => {
  useSettingsStore.setState(savedSettings);
});
