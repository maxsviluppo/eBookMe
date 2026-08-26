import React, { useState } from 'react';
import { X, Bookmark, Highlighter, Trash2, ArrowRight, LayoutGrid, List } from 'lucide-react';
import { BookmarkItem, HighlightItem, BookmarkColor } from '../types';
import { ThemeConfig } from '../utils/themeStyles';
import { BookmarkIconPin } from './BookmarkIconPin';

interface BookmarksNotesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarks: BookmarkItem[];
  highlights: HighlightItem[];
  onRemoveBookmark: (id: string) => void;
  onRemoveHighlight: (id: string) => void;
  onJumpToChapter: (chapterId: string, paragraphIndex?: number) => void;
  themeConfig: ThemeConfig;
}

const BOOKMARK_COLOR_STYLES: Record<BookmarkColor, { bg: string; text: string; border: string; dot: string; label: string }> = {
  amber: {
    bg: 'bg-amber-500/15',
    text: 'text-amber-700 dark:text-amber-300',
    border: 'border-amber-500/30',
    dot: 'bg-amber-500',
    label: 'Ambra'
  },
  emerald: {
    bg: 'bg-emerald-500/15',
    text: 'text-emerald-700 dark:text-emerald-300',
    border: 'border-emerald-500/30',
    dot: 'bg-emerald-500',
    label: 'Smeraldo'
  },
  sky: {
    bg: 'bg-sky-500/15',
    text: 'text-sky-700 dark:text-sky-300',
    border: 'border-sky-500/30',
    dot: 'bg-sky-500',
    label: 'Cielo'
  },
  rose: {
    bg: 'bg-rose-500/15',
    text: 'text-rose-700 dark:text-rose-300',
    border: 'border-rose-500/30',
    dot: 'bg-rose-500',
    label: 'Rosa'
  },
  purple: {
    bg: 'bg-purple-500/15',
    text: 'text-purple-700 dark:text-purple-300',
    border: 'border-purple-500/30',
    dot: 'bg-purple-500',
    label: 'Viola'
  },
  indigo: {
    bg: 'bg-indigo-500/15',
    text: 'text-indigo-700 dark:text-indigo-300',
    border: 'border-indigo-500/30',
    dot: 'bg-indigo-500',
    label: 'Indaco'
  }
};

export const BookmarksNotesDrawer: React.FC<BookmarksNotesDrawerProps> = ({
  isOpen,
  onClose,
  bookmarks,
  highlights,
  onRemoveBookmark,
  onRemoveHighlight,
  onJumpToChapter,
  themeConfig
}) => {
  const [activeTab, setActiveTab] = useState<'bookmarks' | 'highlights'>('bookmarks');
  const [filterColor, setFilterColor] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'icons'>('cards');

  if (!isOpen) return null;

  const colorBadges = {
    yellow: 'bg-amber-400/20 text-amber-700 dark:text-amber-300 border-amber-400/30',
    green: 'bg-emerald-400/20 text-emerald-700 dark:text-emerald-300 border-emerald-400/30',
    blue: 'bg-sky-400/20 text-sky-700 dark:text-sky-300 border-sky-400/30',
    rose: 'bg-rose-400/20 text-rose-700 dark:text-rose-300 border-rose-400/30',
  };

  const filteredBookmarks = filterColor === 'all'
    ? bookmarks
    : bookmarks.filter((b) => (b.color || 'amber') === filterColor);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className={`w-full max-w-md h-full flex flex-col border-l shadow-2xl transition-all ${
          themeConfig.isDark ? 'bg-[#181A1D] border-neutral-800 text-neutral-100' : 'bg-[#FAF8F5] border-[#E3DFD5] text-[#282521]'
        }`}
      >
        {/* Header */}
        <div className={`p-5 sm:p-6 flex items-center justify-between border-b ${
          themeConfig.isDark ? 'border-neutral-800' : 'border-[#EAE6DC]'
        }`}>
          <div>
            <span className="text-[10px] uppercase tracking-widest font-semibold opacity-60">Archivio Cloud</span>
            <h3 className="text-base font-medium mt-0.5">Segnalibri & Note</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg opacity-60 hover:opacity-100 transition-opacity hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
            aria-label="Chiudi note"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className={`flex border-b px-5 sm:px-6 pt-3 justify-between items-center text-xs font-medium ${
          themeConfig.isDark ? 'border-neutral-800' : 'border-[#EAE6DC]'
        }`}>
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab('bookmarks')}
              className={`pb-3 flex items-center gap-1.5 transition-all cursor-pointer relative ${
                activeTab === 'bookmarks'
                  ? themeConfig.isDark ? 'text-white border-b-2 border-white' : 'text-[#282521] border-b-2 border-[#282521]'
                  : 'opacity-50 hover:opacity-100'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Segnalibri ({bookmarks.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('highlights')}
              className={`pb-3 flex items-center gap-1.5 transition-all cursor-pointer relative ${
                activeTab === 'highlights'
                  ? themeConfig.isDark ? 'text-white border-b-2 border-white' : 'text-[#282521] border-b-2 border-[#282521]'
                  : 'opacity-50 hover:opacity-100'
              }`}
            >
              <Highlighter className="w-3.5 h-3.5" />
              <span>Evidenziazioni ({highlights.length})</span>
            </button>
          </div>

          {activeTab === 'bookmarks' && (
            <div className="flex items-center gap-1 pb-2">
              <button
                onClick={() => setViewMode('cards')}
                className={`p-1 rounded-md transition-colors cursor-pointer ${
                  viewMode === 'cards' ? 'bg-black/10 dark:bg-white/15 opacity-100' : 'opacity-40 hover:opacity-80'
                }`}
                title="Vista Schede"
              >
                <List className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('icons')}
                className={`p-1 rounded-md transition-colors cursor-pointer ${
                  viewMode === 'icons' ? 'bg-black/10 dark:bg-white/15 opacity-100' : 'opacity-40 hover:opacity-80'
                }`}
                title="Vista Icone con popup a comparsa"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Color Palette Filter Bar for Bookmarks */}
        {activeTab === 'bookmarks' && bookmarks.length > 0 && (
          <div className="px-5 py-2.5 border-b border-black/5 dark:border-white/5 flex items-center gap-2 overflow-x-auto text-xs">
            <span className="text-[11px] opacity-60 shrink-0">Filtra:</span>
            <button
              onClick={() => setFilterColor('all')}
              className={`px-2 py-0.5 rounded-full text-[11px] font-medium border transition-all cursor-pointer ${
                filterColor === 'all'
                  ? themeConfig.isDark ? 'bg-white text-black border-white' : 'bg-neutral-800 text-white border-neutral-800'
                  : 'opacity-60 border-transparent hover:opacity-100'
              }`}
            >
              Tutti
            </button>
            {(Object.entries(BOOKMARK_COLOR_STYLES) as [BookmarkColor, typeof BOOKMARK_COLOR_STYLES[BookmarkColor]][]).map(([key, style]) => {
              const count = bookmarks.filter((b) => (b.color || 'amber') === key).length;
              if (count === 0) return null;
              return (
                <button
                  key={key}
                  onClick={() => setFilterColor(key)}
                  className={`px-2 py-0.5 rounded-full text-[11px] font-medium border flex items-center gap-1 transition-all cursor-pointer ${
                    filterColor === key
                      ? `${style.bg} ${style.text} ${style.border} ring-1 ring-current`
                      : 'opacity-70 border-transparent hover:opacity-100'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${style.dot}`} />
                  <span>{count}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {activeTab === 'bookmarks' ? (
            filteredBookmarks.length === 0 ? (
              <div className="text-center py-16 px-4 space-y-3 opacity-60">
                <Bookmark className="w-8 h-8 mx-auto stroke-1" />
                <p className="text-xs">
                  {bookmarks.length === 0 ? 'Nessun segnalibro salvato' : 'Nessun segnalibro per questo colore'}
                </p>
                <p className="text-[11px]">
                  Puoi inserire molteplici segnalibri con colori diversi durante la lettura.
                </p>
              </div>
            ) : viewMode === 'icons' ? (
              <div className="p-3 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 space-y-3">
                <p className="text-[11px] opacity-60 font-medium">
                  Passa il mouse o tocca l'icona per aprire la label a comparsa e navigare:
                </p>
                <div className="flex flex-wrap gap-2.5 items-center">
                  {filteredBookmarks.map((bm) => (
                    <BookmarkIconPin
                      key={bm.id}
                      bookmark={bm}
                      themeConfig={themeConfig}
                      onRemove={onRemoveBookmark}
                      onJumpTo={(chId, pIdx) => {
                        onJumpToChapter(chId, pIdx);
                        onClose();
                      }}
                      size="lg"
                      showInlineLabel={true}
                    />
                  ))}
                </div>
              </div>
            ) : (
              filteredBookmarks.map((bm) => {
                const colorKey = bm.color || 'amber';
                const style = BOOKMARK_COLOR_STYLES[colorKey] || BOOKMARK_COLOR_STYLES.amber;
                return (
                  <div
                    key={bm.id}
                    className={`p-4 rounded-xl border transition-all flex flex-col gap-2.5 ${
                      themeConfig.isDark ? 'bg-neutral-900/40 border-neutral-800' : 'bg-white/60 border-[#EAE6DC]'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <BookmarkIconPin
                          bookmark={bm}
                          themeConfig={themeConfig}
                          onRemove={onRemoveBookmark}
                          onJumpTo={(chId, pIdx) => {
                            onJumpToChapter(chId, pIdx);
                            onClose();
                          }}
                          size="sm"
                        />
                        <span className="text-xs font-semibold text-[#695643] dark:text-neutral-200 truncate">
                          {bm.chapterTitle}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/5 opacity-70 shrink-0">
                          Paragrafo {(bm.paragraphIndex ?? 0) + 1}
                        </span>
                      </div>
                      <button
                        onClick={() => onRemoveBookmark(bm.id)}
                        className="opacity-40 hover:opacity-100 hover:text-rose-500 transition-colors p-1 cursor-pointer shrink-0"
                        title="Rimuovi segnalibro dal database"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {bm.note && (
                      <p className={`text-xs font-medium px-2.5 py-1 rounded-md border ${style.bg} ${style.text} ${style.border}`}>
                        {bm.note}
                      </p>
                    )}

                    <p className={`text-xs italic opacity-75 line-clamp-2 pl-2 border-l-2 ${style.border}`}>
                      "{bm.snippet}"
                    </p>

                    <div className="flex items-center justify-between pt-1 text-[11px] opacity-50 border-t border-black/5 dark:border-white/5">
                      <span>{bm.createdAt}</span>
                      <button
                        onClick={() => {
                          onJumpToChapter(bm.chapterId, bm.paragraphIndex);
                          onClose();
                        }}
                        className="text-xs font-medium hover:underline flex items-center gap-1 text-sky-600 dark:text-sky-400 cursor-pointer"
                      >
                        Vai al paragrafo <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })
            )
          ) : (
            /* Tab Highlights */
            highlights.length === 0 ? (
              <div className="text-center py-16 px-4 space-y-3 opacity-60">
                <Highlighter className="w-8 h-8 mx-auto stroke-1" />
                <p className="text-xs">Nessuna evidenziazione</p>
                <p className="text-[11px]">Seleziona una porzione di testo nel lettore per evidenziare o commentare.</p>
              </div>
            ) : (
              highlights.map((hl) => (
                <div
                  key={hl.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col gap-2 ${
                    themeConfig.isDark ? 'bg-neutral-900/40 border-neutral-800' : 'bg-white/50 border-[#EAE6DC]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className={`text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full border ${colorBadges[hl.color]}`}>
                      {hl.chapterTitle}
                    </span>
                    <button
                      onClick={() => onRemoveHighlight(hl.id)}
                      className="opacity-40 hover:opacity-100 hover:text-rose-500 transition-colors p-1 cursor-pointer"
                      title="Rimuovi"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="pl-2.5 border-l-2 border-amber-500/60 py-0.5">
                    <p className="text-xs font-serif leading-relaxed italic">
                      "{hl.text}"
                    </p>
                  </div>

                  {hl.note && (
                    <div className="p-2 rounded-lg bg-black/5 dark:bg-white/5 text-xs">
                      <p className="text-[10px] uppercase tracking-wider font-semibold opacity-60 mb-0.5">Nota:</p>
                      <p className="opacity-90">{hl.note}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1 text-[11px] opacity-50">
                    <span>{hl.createdAt}</span>
                    <button
                      onClick={() => {
                        onJumpToChapter(hl.chapterId);
                        onClose();
                      }}
                      className="text-xs font-medium hover:underline flex items-center gap-1 text-[#695643] dark:text-neutral-300 cursor-pointer"
                    >
                      Vai al capitolo <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )
          )}
        </div>

        {/* Footer info */}
        <div className={`p-4 border-t text-center text-xs opacity-50 ${
          themeConfig.isDark ? 'border-neutral-800' : 'border-[#EAE6DC]'
        }`}>
          {activeTab === 'bookmarks' ? `${bookmarks.length} segnalibri salvati` : `${highlights.length} note salvate`}
        </div>
      </div>
    </div>
  );
};
