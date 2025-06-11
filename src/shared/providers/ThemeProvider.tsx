import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { useSettingsStore } from '@/entities/settings/stores/useSettingsStore';

interface ThemeColors {
  background: string;
  text: string;
  border: string;
  card: string;
  cardText: string;
  button: string;
  buttonText: string;
  drawerBackground: string;
  drawerText: string;
  drawerActive: string;
  drawerActiveText: string;
  accent: string;
  error: string;
}

interface ThemeContextType {
  colors: ThemeColors;
  isDark: boolean;
}

const lightColors: ThemeColors = {
  background: '#FFFFFF',
  text: '#000000',
  border: '#E5E5E5',
  card: '#F5F5F5',
  cardText: '#000000',
  button: '#007AFF',
  buttonText: '#FFFFFF',
  drawerBackground: '#FFFFFF',
  drawerText: '#000000',
  drawerActive: '#007AFF',
  drawerActiveText: '#FFFFFF',
  accent: '#FFD700',
  error: '#FF3B30',
};

const darkColors: ThemeColors = {
  background: '#000000',
  text: '#FFFFFF',
  border: '#333333',
  card: '#1C1C1E',
  cardText: '#FFFFFF',
  button: '#0A84FF',
  buttonText: '#FFFFFF',
  drawerBackground: '#1C1C1E',
  drawerText: '#FFFFFF',
  drawerActive: '#0A84FF',
  drawerActiveText: '#FFFFFF',
  accent: '#FFD700',
  error: '#FF453A',
};

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined,
);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const systemColorScheme = useColorScheme();
  const { theme } = useSettingsStore();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (theme === 'system') {
      setIsDark(systemColorScheme === 'dark');
    } else {
      setIsDark(theme === 'dark');
    }
  }, [theme, systemColorScheme]);

  const colors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ colors, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};
