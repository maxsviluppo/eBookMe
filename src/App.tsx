import React, { useState, useEffect } from 'react';
import { Book, ReaderSettings, BookmarkItem, HighlightItem } from './types';
import { SAMPLE_BOOKS } from './data/sampleBooks';
import { CoverView } from './components/CoverView';
import { ReaderView } from './components/ReaderView';
import { SettingsModal } from './components/SettingsModal';
import { TableOfContentsDrawer } from './components/TableOfContentsDrawer';
import { BookmarksNotesDrawer } from './components/BookmarksNotesDrawer';
import { LibraryModal } from './components/LibraryModal';
import { CustomBookModal } from './components/CustomBookModal';
import { LogoCustomizerModal } from './components/LogoCustomizerModal';
import { SearchModal } from './components/SearchModal';
import { THEME_CONFIGS } from './utils/themeStyles';

const DEFAULT_SETTINGS: ReaderSettings = {
  theme: 'isabelline',
  font: 'newsreader',
  fontSize: 18,
  lineHeight: 1.75,
  marginWidth: 'normal',
  textAlign: 'justify',
  twoPageSpread: false,
  isZenMode: false,
  brightness: 100,
  autoScrollSpeed: 0,
};

export default function App() {
  // Books library state
  const [books, setBooks] = useState<Book[]>(() => {
    const saved = localStorage.getItem('ebook_reader_books');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return SAMPLE_BOOKS;
  });

  const [currentBookId, setCurrentBookId] = useState<string>(() => {
    const saved = localStorage.getItem('ebook_reader_active_book_id');
    return saved || SAMPLE_BOOKS[0].id;
  });

  const currentBook = books.find((b) => b.id === currentBookId) || books[0] || SAMPLE_BOOKS[0];

  const [currentChapterId, setCurrentChapterId] = useState<string>(() => {
    return currentBook.chapters[0]?.id || 'cap-1';
  });

  // View state: 'cover' or 'reader'
  const [viewMode, setViewMode] = useState<'cover' | 'reader'>('cover');

  // Reader Settings
  const [settings, setSettings] = useState<ReaderSettings>(() => {
    const saved = localStorage.getItem('ebook_reader_settings');
    if (saved) {
      try {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_SETTINGS;
  });

  // Bookmarks & Highlights
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(() => {
    const saved = localStorage.getItem('ebook_reader_bookmarks');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  const [highlights, setHighlights] = useState<HighlightItem[]>(() => {
    const saved = localStorage.getItem('ebook_reader_highlights');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  // Modal open states
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTOCOpen, setIsTOCOpen] = useState(false);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('ebook_reader_books', JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem('ebook_reader_active_book_id', currentBookId);
  }, [currentBookId]);

  useEffect(() => {
    localStorage.setItem('ebook_reader_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('ebook_reader_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem('ebook_reader_highlights', JSON.stringify(highlights));
  }, [highlights]);

  // Handle dark mode class on <html> or <body>
  useEffect(() => {
    const currentThemeConfig = THEME_CONFIGS[settings.theme];
    if (currentThemeConfig.isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    document.body.style.backgroundColor = currentThemeConfig.bgHex;
  }, [settings.theme]);

  // Helper functions
  const handleUpdateSettings = (newPartial: Partial<ReaderSettings>) => {
    setSettings((prev) => ({ ...prev, ...newPartial }));
  };

  const handleSelectBook = (book: Book) => {
    setCurrentBookId(book.id);
    setCurrentChapterId(book.chapters[0]?.id || 'cap-1');
  };

  const handleAddBook = (newBook: Book) => {
    setBooks((prev) => [newBook, ...prev]);
    setCurrentBookId(newBook.id);
    setCurrentChapterId(newBook.chapters[0]?.id || 'cap-1');
    setViewMode('reader');
  };

  const handleUpdateCurrentBookLogo = (emblem: string) => {
    setBooks((prev) =>
      prev.map((b) => (b.id === currentBook.id ? { ...b, coverEmblem: emblem, customLogoUrl: undefined } : b))
    );
  };

  const handleUploadCustomLogo = (url: string | undefined) => {
    setBooks((prev) =>
      prev.map((b) => (b.id === currentBook.id ? { ...b, customLogoUrl: url } : b))
    );
  };

  const handleAddBookmark = (snippet: string, paragraphIndex: number) => {
    const currentChapter = currentBook.chapters.find((c) => c.id === currentChapterId) || currentBook.chapters[0];
    const newBm: BookmarkItem = {
      id: `bm-${Date.now()}`,
      bookId: currentBook.id,
      chapterId: currentChapter.id,
      chapterTitle: currentChapter.title,
      paragraphIndex,
      snippet,
      createdAt: new Date().toLocaleDateString('it-IT', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
    };
    setBookmarks((prev) => [newBm, ...prev]);
  };

  const handleRemoveBookmark = (id: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  };

  const handleAddHighlight = (text: string, color: 'yellow' | 'green' | 'blue' | 'rose', note?: string) => {
    const currentChapter = currentBook.chapters.find((c) => c.id === currentChapterId) || currentBook.chapters[0];
    const newHl: HighlightItem = {
      id: `hl-${Date.now()}`,
      bookId: currentBook.id,
      chapterId: currentChapter.id,
      chapterTitle: currentChapter.title,
      text,
      note,
      color,
      createdAt: new Date().toLocaleDateString('it-IT', { day: 'numeric', month: 'short' }),
    };
    setHighlights((prev) => [newHl, ...prev]);
  };

  const handleRemoveHighlight = (id: string) => {
    setHighlights((prev) => prev.filter((h) => h.id !== id));
  };

  const themeConfig = THEME_CONFIGS[settings.theme];

  return (
    <div id="app" className="w-full min-h-screen relative overflow-x-hidden select-text">
      {/* ================= STATO 1: COVER / PRIMA PAGINA ================= */}
      {viewMode === 'cover' ? (
        <CoverView
          currentBook={currentBook}
          settings={settings}
          onStartReading={() => setViewMode('reader')}
          onOpenLibrary={() => setIsLibraryOpen(true)}
          onOpenLogoModal={() => setIsLogoModalOpen(true)}
          onOpenUploadModal={() => setIsUploadModalOpen(true)}
        />
      ) : (
        /* ================= STATO 2: INTERFACCIA LETTORE ================= */
        <ReaderView
          book={currentBook}
          settings={settings}
          onBackToCover={() => setViewMode('cover')}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenTOC={() => setIsTOCOpen(true)}
          onOpenBookmarks={() => setIsBookmarksOpen(true)}
          onOpenSearch={() => setIsSearchOpen(true)}
          currentChapterId={currentChapterId}
          onSelectChapter={setCurrentChapterId}
          bookmarks={bookmarks}
          highlights={highlights}
          onAddBookmark={handleAddBookmark}
          onRemoveBookmark={handleRemoveBookmark}
          onAddHighlight={handleAddHighlight}
        />
      )}

      {/* ================= MODALI E CASSETTI ================= */}
      {/* 1. Modale Impostazioni con icone minimal personalizzate */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onOpenLogoModal={() => setIsLogoModalOpen(true)}
      />

      {/* 2. Indice dei Capitoli */}
      <TableOfContentsDrawer
        isOpen={isTOCOpen}
        onClose={() => setIsTOCOpen(false)}
        book={currentBook}
        currentChapterId={currentChapterId}
        onSelectChapter={setCurrentChapterId}
        themeConfig={themeConfig}
        font={settings.font}
      />

      {/* 3. Segnalibri & Note */}
      <BookmarksNotesDrawer
        isOpen={isBookmarksOpen}
        onClose={() => setIsBookmarksOpen(false)}
        bookmarks={bookmarks.filter((b) => b.bookId === currentBook.id)}
        highlights={highlights.filter((h) => h.bookId === currentBook.id)}
        onRemoveBookmark={handleRemoveBookmark}
        onRemoveHighlight={handleRemoveHighlight}
        onJumpToChapter={setCurrentChapterId}
        themeConfig={themeConfig}
      />

      {/* 4. Biblioteca delle Opere */}
      <LibraryModal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        books={books}
        currentBookId={currentBook.id}
        onSelectBook={handleSelectBook}
        onOpenUploadModal={() => setIsUploadModalOpen(true)}
        themeConfig={themeConfig}
      />

      {/* 5. Personalizza Logo / Emblema dell'Opera */}
      <LogoCustomizerModal
        isOpen={isLogoModalOpen}
        onClose={() => setIsLogoModalOpen(false)}
        currentEmblem={currentBook.coverEmblem || 'geometric'}
        customLogoUrl={currentBook.customLogoUrl}
        onSelectEmblem={handleUpdateCurrentBookLogo}
        onUploadCustomLogo={handleUploadCustomLogo}
        themeConfig={themeConfig}
      />

      {/* 6. Importa nuovo libro / testo */}
      <CustomBookModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onAddBook={handleAddBook}
        themeConfig={themeConfig}
      />

      {/* 7. Cerca nel testo */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        book={currentBook}
        onJumpToResult={setCurrentChapterId}
        themeConfig={themeConfig}
      />
    </div>
  );
}
