export type Theme = 'light' | 'dark' | 'system';
export type Language =
  | 'en-US' // English (United States)
  | 'zh-CN' // Chinese (Mandarin, Simplified)
  | 'hi-IN' // Hindi (India)
  | 'es-ES' // Spanish (Spain)
  | 'fr-FR' // French (France)
  | 'ar-SA' // Arabic (Saudi Arabia)
  | 'bn-BD' // Bengali (Bangladesh)
  | 'pt-BR' // Portuguese (Brazil)
  | 'ru-RU' // Russian (Russia)
  | 'ja-JP' // Japanese (Japan)
  | 'de-DE' // German (Germany)
  | 'jv-ID' // Javanese (Indonesia)
  | 'ko-KR' // Korean (South Korea)
  | 'vi-VN' // Vietnamese (Vietnam)
  | 'te-IN' // Telugu (India)
  | 'tr-TR' // Turkish (Turkey)
  | 'ta-IN' // Tamil (India)
  | 'mr-IN' // Marathi (India)
  | 'it-IT' // Italian (Italy)
  | 'uk-UA'; // Ukrainian (Ukraine)
export type LanguageOption = { code: Language; label: string };
export type FontFamily = 'system' | 'serif' | 'monospace';

export interface UseSpeechProps {
  isOnline: () => Promise<boolean>;
  selectedText: string;
  currentPageContent: string;
  currentPage: number;
  currentBook: Book | null;
  words: string[];
  changePage: (n: number) => void;
}

export interface UseTranslationProps {
  isOnline: () => Promise<boolean>;
  selectedText: string;
  currentBook: Book | null;
}

export interface FB2Section {
  p?: string | string[];
  title?: { p: string | string[] };
}

export interface FB2Body {
  '@_name'?: string;
  section?: FB2Section | FB2Section[];
}

export interface FB2Root {
  FictionBook: {
    body: FB2Body | FB2Body[];
  };
}

export interface TranslationData {
  translations: Translation[];
}

export interface Translation {
  id: string;
  bookName: string;
  originalText: string;
  translatedText: string;
  timestamp: number;
}

export interface BookStatistics {
  bookId: string;
  bookName: string;
  totalReadingTime: number; // in seconds
  lastReadDate: number;
  pagesRead: number;
  totalPages: number;
  readingSessions: {
    startTime: number;
    endTime: number;
    pagesRead: number;
  }[];
}

export interface BookStatisticsData {
  statistics: Record<string, BookStatistics>;
}

export interface Settings {
  theme: Theme;
  fontSize: number;
  fontFamily: FontFamily;
  lineSpacing: number;
  marginWidth: number;
  interfaceLanguage: Language;
  voiceLanguage: Language;
  translationLanguage: Language;
  voiceSpeed: number;
  voicePitch: number;
}

export interface Reader {
  isUsingSpeech: boolean;
  isUsingTranslate: boolean;
  isUsingGoTo: boolean;
  isUsingSearch: boolean;
}

export interface BookData {
  books: Book[];
  currentBook: Book | null;
}

export interface Book {
  id: string;
  name: string;
  type: string;
  content?: string;
  fileSize: number;
  currentPage: number;
  totalPages: number;
  pages?: string[];
  filePath: string;
  lastRead: string;
  isFavorite: boolean;
}

export type BookMetadata = Omit<Book, 'content' | 'pages'>;

export interface BookState extends BookData {
  setBook: (book: Book) => void;
  setCurrentBook: (bookId: string) => void;
  setCurrentPage: (page: number) => void;
  setType: (type: string) => void;
  loadSavedState: () => Promise<void>;
  loadLastBook: () => Promise<void>;
  toggleFavorite: (bookId: string) => void;
  deleteBook: (bookId: string) => void;
}

export interface TranslationStore extends TranslationData {
  addTranslation: (translation: Omit<Translation, 'id' | 'timestamp'>) => void;
  removeTranslation: (id: string) => void;
}

export interface StatisticsStore extends BookStatisticsData {
  setBookStatistics: (bookId: string, stats: BookStatistics) => void;
  getBookStatistics: (bookId: string) => BookStatistics | undefined;
  deleteBookStatistics: (bookId: string) => void;
  getAllStatistics: () => BookStatistics[];
}

export interface SettingsState extends Settings {
  setTheme: (theme: Theme) => void;
  setFontSize: (size: number) => void;
  setFontFamily: (family: FontFamily) => void;
  setLineSpacing: (spacing: number) => void;
  setMarginWidth: (width: number) => void;
  setInterfaceLanguage: (language: Language) => void;
  setVoiceLanguage: (language: Language) => void;
  setTranslationLanguage: (language: Language) => void;
  setVoiceSpeed: (speed: number) => void;
  setVoicePitch: (pitch: number) => void;
  resetSettings: () => void;
}

export interface ReaderState extends Reader {
  setUsingSpeech: (value: boolean) => void;
  setUsingTranslate: (value: boolean) => void;
  setUsingGoTo: (value: boolean) => void;
  setUsingSearch: (value: boolean) => void;
}
