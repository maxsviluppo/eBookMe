import React from 'react';
import { X, User, LogOut, Cloud, BookOpen, Bookmark, Highlighter, ShieldCheck, RefreshCw, CheckCircle2 } from 'lucide-react';
import { UserProfile, logoutUser } from '../lib/firebase';
import { ThemeConfig } from '../utils/themeStyles';
import { BridgeEmblemSymbol } from './BridgeLogo';

interface UserAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  onOpenAuth: () => void;
  onUserLoggedOut: () => void;
  stats: {
    booksCount: number;
    bookmarksCount: number;
    highlightsCount: number;
  };
  themeConfig: ThemeConfig;
}

export const UserAccountModal: React.FC<UserAccountModalProps> = ({
  isOpen,
  onClose,
  user,
  onOpenAuth,
  onUserLoggedOut,
  stats,
  themeConfig
}) => {
  if (!isOpen) return null;

  const handleLogout = async () => {
    try {
      await logoutUser();
      onUserLoggedOut();
      onClose();
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className={`w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden transition-all flex flex-col ${
          themeConfig.isDark
            ? 'bg-[#181A1D] border-neutral-800 text-neutral-100'
            : 'bg-[#FAF8F5] border-[#E3DFD5] text-[#282521]'
        }`}
      >
        {/* Header */}
        <div
          className={`px-6 py-4 flex items-center justify-between border-b ${
            themeConfig.isDark ? 'border-neutral-800' : 'border-[#EAE6DC]'
          }`}
        >
          <div className="flex items-center space-x-2.5">
            <BridgeEmblemSymbol className="w-5 h-3.5 stroke-current opacity-90" strokeWidth={3.2} />
            <h3 className="text-sm font-semibold tracking-tight font-sans">
              Profilo Utente & Cloud Sync
            </h3>
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
        <div className="p-6 space-y-5">
          {user ? (
            <>
              {/* User Avatar & Info */}
              <div className="flex items-center gap-4 p-4 rounded-xl border bg-black/[0.02] dark:bg-white/[0.02]">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'Avatar'}
                    className="w-14 h-14 rounded-full border border-black/10 dark:border-white/10 object-cover shadow-sm"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full border border-black/10 dark:border-white/10 bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-serif text-xl font-bold">
                    {(user.displayName || user.email || 'U')[0].toUpperCase()}
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-sm truncate">
                    {user.displayName || (user.isAnonymous ? 'Ospite eBookMe' : 'Lettore eBookMe')}
                  </h4>
                  <p className="text-xs opacity-60 truncate mt-0.5">
                    {user.email || (user.isAnonymous ? 'Account Temporaneo' : 'Utente Registrato')}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1.5 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Sincronizzazione Cloud Attiva</span>
                  </div>
                </div>
              </div>

              {/* Cloud Sync Stats */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-3 rounded-xl border bg-black/[0.02] dark:bg-white/[0.02]">
                  <div className="text-lg font-mono font-bold">{stats.booksCount}</div>
                  <div className="text-[10px] opacity-60 mt-0.5">eBook Salvati</div>
                </div>
                <div className="p-3 rounded-xl border bg-black/[0.02] dark:bg-white/[0.02]">
                  <div className="text-lg font-mono font-bold">{stats.bookmarksCount}</div>
                  <div className="text-[10px] opacity-60 mt-0.5">Segnalibri</div>
                </div>
                <div className="p-3 rounded-xl border bg-black/[0.02] dark:bg-white/[0.02]">
                  <div className="text-lg font-mono font-bold">{stats.highlightsCount}</div>
                  <div className="text-[10px] opacity-60 mt-0.5">Note & Evidenz.</div>
                </div>
              </div>

              {/* Database info card */}
              <div className="p-3.5 rounded-xl border text-xs space-y-1.5 opacity-80 bg-black/[0.015] dark:bg-white/[0.015]">
                <div className="flex items-center gap-2 font-medium">
                  <Cloud className="w-4 h-4 text-sky-500" />
                  <span>Database Firestore Persistente</span>
                </div>
                <p className="text-[11px] opacity-70 leading-relaxed">
                  I tuoi eBook importati, le posizioni di lettura e le note personali sono crittografati e sincronizzati in tempo reale con il tuo account cloud.
                </p>
              </div>

              {/* Actions */}
              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full py-2.5 rounded-xl border border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 text-xs font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Disconnetti Account</span>
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-4 space-y-4">
              <div className="w-12 h-12 rounded-full border bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
                <Cloud className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-sm">Nessun account collegato</h4>
                <p className="text-xs opacity-70 mt-1">
                  Accedi per sincronizzare e salvare i tuoi file eBook nel database cloud persistente.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAuth();
                }}
                className={`w-full py-2.5 rounded-xl text-xs font-medium transition-all shadow-sm flex items-center justify-center gap-2 ${
                  themeConfig.isDark
                    ? 'bg-white text-neutral-950 hover:bg-neutral-200'
                    : 'bg-[#282521] text-[#FAF8F5] hover:bg-[#151412]'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Accedi o Registrati</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
