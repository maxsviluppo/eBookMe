import React, { useState } from 'react';
import { X, BookOpen, Clock, CheckCircle2, ChevronRight, Bookmark, Trash2, ArrowRight } from 'lucide-react';
import { Book, Chapter, BookmarkItem } from '../types';
import { ThemeConfig, FONT_CONFIGS } from '../utils/themeStyles';
import { BridgeLogo } from './BridgeLogo';
import { BookmarkIconPin } from './BookmarkIconPin';

interface TableOfContentsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  book: Book;
  currentChapterId: string;
  onSelectChapter: (chapterId: string, paragraphIndex?: number) => void;
  themeConfig: ThemeConfig;
  font: string;
  bookmarks?: BookmarkItem[];
  onRemoveBookmark?: (id: string) => void;
}

const BOOKMARK_COLOR_STYLES: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  amber: {
    bg: 'bg-amber-500/15',
    text: 'text-amber-700 dark:text-amber-300',
    border: 'border-amber-500/30',
    dot: 'bg-amber-500'
  },
  emerald: {
    bg: 'bg-emerald-500/15',
    text: 'text-emerald-700 dark:text-emerald-300',
    border: 'border-emerald-500/30',
    dot: 'bg-emerald-500'
  },
  sky: {
    bg: 'bg-sky-500/15',
    text: 'text-sky-700 dark:text-sky-300',
    border: 'border-sky-500/30',
    dot: 'bg-sky-500'
  },
  rose: {
    bg: 'bg-rose-500/15',
    text: 'text-rose-700 dark:text-rose-300',
    border: 'border-rose-500/30',
    dot: 'bg-rose-500'
  },
  purple: {
    bg: 'bg-purple-500/15',
    text: 'text-purple-700 dark:text-purple-300',
    border: 'border-purple-500/30',
    dot: 'bg-purple-500'
  },
  indigo: {
    bg: 'bg-indigo-500/15',
    text: 'text-indigo-700 dark:text-indigo-300',
    border: 'border-indigo-500/30',
    dot: 'bg-indigo-500'
  }
};

export const TableOfContentsDrawer: React.FC<TableOfContentsDrawerProps> = ({
  isOpen,
  onClose,
  book,
  currentChapterId,
  onSelectChapter,
  themeConfig,
  font,
  bookmarks = [],
  onRemoveBookmark
}) => {
  const [activeTab, setActiveTab] = useState<'toc' | 'bookmarks'>('toc');

  if (!isOpen) return null;

  const bookBookmarks = bookmarks.filter((b) => b.bookId === book.id);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className={`w-full max-w-md h-full flex flex-col border-l shadow-2xl transition-all ${
          themeConfig.isDark ? 'bg-[#181A1D] border-neutral-800 text-neutral-100' : 'bg-[#FAF8F5] border-[#E3DFD5] text-[#282521]'
        }`}
      >
        {/* Drawer Header */}
        <div className={`p-5 sm:p-6 flex items-center justify-between border-b ${
          themeConfig.isDark ? 'border-neutral-800' : 'border-[#EAE6DC]'
        }`}>
          <div className="min-w-0 pr-2">
            <BridgeLogo
              variant="compact"
              themeMode={themeConfig.isDark ? 'dark' : 'light'}
              className="mb-1.5 opacity-90"
            />
            <h3 className="text-base font-medium truncate mt-1">{book.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg opacity-60 hover:opacity-100 transition-opacity hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer shrink-0"
            aria-label="Chiudi indice"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher: Indice Capitoli vs Segnalibri */}
        <div className={`flex border-b px-5 sm:px-6 pt-2 gap-4 text-xs font-medium ${
          themeConfig.isDark ? 'border-neutral-800' : 'border-[#EAE6DC]'
        }`}>
          <button
            onClick={() => setActiveTab('toc')}
            className={`pb-2.5 flex items-center gap-1.5 transition-all cursor-pointer relative ${
              activeTab === 'toc'
                ? themeConfig.isDark ? 'text-white border-b-2 border-white' : 'text-[#282521] border-b-2 border-[#282521]'
                : 'opacity-50 hover:opacity-100'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Indice ({book.chapters.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`pb-2.5 flex items-center gap-1.5 transition-all cursor-pointer relative ${
              activeTab === 'bookmarks'
                ? themeConfig.isDark ? 'text-white border-b-2 border-white' : 'text-[#282521] border-b-2 border-[#282521]'
                : 'opacity-50 hover:opacity-100'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />
            <span>Segnalibri ({bookBookmarks.length})</span>
          </button>
        </div>

        {/* Tab 1: Chapters List */}
        {activeTab === 'toc' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
            {book.chapters.map((chapter, index) => {
              const isCurrent = chapter.id === currentChapterId;
              const chapterBms = bookBookmarks.filter((b) => b.chapterId === chapter.id);

              return (
                <div
                  key={chapter.id}
                  className={`w-full rounded-xl border text-left transition-all ${
                    isCurrent
                      ? themeConfig.isDark
                        ? 'border-neutral-400 bg-neutral-800/90 ring-1 ring-neutral-400'
                        : 'border-[#695643] bg-white ring-1 ring-[#695643]'
                      : themeConfig.isDark
                        ? 'border-neutral-800/80 hover:border-neutral-700 bg-neutral-900/30'
                        : 'border-[#EAE6DC] hover:border-[#D5CDBE] bg-white/40'
                  }`}
                >
                  <button
                    onClick={() => {
                      onSelectChapter(chapter.id);
                      onClose();
                    }}
                    className="w-full p-4 flex items-start gap-3.5 text-left cursor-pointer"
                  >
                    <span className="text-xs font-mono opacity-50 pt-0.5">
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium leading-snug">{chapter.title}</h4>
                        {isCurrent && (
                          <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 shrink-0 ml-2">
                            In Lettura
                          </span>
                        )}
                      </div>

                      {chapter.subtitle && (
                        <p className="text-xs opacity-70 italic mt-0.5 line-clamp-1">
                          {chapter.subtitle}
                        </p>
                      )}

                      <div className="flex items-center gap-3 mt-2 text-[11px] opacity-50">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {chapter.readingTimeMinutes} min
                        </span>
                        <span>•</span>
                        <span>{chapter.content.length} paragrafi</span>
                      </div>
                    </div>

                    <ChevronRight className={`w-4 h-4 opacity-40 shrink-0 self-center ${isCurrent ? 'opacity-100 text-[#695643] dark:text-neutral-200' : ''}`} />
                  </button>

                  {/* Bookmark pills inside chapter in TOC */}
                  {chapterBms.length > 0 && (
                    <div className="px-4 pb-3 pt-1 border-t border-black/5 dark:border-white/5 flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] uppercase tracking-wider font-semibold opacity-50 mr-1 flex items-center gap-1">
                        <Bookmark className="w-3 h-3" />
                        Segnalibri:
                      </span>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {chapterBms.map((bm) => (
                          <BookmarkIconPin
                            key={bm.id}
                            bookmark={bm}
                            themeConfig={themeConfig}
                            onRemove={onRemoveBookmark}
                            onJumpTo={(chId, pIdx) => {
                              onSelectChapter(chId, pIdx);
                              onClose();
                            }}
                            size="sm"
                            showInlineLabel={true}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 2: All Bookmarks with Colors & Quick Jump */}
        {activeTab === 'bookmarks' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {bookBookmarks.length === 0 ? (
              <div className="text-center py-16 px-4 space-y-3 opacity-60">
                <Bookmark className="w-8 h-8 mx-auto stroke-1 text-amber-500" />
                <p className="text-xs font-medium">Nessun segnalibro salvato in questo libro</p>
                <p className="text-[11px]">
                  Durante la lettura, clicca sull'icona segnalibro in alto o accanto ai paragrafi per salvare con colore a scelta.
                </p>
              </div>
            ) : (
              bookBookmarks.map((bm) => {
                const style = BOOKMARK_COLOR_STYLES[bm.color || 'amber'] || BOOKMARK_COLOR_STYLES.amber;
                return (
                  <div
                    key={bm.id}
                    className={`p-3.5 rounded-xl border transition-all flex flex-col gap-2 ${
                      themeConfig.isDark ? 'bg-neutral-900/50 border-neutral-800' : 'bg-white/70 border-[#EAE6DC]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`w-2.5 h-2.5 rounded-full ${style.dot} shrink-0 ring-2 ring-white/20`} />
                        <span className="text-xs font-semibold truncate text-[#695643] dark:text-neutral-200">
                          {bm.chapterTitle}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/5 opacity-70 shrink-0">
                          Paragrafo {(bm.paragraphIndex ?? 0) + 1}
                        </span>
                      </div>

                      {onRemoveBookmark && (
                        <button
                          onClick={() => onRemoveBookmark(bm.id)}
                          className="opacity-40 hover:opacity-100 hover:text-rose-500 transition-colors p-1 cursor-pointer shrink-0"
                          title="Elimina segnalibro"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {bm.note && (
                      <p className={`text-xs font-medium px-2 py-1 rounded-md border ${style.bg} ${style.text} ${style.border}`}>
                        Nota: {bm.note}
                      </p>
                    )}

                    <p className={`text-xs italic opacity-75 line-clamp-2 pl-2 border-l-2 ${style.border}`}>
                      "{bm.snippet}"
                    </p>

                    <div className="flex items-center justify-between pt-1 text-[11px] opacity-50 border-t border-black/5 dark:border-white/5">
                      <span>{bm.createdAt}</span>
                      <button
                        onClick={() => {
                          onSelectChapter(bm.chapterId, bm.paragraphIndex);
                          onClose();
                        }}
                        className="text-xs font-medium hover:underline flex items-center gap-1 text-sky-600 dark:text-sky-400 cursor-pointer"
                      >
                        Riprendi lettura <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Footer info */}
        <div className={`p-4 border-t text-center text-xs opacity-50 ${
          themeConfig.isDark ? 'border-neutral-800' : 'border-[#EAE6DC]'
        }`}>
          {activeTab === 'toc'
            ? `${book.chapters.length} capitoli complessivi • Seleziona per leggere`
            : `${bookBookmarks.length} segnalibri salvati`}
        </div>
      </div>
    </div>
  );
};
