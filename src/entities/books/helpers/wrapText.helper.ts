import { FontFamily } from '@/shared/types/types';
import {
  CHAR_WIDTHS,
  FONT_COEFFICIENT,
  FOOTER_HEIGHT,
  HEADER_HEIGHT,
  NAME_HEIGHT,
} from '@/shared/constants/constants';
import { Dimensions } from 'react-native';

// Helper function to measure available canvas
export const measureCanvas = (settings: {
  fontSize: number;
  lineSpacing: number;
  marginWidth: number;
  fontFamily: FontFamily;
}) => {
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  const availableWidth = screenWidth - (settings.marginWidth * 2 + 16 * 2);
  const lineHeight =
    settings.fontSize *
    settings.lineSpacing *
    FONT_COEFFICIENT[settings.fontFamily];
  const availableHeight =
    screenHeight - HEADER_HEIGHT - NAME_HEIGHT - FOOTER_HEIGHT - 16 * 2;
  const linesPerPage = Math.floor(availableHeight / lineHeight);

  return {
    availableWidth,
    linesPerPage,
  };
};

// Helper function to wrap text to width
export const wrapText = (
  text: string,
  maxWidth: number,
  fontSize: number,
  fontFamily: FontFamily,
) => {
  const words = text.match(/[^\s\n]+|\n/g) || [];
  const lines: string[] = [];
  let currentLine: string[] = [];
  let currentWidth = 0;
  const defaultCharWidth = 0.65;
  const uppercaseCharWidth = 0.75;
  let isNewLine = true;

  const getCharWidth = (char: string): number => {
    // Check if character is uppercase
    if (
      char === char.toUpperCase() &&
      char !== char.toLowerCase() &&
      CHAR_WIDTHS[char] === undefined
    ) {
      return uppercaseCharWidth * fontSize;
    }

    return (
      (CHAR_WIDTHS[char] || defaultCharWidth) *
      fontSize *
      FONT_COEFFICIENT[fontFamily]
    );
  };

  const indentWidth = getCharWidth(' ') * 3;

  const getWordWidth = (word: string) => {
    let width = 0;
    for (let i = 0; i < word.length; i++) {
      width += getCharWidth(word[i]);
    }

    return width;
  };

  for (const word of words) {
    // If we encounter a newline, start a new line
    if (word === '\n') {
      if (currentLine.length > 0) {
        lines.push(currentLine.join(' '));
        currentLine = [];
        currentWidth = 0;
      }
      isNewLine = true;
      continue;
    }

    const wordWidth = getWordWidth(word);
    // If adding this word would exceed the line width
    if (
      currentWidth +
        wordWidth +
        (currentLine.length > 0 ? getCharWidth(' ') : 0) +
        (isNewLine ? indentWidth : 0) >
      maxWidth
    ) {
      if (currentLine.length > 0) {
        lines.push(currentLine.join(' '));
        currentLine = [];
        currentWidth = 0;
      }
      // If a single word is longer than the line, split it
      if (wordWidth > maxWidth) {
        let remainingWord = word;
        while (remainingWord.length > 0) {
          let charsThatFit = 0;
          let widthSoFar = 0;

          while (charsThatFit < remainingWord.length) {
            const charWidth = getCharWidth(remainingWord[charsThatFit]);
            if (widthSoFar + charWidth > maxWidth) {
              break;
            }

            widthSoFar += charWidth;
            charsThatFit++;
          }

          if (charsThatFit < remainingWord.length && charsThatFit > 1) {
            lines.push(remainingWord.slice(0, charsThatFit) + '-');
          } else {
            lines.push(remainingWord.slice(0, charsThatFit));
          }
          remainingWord = remainingWord.slice(charsThatFit);
        }

        continue;
      }
    }

    // Add 3 spaces before the first word after a newline
    if (isNewLine) {
      currentLine.push('\\newLine' + word);
      currentWidth += indentWidth;
      isNewLine = false;
    } else {
      currentLine.push(word);
    }
    currentWidth +=
      wordWidth + (currentLine.length > 1 ? getCharWidth(' ') : 0);
  }

  // Handle the last line
  if (currentLine.length > 0) {
    lines.push(currentLine.join(' '));
  }

  return lines;
};
