import {
  Book,
  FontFamily,
  Language,
  LanguageOption,
  Theme,
} from '@/shared/types/types';

export const CHAR_WIDTHS: { [key: string]: number } = {
  // Punctuation
  '.': 0.25,
  ',': 0.25,
  ';': 0.25,
  ':': 0.25,
  '!': 0.25,
  '?': 0.65,
  '"': 0.25,
  "'": 0.25,
  '(': 0.65,
  ')': 0.65,
  '[': 0.65,
  ']': 0.65,
  '{': 0.65,
  '}': 0.65,
  '<': 0.65,
  '>': 0.65,
  '/': 0.65,
  '|': 0.15,
  '-': 0.45,
  _: 0.65,
  '—': 1,
  '+': 0.5,
  '=': 0.5,
  '*': 0.5,
  '&': 0.65,
  '@': 0.65,
  '#': 0.65,
  $: 0.65,
  '%': 0.65,
  '^': 0.65,
  '~': 0.65,
  '`': 0.25,

  // Numbers
  '0': 0.65,
  '1': 0.65,
  '2': 0.65,
  '3': 0.65,
  '4': 0.65,
  '5': 0.65,
  '6': 0.65,
  '7': 0.65,
  '8': 0.65,
  '9': 0.65,

  // Special characters
  ' ': 0.3,
  '\t': 1.2,
  '\n': 0,
  ш: 0.8,
  щ: 0.8,
  ю: 0.8,
  м: 0.8,
  ы: 0.8,
  ф: 0.8,
  ж: 0.8,
  w: 0.8,
  m: 0.8,
  i: 0.5,
  I: 0.5,
};

export const FONT_COEFFICIENT = {
  serif: 1,
  monospace: 1.15,
  system: 1,
};

export const DEFAULT_BOOK: Book = {
  id: '',
  name: '',
  type: 'epub',
  content: '',
  fileSize: 0,
  currentPage: 0,
  totalPages: 0,
  pages: [],
  lastRead: '',
  filePath: '',
  isFavorite: false,
};

export const STORAGE_KEY = 'app-settings';
export const STATISTIC_KEY = 'app-statistic';
export const BOOKS_STORAGE_KEY = 'books_state';
export const LAST_BOOK_KEY = 'last_book';

export const DEFAULT_SETTINGS = {
  theme: 'system' as Theme,
  fontSize: 18,
  fontFamily: 'system' as FontFamily,
  lineSpacing: 1.5,
  marginWidth: 16,
  interfaceLanguage: 'uk-UA' as Language,
  voiceLanguage: 'uk-UA' as Language,
  translationLanguage: 'en-US' as Language,
  voiceSpeed: 1,
  voicePitch: 1,
};

export const AUTO_LANGUAGE: LanguageOption = {
  code: 'auto' as Language,
  label: 'Auto',
};

export const languages: LanguageOption[] = [
  { code: 'en-US', label: 'Eng' },
  { code: 'zh-CN', label: '中文' },
  { code: 'hi-IN', label: 'हिन्दी' },
  { code: 'es-ES', label: 'Esp' },
  { code: 'fr-FR', label: 'Fra' },
  { code: 'ar-SA', label: 'عربى' },
  { code: 'bn-BD', label: 'Bng' },
  { code: 'pt-BR', label: 'Por' },
  { code: 'ru-RU', label: 'Рус' },
  { code: 'ja-JP', label: '日' },
  { code: 'de-DE', label: 'Deu' },
  { code: 'jv-ID', label: 'Jav' },
  { code: 'ko-KR', label: 'Kor' },
  { code: 'vi-VN', label: 'Vie' },
  { code: 'te-IN', label: 'Tel' },
  { code: 'tr-TR', label: 'Tur' },
  { code: 'ta-IN', label: 'Tam' },
  { code: 'mr-IN', label: 'Mar' },
  { code: 'it-IT', label: 'Ita' },
  { code: 'uk-UA', label: 'Укр' },
];

export const HEADER_HEIGHT = 80;
export const NAME_HEIGHT = 95;
export const FOOTER_HEIGHT = 38;
