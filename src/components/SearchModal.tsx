import React, { useState, useMemo } from 'react';
import { X, Search, BookOpen, ArrowRight } from 'lucide-react';
import { Book } from '../types';
import { ThemeConfig } from '../utils/themeStyles';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: Book;
  onJumpToResult: (chapterId: string) => void;
  themeConfig: ThemeConfig;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  book,
  onJumpToResult,
  themeConfig
}) => {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim() || query.trim().length < 2) return [];

    const q = query.toLowerCase();
    const matches: Array<{
      chapterId: string;
      chapterTitle: string;
      snippet: string;
      matchIndex: number;
    }> = [];

    book.chapters.forEach((chap) => {
      chap.content.forEach((para) => {
        const idx = para.toLowerCase().indexOf(q);
        if (idx !== -1) {
          const start = Math.max(0, idx - 40);
          const end = Math.min(para.length, idx + query.length + 50);
          const snippet = (start > 0 ? '...' : '') + para.substring(start, end) + (end < para.length ? '...' : '');
          matches.push({
            chapterId: chap.id,
            chapterTitle: chap.title,
            snippet,
            matchIndex: idx
          });
        }
      });
    });

    return matches;
  }, [query, book]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className={`w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden transition-all flex flex-col max-h-[80vh] ${
          themeConfig.isDark ? 'bg-[#181A1D] border-neutral-800 text-neutral-100' : 'bg-[#FAF8F5] border-[#E3DFD5] text-[#282521]'
        }`}
      >
        {/* Search input bar */}
        <div className={`p-4 flex items-center gap-3 border-b ${
          themeConfig.isDark ? 'border-neutral-800' : 'border-[#EAE6DC]'
        }`}>
          <Search className="w-4 h-4 opacity-50 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Cerca in "${book.title}"...`}
            className="flex-1 bg-transparent border-none outline-none text-base sm:text-sm"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs opacity-50 hover:opacity-100"
            >
              Cancella
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded-lg opacity-60 hover:opacity-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="p-4 overflow-y-auto space-y-2 flex-1">
          {query.trim().length < 2 ? (
            <div className="text-center py-10 opacity-50 text-xs">
              Digita almeno 2 caratteri per avviare la ricerca nel testo...
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-10 opacity-50 text-xs">
              Nessuna corrispondenza trovata per "{query}"
            </div>
          ) : (
            results.map((res, i) => (
              <button
                key={i}
                onClick={() => {
                  onJumpToResult(res.chapterId);
                  onClose();
                }}
                className={`w-full p-3 rounded-xl border text-left transition-all ${
                  themeConfig.isDark
                    ? 'border-neutral-800 hover:border-neutral-700 bg-neutral-900/30'
                    : 'border-[#EAE6DC] hover:border-[#D5CDBE] bg-white/50'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-semibold text-[#695643] dark:text-neutral-400 mb-1">
                  <span>{res.chapterTitle}</span>
                  <ArrowRight className="w-3 h-3 opacity-60" />
                </div>
                <p className="text-xs font-serif opacity-80 line-clamp-2">
                  {res.snippet}
                </p>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
