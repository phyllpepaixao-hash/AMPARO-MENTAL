import React from 'react';
import { Wind, MessageSquareHeart, Footprints, Heart, Sparkles, CheckCircle2, ChevronRight, AlertCircle, Clock, Moon, FileText, Shield } from 'lucide-react';
import { UserPreferences, MoodCheckIn, NextStepPlan } from '../types';

interface HomeViewProps {
  preferences: UserPreferences;
  onNavigate: (tab: string) => void;
  onOpenCheckIn: () => void;
  onOpenCrisis: () => void;
  onOpenNightWindDown: () => void;
  onOpenThoughtDissolve: () => void;
  onOpenTherapyPrep: () => void;
  todayCheckIn?: MoodCheckIn;
  todayPlan?: NextStepPlan;
  onTogglePlanCompletion?: (plan: NextStepPlan) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  preferences,
  onNavigate,
  onOpenCheckIn,
  onOpenCrisis,
  onOpenNightWindDown,
  onOpenThoughtDissolve,
  onOpenTherapyPrep,
  todayCheckIn,
  todayPlan,
  onTogglePlanCompletion,
}) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    let period = 'Olá';
    if (hour >= 5 && hour < 12) period = 'Bom dia';
    else if (hour >= 12 && hour < 18) period = 'Boa tarde';
    else period = 'Boa noite';

    if (preferences.name) {
      return `${period}, ${preferences.name}.`;
    }
    return `${period}.`;
  };

  const getFeelingLabel = (f?: string) => {
    switch (f) {
      case 'energized': return 'Com energia';
      case 'calm': return 'Tranquilo(a)';
      case 'tired': return 'Cansado(a)';
      case 'heavy': return 'Pesado(a)';
      case 'restless': return 'Agitado(a)';
      case 'confused': return 'Confuso(a)';
      case 'dont_know': return 'Não sei definir';
      case 'prefer_not_to_say': return 'Reservado(a)';
      default: return 'Registrado';
    }
  };

  return (
    <div className="entre-home space-y-6 max-w-xl mx-auto pb-10">
      {/* Friendly Editorial Welcome & Core Question */}
      <div className="entre-welcome space-y-2 pt-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase text-teal-400 tracking-wider font-semibold">
            {getGreeting()}
          </span>
          <span className="text-[11px] font-mono text-slate-500">
            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'short' })}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight font-serif">
          O que seria útil agora?
        </h1>

        {/* Gentle Zen Reflection Quote */}
        <div className="entre-quote p-3.5 rounded-2xl bg-[#0D1620] border border-teal-900/30 text-xs sm:text-sm text-slate-300 leading-relaxed font-serif italic border-l-2 border-l-teal-500">
          “Você não precisa resolver a sua vida inteira hoje. Apenas encontre o próximo passo pequeno e possível.”
        </div>
      </div>

      {/* 3 Main Doors (Diferencial Central) */}
      <div className="space-y-3.5">
        {/* DOOR 1: Quero me acalmar */}
        <button
          onClick={() => onNavigate('calm')}
          className="entre-door entre-door--calm w-full text-left p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-teal-950/40 via-[#0E1722] to-[#0A1017] border border-teal-800/40 hover:border-teal-400/60 shadow-xl group transition-all transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3.5">
              <div className="p-3 rounded-2xl bg-teal-900/50 text-teal-300 border border-teal-700/60 group-hover:bg-teal-800/60 transition-all shrink-0 group-hover:scale-105 shadow-sm">
                <Wind className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-slate-100 group-hover:text-teal-200 transition-colors font-serif">
                    Quero me acalmar
                  </h2>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-teal-950 border border-teal-800/60 text-teal-300 font-semibold">
                    1 a 3 min
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
                  Suspiro fisiológico, respiração quadrada e ancoragem sensorial suave. Botão "pular" sempre visível.
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-teal-400 transition-colors shrink-0 mt-1" />
          </div>
        </button>

        {/* DOOR 2: Quero colocar para fora */}
        <button
          onClick={() => onNavigate('chat')}
          className="entre-door entre-door--chat w-full text-left p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-indigo-950/40 via-[#0E1722] to-[#0A1017] border border-indigo-800/40 hover:border-indigo-400/60 shadow-xl group transition-all transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3.5">
              <div className="p-3 rounded-2xl bg-indigo-900/50 text-indigo-300 border border-indigo-700/60 group-hover:bg-indigo-800/60 transition-all shrink-0 group-hover:scale-105 shadow-sm">
                <MessageSquareHeart className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-slate-100 group-hover:text-indigo-200 transition-colors font-serif">
                    Quero colocar para fora
                  </h2>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-950 border border-indigo-800/60 text-indigo-300 font-semibold">
                    Escuta IA
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
                  Conversa breve e acolhedora com IA para aliviar a mente. Sem diagnósticos, sem cobranças e sem dependência.
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-indigo-400 transition-colors shrink-0 mt-1" />
          </div>
        </button>

        {/* DOOR 3: Preciso de um próximo passo */}
        <button
          onClick={() => onNavigate('next-step')}
          className="entre-door entre-door--step w-full text-left p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-amber-950/30 via-[#0E1722] to-[#0A1017] border border-amber-800/40 hover:border-amber-400/60 shadow-xl group transition-all transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3.5">
              <div className="p-3 rounded-2xl bg-amber-900/40 text-amber-300 border border-amber-700/60 group-hover:bg-amber-800/50 transition-all shrink-0 group-hover:scale-105 shadow-sm">
                <Footprints className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-slate-100 group-hover:text-amber-200 transition-colors font-serif">
                    Preciso de um próximo passo
                  </h2>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-950 border border-amber-800/60 text-amber-300 font-semibold">
                    Ação realista
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
                  Ajuda para escolher uma ação minúscula e viável para os próximos 10 minutos ou para o restante do dia.
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-amber-400 transition-colors shrink-0 mt-1" />
          </div>
        </button>
      </div>

      {/* Rituais & Ferramentas Especiais (Novo Nível Masterpiece) */}
      <div className="space-y-2.5 pt-1">
        <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
          <span>Rituais & Ferramentas de Cuidado</span>
          <span className="text-teal-400">Exclusivo</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {/* Night wind-down */}
          <button
            onClick={onOpenNightWindDown}
            className="p-3 rounded-2xl bg-[#0D151F] border border-amber-900/40 hover:border-amber-500/60 transition-all flex flex-col items-center text-center gap-1.5 group shadow-sm"
          >
            <div className="p-2 rounded-xl bg-amber-950/60 text-amber-300 group-hover:scale-105 transition-transform">
              <Moon className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-200 group-hover:text-amber-200">Sono & Noite</div>
              <div className="text-[10px] text-slate-400">Rotina de sono</div>
            </div>
          </button>

          {/* Thought dissolve */}
          <button
            onClick={onOpenThoughtDissolve}
            className="p-3 rounded-2xl bg-[#0D151F] border border-teal-900/40 hover:border-teal-500/60 transition-all flex flex-col items-center text-center gap-1.5 group shadow-sm"
          >
            <div className="p-2 rounded-xl bg-teal-950/60 text-teal-300 group-hover:scale-105 transition-transform">
              <Wind className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-200 group-hover:text-teal-200">Desapego</div>
              <div className="text-[10px] text-slate-400">Soltar pensamentos</div>
            </div>
          </button>

          {/* Therapy Prep */}
          <button
            onClick={onOpenTherapyPrep}
            className="p-3 rounded-2xl bg-[#0D151F] border border-indigo-900/40 hover:border-indigo-500/60 transition-all flex flex-col items-center text-center gap-1.5 group shadow-sm"
          >
            <div className="p-2 rounded-xl bg-indigo-950/60 text-indigo-300 group-hover:scale-105 transition-transform">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-200 group-hover:text-indigo-200">Consulta</div>
              <div className="text-[10px] text-slate-400">Ficha p/ terapeuta</div>
            </div>
          </button>
        </div>
      </div>

      {/* Daily Check-In & Today's Micro-Plan Widget */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        {/* Check-In Card */}
        <div className="p-4 sm:p-5 rounded-3xl bg-[#0D1520] border border-slate-800/90 flex flex-col justify-between shadow-md">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 flex items-center gap-1.5 font-mono">
                <Heart className="w-3.5 h-3.5 text-rose-400" />
                Como você está hoje?
              </span>
              <span className="text-[10px] text-slate-500">Sem notas</span>
            </div>
            {todayCheckIn ? (
              <div className="mt-1">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-950 border border-teal-800 text-teal-300 inline-block">
                  {getFeelingLabel(todayCheckIn.feeling)}
                </span>
                {todayCheckIn.note && (
                  <p className="text-xs text-slate-300 italic mt-1.5 line-clamp-2">
                    "{todayCheckIn.note}"
                  </p>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Um registro voluntário de acolhimento, sem pontuação de "bom" ou "ruim".
              </p>
            )}
          </div>
          <button
            onClick={onOpenCheckIn}
            className="mt-3.5 w-full py-2 px-3 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-teal-300 text-xs font-semibold transition-colors text-center"
          >
            {todayCheckIn ? 'Atualizar check-in' : 'Fazer check-in rápido'}
          </button>
        </div>

        {/* 24-Hour Micro Plan Card */}
        <div className="p-4 sm:p-5 rounded-3xl bg-[#0D1520] border border-slate-800/90 flex flex-col justify-between shadow-md">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 flex items-center gap-1.5 font-mono">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                Seu pequeno passo de hoje
              </span>
              <span className="text-[10px] text-slate-500">24h</span>
            </div>
            {todayPlan ? (
              <div className="mt-1 space-y-1">
                <p className="text-xs font-semibold text-slate-200 line-clamp-2">
                  {todayPlan.smallAction}
                </p>
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <span className="font-mono text-amber-400">~{todayPlan.smallActionMinutes} min</span>
                  {todayPlan.humanSupport && (
                    <span>• Apoio: {todayPlan.humanSupport}</span>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Nenhum passo definido ainda. Escolha algo de 2 a 5 minutos.
              </p>
            )}
          </div>
          {todayPlan ? (
            <button
              onClick={() => onTogglePlanCompletion && onTogglePlanCompletion(todayPlan)}
              className={`mt-3.5 w-full py-2 px-3 rounded-xl text-xs font-medium transition-colors flex items-center justify-center gap-1.5 ${
                todayPlan.completed
                  ? 'bg-emerald-950/80 border border-emerald-800 text-emerald-300'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{todayPlan.completed ? 'Passo concluído com calma' : 'Marcar como feito'}</span>
            </button>
          ) : (
            <button
              onClick={() => onNavigate('next-step')}
              className="mt-3.5 w-full py-2 px-3 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-amber-300 text-xs font-semibold transition-colors text-center"
            >
              Escolher um passo agora
            </button>
          )}
        </div>
      </div>

      {/* Gentle crisis notice at the bottom */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/30 via-slate-900 to-[#0F1722] border border-rose-900/40 flex items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2.5">
          <Shield className="w-4 h-4 text-rose-400 shrink-0" />
          <span>Em sofrimento intenso ou risco à vida?</span>
        </div>
        <button
          onClick={onOpenCrisis}
          className="text-rose-400 hover:text-rose-300 font-bold underline underline-offset-2 shrink-0 transition-colors"
        >
          Linhas Oficiais 188 / 192
        </button>
      </div>
    </div>
  );
};
