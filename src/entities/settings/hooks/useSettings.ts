import { useSettingsStore } from '@/entities/settings/stores/useSettingsStore';
import { useCallback, useEffect, useState } from 'react';
import debounce from 'lodash/debounce';

export const useSettings = () => {
  const {
    fontSize,
    setFontSize,
    lineSpacing,
    setLineSpacing,
    marginWidth,
    setMarginWidth,
    voiceSpeed,
    setVoiceSpeed,
    voicePitch,
    setVoicePitch,
  } = useSettingsStore();

  // Local state for immediate slider updates
  const [localFontSize, setLocalFontSize] = useState(fontSize);
  const [localLineSpacing, setLocalLineSpacing] = useState(lineSpacing);
  const [localMarginWidth, setLocalMarginWidth] = useState(marginWidth);
  const [localVoiceSpeed, setLocalVoiceSpeed] = useState(voiceSpeed);
  const [localVoicePitch, setLocalVoicePitch] = useState(voicePitch);

  // Create debounced update functions
  const debouncedSetFontSize = useCallback(
    debounce((value: number) => {
      setFontSize(value);
    }, 100),
    [setFontSize],
  );

  const debouncedSetLineSpacing = useCallback(
    debounce((value: number) => {
      setLineSpacing(value);
    }, 100),
    [setLineSpacing],
  );

  const debouncedSetMarginWidth = useCallback(
    debounce((value: number) => {
      setMarginWidth(value);
    }, 100),
    [setMarginWidth],
  );

  const debouncedSetVoiceSpeed = useCallback(
    debounce((value: number) => {
      setVoiceSpeed(value);
    }, 100),
    [setVoiceSpeed],
  );

  const debouncedSetVoicePitch = useCallback(
    debounce((value: number) => {
      setVoicePitch(value);
    }, 100),
    [setVoicePitch],
  );

  // Update local state when store values change
  useEffect(() => {
    setLocalFontSize(fontSize);
  }, [fontSize]);

  useEffect(() => {
    setLocalLineSpacing(lineSpacing);
  }, [lineSpacing]);

  useEffect(() => {
    setLocalMarginWidth(marginWidth);
  }, [marginWidth]);

  useEffect(() => {
    setLocalVoiceSpeed(voiceSpeed);
  }, [voiceSpeed]);

  useEffect(() => {
    setLocalVoicePitch(voicePitch);
  }, [voicePitch]);

  // Cleanup debounced functions
  useEffect(() => {
    return () => {
      debouncedSetFontSize.cancel();
      debouncedSetLineSpacing.cancel();
      debouncedSetMarginWidth.cancel();
      debouncedSetVoiceSpeed.cancel();
      debouncedSetVoicePitch.cancel();
    };
  }, []);

  // Update functions that handle both local and debounced store updates
  const updateFontSize = useCallback(
    (value: number) => {
      setLocalFontSize(value);
      debouncedSetFontSize(value);
    },
    [debouncedSetFontSize],
  );

  const updateLineSpacing = useCallback(
    (value: number) => {
      setLocalLineSpacing(value);
      debouncedSetLineSpacing(value);
    },
    [debouncedSetLineSpacing],
  );

  const updateMarginWidth = useCallback(
    (value: number) => {
      setLocalMarginWidth(value);
      debouncedSetMarginWidth(value);
    },
    [debouncedSetMarginWidth],
  );

  const updateVoiceSpeed = useCallback(
    (value: number) => {
      setLocalVoiceSpeed(value);
      debouncedSetVoiceSpeed(value);
    },
    [debouncedSetVoiceSpeed],
  );

  const updateVoicePitch = useCallback(
    (value: number) => {
      setLocalVoicePitch(value);
      debouncedSetVoicePitch(value);
    },
    [debouncedSetVoicePitch],
  );

  return {
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
  };
};
