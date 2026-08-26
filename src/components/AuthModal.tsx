import React, { useState } from 'react';
import { X, Mail, Lock, User, LogIn, Sparkles, ShieldCheck, AlertCircle, Cloud, Check } from 'lucide-react';
import {
  loginWithGoogle,
  loginWithEmail,
  registerWithEmail,
  loginAsGuest,
  UserProfile
} from '../lib/firebase';
import { ThemeConfig } from '../utils/themeStyles';
import { BridgeEmblemSymbol } from './BridgeLogo';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onUserChange: (user: UserProfile | null) => void;
  themeConfig: ThemeConfig;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserChange,
  themeConfig
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      const user = await loginWithGoogle();
      onUserChange(user);
      setSuccessMsg(`Benvenuto, ${user.displayName || user.email || 'Utente'}!`);
      setTimeout(() => {
        onClose();
        setSuccessMsg(null);
      }, 1000);
    } catch (err: any) {
      console.error('Google login error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Accesso annullato.');
      } else {
        setError(err.message || 'Errore durante l\'accesso con Google.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'register') {
        if (!email.trim() || !password.trim()) {
          throw new Error('Inserisci email e password.');
        }
        if (password.length < 6) {
          throw new Error('La password deve contenere almeno 6 caratteri.');
        }
        const user = await registerWithEmail(email.trim(), password, name.trim());
        onUserChange(user);
        setSuccessMsg('Account creato con successo!');
      } else {
        const user = await loginWithEmail(email.trim(), password);
        onUserChange(user);
        setSuccessMsg(`Bentornato, ${user.displayName || user.email || 'Utente'}!`);
      }

      setTimeout(() => {
        onClose();
        setSuccessMsg(null);
      }, 1000);
    } catch (err: any) {
      console.error('Email auth error:', err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Email o password non corretti.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('Questa email è già registrata. Effettua il login.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Formato email non valido.');
      } else {
        setError(err.message || 'Errore di autenticazione.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      const user = await loginAsGuest();
      onUserChange(user);
      setSuccessMsg('Accesso Ospite completato');
      setTimeout(() => {
        onClose();
        setSuccessMsg(null);
      }, 800);
    } catch (err: any) {
      console.error('Guest login error:', err);
      setError('Impossibile accedere come ospite.');
    } finally {
      setLoading(false);
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
              eBook<span className="font-light opacity-80">Me</span> • Cloud Sync
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

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Subtitle & Value Proposition */}
          <div className="text-center space-y-1">
            <h4 className="text-base font-semibold">
              {mode === 'login' ? 'Accedi al tuo Account' : 'Crea il tuo Spazio di Lettura'}
            </h4>
            <p className="text-xs opacity-70">
              Salva i tuoi eBook personali, evidenziazioni e progresso sul database cloud in modo sicuro e accessibile ovunque.
            </p>
          </div>

          {/* Success Banner */}
          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* 1. Google One-Click Login */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className={`w-full py-2.5 px-4 rounded-xl border flex items-center justify-center gap-3 text-xs font-medium transition-all shadow-xs ${
              themeConfig.isDark
                ? 'bg-neutral-900 border-neutral-700 hover:bg-neutral-800 text-white'
                : 'bg-white border-[#DCD5C6] hover:bg-[#F3EFE6] text-[#2D2D2A]'
            }`}
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>Continua con Google</span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-2">
            <div className="h-px bg-black/10 dark:bg-white/10 flex-1" />
            <span className="text-[10px] uppercase font-mono tracking-wider opacity-40">oppure email</span>
            <div className="h-px bg-black/10 dark:bg-white/10 flex-1" />
          </div>

          {/* 2. Email & Password Form */}
          <form onSubmit={handleEmailAuth} className="space-y-3">
            {mode === 'register' && (
              <div>
                <label className="text-xs font-medium block mb-1">Nome o Pseudonimo</label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 absolute left-3 top-3 opacity-50" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Mario Rossi"
                    className={`w-full pl-9 pr-3 py-2 rounded-xl text-base sm:text-xs border outline-none transition-all ${
                      themeConfig.isDark
                        ? 'bg-neutral-900 border-neutral-800 focus:border-neutral-500'
                        : 'bg-white border-[#E0D9CC] focus:border-[#695643]'
                    }`}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-medium block mb-1">Indirizzo Email</label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 absolute left-3 top-3 opacity-50" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nome@dominio.com"
                  className={`w-full pl-9 pr-3 py-2 rounded-xl text-base sm:text-xs border outline-none transition-all ${
                    themeConfig.isDark
                      ? 'bg-neutral-900 border-neutral-800 focus:border-neutral-500'
                      : 'bg-white border-[#E0D9CC] focus:border-[#695643]'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium block mb-1">Password</label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 absolute left-3 top-3 opacity-50" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full pl-9 pr-3 py-2 rounded-xl text-base sm:text-xs border outline-none transition-all ${
                    themeConfig.isDark
                      ? 'bg-neutral-900 border-neutral-800 focus:border-neutral-500'
                      : 'bg-white border-[#E0D9CC] focus:border-[#695643]'
                  }`}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2.5 rounded-xl text-xs font-medium transition-all shadow-sm flex items-center justify-center gap-2 mt-4 ${
                themeConfig.isDark
                  ? 'bg-white text-neutral-950 hover:bg-neutral-200 disabled:opacity-50'
                  : 'bg-[#282521] text-[#FAF8F5] hover:bg-[#151412] disabled:opacity-50'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{mode === 'login' ? 'Accedi' : 'Crea Account Cloud'}</span>
            </button>
          </form>

          {/* Toggle Login/Register */}
          <div className="pt-2 text-center text-xs opacity-80 flex items-center justify-center gap-1.5">
            <span>{mode === 'login' ? 'Non hai ancora un account?' : 'Hai già un account?'}</span>
            <button
              type="button"
              onClick={() => {
                setError(null);
                setMode(mode === 'login' ? 'register' : 'login');
              }}
              className="font-semibold underline hover:opacity-100 cursor-pointer"
            >
              {mode === 'login' ? 'Registrati gratis' : 'Accedi'}
            </button>
          </div>

          {/* Guest fallback button */}
          <div className="pt-3 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-xs opacity-60">
            <div className="flex items-center gap-1.5">
              <Cloud className="w-3.5 h-3.5" />
              <span className="text-[11px]">Database Cloud Firestore</span>
            </div>
            <button
              type="button"
              onClick={handleGuestLogin}
              className="hover:underline text-[11px] cursor-pointer"
            >
              Continua come Ospite
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
