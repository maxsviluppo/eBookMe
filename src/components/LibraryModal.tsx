import React, { useState } from 'react';
import { X, BookOpen, Clock, Calendar, Check, Plus, Library, Cloud, Trash2, ShieldCheck } from 'lucide-react';
import { Book } from '../types';
import { LogoEmblem } from './LogoEmblem';
import { ThemeConfig } from '../utils/themeStyles';
import { UserProfile } from '../lib/firebase';

interface LibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  books: Book[];
  currentBookId: string;
  onSelectBook: (book: Book) => void;
  onOpenUploadModal: () => void;
  onDeleteBook?: (bookId: string) => void;
  currentUser?: UserProfile | null;
  themeConfig: ThemeConfig;
}

export const LibraryModal: React.FC<LibraryModalProps> = ({
  isOpen,
  onClose,
  books,
  currentBookId,
  onSelectBook,
  onOpenUploadModal,
  onDeleteBook,
  currentUser,
  themeConfig
}) => {
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className={`w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden transition-all flex flex-col max-h-[85vh] ${
          themeConfig.isDark ? 'bg-[#181A1D] border-neutral-800 text-neutral-100' : 'bg-[#FAF8F5] border-[#E3DFD5] text-[#282521]'
        }`}
      >
        {/* Header */}
        <div className={`px-6 py-4 flex items-center justify-between border-b ${
          themeConfig.isDark ? 'border-neutral-800' : 'border-[#EAE6DC]'
        }`}>
          <div className="flex items-center space-x-2.5">
            <Library className="w-4 h-4 opacity-70" />
            <div>
              <h3 className="text-sm font-medium tracking-wide">Biblioteca & Opere</h3>
              <div className="flex items-center gap-1.5 text-[10px] opacity-60">
                <Cloud className="w-3 h-3 text-sky-500" />
                <span>
                  {currentUser ? 'Database Cloud Attivo' : 'Archiviazione Locale'}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                onClose();
                onOpenUploadModal();
              }}
              className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-all ${
                themeConfig.isDark
                  ? 'border-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-white'
                  : 'border-[#DFD9CE] bg-white hover:bg-[#EFEBE2] text-[#282521]'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Importa / Salva eBook</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg opacity-60 hover:opacity-100 transition-opacity hover:bg-black/5 dark:hover:bg-white/5"
              aria-label="Chiudi biblioteca"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Books List Grid */}
        <div className="p-6 overflow-y-auto space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {books.map((book) => {
              const isSelected = book.id === currentBookId;
              const totalMins = book.chapters.reduce((a, c) => a + c.readingTimeMinutes, 0);
              const isUserUploaded = book.id.startsWith('custom-') || book.id.startsWith('book-');

              return (
                <div
                  key={book.id}
                  onClick={() => {
                    onSelectBook(book);
                    onClose();
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between group relative ${
                    isSelected
                      ? themeConfig.isDark
                        ? 'border-neutral-300 bg-neutral-800/90 ring-1 ring-neutral-400 shadow-md'
                        : 'border-[#695643] bg-white ring-1 ring-[#695643] shadow-md'
                      : themeConfig.isDark
                        ? 'border-neutral-800 hover:border-neutral-700 bg-neutral-900/30'
                        : 'border-[#EAE6DC] hover:border-[#D5CDBE] bg-white/40'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 ${
                      themeConfig.isDark ? 'border-neutral-700 bg-neutral-900' : 'border-[#DFD8CC] bg-[#F7F5EE]'
                    }`}>
                      <LogoEmblem
                        emblemType={book.coverEmblem || 'geometric'}
                        customUrl={book.customLogoUrl}
                        size="sm"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium leading-snug truncate pr-1">{book.title}</h4>
                        <div className="flex items-center gap-1 shrink-0">
                          {isSelected && <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />}
                          {onDeleteBook && isUserUploaded && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (deleteConfirmId === book.id) {
                                  onDeleteBook(book.id);
                                  setDeleteConfirmId(null);
                                } else {
                                  setDeleteConfirmId(book.id);
                                  setTimeout(() => setDeleteConfirmId(null), 3000);
                                }
                              }}
                              className={`p-1 rounded opacity-60 hover:opacity-100 transition-all ${
                                deleteConfirmId === book.id
                                  ? 'bg-rose-500 text-white opacity-100 text-[10px] px-1.5'
                                  : 'hover:text-rose-500'
                              }`}
                              title="Elimina dal Cloud"
                            >
                              {deleteConfirmId === book.id ? 'Conferma?' : <Trash2 className="w-3.5 h-3.5" />}
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-xs opacity-70 truncate mt-0.5">{book.author}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {isUserUploaded && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-600 dark:text-sky-400 font-mono font-medium flex items-center gap-1">
                            <Cloud className="w-2.5 h-2.5" />
                            <span>Cloud</span>
                          </span>
                        )}
                        {book.genre && (
                          <span className="text-[10px] opacity-50 block">{book.genre}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-[11px] opacity-50">
                    <span>{book.chapters.length} capitoli</span>
                    <span>~{totalMins} min lettura</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

