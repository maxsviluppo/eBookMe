import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Book,
  Chapter,
  ReaderSettings,
  BookmarkItem,
  HighlightItem
} from '../types';
import {
  THEME_CONFIGS,
  FONT_CONFIGS,
  MARGIN_CONFIGS
} from '../utils/themeStyles';
import { BridgeLogo, BridgeEmblemSymbol } from './BridgeLogo';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  List,
  Bookmark,
  Search,
  Sliders,
  Volume2,
  VolumeX,
  Highlighter,
  Check,
  Share2,
  Minimize2,
  Maximize2,
  BookOpen,
  MessageSquarePlus,
  Menu,
  X,
  ArrowUp,
  Home
} from 'lucide-react';

interface ReaderViewProps {
  book: Book;
  settings: ReaderSettings;
  onBackToCover: () => void;
  onOpenSettings: () => void;
  onOpenTOC: () => void;
  onOpenBookmarks: () => void;
  onOpenSearch: () => void;
  currentChapterId: string;
  onSelectChapter: (chapterId: string) => void;
  bookmarks: BookmarkItem[];
  highlights: HighlightItem[];
  onAddBookmark: (snippet: string, paragraphIndex: number) => void;
  onRemoveBookmark: (id: string) => void;
  onAddHighlight: (text: string, color: 'yellow' | 'green' | 'blue' | 'rose', note?: string) => void;
}

export const ReaderView: React.FC<ReaderViewProps> = ({
  book,
  settings,
  onBackToCover,
  onOpenSettings,
  onOpenTOC,
  onOpenBookmarks,
  onOpenSearch,
  currentChapterId,
  onSelectChapter,
  bookmarks,
  highlights,
  onAddBookmark,
  onRemoveBookmark,
  onAddHighlight
}) => {
  const [selectedText, setSelectedText] = useState('');
  const [toolbarPos, setToolbarPos] = useState<{ x: number; y: number } | null>(null);
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechRate, setSpeechRate] = useState(1);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isFloatingMenuOpen, setIsFloatingMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const floatingMenuRef = useRef<HTMLDivElement>(null);

  const themeConfig = THEME_CONFIGS[settings.theme];
  const fontConfig = FONT_CONFIGS[settings.font];
  const marginConfig = MARGIN_CONFIGS[settings.marginWidth];

  const currentChapterIndex = book.chapters.findIndex((c) => c.id === currentChapterId);
  const currentChapter = book.chapters[currentChapterIndex] || book.chapters[0];

  const isCurrentBookmarked = bookmarks.some(
    (b) => b.bookId === book.id && b.chapterId === currentChapter.id
  );

  // Chapter progress
  const progressPercentage = Math.round(
    ((currentChapterIndex + 1) / book.chapters.length) * 100
  );

  // Scroll listener to hide top bar and incorporate command icons into persistent floating menu
  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      if (currentScroll > 60) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
        setIsFloatingMenuOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close floating popover menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        isFloatingMenuOpen &&
        floatingMenuRef.current &&
        !floatingMenuRef.current.contains(e.target as Node)
      ) {
        setIsFloatingMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isFloatingMenuOpen]);

  // Handle Text Selection for highlighting & notes
  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed || !selection.toString().trim()) {
        if (!showNoteInput) {
          setToolbarPos(null);
          setSelectedText('');
        }
        return;
      }

      const text = selection.toString().trim();
      if (text.length > 2) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        setSelectedText(text);
        setToolbarPos({
          x: Math.max(10, rect.left + rect.width / 2 - 120),
          y: Math.max(10, rect.top - 50 + window.scrollY),
        });
      }
    };

    document.addEventListener('mouseup', handleSelection);
    document.addEventListener('touchend', handleSelection);
    return () => {
      document.removeEventListener('mouseup', handleSelection);
      document.removeEventListener('touchend', handleSelection);
    };
  }, [showNoteInput]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid if modal is open or typing
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        if (currentChapterIndex < book.chapters.length - 1) {
          onSelectChapter(book.chapters[currentChapterIndex + 1].id);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        if (currentChapterIndex > 0) {
          onSelectChapter(book.chapters[currentChapterIndex - 1].id);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } else if (e.key === 's' || e.key === 'S') {
        onOpenSettings();
      } else if (e.key === 'i' || e.key === 'I') {
        onOpenTOC();
      } else if (e.key === 'b' || e.key === 'B') {
        toggleBookmark();
      } else if (e.key === 'Escape') {
        setIsFloatingMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentChapterIndex, book.chapters, onSelectChapter, onOpenSettings, onOpenTOC]);

  // Web Speech API for Text-to-Speech narration
  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert('La sintesi vocale non è supportata dal browser corrente.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const textToRead = `${currentChapter.title}. ${currentChapter.content.join(' ')}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = 'it-IT';
      utterance.rate = speechRate;

      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const toggleBookmark = () => {
    const existing = bookmarks.find(
      (b) => b.bookId === book.id && b.chapterId === currentChapter.id
    );
    if (existing) {
      onRemoveBookmark(existing.id);
    } else {
      const snippet = currentChapter.content[0] || currentChapter.title;
      onAddBookmark(snippet.substring(0, 120), 0);
    }
  };

  const handleApplyHighlight = (color: 'yellow' | 'green' | 'blue' | 'rose') => {
    if (!selectedText) return;
    onAddHighlight(selectedText, color, noteText.trim() || undefined);
    setToolbarPos(null);
    setSelectedText('');
    setShowNoteInput(false);
    setNoteText('');
    window.getSelection()?.removeAllRanges();
  };

  return (
    <div
      id="reader-interface"
      ref={containerRef}
      className={`min-h-screen flex flex-col transition-colors duration-500 relative ${themeConfig.bgClass} ${themeConfig.textClass}`}
    >
      {/* ================= BARRA SUPERIORE (HEADER) ================= */}
      {!settings.isZenMode && (
        <motion.header
          initial={false}
          animate={{
            y: isScrolled ? -120 : 0,
            opacity: isScrolled ? 0 : 1,
            pointerEvents: isScrolled ? 'none' : 'auto'
          }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className={`sticky top-0 z-30 w-full backdrop-blur-md border-b transition-colors shadow-sm ${themeConfig.headerBgClass} ${themeConfig.borderClass}`}
        >
          {/* Prima riga: Navigazione & Controlli */}
          <div className="w-full px-4 sm:px-8 py-2.5 flex items-center justify-between">
            {/* Sinistra: Torna alla Copertina / Home con Logo Cliccabile */}
            <motion.div
              animate={{
                x: isScrolled ? 60 : 0,
                opacity: isScrolled ? 0 : 1
              }}
              transition={{ duration: 0.25 }}
              className="flex items-center space-x-2 sm:space-x-3"
            >
              <button
                id="logo-home-button"
                onClick={onBackToCover}
                className="p-1.5 sm:p-2 rounded-xl opacity-90 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5 transition-all flex items-center gap-2 text-xs font-medium cursor-pointer group select-none"
                title="Torna alla Home / Copertina"
                aria-label="Torna alla Home"
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 text-current opacity-70 group-hover:opacity-100" />
                <BridgeLogo
                  variant="compact"
                  brandText="eBookMe"
                  themeMode={themeConfig.isDark ? 'dark' : 'light'}
                  className="transition-transform group-hover:scale-105"
                />
              </button>

              <div className="hidden sm:block h-4 w-px bg-black/10 dark:bg-white/10" />

              <div className="hidden sm:flex items-center gap-2">
                <span className="text-xs font-medium tracking-wide truncate max-w-[200px] md:max-w-[320px] block opacity-85">
                  {book.title}
                </span>
              </div>
            </motion.div>

            {/* Destra: Strumenti di Lettura con animazione verso destra */}
            <motion.div
              animate={{
                x: isScrolled ? 50 : 0,
                opacity: isScrolled ? 0 : 1,
                scale: isScrolled ? 0.7 : 1
              }}
              transition={{ duration: 0.25, staggerChildren: 0.03 }}
              className="flex items-center space-x-1 sm:space-x-1.5"
            >
              {/* Ricerca */}
              <button
                onClick={onOpenSearch}
                className="p-2 rounded-xl opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5 transition-all"
                title="Cerca nel testo"
                aria-label="Cerca"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Segnalibro rapido */}
              <button
                onClick={toggleBookmark}
                className={`p-2 rounded-xl transition-all ${
                  isCurrentBookmarked
                    ? 'text-amber-600 dark:text-amber-400 opacity-100'
                    : 'opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5'
                }`}
                title={isCurrentBookmarked ? 'Rimuovi segnalibro' : 'Aggiungi segnalibro'}
                aria-label="Segnalibro"
              >
                <Bookmark className={`w-4 h-4 ${isCurrentBookmarked ? 'fill-current' : ''}`} />
              </button>

              {/* Indice capitoli */}
              <button
                onClick={onOpenTOC}
                className="p-2 rounded-xl opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5 transition-all"
                title="Indice dei capitoli"
                aria-label="Indice"
              >
                <List className="w-4 h-4" />
              </button>

              {/* Sintesi vocale (TTS) */}
              <button
                onClick={handleToggleSpeech}
                className={`p-2 rounded-xl transition-all ${
                  isSpeaking
                    ? 'text-emerald-600 dark:text-emerald-400 animate-pulse'
                    : 'opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5'
                }`}
                title={isSpeaking ? 'Ferma lettura vocale' : 'Leggi capitolo ad alta voce'}
                aria-label="Ascolta"
              >
                {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              <div className="h-4 w-px bg-black/10 dark:bg-white/10 mx-1" />

              {/* Menu Impostazioni */}
              <button
                id="hamburger-btn"
                onClick={onOpenSettings}
                className={`p-2 rounded-xl border transition-all flex items-center gap-1.5 ${
                  themeConfig.isDark
                    ? 'border-neutral-800 bg-neutral-900/60 hover:bg-neutral-800 text-neutral-200'
                    : 'border-[#E2DDCF] bg-white/70 hover:bg-white text-[#332E27]'
                }`}
                title="Impostazioni di lettura"
                aria-label="Menu impostazioni"
              >
                <Sliders className="w-4 h-4" />
                <span className="hidden lg:inline text-xs font-medium">Impostazioni</span>
              </button>
            </motion.div>
          </div>

          {/* Secondo rigo esteso: Titolo Capitolo & Avanzamento */}
          <div className="w-full px-4 sm:px-8 py-2 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-xs transition-colors bg-black/[0.015] dark:bg-white/[0.015]">
            <div className="flex items-center space-x-2.5 min-w-0 flex-1 mr-4">
              <span className="text-[10px] uppercase font-mono tracking-wider opacity-60 shrink-0 font-medium px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/5">
                Cap. {currentChapterIndex + 1} di {book.chapters.length}
              </span>
              <span className="opacity-30">•</span>
              <span className="font-serif font-medium tracking-wide truncate opacity-90 text-[13px] sm:text-[14px]">
                {currentChapter.title}
              </span>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <div className="w-16 sm:w-24 h-1 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden hidden xs:block">
                <div
                  className="h-full bg-current opacity-70 transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <span className="text-[11px] opacity-65 font-mono font-medium min-w-[32px] text-right">
                {progressPercentage}%
              </span>
            </div>
          </div>
        </motion.header>
      )}

      {/* ================= ICONA MENU FLUTTUANTE SEMPRE VISIBILE ALLO SCROLL ================= */}
      <AnimatePresence>
        {isScrolled && !settings.isZenMode && (
          <div
            ref={floatingMenuRef}
            className="fixed top-4 right-4 sm:right-6 z-50 flex flex-col items-end"
          >
            {/* Pulsante Principale di Menu Incorporato */}
            <motion.button
              id="persistent-floating-menu-btn"
              initial={{ scale: 0, opacity: 0, x: 40 }}
              animate={{ scale: 1, opacity: 1, x: 0 }}
              exit={{ scale: 0, opacity: 0, x: 40 }}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              onClick={() => setIsFloatingMenuOpen((prev) => !prev)}
              className={`p-2.5 sm:p-3 rounded-2xl shadow-xl backdrop-blur-lg border transition-all flex items-center gap-2 ${
                themeConfig.isDark
                  ? 'bg-neutral-900/90 border-neutral-700/80 text-white hover:bg-neutral-800'
                  : 'bg-white/95 border-[#D8D2C5] text-[#2D2D2A] hover:bg-white'
              }`}
              title="Menu comandi di lettura"
              aria-label="Menu comandi"
            >
              {isFloatingMenuOpen ? (
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-current" />
              ) : (
                <>
                  <div className="relative flex items-center justify-center">
                    <BridgeEmblemSymbol className="w-4 h-3 opacity-90 stroke-current" strokeWidth={3.2} />
                    {isCurrentBookmarked && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-500" />
                    )}
                  </div>
                  <span className="text-xs font-semibold tracking-tight font-sans hidden sm:inline">
                    eBook<span className="font-light opacity-80">Me</span>
                  </span>
                  <div className="h-3 w-px bg-current opacity-20" />
                  <Menu className="w-4 h-4 opacity-80" />
                  <span className="text-[10px] font-mono opacity-60 font-semibold">
                    {progressPercentage}%
                  </span>
                </>
              )}
            </motion.button>

            {/* Dock Espanso dei Comandi Incorporati */}
            <AnimatePresence>
              {isFloatingMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.92 }}
                  animate={{ opacity: 1, y: 8, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.92 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className={`w-64 p-3 rounded-2xl shadow-2xl border backdrop-blur-xl flex flex-col gap-1.5 ${
                    themeConfig.isDark
                      ? 'bg-[#1C1F22]/95 border-neutral-700 text-white'
                      : 'bg-white/95 border-[#D8D2C5] text-[#2D2D2A]'
                  }`}
                >
                  {/* Intestazione Rapida Capitolo */}
                  <div className="px-2 py-1.5 border-b border-black/5 dark:border-white/10 mb-1 flex items-center justify-between">
                    <span className="text-[11px] font-medium truncate max-w-[170px] opacity-80">
                      {currentChapter.title}
                    </span>
                    <span className="text-[10px] font-mono opacity-50">
                      {progressPercentage}%
                    </span>
                  </div>

                  {/* 1. Torna alla Home / Copertina (eBookMe) */}
                  <button
                    onClick={() => {
                      setIsFloatingMenuOpen(false);
                      onBackToCover();
                    }}
                    className="w-full px-3 py-2 rounded-xl text-left flex items-center justify-between text-xs font-medium hover:bg-black/5 dark:hover:bg-white/10 transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <Home className="w-4 h-4 opacity-70 group-hover:opacity-100 text-amber-600 dark:text-amber-400" />
                      <span>Torna alla Home</span>
                    </div>
                    <span className="text-[10px] opacity-50 font-sans">eBookMe</span>
                  </button>

                  {/* 2. Cerca nel testo */}
                  <button
                    onClick={() => {
                      setIsFloatingMenuOpen(false);
                      onOpenSearch();
                    }}
                    className="w-full px-3 py-2 rounded-xl text-left flex items-center justify-between text-xs font-medium hover:bg-black/5 dark:hover:bg-white/10 transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Search className="w-4 h-4 opacity-70 group-hover:opacity-100" />
                      <span>Cerca nel testo</span>
                    </div>
                  </button>

                  {/* 3. Segnalibro */}
                  <button
                    onClick={() => {
                      toggleBookmark();
                    }}
                    className="w-full px-3 py-2 rounded-xl text-left flex items-center justify-between text-xs font-medium hover:bg-black/5 dark:hover:bg-white/10 transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Bookmark className={`w-4 h-4 ${isCurrentBookmarked ? 'fill-current text-amber-500' : 'opacity-70 group-hover:opacity-100'}`} />
                      <span>{isCurrentBookmarked ? 'Rimuovi Segnalibro' : 'Aggiungi Segnalibro'}</span>
                    </div>
                    {isCurrentBookmarked && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400 font-mono">
                        Attivo
                      </span>
                    )}
                  </button>

                  {/* 4. Indice dei capitoli */}
                  <button
                    onClick={() => {
                      setIsFloatingMenuOpen(false);
                      onOpenTOC();
                    }}
                    className="w-full px-3 py-2 rounded-xl text-left flex items-center justify-between text-xs font-medium hover:bg-black/5 dark:hover:bg-white/10 transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <List className="w-4 h-4 opacity-70 group-hover:opacity-100" />
                      <span>Indice dei capitoli</span>
                    </div>
                    <span className="text-[10px] opacity-50 font-mono">
                      {currentChapterIndex + 1}/{book.chapters.length}
                    </span>
                  </button>

                  {/* 5. Sintesi vocale TTS */}
                  <button
                    onClick={() => {
                      handleToggleSpeech();
                    }}
                    className="w-full px-3 py-2 rounded-xl text-left flex items-center justify-between text-xs font-medium hover:bg-black/5 dark:hover:bg-white/10 transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      {isSpeaking ? (
                        <VolumeX className="w-4 h-4 text-emerald-500 animate-pulse" />
                      ) : (
                        <Volume2 className="w-4 h-4 opacity-70 group-hover:opacity-100" />
                      )}
                      <span>{isSpeaking ? 'Ferma lettura vocale' : 'Leggi a voce alta'}</span>
                    </div>
                  </button>

                  {/* 6. Impostazioni di lettura */}
                  <button
                    onClick={() => {
                      setIsFloatingMenuOpen(false);
                      onOpenSettings();
                    }}
                    className="w-full px-3 py-2 rounded-xl text-left flex items-center justify-between text-xs font-medium hover:bg-black/5 dark:hover:bg-white/10 transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Sliders className="w-4 h-4 opacity-70 group-hover:opacity-100" />
                      <span>Impostazioni & Caratteri</span>
                    </div>
                  </button>

                  {/* Divisore & Torna in cima */}
                  <div className="pt-1.5 border-t border-black/5 dark:border-white/10 mt-0.5">
                    <button
                      onClick={() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        setIsFloatingMenuOpen(false);
                      }}
                      className="w-full px-3 py-1.5 rounded-xl text-center text-[11px] opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                      <span>Torna all'inizio capitolo</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Selection Toolbar for Highlighting */}
      {toolbarPos && (
        <div
          className={`fixed z-40 p-2 rounded-2xl border shadow-2xl flex flex-col gap-2 animate-in fade-in zoom-in-95 duration-150 ${
            themeConfig.isDark ? 'bg-[#202428] border-neutral-700 text-white' : 'bg-white border-[#DDD6C8] text-[#282521]'
          }`}
          style={{ top: `${Math.max(10, toolbarPos.y)}px`, left: `${toolbarPos.x}px` }}
        >
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] uppercase tracking-wider font-semibold opacity-60 px-1">
              Evidenzia:
            </span>
            <button
              onClick={() => handleApplyHighlight('yellow')}
              className="w-6 h-6 rounded-full bg-amber-400 border border-amber-500 hover:scale-110 transition-transform"
              title="Giallo"
            />
            <button
              onClick={() => handleApplyHighlight('green')}
              className="w-6 h-6 rounded-full bg-emerald-400 border border-emerald-500 hover:scale-110 transition-transform"
              title="Verde"
            />
            <button
              onClick={() => handleApplyHighlight('blue')}
              className="w-6 h-6 rounded-full bg-sky-400 border border-sky-500 hover:scale-110 transition-transform"
              title="Blu"
            />
            <button
              onClick={() => handleApplyHighlight('rose')}
              className="w-6 h-6 rounded-full bg-rose-400 border border-rose-500 hover:scale-110 transition-transform"
              title="Rosa"
            />

            <div className="h-4 w-px bg-black/10 dark:bg-white/10 mx-0.5" />

            <button
              onClick={() => setShowNoteInput(!showNoteInput)}
              className="p-1 rounded-lg opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5"
              title="Aggiungi nota"
            >
              <MessageSquarePlus className="w-4 h-4" />
            </button>
          </div>

          {showNoteInput && (
            <div className="pt-1 border-t border-black/10 dark:border-white/10 flex gap-1.5">
              <input
                type="text"
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Scrivi una nota personale..."
                className="text-base sm:text-xs px-2 py-1 rounded-lg bg-black/5 dark:bg-white/5 border border-transparent focus:border-neutral-400 outline-none w-48"
              />
              <button
                onClick={() => handleApplyHighlight('yellow')}
                className="px-2 py-1 rounded-lg bg-[#695643] text-white text-[11px] font-medium"
              >
                Salva
              </button>
            </div>
          )}
        </div>
      )}

      {/* ================= AREA CONTENUTO DI LETTURA (PAGINA) ================= */}
      <main className="flex-1 flex flex-col items-center justify-start px-4 sm:px-8 py-8 sm:py-12 w-full">
        <article
          className={`w-full ${marginConfig.maxWidthClass} transition-all duration-300 ${
            settings.twoPageSpread ? 'lg:max-w-5xl lg:columns-2 lg:gap-12 lg:rule-stone-200' : ''
          }`}
          style={{
            fontSize: `${settings.fontSize}px`,
            lineHeight: settings.lineHeight,
            textAlign: settings.textAlign,
          }}
        >
          {/* Chapter Header Banner */}
          <div className="mb-10 text-center space-y-2 border-b border-black/5 dark:border-white/5 pb-8">
            <span className="text-xs uppercase tracking-widest font-semibold opacity-50 block font-mono">
              Capitolo {currentChapter.number}
            </span>
            <h2
              className={`text-2xl sm:text-3xl lg:text-4xl font-normal leading-tight ${fontConfig.fontClass}`}
            >
              {currentChapter.title}
            </h2>
            {currentChapter.subtitle && (
              <p className="text-sm italic opacity-70 max-w-lg mx-auto">
                {currentChapter.subtitle}
              </p>
            )}
          </div>

          {/* Text Paragraphs */}
          <div className={`space-y-6 ${fontConfig.fontClass}`}>
            {currentChapter.content.map((paragraph, pIdx) => {
              // Check if paragraph is verse / poetry or contains newlines
              const isVerse = paragraph.includes('\n');

              return (
                <p
                  key={pIdx}
                  className={`relative group ${
                    isVerse ? 'whitespace-pre-line italic pl-4 sm:pl-8 border-l border-amber-600/30' : ''
                  }`}
                >
                  {/* First paragraph drop cap styling for elegance if not poetry */}
                  {pIdx === 0 && !isVerse && paragraph.length > 50 ? (
                    <span>
                      <span
                        className={`float-left text-4xl sm:text-5xl font-normal mr-2 leading-none pt-1 opacity-90 ${fontConfig.fontClass}`}
                      >
                        {paragraph.charAt(0)}
                      </span>
                      {paragraph.slice(1)}
                    </span>
                  ) : (
                    paragraph
                  )}
                </p>
              );
            })}
          </div>

          {/* Chapter End Ornament / Finis */}
          <div className="mt-20 pt-10 text-center border-t border-black/5 dark:border-white/5 flex flex-col items-center gap-3 opacity-60">
            <BridgeEmblemSymbol className="w-8 h-5.5 stroke-current opacity-70" strokeWidth={2.8} />
            <span className="text-[10px] uppercase tracking-[0.25em] font-sans opacity-70">
              eBookMe • Fine capitolo {currentChapter.number}
            </span>
          </div>
        </article>
      </main>

      {/* ================= BARRA INFERIORE DI NAVIGAZIONE ================= */}
      <footer
        className={`sticky bottom-0 z-20 w-full px-4 sm:px-8 py-3 backdrop-blur-md border-t transition-colors flex items-center justify-between ${themeConfig.headerBgClass} ${themeConfig.borderClass}`}
      >
        {/* Capitolo Precedente */}
        <button
          onClick={() => {
            if (currentChapterIndex > 0) {
              onSelectChapter(book.chapters[currentChapterIndex - 1].id);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          disabled={currentChapterIndex === 0}
          className="px-3 py-1.5 rounded-xl border border-black/10 dark:border-white/10 text-xs font-medium flex items-center gap-1.5 opacity-80 hover:opacity-100 disabled:opacity-30 disabled:pointer-events-none transition-all"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Precedente</span>
        </button>

        {/* Scrub progress bar */}
        <div className="flex-1 max-w-xs mx-4 flex items-center gap-2.5">
          <span className="text-[11px] font-mono opacity-50 shrink-0">
            {currentChapterIndex + 1}/{book.chapters.length}
          </span>
          <div className="flex-1 h-1.5 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden relative">
            <div
              className="h-full rounded-full bg-[#705E4C] dark:bg-neutral-300 transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <span className="text-[11px] font-mono opacity-50 shrink-0">
            {progressPercentage}%
          </span>
        </div>

        {/* Capitolo Successivo */}
        <button
          onClick={() => {
            if (currentChapterIndex < book.chapters.length - 1) {
              onSelectChapter(book.chapters[currentChapterIndex + 1].id);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          disabled={currentChapterIndex === book.chapters.length - 1}
          className="px-3 py-1.5 rounded-xl border border-black/10 dark:border-white/10 text-xs font-medium flex items-center gap-1.5 opacity-80 hover:opacity-100 disabled:opacity-30 disabled:pointer-events-none transition-all"
        >
          <span className="hidden sm:inline">Successivo</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </footer>
    </div>
  );
};
