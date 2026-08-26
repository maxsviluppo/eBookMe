import React from 'react';
import { X, BookOpen, Clock, CheckCircle2, ChevronRight } from 'lucide-react';
import { Book, Chapter } from '../types';
import { ThemeConfig, FONT_CONFIGS } from '../utils/themeStyles';
import { BridgeLogo } from './BridgeLogo';

interface TableOfContentsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  book: Book;
  currentChapterId: string;
  onSelectChapter: (chapterId: string) => void;
  themeConfig: ThemeConfig;
  font: string;
}

export const TableOfContentsDrawer: React.FC<TableOfContentsDrawerProps> = ({
  isOpen,
  onClose,
  book,
  currentChapterId,
  onSelectChapter,
  themeConfig,
  font
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className={`w-full max-w-md h-full flex flex-col border-l shadow-2xl transition-all ${
          themeConfig.isDark ? 'bg-[#181A1D] border-neutral-800 text-neutral-100' : 'bg-[#FAF8F5] border-[#E3DFD5] text-[#282521]'
        }`}
      >
        {/* Drawer Header */}
        <div className={`p-6 flex items-center justify-between border-b ${
          themeConfig.isDark ? 'border-neutral-800' : 'border-[#EAE6DC]'
        }`}>
          <div>
            <BridgeLogo
              variant="compact"
              themeMode={themeConfig.isDark ? 'dark' : 'light'}
              className="mb-1.5 opacity-90"
            />
            <h3 className="text-base font-medium truncate mt-1">{book.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg opacity-60 hover:opacity-100 transition-opacity hover:bg-black/5 dark:hover:bg-white/5"
            aria-label="Chiudi indice"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Chapters List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {book.chapters.map((chapter, index) => {
            const isCurrent = chapter.id === currentChapterId;
            return (
              <button
                key={chapter.id}
                onClick={() => {
                  onSelectChapter(chapter.id);
                  onClose();
                }}
                className={`w-full p-4 rounded-xl border text-left transition-all flex items-start gap-3.5 ${
                  isCurrent
                    ? themeConfig.isDark
                      ? 'border-neutral-400 bg-neutral-800/90 ring-1 ring-neutral-400'
                      : 'border-[#695643] bg-white ring-1 ring-[#695643]'
                    : themeConfig.isDark
                      ? 'border-neutral-800/80 hover:border-neutral-700 bg-neutral-900/30'
                      : 'border-[#EAE6DC] hover:border-[#D5CDBE] bg-white/40'
                }`}
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
            );
          })}
        </div>

        {/* Footer info */}
        <div className={`p-4 border-t text-center text-xs opacity-50 ${
          themeConfig.isDark ? 'border-neutral-800' : 'border-[#EAE6DC]'
        }`}>
          {book.chapters.length} capitoli complessivi • Scorri per selezionare
        </div>
      </div>
    </div>
  );
};
