import React from 'react';
import { BarChart3, Calendar, Heart, ShieldCheck, Sparkles, CheckCircle2, Activity } from 'lucide-react';
import { MoodCheckIn, NextStepPlan, JournalEntry } from '../types';

interface ProgressViewProps {
  checkIns: MoodCheckIn[];
  plans: NextStepPlan[];
  journalEntries: JournalEntry[];
  onNavigate: (tab: string) => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  checkIns,
  plans,
  journalEntries,
  onNavigate,
}) => {
  // Aggregate observed patterns without clinical diagnostic labels
  const feelingCounts = checkIns.reduce((acc, c) => {
    acc[c.feeling] = (acc[c.feeling] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sensationCounts = checkIns.flatMap(c => c.bodySensations).reduce((acc, s) => {
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sortedSensations = Object.entries(sensationCounts).sort((a, b) => b[1] - a[1]);

  const completedPlansCount = plans.filter(p => p.completed).length;

  const getFeelingLabel = (key: string) => {
    switch (key) {
      case 'energized': return 'Com energia';
      case 'calm': return 'Tranquilo(a)';
      case 'tired': return 'Cansado(a)';
      case 'heavy': return 'Pesado(a)';
      case 'restless': return 'Agitado(a)';
      case 'confused': return 'Confuso(a)';
      case 'dont_know': return 'Não sei definir';
      case 'prefer_not_to_say': return 'Reservado(a)';
      default: return key;
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div>
        <span className="text-xs font-mono uppercase text-teal-400 tracking-wider font-semibold">
          Auto-observação
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight mt-1 font-serif">
          Seus Padrões Observados
        </h1>
        <p className="text-sm text-slate-400 mt-1 leading-relaxed">
          Sem pontuações de desempenho, notas clínicas ou metas punitivas. Esta tela reflete com carinho e respeito o que você voluntariamente escolheu registrar.
        </p>
      </div>

      {/* Non-Diagnostic Disclaimer Card */}
      <div className="p-4 rounded-2xl bg-[#0D1520] border border-teal-900/40 flex items-start gap-3 text-xs text-slate-300">
        <ShieldCheck className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Aviso de Cuidado:</strong> Nenhuma informação visualizada aqui é um laudo, diagnóstico ou prognóstico de saúde mental. Oscilações emocionais são naturais na experiência humana.
        </p>
      </div>

      {/* Summary Counts */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="p-4 rounded-3xl bg-[#0D151F] border border-slate-800 text-center shadow-sm">
          <span className="text-2xl sm:text-3xl font-bold font-mono text-teal-300">
            {checkIns.length}
          </span>
          <p className="text-[11px] text-slate-400 mt-1">Check-ins feitos</p>
        </div>

        <div className="p-4 rounded-3xl bg-[#0D151F] border border-slate-800 text-center shadow-sm">
          <span className="text-2xl sm:text-3xl font-bold font-mono text-amber-300">
            {plans.length}
          </span>
          <p className="text-[11px] text-slate-400 mt-1">Passos criados</p>
        </div>

        <div className="p-4 rounded-3xl bg-[#0D151F] border border-slate-800 text-center shadow-sm">
          <span className="text-2xl sm:text-3xl font-bold font-mono text-indigo-300">
            {journalEntries.length}
          </span>
          <p className="text-[11px] text-slate-400 mt-1">Reflexões gravadas</p>
        </div>
      </div>

      {/* Emotional States Distribution */}
      {checkIns.length > 0 ? (
        <div className="p-5 sm:p-6 rounded-3xl bg-[#0D151F] border border-slate-800 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Heart className="w-4 h-4 text-teal-400" />
              Estados emocionais que você observou
            </h2>
            <span className="text-[11px] text-slate-500 font-mono">Últimos registros</span>
          </div>

          <div className="space-y-3">
            {Object.entries(feelingCounts).map(([feeling, count]) => {
              const pct = Math.round((count / checkIns.length) * 100);
              return (
                <div key={feeling} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-200 font-medium">{getFeelingLabel(feeling)}</span>
                    <span className="font-mono text-slate-400">{count}x ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-teal-500 to-teal-400 transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800 text-center space-y-2">
          <p className="text-xs sm:text-sm text-slate-400">
            Nenhum check-in registrado ainda para compor observações.
          </p>
          <button
            onClick={() => onNavigate('home')}
            className="text-xs text-teal-400 hover:text-teal-300 font-semibold underline underline-offset-2"
          >
            Fazer um primeiro check-in
          </button>
        </div>
      )}

      {/* Bodily sensations insights */}
      {sortedSensations.length > 0 && (
        <div className="p-5 sm:p-6 rounded-3xl bg-[#0D151F] border border-slate-800 space-y-3.5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-400" />
              Sensações corporais mais frequentes
            </h2>
            <span className="text-[10px] text-slate-500 font-mono">Sinais físicos</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {sortedSensations.map(([sensation, count]) => (
              <span
                key={sensation}
                className="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs text-slate-200 flex items-center gap-2"
              >
                <span>{sensation}</span>
                <span className="font-mono text-[10px] text-indigo-300 font-bold bg-indigo-950 px-2 py-0.5 rounded-full border border-indigo-800/60">
                  {count}x
                </span>
              </span>
            ))}
          </div>
          <p className="text-[11px] text-slate-400 pt-1 leading-relaxed">
            Reconhecer onde o estresse se manifesta no corpo é um passo seguro para saber quando pausar, soltar os ombros e respirar com calma.
          </p>
        </div>
      )}

      {/* Micro-Actions Reflection */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-emerald-950/30 via-slate-900 to-[#0F1722] border border-emerald-900/40 flex items-center justify-between gap-3 text-xs">
        <div>
          <span className="font-semibold text-slate-200 block text-sm">
            Cuidado no seu próprio ritmo
          </span>
          <span className="text-slate-400 mt-0.5 block">
            {completedPlansCount} microações foram concluídas com calma por você até agora.
          </span>
        </div>
        <button
          onClick={() => onNavigate('next-step')}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold shrink-0 transition-colors"
        >
          Ver passos
        </button>
      </div>
    </div>
  );
};
