export type ReaderTheme = 'isabelline' | 'bone' | 'sepia' | 'pure' | 'slate' | 'night';

export type ReaderFont = 'newsreader' | 'garamond' | 'lora' | 'sans';

export type MarginWidth = 'narrow' | 'normal' | 'wide';

export type TextAlign = 'left' | 'justify';

export interface Chapter {
  id: string;
  number: number;
  title: string;
  subtitle?: string;
  content: string[]; // paragraphs
  readingTimeMinutes: number;
}

export interface Book {
  id: string;
  title: string;
  subtitle?: string;
  author: string;
  year?: string;
  genre?: string;
  coverEmblem?: string; // 'book' | 'quill' | 'feather' | 'monogram' | 'geometric' | 'seal' | custom url
  customLogoUrl?: string;
  description?: string;
  chapters: Chapter[];
}

export interface HighlightItem {
  id: string;
  bookId: string;
  chapterId: string;
  chapterTitle: string;
  text: string;
  note?: string;
  color: 'yellow' | 'green' | 'blue' | 'rose';
  createdAt: string;
}

export interface BookmarkItem {
  id: string;
  bookId: string;
  chapterId: string;
  chapterTitle: string;
  paragraphIndex: number;
  snippet: string;
  createdAt: string;
}

export interface ReaderSettings {
  theme: ReaderTheme;
  font: ReaderFont;
  fontSize: number; // in px, e.g. 18
  lineHeight: number; // e.g. 1.75
  marginWidth: MarginWidth;
  textAlign: TextAlign;
  twoPageSpread: boolean;
  isZenMode: boolean;
  brightness: number; // 0 to 100%
  autoScrollSpeed: number; // 0 = off, 1 - 5
}
