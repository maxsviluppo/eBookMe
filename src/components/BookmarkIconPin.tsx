import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bookmark, X, ArrowRight, Trash2, Tag } from 'lucide-react';
import { BookmarkItem, BookmarkColor } from '../types';
import { ThemeConfig } from '../utils/themeStyles';

interface BookmarkIconPinProps {
  bookmark: BookmarkItem;
  themeConfig: ThemeConfig;
  onRemove?: (id: string) => void;
  onJumpTo?: (chapterId: string, paragraphIndex?: number) => void;
  size?: 'sm' | 'md' | 'lg';
  showInlineLabel?: boolean;
}

const COLOR_THEMES: Record<BookmarkColor, {
  bg: string;
  badgeBg: string;
  text: string;
  border: string;
  dot: string;
  ring: string;
  label: string;
}> = {
  amber: {
    bg: 'bg-amber-500/15 hover:bg-amber-500/25',
    badgeBg: 'bg-amber-500/20 text-amber-700 dark:text-amber-300',
    text: 'text-amber-600 dark:text-amber-400',
    border: 'border-amber-500/40',
    dot: 'bg-amber-500',
    ring: 'ring-amber-500/30',
    label: 'Ambra / Oro'
  },
  emerald: {
    bg: 'bg-emerald-500/15 hover:bg-emerald-500/25',
    badgeBg: 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300',
    text: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-500/40',
    dot: 'bg-emerald-500',
    ring: 'ring-emerald-500/30',
    label: 'Smeraldo / Verde'
  },
  sky: {
    bg: 'bg-sky-500/15 hover:bg-sky-500/25',
    badgeBg: 'bg-sky-500/20 text-sky-700 dark:text-sky-300',
    text: 'text-sky-600 dark:text-sky-400',
    border: 'border-sky-500/40',
    dot: 'bg-sky-500',
    ring: 'ring-sky-500/30',
    label: 'Cielo / Azzurro'
  },
  rose: {
    bg: 'bg-rose-500/15 hover:bg-rose-500/25',
    badgeBg: 'bg-rose-500/20 text-rose-700 dark:text-rose-300',
    text: 'text-rose-600 dark:text-rose-400',
    border: 'border-rose-500/40',
    dot: 'bg-rose-500',
    ring: 'ring-rose-500/30',
    label: 'Rosa / Corallo'
  },
  purple: {
    bg: 'bg-purple-500/15 hover:bg-purple-500/25',
    badgeBg: 'bg-purple-500/20 text-purple-700 dark:text-purple-300',
    text: 'text-purple-600 dark:text-purple-400',
    border: 'border-purple-500/40',
    dot: 'bg-purple-500',
    ring: 'ring-purple-500/30',
    label: 'Viola / Ametista'
  },
  indigo: {
    bg: 'bg-indigo-500/15 hover:bg-indigo-500/25',
    badgeBg: 'bg-indigo-500/20 text-indigo-700 dark:text-indigo-300',
    text: 'text-indigo-600 dark:text-indigo-400',
    border: 'border-indigo-500/40',
    dot: 'bg-indigo-500',
    ring: 'ring-indigo-500/30',
    label: 'Indaco / Zaffiro'
  }
};

export const BookmarkIconPin: React.FC<BookmarkIconPinProps> = ({
  bookmark,
  themeConfig,
  onRemove,
  onJumpTo,
  size = 'md',
  showInlineLabel = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const colorKey = bookmark.color || 'amber';
  const style = COLOR_THEMES[colorKey] || COLOR_THEMES.amber;

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4'
  };

  const btnPaddings = {
    sm: 'p-1',
    md: 'p-1.5',
    lg: 'p-2'
  };

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 250);
  };

  const labelDisplay = bookmark.note || `Segnalibro ${style.label.split('/')[0].trim()}`;

  return (
    <div
      ref={popoverRef}
      className="relative inline-flex items-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Icon Button Trigger */}
      <button
        type="button"
        id={`bookmark-icon-${bookmark.id}`}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        className={`rounded-full border transition-all flex items-center gap-1.5 cursor-pointer select-none group shadow-2xs ${
          style.bg
        } ${style.border} ${btnPaddings[size]} ${isOpen ? `ring-2 ${style.ring} scale-105` : 'hover:scale-105'}`}
        title={`Segnalibro: ${labelDisplay}`}
        aria-expanded={isOpen}
      >
        <span className={`w-2 h-2 rounded-full ${style.dot} ring-1 ring-white/40 shrink-0`} />
        <Bookmark className={`${iconSizes[size]} fill-current ${style.text}`} />
        {showInlineLabel && (
          <span className="text-[11px] font-medium max-w-[120px] truncate opacity-90 pr-1">
            {labelDisplay}
          </span>
        )}
      </button>

      {/* Label & Card a comparsa (Animated Popover) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={`absolute left-0 top-full mt-2 z-50 w-64 sm:w-72 p-3.5 rounded-2xl border shadow-2xl backdrop-blur-xl flex flex-col gap-2 ${
              themeConfig.isDark
                ? 'bg-[#1C1F24]/95 border-neutral-700 text-white'
                : 'bg-white/95 border-[#D8D2C5] text-[#282521]'
            }`}
            style={{
              transformOrigin: 'top left'
            }}
          >
            {/* Header: Label & Color Badge */}
            <div className="flex items-start justify-between gap-2 border-b border-black/5 dark:border-white/5 pb-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className={`w-2.5 h-2.5 rounded-full ${style.dot} ring-2 ring-white/20 shrink-0`} />
                <span className={`text-xs font-semibold truncate ${style.text}`}>
                  {labelDisplay}
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/5 font-mono opacity-70 shrink-0">
                Par. {(bookmark.paragraphIndex ?? 0) + 1}
              </span>
            </div>

            {/* Snippet / Citation */}
            <p className={`text-xs italic opacity-80 leading-relaxed line-clamp-3 pl-2 border-l-2 ${style.border}`}>
              "{bookmark.snippet}"
            </p>

            {/* Footer metadata & actions */}
            <div className="pt-2 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-[11px]">
              <span className="opacity-50 text-[10px]">{bookmark.createdAt}</span>

              <div className="flex items-center gap-1.5">
                {onJumpTo && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onJumpTo(bookmark.chapterId, bookmark.paragraphIndex);
                      setIsOpen(false);
                    }}
                    className="px-2 py-1 rounded-lg bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 font-medium flex items-center gap-1 text-sky-600 dark:text-sky-400 transition-colors cursor-pointer"
                  >
                    <span>Vai</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}

                {onRemove && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(bookmark.id);
                      setIsOpen(false);
                    }}
                    className="p-1 rounded-lg hover:bg-rose-500/10 text-rose-500 transition-colors cursor-pointer opacity-70 hover:opacity-100"
                    title="Rimuovi questo segnalibro dal database"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
