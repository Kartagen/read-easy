import AsyncStorage from '@react-native-async-storage/async-storage';
import { Toast } from 'toastify-react-native';

// Helper functions for type-safe storage operations
export const storageUtils = {
  set: async <T>(key: string, value: T): Promise<void> => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      Toast.error('Error saving to storage:' + error);
    }
  },

  get: async <T>(key: string, defaultValue: T): Promise<T> => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);

      return jsonValue ? JSON.parse(jsonValue) : defaultValue;
    } catch (error) {
      Toast.error('Error reading from storage:' + error);

      return defaultValue;
    }
  },

  remove: async (key: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      Toast.error('Error removing from storage:' + error);
    }
  },

  clear: async (): Promise<void> => {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      Toast.error('Error clearing storage:' + error);
    }
  },
};
