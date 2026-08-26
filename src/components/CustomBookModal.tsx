import React, { useState } from 'react';
import { X, Upload, FileText, Sparkles, Check, Cloud, ShieldCheck } from 'lucide-react';
import { Book, Chapter } from '../types';
import { ThemeConfig } from '../utils/themeStyles';
import { UserProfile } from '../lib/firebase';

interface CustomBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBook: (newBook: Book) => void;
  currentUser?: UserProfile | null;
  themeConfig: ThemeConfig;
}

export const CustomBookModal: React.FC<CustomBookModalProps> = ({
  isOpen,
  onClose,
  onAddBook,
  currentUser,
  themeConfig
}) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [content, setContent] = useState('');
  const [emblem, setEmblem] = useState('book');

  if (!isOpen) return null;

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = (e.target?.result as string) || '';
      setContent(text);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
    };
    reader.readAsText(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    // Split paragraphs
    const rawParagraphs = content
      .split(/\n\s*\n/)
      .map(p => p.trim())
      .filter(p => p.length > 0);

    // Group into chapters (e.g. every 6 paragraphs or markdown headers)
    const chapters: Chapter[] = [];
    let currentChapterParagraphs: string[] = [];
    let currentChapterTitle = 'Capitolo 1';
    let chapterIndex = 1;

    rawParagraphs.forEach((p) => {
      if (p.startsWith('# ') || p.startsWith('## ') || p.toLowerCase().startsWith('capitolo') || p.toLowerCase().startsWith('canto') || p.toLowerCase().startsWith('chapter')) {
        if (currentChapterParagraphs.length > 0) {
          chapters.push({
            id: `chap-${chapterIndex}`,
            number: chapterIndex,
            title: currentChapterTitle,
            content: currentChapterParagraphs,
            readingTimeMinutes: Math.max(2, Math.ceil(currentChapterParagraphs.join(' ').split(/\s+/).length / 150))
          });
          chapterIndex++;
          currentChapterParagraphs = [];
        }
        currentChapterTitle = p.replace(/^#+\s*/, '');
      } else {
        currentChapterParagraphs.push(p);
      }
    });

    if (currentChapterParagraphs.length > 0 || chapters.length === 0) {
      chapters.push({
        id: `chap-${chapterIndex}`,
        number: chapterIndex,
        title: currentChapterTitle,
        content: currentChapterParagraphs.length > 0 ? currentChapterParagraphs : ["Testo dell'opera..."],
        readingTimeMinutes: Math.max(2, Math.ceil(currentChapterParagraphs.join(' ').split(/\s+/).length / 150))
      });
    }

    const newBook: Book = {
      id: `custom-${Date.now()}`,
      title: title.trim(),
      subtitle: subtitle.trim() || undefined,
      author: author.trim() || 'Autore Personale',
      year: new Date().getFullYear().toString(),
      genre: 'Testo Personale',
      coverEmblem: emblem,
      chapters
    };

    onAddBook(newBook);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className={`w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden transition-all flex flex-col max-h-[90vh] ${
          themeConfig.isDark ? 'bg-[#181A1D] border-neutral-800 text-neutral-100' : 'bg-[#FAF8F5] border-[#E3DFD5] text-[#282521]'
        }`}
      >
        {/* Header */}
        <div className={`px-6 py-4 flex items-center justify-between border-b ${
          themeConfig.isDark ? 'border-neutral-800' : 'border-[#EAE6DC]'
        }`}>
          <div className="flex items-center space-x-2.5">
            <FileText className="w-4 h-4 opacity-70" />
            <div>
              <h3 className="text-sm font-medium tracking-wide">Importa eBook & Testi</h3>
              <div className="flex items-center gap-1.5 text-[10px] text-sky-600 dark:text-sky-400">
                <Cloud className="w-3 h-3" />
                <span>Salvataggio su Cloud Firestore</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg opacity-60 hover:opacity-100 transition-opacity hover:bg-black/5 dark:hover:bg-white/5"
            aria-label="Chiudi"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* File drag-drop input */}
          <div
            onClick={() => {
              const fileInput = document.createElement('input');
              fileInput.type = 'file';
              fileInput.accept = '.txt,.md,.text,.epub';
              fileInput.onchange = (e: any) => {
                if (e.target?.files?.[0]) {
                  handleFileUpload(e.target.files[0]);
                }
              };
              fileInput.click();
            }}
            className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
              themeConfig.isDark ? 'border-neutral-700 hover:border-neutral-500 bg-neutral-900/30' : 'border-[#DCD5C6] hover:border-[#BDB3A0] bg-white/40'
            }`}
          >
            <Upload className="w-5 h-5 mx-auto mb-1.5 opacity-60 text-sky-500" />
            <p className="text-xs font-medium">Carica file (.txt, .md, .text)</p>
            <p className="text-[10px] opacity-60">I capitoli (# Titolo) e i paragrafi vengono formattati e salvati nel cloud</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium block mb-1">Titolo dell'Opera *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="es. Le mie memorie"
                className={`w-full px-3 py-2 rounded-xl text-base sm:text-xs border outline-none transition-all ${
                  themeConfig.isDark ? 'bg-neutral-900 border-neutral-800 focus:border-neutral-500' : 'bg-white border-[#E0D9CC] focus:border-[#695643]'
                }`}
              />
            </div>

            <div>
              <label className="text-xs font-medium block mb-1">Autore</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="es. Nome Autore"
                className={`w-full px-3 py-2 rounded-xl text-base sm:text-xs border outline-none transition-all ${
                  themeConfig.isDark ? 'bg-neutral-900 border-neutral-800 focus:border-neutral-500' : 'bg-white border-[#E0D9CC] focus:border-[#695643]'
                }`}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium block mb-1">Sottotitolo / Descrizione</label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="es. Raccolta di saggi e riflessioni"
              className={`w-full px-3 py-2 rounded-xl text-base sm:text-xs border outline-none transition-all ${
                themeConfig.isDark ? 'bg-neutral-900 border-neutral-800 focus:border-neutral-500' : 'bg-white border-[#E0D9CC] focus:border-[#695643]'
              }`}
            />
          </div>

          <div>
            <label className="text-xs font-medium block mb-1">Testo dell'eBook *</label>
            <textarea
              rows={7}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Incolla qui il testo dell'eBook. Separa i paragrafi con una riga vuota. Usa '# Capitolo 1' per suddividere automaticamente i capitoli..."
              className={`w-full p-3 rounded-xl text-base sm:text-xs border outline-none font-serif leading-relaxed transition-all ${
                themeConfig.isDark ? 'bg-neutral-900 border-neutral-800 focus:border-neutral-500' : 'bg-white border-[#E0D9CC] focus:border-[#695643]'
              }`}
            />
          </div>

          {/* Footer */}
          <div className="pt-3 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[11px] opacity-60">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Salvataggio crittografato sul database</span>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-medium opacity-70 hover:opacity-100"
              >
                Annulla
              </button>
              <button
                type="submit"
                disabled={!title.trim() || !content.trim()}
                className={`px-5 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
                  themeConfig.isDark
                    ? 'bg-neutral-100 text-neutral-900 hover:bg-white disabled:opacity-40'
                    : 'bg-[#2B2722] text-[#F7F6F2] hover:bg-[#1A1815] disabled:opacity-40'
                }`}
              >
                <Cloud className="w-3.5 h-3.5" />
                <span>Salva nel Cloud & Leggi</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

