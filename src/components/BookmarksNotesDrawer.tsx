import React, { useState } from 'react';
import { X, Bookmark, Highlighter, Trash2, Edit3, ArrowRight, BookOpen, Quote } from 'lucide-react';
import { BookmarkItem, HighlightItem } from '../types';
import { ThemeConfig } from '../utils/themeStyles';

interface BookmarksNotesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarks: BookmarkItem[];
  highlights: HighlightItem[];
  onRemoveBookmark: (id: string) => void;
  onRemoveHighlight: (id: string) => void;
  onJumpToChapter: (chapterId: string) => void;
  themeConfig: ThemeConfig;
}

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

  if (!isOpen) return null;

  const colorBadges = {
    yellow: 'bg-amber-400/20 text-amber-700 dark:text-amber-300 border-amber-400/30',
    green: 'bg-emerald-400/20 text-emerald-700 dark:text-emerald-300 border-emerald-400/30',
    blue: 'bg-sky-400/20 text-sky-700 dark:text-sky-300 border-sky-400/30',
    rose: 'bg-rose-400/20 text-rose-700 dark:text-rose-300 border-rose-400/30',
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className={`w-full max-w-md h-full flex flex-col border-l shadow-2xl transition-all ${
          themeConfig.isDark ? 'bg-[#181A1D] border-neutral-800 text-neutral-100' : 'bg-[#FAF8F5] border-[#E3DFD5] text-[#282521]'
        }`}
      >
        {/* Header */}
        <div className={`p-6 flex items-center justify-between border-b ${
          themeConfig.isDark ? 'border-neutral-800' : 'border-[#EAE6DC]'
        }`}>
          <div>
            <span className="text-[10px] uppercase tracking-widest font-semibold opacity-60">Archivio Personale</span>
            <h3 className="text-base font-medium mt-0.5">Segnalibri & Note</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg opacity-60 hover:opacity-100 transition-opacity hover:bg-black/5 dark:hover:bg-white/5"
            aria-label="Chiudi note"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className={`flex border-b px-6 pt-3 gap-6 text-xs font-medium ${
          themeConfig.isDark ? 'border-neutral-800' : 'border-[#EAE6DC]'
        }`}>
          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`pb-3 flex items-center gap-1.5 transition-all relative ${
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
            className={`pb-3 flex items-center gap-1.5 transition-all relative ${
              activeTab === 'highlights'
                ? themeConfig.isDark ? 'text-white border-b-2 border-white' : 'text-[#282521] border-b-2 border-[#282521]'
                : 'opacity-50 hover:opacity-100'
            }`}
          >
            <Highlighter className="w-3.5 h-3.5" />
            <span>Evidenziazioni ({highlights.length})</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {activeTab === 'bookmarks' ? (
            bookmarks.length === 0 ? (
              <div className="text-center py-16 px-4 space-y-3 opacity-60">
                <Bookmark className="w-8 h-8 mx-auto stroke-1" />
                <p className="text-xs">Nessun segnalibro salvato</p>
                <p className="text-[11px]">Clicca sull'icona segnalibro nella barra del lettore per salvare la pagina corrente.</p>
              </div>
            ) : (
              bookmarks.map((bm) => (
                <div
                  key={bm.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col gap-2 ${
                    themeConfig.isDark ? 'bg-neutral-900/40 border-neutral-800' : 'bg-white/50 border-[#EAE6DC]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[#695643] dark:text-neutral-300">
                      <Bookmark className="w-3.5 h-3.5 fill-current" />
                      <span>{bm.chapterTitle}</span>
                    </div>
                    <button
                      onClick={() => onRemoveBookmark(bm.id)}
                      className="opacity-40 hover:opacity-100 hover:text-rose-500 transition-colors p-1"
                      title="Rimuovi segnalibro"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-xs italic opacity-75 line-clamp-2 pl-2 border-l-2 border-amber-500/40">
                    "{bm.snippet}"
                  </p>

                  <div className="flex items-center justify-between pt-1 text-[11px] opacity-50">
                    <span>{bm.createdAt}</span>
                    <button
                      onClick={() => {
                        onJumpToChapter(bm.chapterId);
                        onClose();
                      }}
                      className="text-xs font-medium hover:underline flex items-center gap-1 text-[#695643] dark:text-neutral-300"
                    >
                      Vai al capitolo <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )
          ) : highlights.length === 0 ? (
            <div className="text-center py-16 px-4 space-y-3 opacity-60">
              <Highlighter className="w-8 h-8 mx-auto stroke-1" />
              <p className="text-xs">Nessuna evidenziazione</p>
              <p className="text-[11px]">Seleziona una porzione di testo nel lettore per evidenziarla o aggiungere un commento.</p>
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
                    className="opacity-40 hover:opacity-100 hover:text-rose-500 transition-colors p-1"
                    title="Rimuovi evidenziazione"
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
                    className="text-xs font-medium hover:underline flex items-center gap-1 text-[#695643] dark:text-neutral-300"
                  >
                    Apri capitolo <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
