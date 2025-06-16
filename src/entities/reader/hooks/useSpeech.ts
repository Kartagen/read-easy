import { useSettingsStore } from '@/entities/settings/stores/useSettingsStore';
import { useEffect, useRef, useState } from 'react';
import { useAudioPlayer } from 'expo-audio';
import * as Speech from 'expo-speech';
import { Toast } from 'toastify-react-native';
import * as FileSystem from 'expo-file-system';
import { UseSpeechProps } from '@/shared/types/types';

export const useSpeech = ({
  isOnline,
  selectedText,
  currentPageContent,
  currentPage,
  currentBook,
  words,
  changePage,
}: UseSpeechProps) => {
  const voiceLanguage = useSettingsStore((state) => state.voiceLanguage);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [pausedPosition, setPausedPosition] = useState<number>(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const wordTimerRef = useRef<ReturnType<typeof setInterval> | undefined>(
    undefined,
  );
  const player = useAudioPlayer(null);

  const handleSpeech = async () => {
    if (player.currentStatus.playing || isSpeaking) {
      player.pause();
      await Speech.stop();
      setIsSpeaking(false);
      setPausedPosition(currentWordIndex);

      return;
    }
    const online = await isOnline();
    if (online) {
      try {
        await playGoogleTTS();
      } catch (error) {
        Toast.error('error' + error);
        await handleSpeechOffline();
      }
    } else {
      await handleSpeechOffline();
    }
  };

  async function playGoogleTTS() {
    setIsSpeaking(true);
    const textToSpeak =
      selectedText ||
      currentPageContent.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ');

    const apiKey = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;
    const language =
      voiceLanguage.toString() === 'auto'
        ? undefined
        : voiceLanguage.toString();
    const voices = await fetch(
      `https://texttospeech.googleapis.com/v1/voices?languageCode=${language}&key=${apiKey}`,
    );
    const voicesData: {
      voices: {
        languageCodes: string[];
        name: string;
        naturalSampleRateHertz: number;
        ssmlGender: string;
      }[];
    } = await voices.json();
    const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`;
    const voiceOptions = language
      ? {
          languageCode: language,
          name:
            voicesData.voices.find((voice) => voice.name.includes(language))
              ?.name ??
            voicesData.voices.find((voice) =>
              voice.languageCodes.find((code) => code === language),
            )?.name,
        }
      : {
          languageCode: 'en-US',
        };
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        input: { text: textToSpeak.replace(/\\newLine/g, ' ') },
        voice: {
          ...voiceOptions,
        },
        audioConfig: { audioEncoding: 'MP3' },
      }),
    });
    const result = await response.json();
    if (!result.audioContent) {
      setIsSpeaking(false);
      Toast.error(String(result).slice(0, 25));
      throw new Error(result.error?.message || 'Failed to get audio');
    }

    const fileUri = FileSystem.cacheDirectory + 'google_tts.mp3';
    await FileSystem.writeAsStringAsync(fileUri, result.audioContent, {
      encoding: FileSystem.EncodingType.Base64,
    });

    player.replace(fileUri);
    while (!player.isLoaded) {
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
    setIsSpeaking(true);
    player.play();
  }

  const handleSpeechOffline = async () => {
    const baseText = selectedText || currentPageContent;

    const textToSpeak = (
      pausedPosition !== 0
        ? baseText.split(/\s+/).slice(pausedPosition).join(' ')
        : baseText
    ).replace(/\\newLine/g, ' ');
    setIsSpeaking(true);

    const speechHandlers = {
      ...(voiceLanguage.toString() !== 'auto' && { language: voiceLanguage }),
      onDone: () => {
        setIsSpeaking(false);
        setPausedPosition(0);

        if (!selectedText && currentPage < (currentBook?.totalPages || 1) - 1) {
          changePage(1);
          setTimeout(() => handleSpeech(), 500);
        }
      },

      onError: () => {
        setIsSpeaking(false);
        setPausedPosition(0);
      },

      onStopped: () => {
        setIsSpeaking(false);
      },

      onBoundary: (boundaries: { charIndex: number; charLength: number }) => {
        const { charIndex, charLength } = boundaries;
        const word = textToSpeak.substring(charIndex, charIndex + charLength);
        const wordIndex = words.findIndex((w) => w.includes(word));

        if (wordIndex !== -1) {
          setCurrentWordIndex(wordIndex);
        }
      },
    };

    Speech.speak(textToSpeak, speechHandlers);
  };

  const handleResetPosition = () => {
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
    }
    setCurrentWordIndex(0);
    setPausedPosition(0);
  };

  useEffect(() => {
    return () => {
      if (wordTimerRef.current) {
        clearInterval(wordTimerRef.current);
      }
    };
  }, []);

  return {
    isSpeaking,
    setIsSpeaking,
    currentWordIndex,
    setCurrentWordIndex,
    handleSpeech,
    handleResetPosition,
  };
};
