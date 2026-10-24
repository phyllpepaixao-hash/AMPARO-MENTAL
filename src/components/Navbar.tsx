import React from 'react';
import { ShieldAlert, Sparkles, BookOpen, EyeOff, Eye, User, UserCheck, Crown } from 'lucide-react';
import { UserPreferences } from '../types';
import { SoundscapePlayer } from './SoundscapePlayer';

interface NavbarProps {
  onOpenCrisis: () => void;
  onOpenSpecs: () => void;
  onOpenAuth: () => void;
  onOpenPremium: () => void;
  preferences: UserPreferences;
  onUpdatePreferences: (prefs: UserPreferences) => void;
  currentTab: string;
  onNavigate: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCrisis,
  onOpenSpecs,
  onOpenAuth,
  onOpenPremium,
  preferences,
  onUpdatePreferences,
  currentTab,
  onNavigate,
}) => {
  const toggleLowStimulus = () => {
    onUpdatePreferences({
      ...preferences,
      lowStimulusMode: !preferences.lowStimulusMode,
    });
  };

  const account = preferences.account;
  const isLoggedIn = account?.isLoggedIn;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#070D13]/90 backdrop-blur-md transition-colors">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between gap-2.5">
        {/* Brand */}
        <button 
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 text-left group focus:outline-none focus:ring-2 focus:ring-teal-500/50 rounded-xl p-1"
          aria-label="Ir para a página inicial Amparo Mental"
        >
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-teal-400/35 via-teal-600/30 to-indigo-600/30 border border-teal-500/50 flex items-center justify-center text-teal-200 font-bold text-lg shadow-md group-hover:scale-105 transition-transform font-serif">
            A
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-100 tracking-tight text-base group-hover:text-teal-300 transition-colors font-serif">
                Amparo
              </span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded-full bg-teal-950/90 border border-teal-700/60 text-teal-300 font-semibold tracking-wider shadow-sm">
                MENTAL
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block font-serif tracking-wide">
              Não passe por tudo sozinho.
            </p>
          </div>
        </button>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Ambient Soundscapes Synthesizer */}
          <SoundscapePlayer lowStimulus={preferences.lowStimulusMode} />

          {/* User Account / Login Button */}
          <button
            onClick={onOpenAuth}
            className={`p-2 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-all ${
              isLoggedIn
                ? 'bg-teal-950/60 border-teal-700/70 text-teal-300'
                : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800/70'
            }`}
            title={isLoggedIn ? `Conectado como ${account?.name || 'Usuário'}` : 'Entrar ou criar conta'}
            aria-label="Painel de login e perfil"
          >
            {isLoggedIn ? (
              <>
                <UserCheck className="w-4 h-4 text-teal-400" />
                <span className="hidden sm:inline text-[11px] font-semibold">{account?.name || 'Perfil'}</span>
              </>
            ) : (
              <>
                <User className="w-4 h-4 text-slate-400" />
                <span className="hidden sm:inline text-[11px]">Entrar</span>
              </>
            )}
          </button>

          {/* Amparo Premium Button */}
          <button
            onClick={onOpenPremium}
            className="p-2 rounded-xl text-xs font-medium bg-gradient-to-r from-teal-950 to-emerald-950 border border-teal-500/50 text-teal-300 hover:text-teal-200 hover:border-teal-400 transition-all flex items-center gap-1.5 shadow-sm"
            title="Conhecer Amparo Premium"
            aria-label="Amparo Premium"
          >
            <Crown className="w-4 h-4 text-amber-400 fill-current" />
            <span className="hidden md:inline text-[11px] font-semibold">Premium</span>
          </button>

          {/* Low Stimulus Toggle */}
          <button
            onClick={toggleLowStimulus}
            title={preferences.lowStimulusMode ? 'Desativar modo com menos estímulos' : 'Ativar modo com menos estímulos (visual mais calmo)'}
            className={`p-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all border ${
              preferences.lowStimulusMode
                ? 'bg-amber-950/40 border-amber-800/60 text-amber-300'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
            aria-label="Alternar modo com menos estímulos"
          >
            {preferences.lowStimulusMode ? (
              <>
                <EyeOff className="w-4 h-4 text-amber-400" />
                <span className="hidden lg:inline text-[11px]">Menos Estímulos</span>
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                <span className="hidden lg:inline text-[11px]">Menos Estímulos</span>
              </>
            )}
          </button>

          {/* Project & Clinical Specs */}
          <button
            onClick={onOpenSpecs}
            className="p-2 rounded-xl text-xs font-medium bg-slate-900/60 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800/70 transition-all flex items-center gap-1.5"
            title="Ver resumo de produto, governança clínica e auditoria"
            aria-label="Ver especificações e governança do projeto"
          >
            <BookOpen className="w-4 h-4 text-teal-400" />
            <span className="hidden md:inline text-[11px]">Sobre & Auditoria</span>
          </button>

          {/* Persistent Immediate Help Button */}
          <button
            onClick={onOpenCrisis}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-950/70 hover:bg-rose-900/80 text-rose-200 border border-rose-700/60 shadow-sm transition-all flex items-center gap-1.5 hover:shadow-rose-950/50 focus:outline-none focus:ring-2 focus:ring-rose-500"
            aria-label="Preciso de ajuda agora - Recursos de crise e apoio humano imediato"
          >
            <ShieldAlert className="w-4 h-4 text-rose-400 animate-pulse" />
            <span className="whitespace-nowrap">Ajuda Agora</span>
          </button>
        </div>
      </div>
    </header>
  );
};
