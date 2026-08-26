import React, { useState } from 'react';
import { Book, ReaderSettings } from '../types';
import { LogoEmblem } from './LogoEmblem';
import { BridgeLogo } from './BridgeLogo';
import { THEME_CONFIGS, FONT_CONFIGS } from '../utils/themeStyles';
import { Library, Upload, Sparkles, ChevronRight, BookOpen, Clock, Calendar, User, Cloud, CheckCircle2 } from 'lucide-react';
import { UserProfile } from '../lib/firebase';

interface CoverViewProps {
  currentBook: Book;
  settings: ReaderSettings;
  currentUser: UserProfile | null;
  onStartReading: () => void;
  onOpenLibrary: () => void;
  onOpenLogoModal: () => void;
  onOpenUploadModal: () => void;
  onOpenAuth: () => void;
  onOpenAccountModal: () => void;
}

export const CoverView: React.FC<CoverViewProps> = ({
  currentBook,
  settings,
  currentUser,
  onStartReading,
  onOpenLibrary,
  onOpenLogoModal,
  onOpenUploadModal,
  onOpenAuth,
  onOpenAccountModal
}) => {
  const [hoveredLogo, setHoveredLogo] = useState(false);
  const themeConfig = THEME_CONFIGS[settings.theme];
  const fontConfig = FONT_CONFIGS[settings.font];

  const totalReadingTime = currentBook.chapters.reduce(
    (acc, chap) => acc + (chap.readingTimeMinutes || 3),
    0
  );

  return (
    <div
      id="cover-page"
      onClick={onStartReading}
      className={`absolute inset-0 flex flex-col items-center justify-between p-6 sm:p-10 select-none cursor-pointer transition-all duration-700 z-20 ${themeConfig.bgClass} ${themeConfig.textClass}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onStartReading();
        }
      }}
    >
      {/* Top Header on Cover */}
      <div className="w-full max-w-4xl flex items-center justify-between z-10">
        <div
          className="flex items-center space-x-3 cursor-pointer"
          onClick={(e) => e.stopPropagation()}
          title="eBookMe"
        >
          <BridgeLogo
            variant="compact"
            themeMode={themeConfig.isDark ? 'dark' : 'light'}
            className="opacity-90 hover:opacity-100 transition-opacity"
          />
        </div>

        {/* Quick actions that don't trigger reading when clicked */}
        <div
          className="flex items-center space-x-2"
          onClick={(e) => e.stopPropagation()}
        >
          {/* User Account / Cloud Sync status */}
          <button
            onClick={currentUser ? onOpenAccountModal : onOpenAuth}
            className={`px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-all shadow-2xs ${
              currentUser
                ? themeConfig.isDark
                  ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                  : 'border-emerald-600/30 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                : themeConfig.isDark
                  ? 'border-neutral-800 bg-neutral-900/60 hover:bg-neutral-800 text-neutral-200'
                  : 'border-[#E0DBD0] bg-white/60 hover:bg-white text-[#38332B]'
            }`}
            title={currentUser ? 'Account Cloud Sincronizzato' : 'Accedi al Cloud'}
          >
            {currentUser?.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt="Avatar"
                className="w-3.5 h-3.5 rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : currentUser ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <User className="w-3.5 h-3.5 opacity-70" />
            )}
            <span className="hidden sm:inline">
              {currentUser ? (currentUser.displayName?.split(' ')[0] || 'Account Cloud') : 'Accedi'}
            </span>
          </button>

          <button
            onClick={onOpenLibrary}
            className={`px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-all shadow-2xs ${
              themeConfig.isDark
                ? 'border-neutral-800 bg-neutral-900/60 hover:bg-neutral-800 text-neutral-200'
                : 'border-[#E0DBD0] bg-white/60 hover:bg-white text-[#38332B]'
            }`}
            title="Sfoglia biblioteca"
          >
            <Library className="w-3.5 h-3.5 opacity-70" />
            <span className="hidden sm:inline">Biblioteca</span>
          </button>

          <button
            onClick={onOpenUploadModal}
            className={`px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-all shadow-2xs ${
              themeConfig.isDark
                ? 'border-neutral-800 bg-neutral-900/60 hover:bg-neutral-800 text-neutral-200'
                : 'border-[#E0DBD0] bg-white/60 hover:bg-white text-[#38332B]'
            }`}
            title="Importa testo o file"
          >
            <Upload className="w-3.5 h-3.5 opacity-70" />
            <span className="hidden sm:inline">Importa</span>
          </button>
        </div>
      </div>

      {/* Main Center Stage (Cover Card) */}
      <div className="my-auto text-center flex flex-col items-center max-w-md w-full py-8">
        {/* Logo / Emblem Container with hover customization trigger */}
        <div className="relative group mb-8">
          <div
            id="logo-container"
            onMouseEnter={() => setHoveredLogo(true)}
            onMouseLeave={() => setHoveredLogo(false)}
            onClick={(e) => {
              e.stopPropagation();
              onOpenLogoModal();
            }}
            className={`w-28 h-28 sm:w-32 sm:h-32 mx-auto border rounded-3xl flex items-center justify-center transition-all duration-300 transform group-hover:scale-105 shadow-sm relative overflow-hidden ${
              themeConfig.isDark
                ? 'border-neutral-800 bg-neutral-900/80 group-hover:border-neutral-600 text-neutral-200'
                : 'border-[#DFD9CD] bg-white/70 group-hover:border-[#BDB3A1] text-[#3E382E]'
            }`}
            title="Clicca per personalizzare il logo o emblema"
          >
            <LogoEmblem
              emblemType={currentBook.coverEmblem || 'bridge'}
              customUrl={currentBook.customLogoUrl}
              size="lg"
            />

            {/* Subtle edit overlay */}
            <div className="absolute inset-0 bg-black/40 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 backdrop-blur-xs">
              <Sparkles className="w-4 h-4 mb-1" />
              <span className="text-[10px] font-medium tracking-wide">Modifica Logo</span>
            </div>
          </div>
        </div>

        {/* Book Title & Typography */}
        <div className="space-y-3 px-4">
          <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-normal tracking-tight leading-tight ${fontConfig.fontClass}`}>
            {currentBook.title}
          </h1>

          {currentBook.subtitle && (
            <p className="text-sm sm:text-base font-light italic opacity-75 max-w-sm mx-auto">
              {currentBook.subtitle}
            </p>
          )}

          <div className="pt-2 flex items-center justify-center space-x-2 text-xs opacity-60">
            <span className="font-medium tracking-wide uppercase">{currentBook.author}</span>
            {currentBook.year && (
              <>
                <span>•</span>
                <span>{currentBook.year}</span>
              </>
            )}
          </div>
        </div>

        {/* Minimal Meta Tags */}
        <div className="mt-8 flex items-center justify-center gap-4 text-[11px] opacity-50 font-mono">
          <span className="flex items-center gap-1">
            <BookOpen className="w-3 h-3" />
            {currentBook.chapters.length} capitoli
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            ~{totalReadingTime} min
          </span>
        </div>

        {/* Call to Action indicator */}
        <div className="mt-10 inline-flex items-center gap-2 px-5 py-2 rounded-full border border-black/10 dark:border-white/10 text-xs tracking-widest uppercase font-medium opacity-80 hover:opacity-100 transition-all transform hover:translate-y-[-1px] group">
          <span>Tocca per iniziare a leggere</span>
          <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </div>
      </div>

      {/* Bottom Footer Note */}
      <div className="w-full max-w-4xl flex items-center justify-between text-[11px] opacity-50">
        <span className="tracking-wide">eBookMe • Edizione Digitale</span>
        <span className="font-mono">{themeConfig.label}</span>
      </div>
    </div>
  );
};
