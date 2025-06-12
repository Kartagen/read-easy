import React from 'react';
import {
  Modal,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { ThemedText } from '@/shared/components/ThemedText';
import { useTheme } from '@/shared/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { useReader } from '@/entities/reader/hooks/useReader';
import { RenderedText } from '@/features/renderedText/RenderedText';

const Reader = () => {
  const { colors } = useTheme();
  const {
    words,
    changePage,
    currentPageContent,
    handleWordPress,
    marginWidth,
    selectedIndexes,
    isSpeaking,
    currentWordIndex,
    currentBook,
    isLoading,
    isUsingSpeech,
    isUsingTranslate,
    isUsingGoTo,
    isUsingSearch,
    inputField,
    gesture,
    animatedStyle,
    currentPage,
    showTranslationModal,
    setShowTranslationModal,
    handleInput,
    selectedText,
    translatedText,
    handleSaveTranslation,
    useOffline,
    handleChangeNetwork,
    handleResetPosition,
    handleClose,
    handleFind,
    handleSpeech,
    handleTranslation,
  } = useReader();

  if (!currentBook) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ThemedText style={styles.message}>
          No book loaded. Please select a book from the library.
        </ThemedText>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <ThemedText>Loading book content...</ThemedText>
        </View>
      </View>
    );
  }

  const showBottomBar =
    isUsingSpeech || isUsingTranslate || isUsingGoTo || isUsingSearch;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {!showBottomBar && (
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <ThemedText numberOfLines={1} style={styles.title}>
            {currentBook.name}
          </ThemedText>
        </View>
      )}

      <GestureDetector gesture={gesture}>
        <Animated.View
          style={[
            styles.pageContainer,
            showBottomBar && styles.pageContainerWithBar,
            animatedStyle,
            { backgroundColor: colors.card },
          ]}
        >
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              flex: 1,
              paddingHorizontal: marginWidth,
              width: '100%',
            }}
          >
            <RenderedText
              currentPageContent={currentPageContent}
              currentWordIndex={currentWordIndex}
              handleWordPress={handleWordPress}
              selectedIndexes={selectedIndexes}
              words={words}
              isSpeaking={isSpeaking}
            />
          </View>
          <ThemedText style={styles.pageNumber}>
            {currentPage + 1}/{currentBook.totalPages || 0}
          </ThemedText>
        </Animated.View>
      </GestureDetector>

      <Modal
        visible={showTranslationModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowTranslationModal(false)}
      >
        <View
          style={[
            styles.modalContainer,
            { backgroundColor: colors.background + '99' },
          ]}
        >
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>Translation</ThemedText>
              <TouchableOpacity
                onPress={() => setShowTranslationModal(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <View style={styles.translationContent}>
              <View style={styles.textContainer}>
                <ThemedText style={styles.label}>Original Text:</ThemedText>
                <ThemedText style={styles.text}>
                  {selectedText.replace('\\newLine', ' ')}
                </ThemedText>
              </View>
              <View style={styles.textContainer}>
                <ThemedText style={styles.label}>Translation:</ThemedText>
                <ThemedText style={styles.text}>{translatedText}</ThemedText>
              </View>
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.button }]}
                onPress={handleSaveTranslation}
              >
                <ThemedText
                  style={[styles.buttonText, { color: colors.buttonText }]}
                >
                  Save Translation
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {showBottomBar && (
        <View style={[styles.bottomBar, { backgroundColor: colors.card }]}>
          <View style={styles.bottomBarHeader}>
            <View style={styles.bottomBarTitleContainer}>
              <ThemedText style={styles.bottomBarTitle}>
                {isUsingSpeech
                  ? 'Text to Speech'
                  : isUsingTranslate
                    ? 'Translation'
                    : isUsingGoTo
                      ? 'Go To'
                      : 'Search text'}
              </ThemedText>
              <ThemedText style={styles.bottomBarPage}>
                Page {currentPage + 1}/{currentBook.totalPages + 1 || 0}
              </ThemedText>
              <ThemedText style={styles.bottomBarPage}>
                Is offline {String(useOffline)}
              </ThemedText>
            </View>
            <View style={styles.bottomBarControls}>
              <TouchableOpacity
                onPress={handleChangeNetwork}
                style={styles.closeButton}
              >
                <Ionicons
                  size={24}
                  color={colors.text}
                  name={useOffline ? 'globe' : 'globe-outline'}
                />
              </TouchableOpacity>
              {isUsingSpeech && (
                <TouchableOpacity
                  onPress={handleResetPosition}
                  style={styles.resetButton}
                >
                  <Ionicons name="refresh" size={24} color={colors.text} />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={handleClose}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
          </View>

          {(isUsingGoTo || isUsingSearch) && (
            <TextInput
              style={[
                styles.input,
                {
                  width: isUsingGoTo ? 110 : '100%',
                  color: colors.text,
                  backgroundColor: colors.background,
                },
              ]}
              placeholder={isUsingGoTo ? 'Select Page' : 'Write Something...'}
              value={inputField}
              keyboardType={isUsingGoTo ? 'numeric' : 'default'}
              onChangeText={handleInput}
            />
          )}
          <View style={styles.bottomBarActions}>
            {isUsingSpeech ? (
              <TouchableOpacity
                style={[
                  styles.bottomBarButton,
                  { backgroundColor: colors.button },
                ]}
                onPress={handleSpeech}
              >
                <Ionicons
                  name={isSpeaking ? 'pause' : 'play'}
                  size={24}
                  color={colors.buttonText}
                />
              </TouchableOpacity>
            ) : isUsingTranslate ? (
              <>
                <TouchableOpacity
                  style={[
                    styles.bottomBarButton,
                    { backgroundColor: colors.button },
                  ]}
                  onPress={() => {
                    handleTranslation();
                    setShowTranslationModal(true);
                  }}
                >
                  <Ionicons
                    name="language-outline"
                    size={24}
                    color={colors.buttonText}
                  />
                </TouchableOpacity>
              </>
            ) : isUsingGoTo ? (
              <>
                <TouchableOpacity
                  style={[
                    styles.bottomBarButton,
                    { backgroundColor: colors.button },
                  ]}
                  onPress={() => {
                    changePage(+inputField, true);
                    handleClose();
                  }}
                >
                  <Ionicons
                    name="book-outline"
                    size={24}
                    color={colors.buttonText}
                  />
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity
                  style={[
                    styles.bottomBarButton,
                    { backgroundColor: colors.button },
                  ]}
                  onPress={() => {
                    handleFind();
                  }}
                >
                  <Ionicons
                    name="search-outline"
                    size={24}
                    color={colors.buttonText}
                  />
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
  },
  title: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  pageContainer: {
    flex: 1,
    padding: 16,
    margin: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  pageContainerWithBar: {
    marginBottom: 90,
    marginTop: 0,
  },
  pageNumber: {
    textAlign: 'center',
    marginTop: 16,
    opacity: 0.5,
  },
  input: {
    alignSelf: 'center',
    textAlign: 'center',
    height: 50,
    fontSize: 16,
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 4,
    marginBottom: 12,
  },
  message: {
    textAlign: 'center',
    padding: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  bottomBarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  bottomBarTitleContainer: {
    flex: 1,
  },
  bottomBarTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomBarPage: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 2,
  },
  closeButton: {
    padding: 4,
  },
  bottomBarText: {
    fontSize: 16,
    minHeight: 60,
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  bottomBarActions: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  bottomBarButton: {
    padding: 12,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  bottomBarControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  resetButton: {
    padding: 4,
  },
  translationContainer: {
    marginBottom: 12,
  },
  translationText: {
    fontSize: 16,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    width: '100%',
    borderRadius: 12,
    padding: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  translationContent: {
    gap: 16,
  },
  textContainer: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    opacity: 0.7,
  },
  text: {
    fontSize: 16,
  },
  modalActions: {
    marginTop: 24,
  },
  modalButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Reader;
