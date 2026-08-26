import React, { useState, useEffect, useRef } from 'react';
import { Book, ReaderSettings, BookmarkItem, HighlightItem, BookmarkColor } from './types';
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
import { AuthModal } from './components/AuthModal';
import { UserAccountModal } from './components/UserAccountModal';
import { THEME_CONFIGS } from './utils/themeStyles';
import {
  auth,
  UserProfile,
  saveUserBookToCloud,
  deleteUserBookFromCloud,
  subscribeToUserBooks,
  saveReadingProgressToCloud,
  saveBookmarkToCloud,
  deleteBookmarkFromCloud,
  clearAllBookmarksForBookFromCloud,
  subscribeToUserBookmarks,
  saveHighlightToCloud,
  deleteHighlightFromCloud,
  subscribeToUserHighlights,
  saveReaderSettingsToCloud,
  getReaderSettingsFromCloud
} from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

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
  // Current logged in Firebase user profile
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

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
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

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

  // ================= FIREBASE AUTH & REAL-TIME SYNC =================
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const profile: UserProfile = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          isAnonymous: user.isAnonymous
        };
        setCurrentUser(profile);

        // Load cloud settings if available
        const cloudSettings = await getReaderSettingsFromCloud(user.uid);
        if (cloudSettings) {
          setSettings((prev) => ({ ...prev, ...cloudSettings }));
        }
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // Subscribe to Cloud Books, Bookmarks, Highlights when user is logged in
  useEffect(() => {
    if (!currentUser?.uid) return;

    // 1. Subscribe to Cloud Books
    const unsubBooks = subscribeToUserBooks(currentUser.uid, (cloudBooks) => {
      if (cloudBooks && cloudBooks.length > 0) {
        setBooks((prev) => {
          // Merge sample books and cloud books without duplicates
          const sampleIds = new Set(SAMPLE_BOOKS.map((s) => s.id));
          const nonCloudCustom = prev.filter(
            (b) => !sampleIds.has(b.id) && !cloudBooks.some((cb) => cb.id === b.id)
          );
          return [...cloudBooks, ...nonCloudCustom, ...SAMPLE_BOOKS];
        });
      }
    });

    // 2. Subscribe to Cloud Bookmarks
    const unsubBookmarks = subscribeToUserBookmarks(currentUser.uid, (cloudBms) => {
      if (cloudBms && cloudBms.length > 0) {
        setBookmarks((prev) => {
          const map = new Map<string, BookmarkItem>();
          prev.forEach((b) => map.set(b.id, b));
          cloudBms.forEach((b) => map.set(b.id, b));
          return Array.from(map.values());
        });
      }
    });

    // 3. Subscribe to Cloud Highlights
    const unsubHighlights = subscribeToUserHighlights(currentUser.uid, (cloudHls) => {
      if (cloudHls && cloudHls.length > 0) {
        setHighlights((prev) => {
          const map = new Map<string, HighlightItem>();
          prev.forEach((h) => map.set(h.id, h));
          cloudHls.forEach((h) => map.set(h.id, h));
          return Array.from(map.values());
        });
      }
    });

    return () => {
      unsubBooks();
      unsubBookmarks();
      unsubHighlights();
    };
  }, [currentUser?.uid]);

  // Helper functions
  const handleUpdateSettings = (newPartial: Partial<ReaderSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newPartial };
      if (currentUser?.uid) {
        saveReaderSettingsToCloud(currentUser.uid, updated).catch(console.error);
      }
      return updated;
    });
  };

  const handleSelectBook = (book: Book) => {
    setCurrentBookId(book.id);
    setCurrentChapterId(book.chapters[0]?.id || 'cap-1');
  };

  const handleAddBook = async (newBook: Book) => {
    setBooks((prev) => [newBook, ...prev]);
    setCurrentBookId(newBook.id);
    setCurrentChapterId(newBook.chapters[0]?.id || 'cap-1');
    setViewMode('reader');

    // Save to Firestore if user logged in
    if (currentUser?.uid) {
      try {
        await saveUserBookToCloud(currentUser.uid, newBook);
      } catch (err) {
        console.error('Error saving book to cloud:', err);
      }
    }
  };

  const handleDeleteBook = async (bookId: string) => {
    setBooks((prev) => prev.filter((b) => b.id !== bookId));
    if (currentBookId === bookId) {
      const remaining = books.filter((b) => b.id !== bookId);
      if (remaining.length > 0) {
        setCurrentBookId(remaining[0].id);
        setCurrentChapterId(remaining[0].chapters[0]?.id || 'cap-1');
      }
    }

    if (currentUser?.uid) {
      try {
        await deleteUserBookFromCloud(currentUser.uid, bookId);
      } catch (err) {
        console.error('Error deleting book from cloud:', err);
      }
    }
  };

  const handleUpdateCurrentBookLogo = (emblem: string) => {
    setBooks((prev) => {
      const updated = prev.map((b) =>
        b.id === currentBook.id ? { ...b, coverEmblem: emblem, customLogoUrl: undefined } : b
      );
      const updatedBook = updated.find((b) => b.id === currentBook.id);
      if (updatedBook && currentUser?.uid && (updatedBook.id.startsWith('custom-') || updatedBook.id.startsWith('book-'))) {
        saveUserBookToCloud(currentUser.uid, updatedBook).catch(console.error);
      }
      return updated;
    });
  };

  const handleUploadCustomLogo = (url: string | undefined) => {
    setBooks((prev) => {
      const updated = prev.map((b) =>
        b.id === currentBook.id ? { ...b, customLogoUrl: url } : b
      );
      const updatedBook = updated.find((b) => b.id === currentBook.id);
      if (updatedBook && currentUser?.uid && (updatedBook.id.startsWith('custom-') || updatedBook.id.startsWith('book-'))) {
        saveUserBookToCloud(currentUser.uid, updatedBook).catch(console.error);
      }
      return updated;
    });
  };

  const handleAddBookmark = (snippet: string, paragraphIndex: number, color?: BookmarkColor, note?: string) => {
    const currentChapter = currentBook.chapters.find((c) => c.id === currentChapterId) || currentBook.chapters[0];
    const newBm: BookmarkItem = {
      id: `bm-${Date.now()}`,
      bookId: currentBook.id,
      chapterId: currentChapter.id,
      chapterTitle: currentChapter.title,
      paragraphIndex,
      snippet,
      color: 'amber', // Segnalibro arancione
      note: note || undefined,
      createdAt: new Date().toLocaleDateString('it-IT', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
    };

    // Assicura che esista un unico segnalibro per questo libro nello stato locale
    setBookmarks((prev) => [newBm, ...prev.filter((b) => b.bookId !== currentBook.id)]);

    if (currentUser?.uid) {
      // Pulisce tutti i vecchi segnalibri dal database per questo libro e salva il nuovo
      clearAllBookmarksForBookFromCloud(currentUser.uid, currentBook.id)
        .then(() => saveBookmarkToCloud(currentUser.uid, newBm))
        .catch(console.error);
    }
  };

  const handleRemoveBookmark = (id: string) => {
    const targetBm = bookmarks.find((b) => b.id === id);
    const targetBookId = targetBm?.bookId || currentBook.id;

    // Rimuove da stato locale azzerando i segnalibri di questo libro
    setBookmarks((prev) => prev.filter((b) => b.id !== id && b.bookId !== targetBookId));

    if (currentUser?.uid) {
      // Cancella dal database Firestore il singolo ID ed esegue l'azzeramento completo per il libro
      deleteBookmarkFromCloud(currentUser.uid, id)
        .then(() => clearAllBookmarksForBookFromCloud(currentUser.uid, targetBookId))
        .catch(console.error);
    }
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

    if (currentUser?.uid) {
      saveHighlightToCloud(currentUser.uid, newHl).catch(console.error);
    }
  };

  const handleRemoveHighlight = (id: string) => {
    setHighlights((prev) => prev.filter((h) => h.id !== id));
    if (currentUser?.uid) {
      deleteHighlightFromCloud(currentUser.uid, id).catch(console.error);
    }
  };

  const handleSelectChapter = (chapterId: string, paragraphIndex?: number) => {
    setCurrentChapterId(chapterId);
    if (currentUser?.uid) {
      const idx = currentBook.chapters.findIndex((c) => c.id === chapterId);
      const pct = Math.round(((idx + 1) / currentBook.chapters.length) * 100);
      saveReadingProgressToCloud(currentUser.uid, currentBook.id, chapterId, idx, pct).catch(console.error);
    }

    if (paragraphIndex !== undefined && paragraphIndex > 0) {
      setTimeout(() => {
        const paragraphs = document.querySelectorAll('#reader-interface article p');
        if (paragraphs[paragraphIndex]) {
          paragraphs[paragraphIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 150);
    }
  };

  const themeConfig = THEME_CONFIGS[settings.theme];

  const userStats = {
    booksCount: books.filter((b) => b.id.startsWith('custom-') || b.id.startsWith('book-')).length,
    bookmarksCount: bookmarks.length,
    highlightsCount: highlights.length
  };

  return (
    <div id="app" className="w-full min-h-screen relative overflow-x-hidden select-text">
      {/* ================= STATO 1: COVER / PRIMA PAGINA ================= */}
      {viewMode === 'cover' ? (
        <CoverView
          currentBook={currentBook}
          settings={settings}
          currentUser={currentUser}
          onStartReading={() => setViewMode('reader')}
          onOpenLibrary={() => setIsLibraryOpen(true)}
          onOpenLogoModal={() => setIsLogoModalOpen(true)}
          onOpenUploadModal={() => setIsUploadModalOpen(true)}
          onOpenAuth={() => setIsAuthOpen(true)}
          onOpenAccountModal={() => setIsAccountModalOpen(true)}
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
          onSelectChapter={handleSelectChapter}
          bookmarks={bookmarks}
          highlights={highlights}
          onAddBookmark={handleAddBookmark}
          onRemoveBookmark={handleRemoveBookmark}
          onAddHighlight={handleAddHighlight}
        />
      )}

      {/* ================= MODALI E CASSETTI ================= */}
      {/* 1. Modale Impostazioni con Preferenze e Sezione Cloud */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onOpenLogoModal={() => setIsLogoModalOpen(true)}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenAccountModal={() => setIsAccountModalOpen(true)}
      />

      {/* 2. Indice dei Capitoli */}
      <TableOfContentsDrawer
        isOpen={isTOCOpen}
        onClose={() => setIsTOCOpen(false)}
        book={currentBook}
        currentChapterId={currentChapterId}
        onSelectChapter={handleSelectChapter}
        themeConfig={themeConfig}
        font={settings.font}
        bookmarks={bookmarks.filter((b) => b.bookId === currentBook.id)}
        onRemoveBookmark={handleRemoveBookmark}
      />

      {/* 3. Segnalibri & Note */}
      <BookmarksNotesDrawer
        isOpen={isBookmarksOpen}
        onClose={() => setIsBookmarksOpen(false)}
        bookmarks={bookmarks.filter((b) => b.bookId === currentBook.id)}
        highlights={highlights.filter((h) => h.bookId === currentBook.id)}
        onRemoveBookmark={handleRemoveBookmark}
        onRemoveHighlight={handleRemoveHighlight}
        onJumpToChapter={handleSelectChapter}
        themeConfig={themeConfig}
      />

      {/* 4. Biblioteca delle Opere con Badge Cloud */}
      <LibraryModal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        books={books}
        currentBookId={currentBook.id}
        onSelectBook={handleSelectBook}
        onOpenUploadModal={() => setIsUploadModalOpen(true)}
        onDeleteBook={handleDeleteBook}
        currentUser={currentUser}
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

      {/* 6. Importa nuovo libro / testo & Salva nel database */}
      <CustomBookModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onAddBook={handleAddBook}
        currentUser={currentUser}
        themeConfig={themeConfig}
      />

      {/* 7. Cerca nel testo */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        book={currentBook}
        onJumpToResult={handleSelectChapter}
        themeConfig={themeConfig}
      />

      {/* 8. Modale di Autenticazione (Google / Email / Ospite) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={currentUser}
        onUserChange={setCurrentUser}
        themeConfig={themeConfig}
      />

      {/* 9. Modale Profilo Utente & Cloud Sync Stats */}
      <UserAccountModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        user={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onUserLoggedOut={() => setCurrentUser(null)}
        stats={userStats}
        themeConfig={themeConfig}
      />
    </div>
  );
}
