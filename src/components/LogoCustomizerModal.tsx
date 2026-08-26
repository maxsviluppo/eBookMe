import React, { useState } from 'react';
import { X, Upload, Check, RefreshCw, Sparkles, BookOpen, Sun, Moon } from 'lucide-react';
import { LogoEmblem } from './LogoEmblem';
import { BridgeLogo } from './BridgeLogo';
import { ThemeConfig } from '../utils/themeStyles';

interface LogoCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentEmblem: string;
  customLogoUrl?: string;
  onSelectEmblem: (emblem: string) => void;
  onUploadCustomLogo: (url: string | undefined) => void;
  themeConfig: ThemeConfig;
}

const EMBLEM_OPTIONS = [
  { id: 'bridge', label: 'eBookMe (Ufficiale)', desc: 'Libro e infinito geometrico - Logo Ufficiale' },
  { id: 'geometric', label: 'Armonia Geometrica', desc: 'Cerchio e assi zen minimali' },
  { id: 'book', label: 'Libro Aperto', desc: 'Simbolo classico della lettura' },
  { id: 'quill', label: 'Calamaio & Penna', desc: 'Ispirazione classica e calligrafia' },
  { id: 'feather', label: 'Piuma Filosofica', desc: 'Leggerezza e pensiero' },
  { id: 'seal', label: 'Sigillo Editoriale', desc: 'Stampa d’arte e incisione' },
  { id: 'monogram', label: 'Monogramma Moderno', desc: 'Inquadratura architettonica' },
];

export const LogoCustomizerModal: React.FC<LogoCustomizerModalProps> = ({
  isOpen,
  onClose,
  currentEmblem,
  customLogoUrl,
  onSelectEmblem,
  onUploadCustomLogo,
  themeConfig
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [previewTheme, setPreviewTheme] = useState<'current' | 'light' | 'dark'>('current');

  if (!isOpen) return null;

  const isPreviewDark = previewTheme === 'dark' || (previewTheme === 'current' && themeConfig.isDark);

  const handleFileUpload = (file: File) => {
    if (file && (file.type.startsWith('image/') || file.type.includes('svg'))) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onUploadCustomLogo(result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div 
        className={`w-full max-w-lg rounded-2xl border shadow-xl overflow-hidden transition-all ${
          themeConfig.isDark ? 'bg-[#181A1D] border-neutral-800 text-neutral-100' : 'bg-[#FAF8F5] border-[#E3DFD5] text-[#282521]'
        }`}
      >
        {/* Header */}
        <div className={`px-6 py-4 flex items-center justify-between border-b ${
          themeConfig.isDark ? 'border-neutral-800' : 'border-[#EAE6DC]'
        }`}>
          <div className="flex items-center space-x-2">
            <BridgeLogo variant="compact" themeMode={themeConfig.isDark ? 'dark' : 'light'} />
            <span className="opacity-40">•</span>
            <h3 className="text-sm font-medium tracking-wide">Logo & Brand Ufficiale</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg opacity-60 hover:opacity-100 transition-opacity hover:bg-black/5 dark:hover:bg-white/5"
            aria-label="Chiudi"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Active Preview Box with Light / Dark Theme Switcher */}
          <div className={`p-5 rounded-2xl border transition-all flex flex-col items-center gap-3 relative ${
            isPreviewDark ? 'bg-[#141517] border-neutral-800 text-[#F7F6F2]' : 'bg-[#F7F6F2] border-[#E4DFD5] text-[#2D2D2A]'
          }`}>
            {/* Quick theme toggle for preview */}
            <div className="flex items-center gap-1.5 self-end text-[11px] opacity-70">
              <span className="text-[10px] uppercase font-mono mr-1">Anteprima:</span>
              <button
                onClick={() => setPreviewTheme('light')}
                className={`p-1 rounded-md transition-all ${previewTheme === 'light' ? 'bg-amber-100 text-amber-900 ring-1 ring-amber-400' : 'opacity-60 hover:opacity-100'}`}
                title="Versione Chiara (Light)"
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setPreviewTheme('dark')}
                className={`p-1 rounded-md transition-all ${previewTheme === 'dark' ? 'bg-neutral-800 text-neutral-100 ring-1 ring-neutral-500' : 'opacity-60 hover:opacity-100'}`}
                title="Versione Scura (Dark)"
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setPreviewTheme('current')}
                className={`px-1.5 py-0.5 rounded text-[10px] transition-all ${previewTheme === 'current' ? 'bg-black/10 dark:bg-white/10 font-medium' : 'opacity-50'}`}
              >
                Auto
              </button>
            </div>

            {/* Render full bridge logo or emblem */}
            {(!customLogoUrl && (currentEmblem === 'bridge' || !currentEmblem)) ? (
              <BridgeLogo
                variant="full"
                themeMode={isPreviewDark ? 'dark' : 'light'}
                size="lg"
                className="py-2"
              />
            ) : (
              <div className="w-24 h-24 rounded-2xl border border-current/10 flex items-center justify-center bg-current/5 shadow-inner">
                <LogoEmblem
                  emblemType={currentEmblem}
                  customUrl={customLogoUrl}
                  size="lg"
                  className="w-16 h-16 rounded-lg object-contain"
                />
              </div>
            )}

            <p className="text-xs opacity-60">
              {customLogoUrl
                ? 'Logo personalizzato caricato'
                : currentEmblem === 'bridge'
                ? 'Logo Ufficiale eBookMe (Dark & Light)'
                : 'Emblema minimalista selezionato'}
            </p>

            {customLogoUrl && (
              <button
                onClick={() => onUploadCustomLogo(undefined)}
                className="text-xs text-rose-500 hover:underline flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> Ripristina logo ufficiale eBookMe
              </button>
            )}
          </div>

          {/* Emblems grid */}
          <div>
            <label className="text-xs uppercase tracking-wider font-semibold opacity-70 mb-3 block">
              Scegli un emblema per la copertina
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {EMBLEM_OPTIONS.map((opt) => {
                const isSelected = !customLogoUrl && (currentEmblem === opt.id || (!currentEmblem && opt.id === 'bridge'));
                return (
                  <button
                    key={opt.id}
                    onClick={() => {
                      onUploadCustomLogo(undefined);
                      onSelectEmblem(opt.id);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all flex items-start gap-3 ${
                      isSelected
                        ? themeConfig.isDark
                          ? 'border-neutral-300 bg-neutral-800/90 shadow-xs ring-1 ring-neutral-400'
                          : 'border-[#2D2D2A] bg-white shadow-xs ring-1 ring-[#2D2D2A]'
                        : themeConfig.isDark
                          ? 'border-neutral-800 hover:border-neutral-700 bg-neutral-900/30'
                          : 'border-[#EAE6DC] hover:border-[#D0C9BA] bg-white/40'
                    }`}
                  >
                    <div className="p-2 rounded-lg bg-black/5 dark:bg-white/5 shrink-0 flex items-center justify-center">
                      <LogoEmblem emblemType={opt.id} size="sm" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium truncate">{opt.label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 shrink-0 ml-1 text-emerald-600 dark:text-emerald-400" />}
                      </div>
                      <p className="text-[11px] opacity-60 line-clamp-1 mt-0.5">{opt.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* File Upload zone */}
          <div>
            <label className="text-xs uppercase tracking-wider font-semibold opacity-70 mb-2 block">
              Oppure carica il tuo file Logo (SVG, PNG, JPG)
            </label>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                if (e.dataTransfer.files?.[0]) {
                  handleFileUpload(e.dataTransfer.files[0]);
                }
              }}
              className={`border-2 border-dashed rounded-xl p-5 text-center transition-all cursor-pointer ${
                dragOver
                  ? 'border-amber-600 bg-amber-50/20'
                  : themeConfig.isDark
                    ? 'border-neutral-700 hover:border-neutral-500 bg-neutral-900/40'
                    : 'border-[#D9D3C5] hover:border-[#B5AA95] bg-white/40'
              }`}
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*,.svg';
                input.onchange = (e: any) => {
                  if (e.target?.files?.[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                };
                input.click();
              }}
            >
              <Upload className="w-6 h-6 mx-auto mb-2 opacity-60" />
              <p className="text-xs font-medium">Trascina qui il tuo logo o clicca per sfogliare</p>
              <p className="text-[11px] opacity-60 mt-1">Consigliato SVG trasparente o PNG ad alta risoluzione</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`px-6 py-3.5 flex justify-end border-t ${
          themeConfig.isDark ? 'border-neutral-800 bg-neutral-900/50' : 'border-[#EAE6DC] bg-black/2'
        }`}>
          <button
            onClick={onClose}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
              themeConfig.isDark ? 'bg-neutral-100 text-neutral-900 hover:bg-white' : 'bg-[#2B2722] text-[#F7F6F2] hover:bg-[#1A1815]'
            }`}
          >
            Applica & Salva
          </button>
        </div>
      </div>
    </div>
  );
};
