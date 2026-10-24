import React, { useState, useEffect } from 'react';
import { Footprints, CheckCircle2, Circle, Plus, Sparkles, Clock, Heart, Trash2, Edit3, ArrowRight, Play, Pause, RotateCcw, Bell } from 'lucide-react';
import { NextStepPlan, UserPreferences } from '../types';
import { NEXT_STEP_IDEAS, NextStepIdea } from '../services/nextStepIdeas';
import { AmbientSound } from '../services/soundService';

interface NextStepViewProps {
  plans: NextStepPlan[];
  onSavePlan: (plan: NextStepPlan) => void;
  onTogglePlanCompletion: (plan: NextStepPlan) => void;
  onDeletePlan?: (id: string) => void;
  preferences: UserPreferences;
  onNavigate: (tab: string) => void;
}

export const NextStepView: React.FC<NextStepViewProps> = ({
  plans,
  onSavePlan,
  onTogglePlanCompletion,
  onDeletePlan,
  preferences,
  onNavigate,
}) => {
  const [priority, setPriority] = useState('');
  const [smallAction, setSmallAction] = useState('');
  const [minutes, setMinutes] = useState(5);
  const [humanSupport, setHumanSupport] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isCreatingNew, setIsCreatingNew] = useState(plans.length === 0);

  // Active Micro-Action Timer
  const [activeTimerPlanId, setActiveTimerPlanId] = useState<string | null>(null);
  const [timerSecondsLeft, setTimerSecondsLeft] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const categories = ['all', 'Corpo & Fisiologia', 'Ambiente & Espaço', 'Conexão Humana', 'Mente & Descanso'];

  const filteredIdeas = selectedCategory === 'all'
    ? NEXT_STEP_IDEAS
    : NEXT_STEP_IDEAS.filter(i => i.category === selectedCategory);

  const handleApplyIdea = (idea: NextStepIdea) => {
    setSmallAction(idea.action);
    setMinutes(idea.minutes);
    if (!priority) {
      setPriority(`Cuidar de: ${idea.category}`);
    }
    setIsCreatingNew(true);
  };

  const handleCreatePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!smallAction.trim()) return;

    const today = new Date().toISOString().split('T')[0];
    const newPlan: NextStepPlan = {
      id: `plan-${Date.now()}`,
      date: today,
      priority: priority.trim() || 'Cuidar do momento presente',
      smallAction: smallAction.trim(),
      smallActionMinutes: minutes || 5,
      humanSupport: humanSupport.trim() || undefined,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    onSavePlan(newPlan);
    setSmallAction('');
    setPriority('');
    setHumanSupport('');
    setIsCreatingNew(false);
  };

  const startTimerForPlan = (plan: NextStepPlan) => {
    setActiveTimerPlanId(plan.id);
    setTimerSecondsLeft(plan.smallActionMinutes * 60);
    setIsTimerRunning(true);
  };

  const toggleComplete = (plan: NextStepPlan) => {
    if (!plan.completed) {
      AmbientSound.playGentleChime();
    }
    onTogglePlanCompletion(plan);
  };

  // Timer countdown
  useEffect(() => {
    if (!isTimerRunning || timerSecondsLeft <= 0) return;
    const interval = setInterval(() => {
      setTimerSecondsLeft(prev => {
        if (prev <= 1) {
          setIsTimerRunning(false);
          AmbientSound.playGentleChime();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSecondsLeft]);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 pb-12">
      {/* Title & Philosophy */}
      <div>
        <span className="text-xs font-mono uppercase text-amber-400 tracking-wider font-semibold">
          Plano Leve de 24 Horas
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight mt-1 font-serif">
          Preciso de um próximo passo
        </h1>
        <p className="text-sm text-slate-400 mt-1 leading-relaxed">
          Sem listas gigantes ou cobranças de produtividade. Apenas uma prioridade realista, uma microação de até 15 minutos e um contato de apoio humano voluntário.
        </p>
      </div>

      {/* Active Timer Floating Bar */}
      {activeTimerPlanId && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/80 via-slate-900 to-teal-950/80 border border-amber-600/60 shadow-xl flex items-center justify-between gap-3 animate-fadeIn">
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono uppercase text-amber-300 font-bold tracking-wider">
              {timerSecondsLeft === 0 ? '✨ Tempo Concluído!' : 'Microação em andamento'}
            </span>
            <div className="text-xl sm:text-2xl font-mono font-bold text-slate-100 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400" />
              <span>{formatTimer(timerSecondsLeft)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {timerSecondsLeft > 0 ? (
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                title={isTimerRunning ? 'Pausar' : 'Continuar'}
              >
                {isTimerRunning ? <Pause className="w-4 h-4 text-amber-400" /> : <Play className="w-4 h-4 text-teal-400" />}
              </button>
            ) : (
              <button
                onClick={() => {
                  const p = plans.find(x => x.id === activeTimerPlanId);
                  if (p && !p.completed) toggleComplete(p);
                  setActiveTimerPlanId(null);
                }}
                className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md"
              >
                Concluir passo
              </button>
            )}

            <button
              onClick={() => setActiveTimerPlanId(null)}
              className="text-xs text-slate-400 hover:text-slate-200 p-1.5"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* Existing Active Plans */}
      {plans.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Seus Passos Registrados
            </h2>
            <button
              onClick={() => setIsCreatingNew(!isCreatingNew)}
              className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isCreatingNew ? 'Fechar formulário' : 'Novo passo'}</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                  plan.completed
                    ? 'bg-emerald-950/20 border-emerald-900/60 text-slate-400'
                    : 'bg-[#0D151F] border-slate-800 text-slate-100 shadow-md hover:border-slate-700'
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleComplete(plan)}
                    className="mt-0.5 text-slate-400 hover:text-emerald-400 transition-colors"
                    aria-label={plan.completed ? 'Marcar como não concluído' : 'Marcar como concluído'}
                  >
                    {plan.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-600 hover:text-slate-400" />
                    )}
                  </button>
                  <div className="space-y-1">
                    <p className={`text-sm font-semibold leading-snug ${plan.completed ? 'line-through text-slate-500' : 'text-slate-100'}`}>
                      {plan.smallAction}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                      <span className="flex items-center gap-1 font-mono text-[11px] text-amber-400/90">
                        <Clock className="w-3 h-3" />
                        ~{plan.smallActionMinutes} min
                      </span>
                      <span>• Prioridade: {plan.priority}</span>
                      {plan.humanSupport && (
                        <span className="flex items-center gap-1 text-indigo-300">
                          <Heart className="w-3 h-3" />
                          Apoio: {plan.humanSupport}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {!plan.completed && activeTimerPlanId !== plan.id && (
                    <button
                      onClick={() => startTimerForPlan(plan)}
                      className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold flex items-center gap-1 transition-colors"
                      title="Iniciar cronômetro para este passo"
                    >
                      <Play className="w-3 h-3 text-amber-400" />
                      <span className="hidden sm:inline">Cronômetro</span>
                    </button>
                  )}

                  {onDeletePlan && (
                    <button
                      onClick={() => onDeletePlan(plan.id)}
                      className="text-slate-600 hover:text-rose-400 transition-colors p-1"
                      title="Excluir este passo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Plan Creation Form */}
      {isCreatingNew && (
        <form onSubmit={handleCreatePlan} className="p-5 sm:p-6 rounded-3xl bg-[#0F1722] border border-amber-900/40 shadow-2xl space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-amber-200 flex items-center gap-2 font-serif">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Definir um passo para as próximas 24 horas
            </h3>
            {plans.length > 0 && (
              <button
                type="button"
                onClick={() => setIsCreatingNew(false)}
                className="text-xs text-slate-500 hover:text-slate-300"
              >
                Cancelar
              </button>
            )}
          </div>

          {/* 1. Priority */}
          <div className="space-y-1">
            <label htmlFor="plan-priority" className="text-xs font-semibold text-slate-300">
              1. Qual é a sua prioridade principal hoje?
            </label>
            <input
              id="plan-priority"
              type="text"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              placeholder="Ex.: Desacelerar a mente, descansar o corpo, não me cobrar..."
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* 2. Micro Action */}
          <div className="space-y-1">
            <label htmlFor="plan-action" className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>2. Qual é a menor ação possível que você pode fazer?</span>
              <span className="text-[10px] text-amber-400 font-mono">2 a 15 min</span>
            </label>
            <input
              id="plan-action"
              type="text"
              required
              value={smallAction}
              onChange={(e) => setSmallAction(e.target.value)}
              placeholder="Ex.: Tomar um copo de água fresca, lavar o rosto ou abrir a janela"
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Time slider */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Tempo estimado para este passo:</span>
              <span className="font-bold text-amber-300 font-mono">{minutes} minutos</span>
            </div>
            <input
              type="range"
              min={2}
              max={20}
              step={1}
              value={minutes}
              onChange={(e) => setMinutes(Number(e.target.value))}
              className="w-full accent-amber-500 bg-slate-800 rounded-lg h-2 cursor-pointer"
            />
          </div>

          {/* 3. Human Support (Optional) */}
          <div className="space-y-1">
            <label htmlFor="plan-support" className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>3. Apoio humano opcional</span>
              <span className="text-[10px] text-slate-500">Pode deixar em branco</span>
            </label>
            <input
              id="plan-support"
              type="text"
              value={humanSupport}
              onChange={(e) => setHumanSupport(e.target.value)}
              placeholder="Ex.: Mandar um oi para meu irmão, conversar com terapeuta, sentar com alguém"
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-md shadow-amber-950/40"
          >
            Salvar este próximo passo
          </button>
        </form>
      )}

      {/* Next Step Ideas Bank (Diferencial Prático) */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Banco de Microações Testadas
            </h3>
            <p className="text-[11px] text-slate-400">
              Escolha uma ideia para preencher o plano automaticamente:
            </p>
          </div>
        </div>

        {/* Filter categories */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl border whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-amber-950 border-amber-600 text-amber-200 font-semibold'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat === 'all' ? 'Todas as ideias' : cat}
            </button>
          ))}
        </div>

        {/* Ideas Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {filteredIdeas.map((idea) => (
            <div
              key={idea.id}
              className="p-3.5 rounded-2xl bg-[#0D151F] border border-slate-800 hover:border-amber-700/60 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                  <span className="font-mono text-amber-400">{idea.category}</span>
                  <span className="font-mono">~{idea.minutes} min</span>
                </div>
                <h4 className="text-xs font-bold text-slate-200 leading-snug">
                  {idea.action}
                </h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  {idea.description}
                </p>
              </div>

              <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 italic truncate max-w-[170px]" title={idea.whyItHelps}>
                  {idea.whyItHelps}
                </span>
                <button
                  onClick={() => handleApplyIdea(idea)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold text-[11px] transition-colors"
                >
                  Usar ideia
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
