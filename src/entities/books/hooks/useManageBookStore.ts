import { Toast } from 'toastify-react-native';
import {
  extractFB2Content,
  isEpubFile,
  isFb2File,
  isMobiFile,
  isTxtFile,
  readFileWithEncoding,
} from '@/entities/books/helpers/file.helper';
import { Mobi } from '@/entities/books/helpers/mobi.hepler';
import { useBookStore } from '@/entities/books/stores/useBookStore';
import { useSettingsStore } from '@/entities/settings/stores/useSettingsStore';
import {
  measureCanvas,
  wrapText,
} from '@/entities/books/helpers/wrapText.helper';

export const useManageBookStore = () => {
  const books = useBookStore((state) => state.books);
  const currentBook = useBookStore((state) => state.currentBook);
  const setBook = useBookStore((state) => state.setBook);
  const setCurrentBook = useBookStore((state) => state.setCurrentBook);
  const toggleFavorite = useBookStore((state) => state.toggleFavorite);
  const deleteBook = useBookStore((state) => state.deleteBook);

  const loadBookContent = async () => {
    if (!currentBook?.filePath) {
      Toast.error('No file path available for loading content');

      return;
    }
    try {
      let content = '';

      if (isTxtFile(currentBook.name)) {
        content = await readFileWithEncoding(currentBook.filePath);
      } else if (isEpubFile(currentBook.name)) {
        content = await readFileWithEncoding(currentBook.filePath);
      } else if (isMobiFile(currentBook.name)) {
        const mobi = new Mobi(currentBook.filePath);
        await mobi.parse();
        content = mobi.info.content
          .replace(/<p\b[^>]*>/gi, '\n')
          .replace(/<[^>]+>/g, '');
      } else if (isFb2File(currentBook.name)) {
        content = await extractFB2Content(currentBook.filePath);
      } else {
        Toast.warn(
          'Unsupported file type. Please try file with format .txt, .fb2, .epub, .mobi.',
        );

        return;
      }
      await processContent(content);
    } catch (error) {
      Toast.error('Error loading book content:' + error);
    }
  };
  const processContent = async (content: string) => {
    if (!currentBook) {
      return;
    }

    try {
      const settings = useSettingsStore.getState();
      const textSettings = {
        fontSize: settings.fontSize,
        lineSpacing: settings.lineSpacing,
        marginWidth: settings.marginWidth,
        fontFamily: settings.fontFamily,
      };

      const { availableWidth, linesPerPage } = measureCanvas(textSettings);

      const paragraphs = content
        .split(/\n\s*\n/)
        .filter((p) => p.trim().length > 0);

      const pages: string[] = [];
      let currentPageLines: string[] = [];
      let currentLineCount = 0;

      for (const paragraph of paragraphs) {
        const wrappedLines = wrapText(
          paragraph,
          availableWidth,
          textSettings.fontSize,
          textSettings.fontFamily,
        );

        for (const line of wrappedLines) {
          if (currentLineCount >= linesPerPage) {
            pages.push(currentPageLines.join('\n'));
            currentPageLines = [];
            currentLineCount = 0;
          }

          currentPageLines.push(line);
          currentLineCount++;
        }

        if (currentLineCount < linesPerPage) {
          currentPageLines.push('');
          currentLineCount++;
        }
      }

      if (currentPageLines.length > 0) {
        pages.push(currentPageLines.join('\n'));
      }

      const updatedBook = {
        ...currentBook,
        content,
        totalPages: pages.length,
        pages,
        lastRead: new Date().toISOString(),
      };

      setBook(updatedBook);
    } catch (error) {
      Toast.error('Error processing content:' + error);
    }
  };

  return {
    books,
    currentBook,
    setBook,
    setCurrentBook,
    toggleFavorite,
    deleteBook,
    loadBookContent,
    processContent,
  };
};
