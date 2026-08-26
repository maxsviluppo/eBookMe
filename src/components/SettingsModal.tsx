import React from 'react';
import {
  X,
  Type,
  Sun,
  Moon,
  AlignLeft,
  AlignJustify,
  Columns,
  Maximize2,
  Minimize2,
  Sparkles,
  Sliders,
  Palette,
  BookOpen,
  Volume2,
  User,
  Cloud,
  CheckCircle2
} from 'lucide-react';
import { ReaderSettings, ReaderTheme, ReaderFont, MarginWidth, TextAlign } from '../types';
import { THEME_CONFIGS, FONT_CONFIGS, MARGIN_CONFIGS } from '../utils/themeStyles';
import { BridgeLogo } from './BridgeLogo';
import { UserProfile } from '../lib/firebase';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ReaderSettings;
  onUpdateSettings: (newSettings: Partial<ReaderSettings>) => void;
  onOpenLogoModal: () => void;
  currentUser?: UserProfile | null;
  onOpenAuth?: () => void;
  onOpenAccountModal?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onOpenLogoModal,
  currentUser,
  onOpenAuth,
  onOpenAccountModal
}) => {
  if (!isOpen) return null;

  const currentTheme = THEME_CONFIGS[settings.theme];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div
        className={`w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden transition-all flex flex-col max-h-[85vh] ${
          currentTheme.isDark ? 'bg-[#181A1D] border-neutral-800 text-neutral-100' : 'bg-[#FAF8F5] border-[#E3DFD5] text-[#282521]'
        }`}
      >
        {/* Header */}
        <div className={`px-6 py-4 flex items-center justify-between border-b ${
          currentTheme.isDark ? 'border-neutral-800' : 'border-[#EAE6DC]'
        }`}>
          <div className="flex items-center space-x-2.5">
            <BridgeLogo variant="compact" themeMode={currentTheme.isDark ? 'dark' : 'light'} />
            <span className="opacity-40">•</span>
            <h3 className="text-sm font-medium tracking-wide">Preferenze & Cloud</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg opacity-60 hover:opacity-100 transition-opacity hover:bg-black/5 dark:hover:bg-white/5"
            aria-label="Chiudi impostazioni"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Settings Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* SEZIONE 0: ACCOUNT UTENTE & DATABASE CLOUD */}
          <div className={`p-3.5 rounded-xl border flex items-center justify-between ${
            currentTheme.isDark ? 'bg-neutral-900/60 border-neutral-800' : 'bg-white/60 border-[#E8E4DA]'
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xs">
                {currentUser?.photoURL ? (
                  <img src={currentUser.photoURL} alt="Avatar" className="w-full h-full rounded-full object-cover" referrerPolicy="no-referrer" />
                ) : currentUser ? (
                  (currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()
                ) : (
                  <Cloud className="w-4 h-4 text-sky-500" />
                )}
              </div>
              <div>
                <p className="text-xs font-semibold">
                  {currentUser ? (currentUser.displayName || currentUser.email || 'Account Connesso') : 'Account & Salvataggio Cloud'}
                </p>
                <div className="flex items-center gap-1 text-[10px] opacity-70">
                  {currentUser ? (
                    <>
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      <span>Database Firestore Sincronizzato</span>
                    </>
                  ) : (
                    <span>Accedi per salvare file eBook e note</span>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                if (currentUser && onOpenAccountModal) {
                  onOpenAccountModal();
                } else if (onOpenAuth) {
                  onOpenAuth();
                }
              }}
              className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                currentUser
                  ? 'border-emerald-600/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10'
                  : currentTheme.isDark
                    ? 'border-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-white'
                    : 'border-[#D9D3C6] bg-white hover:bg-[#F3EFE6] text-[#282521]'
              }`}
            >
              {currentUser ? 'Gestisci' : 'Accedi'}
            </button>
          </div>

          {/* SEZIONE 1: TEMI VISIVI (CROMATICA) */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs uppercase tracking-wider font-semibold opacity-70 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5" />
                Tonalità & Superficie Carta
              </label>
              <span className="text-[11px] opacity-60">
                {THEME_CONFIGS[settings.theme].label}
              </span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {(Object.keys(THEME_CONFIGS) as ReaderTheme[]).map((themeKey) => {
                const conf = THEME_CONFIGS[themeKey];
                const isSelected = settings.theme === themeKey;
                return (
                  <button
                    key={themeKey}
                    onClick={() => onUpdateSettings({ theme: themeKey })}
                    className={`h-14 rounded-xl border flex flex-col items-center justify-center p-1 transition-all relative ${
                      isSelected
                        ? 'ring-2 ring-offset-2 ring-[#705E4C] dark:ring-neutral-400 border-transparent shadow-xs'
                        : 'border-black/10 dark:border-white/10 hover:opacity-90'
                    }`}
                    style={{ backgroundColor: conf.bgHex }}
                    title={conf.label}
                  >
                    <span
                      className="text-[11px] font-medium leading-none mb-1 text-center"
                      style={{ color: conf.isDark ? '#E0E0E0' : '#282521' }}
                    >
                      Aa
                    </span>
                    <span
                      className="text-[9px] opacity-75 truncate max-w-full px-1"
                      style={{ color: conf.isDark ? '#9E9E9E' : '#736B5E' }}
                    >
                      {conf.name === 'isabelline' ? 'Avorio' : conf.name === 'bone' ? 'Pergamena' : conf.name === 'sepia' ? 'Seppia' : conf.name === 'pure' ? 'Bianco' : conf.name === 'slate' ? 'Ardesia' : 'Notte'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SEZIONE 2: TIPOGRAFIA */}
          <div>
            <label className="text-xs uppercase tracking-wider font-semibold opacity-70 mb-3 flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5" />
              Carattere Tipografico
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(FONT_CONFIGS) as ReaderFont[]).map((fontKey) => {
                const fConf = FONT_CONFIGS[fontKey];
                const isSelected = settings.font === fontKey;
                return (
                  <button
                    key={fontKey}
                    onClick={() => onUpdateSettings({ font: fontKey })}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? currentTheme.isDark
                          ? 'border-neutral-300 bg-neutral-800 ring-1 ring-neutral-300 shadow-xs'
                          : 'border-[#695643] bg-white ring-1 ring-[#695643] shadow-xs'
                        : currentTheme.isDark
                          ? 'border-neutral-800 hover:border-neutral-700 bg-neutral-900/40'
                          : 'border-[#E8E4DA] hover:border-[#D0CABA] bg-white/40'
                    }`}
                  >
                    <div className={`text-base font-medium ${fConf.fontClass}`}>
                      {fConf.label}
                    </div>
                    <div className="text-[11px] opacity-60 mt-0.5">{fConf.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SEZIONE 3: DIMENSIONE TESTO & INTERLINEA */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Dimensione Font */}
            <div className={`p-4 rounded-xl border ${
              currentTheme.isDark ? 'bg-neutral-900/40 border-neutral-800' : 'bg-white/40 border-[#E8E4DA]'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium">Dimensione Testo</span>
                <span className="text-xs font-mono opacity-70">{settings.fontSize}px</span>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => onUpdateSettings({ fontSize: Math.max(14, settings.fontSize - 1) })}
                  className="w-8 h-8 rounded-lg border border-black/10 dark:border-white/10 flex items-center justify-center text-xs font-medium hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 transition-all"
                  aria-label="Riduci testo"
                >
                  A-
                </button>
                <input
                  type="range"
                  min="14"
                  max="28"
                  value={settings.fontSize}
                  onChange={(e) => onUpdateSettings({ fontSize: Number(e.target.value) })}
                  className="flex-1 accent-[#695643] dark:accent-neutral-300 cursor-pointer h-1.5 rounded-lg bg-neutral-300 dark:bg-neutral-700"
                />
                <button
                  onClick={() => onUpdateSettings({ fontSize: Math.min(28, settings.fontSize + 1) })}
                  className="w-8 h-8 rounded-lg border border-black/10 dark:border-white/10 flex items-center justify-center text-sm font-medium hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 transition-all"
                  aria-label="Ingrandisci testo"
                >
                  A+
                </button>
              </div>
            </div>

            {/* Interlinea */}
            <div className={`p-4 rounded-xl border ${
              currentTheme.isDark ? 'bg-neutral-900/40 border-neutral-800' : 'bg-white/40 border-[#E8E4DA]'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium">Interlinea</span>
                <span className="text-xs font-mono opacity-70">{settings.lineHeight.toFixed(2)}x</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { val: 1.5, label: 'Compatta' },
                  { val: 1.75, label: 'Ideale' },
                  { val: 2.0, label: 'Ariosa' }
                ].map((lh) => (
                  <button
                    key={lh.val}
                    onClick={() => onUpdateSettings({ lineHeight: lh.val })}
                    className={`py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      Math.abs(settings.lineHeight - lh.val) < 0.05
                        ? currentTheme.isDark ? 'bg-neutral-200 text-neutral-900 border-white' : 'bg-[#2B2722] text-[#F7F6F2] border-[#2B2722]'
                        : 'border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                  >
                    {lh.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* SEZIONE 4: LAYOUT, MARGINI & ALLINEAMENTO */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Margini Colonna */}
            <div>
              <label className="text-xs uppercase tracking-wider font-semibold opacity-70 mb-2 block">
                Ampiezza Pagina
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(Object.keys(MARGIN_CONFIGS) as MarginWidth[]).map((mKey) => {
                  const isSelected = settings.marginWidth === mKey;
                  return (
                    <button
                      key={mKey}
                      onClick={() => onUpdateSettings({ marginWidth: mKey })}
                      className={`py-2 px-1 rounded-xl text-xs font-medium border transition-all text-center ${
                        isSelected
                          ? currentTheme.isDark ? 'bg-neutral-200 text-neutral-900 border-white' : 'bg-[#2B2722] text-[#F7F6F2] border-[#2B2722]'
                          : 'border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5'
                      }`}
                    >
                      {MARGIN_CONFIGS[mKey].label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Allineamento */}
            <div>
              <label className="text-xs uppercase tracking-wider font-semibold opacity-70 mb-2 block">
                Allineamento Paragrafi
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { key: 'left' as TextAlign, label: 'Bandiera Sinistra', icon: AlignLeft },
                  { key: 'justify' as TextAlign, label: 'Giustificato', icon: AlignJustify }
                ].map((item) => {
                  const isSelected = settings.textAlign === item.key;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.key}
                      onClick={() => onUpdateSettings({ textAlign: item.key })}
                      className={`py-2 px-2 rounded-xl text-xs font-medium border flex items-center justify-center gap-1.5 transition-all ${
                        isSelected
                          ? currentTheme.isDark ? 'bg-neutral-200 text-neutral-900 border-white' : 'bg-[#2B2722] text-[#F7F6F2] border-[#2B2722]'
                          : 'border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* SEZIONE 5: MODALITÀ AVANZATE & LOGO */}
          <div className="pt-2 border-t border-black/10 dark:border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium">Doppia Pagina (Libro Aperto)</p>
                <p className="text-[11px] opacity-60">Visualizza affiancate due colonne su display ampi</p>
              </div>
              <button
                onClick={() => onUpdateSettings({ twoPageSpread: !settings.twoPageSpread })}
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                  settings.twoPageSpread ? 'bg-emerald-600' : 'bg-neutral-300 dark:bg-neutral-700'
                }`}
                role="switch"
                aria-checked={settings.twoPageSpread}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    settings.twoPageSpread ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium">Modalità Zen (Focus Totale)</p>
                <p className="text-[11px] opacity-60">Nasconde l'intestazione durante la lettura per pura immersione</p>
              </div>
              <button
                onClick={() => onUpdateSettings({ isZenMode: !settings.isZenMode })}
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                  settings.isZenMode ? 'bg-amber-600' : 'bg-neutral-300 dark:bg-neutral-700'
                }`}
                role="switch"
                aria-checked={settings.isZenMode}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    settings.isZenMode ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Custom Logo Modal Trigger */}
            <div className="pt-2">
              <button
                onClick={() => {
                  onClose();
                  onOpenLogoModal();
                }}
                className={`w-full py-2.5 px-4 rounded-xl border text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                  currentTheme.isDark
                    ? 'border-neutral-700 hover:border-neutral-500 bg-neutral-900/50'
                    : 'border-[#D9D3C6] hover:border-[#B8AD99] bg-white/60'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 opacity-70" />
                Personalizza Logo o Emblema della Copertina
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`px-6 py-3.5 flex justify-end border-t ${
          currentTheme.isDark ? 'border-neutral-800 bg-neutral-900/50' : 'border-[#EAE6DC] bg-black/2'
        }`}>
          <button
            onClick={onClose}
            className={`px-5 py-2 rounded-xl text-xs font-medium transition-all ${
              currentTheme.isDark ? 'bg-neutral-100 text-neutral-900 hover:bg-white' : 'bg-[#2B2722] text-[#F7F6F2] hover:bg-[#1A1815]'
            }`}
          >
            Fatto
          </button>
        </div>
      </div>
    </div>
  );
};

