import 'expo-dev-client';
import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from '@/shared/providers/ThemeProvider';
import { useBookStore } from '@/entities/books/stores/useBookStore';
import React, { useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, View } from 'react-native';
import { useReaderStore } from '@/entities/reader/stores/useReaderStore';
import { useTheme } from '@/shared/hooks/useTheme';
import { ThemedText } from '@/shared/components/ThemedText';
import { styles } from '@/shared/styles/styles';
import ToastManager from 'toastify-react-native';

export default function Layout() {
  useFonts({
    SpaceMono: require('../shared/assets/fonts/SpaceMono-Regular.ttf'),
  });

  const loadSavedState = useBookStore((state) => state.loadSavedState);

  useEffect(() => {
    loadSavedState();
  }, [loadSavedState]);

  return (
    <ThemeProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style="auto" />
        <DrawerLayout />
        <ToastManager />
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}

function DrawerLayout() {
  const { colors } = useTheme();

  const readerButtons = () => {
    const [isExpanded, setIsExpanded] = React.useState(false);
    const { colors } = useTheme();
    const { setUsingSpeech, setUsingTranslate, setUsingGoTo, setUsingSearch } =
      useReaderStore();

    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {isExpanded && (
          <View
            style={{
              position: 'absolute',
              top: 50,
              right: 0,
              backgroundColor: colors.card,
              borderRadius: 8,
              padding: 8,
              elevation: 5,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              zIndex: 1000,
            }}
          >
            <TouchableOpacity
              style={[styles.menuButton, { borderBottomColor: colors.border }]}
              onPress={() => {
                setUsingTranslate(true);
                setIsExpanded(false);
              }}
            >
              <Ionicons name="language-outline" size={20} color={colors.text} />
              <ThemedText style={styles.menuButtonText}>Translate</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.menuButton, { borderBottomColor: colors.border }]}
              onPress={() => {
                setUsingSpeech(true);
                setIsExpanded(false);
              }}
            >
              <Ionicons
                name="volume-high-outline"
                size={20}
                color={colors.text}
              />
              <ThemedText style={styles.menuButtonText}>Speak</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.menuButton, { borderBottomColor: colors.border }]}
              onPress={() => {
                setUsingGoTo(true);
                setIsExpanded(false);
              }}
            >
              <Ionicons name="book-outline" size={20} color={colors.text} />
              <ThemedText style={styles.menuButtonText}>Go to Page</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.menuButton, { borderBottomWidth: 0 }]}
              onPress={() => {
                setUsingSearch(true);
                setIsExpanded(false);
              }}
            >
              <Ionicons name="search-outline" size={20} color={colors.text} />
              <ThemedText style={styles.menuButtonText}>
                Find in Book
              </ThemedText>
            </TouchableOpacity>
          </View>
        )}
        <TouchableOpacity
          style={{ paddingHorizontal: 8 }}
          onPress={() => setIsExpanded(!isExpanded)}
        >
          <Ionicons
            name="settings-outline"
            style={{ marginVertical: 8, marginHorizontal: 5 }}
            size={24}
            color={colors.text}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Drawer
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          color: colors.text,
        },
        drawerStyle: {
          backgroundColor: colors.drawerBackground,
        },
        drawerLabelStyle: {
          color: colors.drawerText,
        },
        drawerActiveTintColor: colors.drawerActive,
        drawerActiveBackgroundColor: colors.drawerActive,
        drawerInactiveTintColor: colors.drawerText,
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          headerShown: false,
          drawerItemStyle: { display: 'none' },
        }}
      />
      <Drawer.Screen
        name="navigation/library"
        options={{
          title: 'Library',
          drawerLabel: '📚 Library',
          headerShown: true,
        }}
      />
      <Drawer.Screen
        name="navigation/reader"
        options={{
          title: 'Reading',
          drawerLabel: '📖 Reading',
          headerRight: readerButtons,
        }}
      />
      <Drawer.Screen
        name="navigation/aboutBook"
        options={{ title: 'About Book', drawerLabel: 'ℹ️ About Book' }}
      />
      <Drawer.Screen
        name="navigation/history"
        options={{ title: 'History', drawerLabel: '🕘 History' }}
      />
      <Drawer.Screen
        name="navigation/stats"
        options={{ title: 'Statistics', drawerLabel: '📊 Statistics' }}
      />
      <Drawer.Screen
        name="navigation/settings"
        options={{ title: 'Settings', drawerLabel: '⚙️ Settings' }}
      />
      <Drawer.Screen
        name="navigation/about"
        options={{ title: 'About App', drawerLabel: 'ℹ️ About App' }}
      />
      <Drawer.Screen
        name="+not-found"
        options={{ drawerItemStyle: { display: 'none' } }}
      />
    </Drawer>
  );
}
