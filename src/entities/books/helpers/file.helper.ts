import * as FileSystem from 'expo-file-system';
import { Toast } from 'toastify-react-native';
import { XMLParser } from 'fast-xml-parser';
import { FB2Root } from '@/shared/types/types';

export const isTxtFile = (filename: string): boolean => {
  return filename.toLowerCase().endsWith('.txt');
};

export const isEpubFile = (filename: string): boolean => {
  return filename.toLowerCase().endsWith('.epub');
};

export const isMobiFile = (filename: string): boolean => {
  return filename.toLowerCase().endsWith('.mobi');
};

export const isFb2File = (filename: string): boolean => {
  return filename.toLowerCase().endsWith('.fb2');
};

export const readFileWithEncoding = async (uri: string): Promise<string> => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to read file as text'));
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsText(blob);
    });
  } catch (error) {
    Toast.error('Error reading file:' + error);
    throw error;
  }
};

export async function extractEpubContent(uri: string): Promise<{
  content: string;
  metadata: {
    type: string;
    uri: string;
  };
}> {
  try {
    const fileContent = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    return {
      content: fileContent,
      metadata: {
        type: 'epub',
        uri: uri,
      },
    };
  } catch (error) {
    Toast.error('Error extracting EPUB content:' + error);
    throw new Error('Failed to extract EPUB content');
  }
}

export const extractFB2Content = async (uri: string): Promise<string> => {
  try {
    const fileContent = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    const parser = new XMLParser({
      ignoreAttributes: false,
      ignoreDeclaration: true,
      parseTagValue: true,
      trimValues: true,
    });

    const parsed = parser.parse(fileContent) as FB2Root;

    const bodies = parsed.FictionBook.body;
    let text = '';

    const bodyArray = Array.isArray(bodies) ? bodies : [bodies];
    bodyArray.forEach((body) => {
      if (body['@_name'] === 'notes' || body['@_name'] === 'images') {
        return;
      }
      const sections = Array.isArray(body.section)
        ? body.section
        : [body.section];
      sections.forEach((section) => {
        if (section && section.p) {
          const paragraphs = Array.isArray(section.p) ? section.p : [section.p];
          paragraphs.forEach((p) => {
            text += (p ?? '') + '\n';
          });
        }
      });
    });

    text = text
      .replace(/<image\b[^>]*>.*?<\/image>/gi, '')
      .replace(/<binary\b[^>]*>.*?<\/binary>/gi, '');

    return text.trim();
  } catch (error) {
    Toast.error('Error extracting FB2 content: ' + error);
    throw new Error('Failed to extract FB2 content');
  }
};
