import React, { useState, useEffect } from 'react';
import { Wind, Footprints, Eye, Pause, Play, SkipForward, RotateCcw, Check, ArrowRight, ShieldCheck, Sparkles, Heart, Volume2 } from 'lucide-react';
import { CALMING_EXERCISES, CalmingExercise } from '../services/exercisesData';
import { UserPreferences, NextStepPlan } from '../types';
import { AmbientSound } from '../services/soundService';

interface CalmViewProps {
  preferences: UserPreferences;
  onNavigate: (tab: string) => void;
  onSavePlan?: (plan: NextStepPlan) => void;
}

export const CalmView: React.FC<CalmViewProps> = ({ preferences, onNavigate, onSavePlan }) => {
  const [selectedExercise, setSelectedExercise] = useState<CalmingExercise | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState<number | null>(null);
  const [completed, setCompleted] = useState(false);
  const [suggestedStepSaved, setSuggestedStepSaved] = useState(false);
  const [isBreathingIn, setIsBreathingIn] = useState(true);

  // Available exercises respecting preferences
  const exercises = CALMING_EXERCISES.filter(ex => {
    if (!preferences.allowBreathingExercises && ex.isBreathing) return false;
    return true;
  });

  const handleStart = (exercise: CalmingExercise) => {
    setSelectedExercise(exercise);
    setCurrentStepIndex(0);
    setIsPaused(false);
    setCompleted(false);
    setSuggestedStepSaved(false);
    if (exercise.steps[0].durationSeconds) {
      setSecondsRemaining(exercise.steps[0].durationSeconds);
    } else {
      setSecondsRemaining(null);
    }
  };

  const handleNextStep = () => {
    if (!selectedExercise) return;
    if (currentStepIndex < selectedExercise.steps.length - 1) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      if (selectedExercise.steps[nextIndex].durationSeconds) {
        setSecondsRemaining(selectedExercise.steps[nextIndex].durationSeconds);
      } else {
        setSecondsRemaining(null);
      }
    } else {
      setCompleted(true);
      AmbientSound.playGentleChime();
    }
  };

  const handleResetOrQuit = () => {
    setSelectedExercise(null);
    setCurrentStepIndex(0);
    setCompleted(false);
  };

  const handleSaveNextStep = () => {
    if (!onSavePlan) return;
    const today = new Date().toISOString().split('T')[0];
    const newPlan: NextStepPlan = {
      id: `plan-${Date.now()}`,
      date: today,
      priority: 'Manter a calma do momento',
      smallAction: 'Beber um copo de água e sentar confortavelmente por 5 minutos',
      smallActionMinutes: 5,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    onSavePlan(newPlan);
    setSuggestedStepSaved(true);
    AmbientSound.playGentleChime();
  };

  // Timer effect
  useEffect(() => {
    if (!selectedExercise || isPaused || secondsRemaining === null || completed) return;
    if (secondsRemaining <= 0) {
      handleNextStep();
      return;
    }
    const timer = setInterval(() => {
      setSecondsRemaining(prev => (prev !== null && prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsRemaining, isPaused, selectedExercise, completed, currentStepIndex]);

  // Breathing pacer animation toggle (4s in, 4s out)
  useEffect(() => {
    if (!selectedExercise?.isBreathing || isPaused || completed) return;
    const breathInterval = setInterval(() => {
      setIsBreathingIn(prev => !prev);
    }, 4000);
    return () => clearInterval(breathInterval);
  }, [selectedExercise, isPaused, completed]);

  // If no exercise is selected: show picker
  if (!selectedExercise) {
    return (
      <div className="space-y-6 max-w-xl mx-auto pb-10">
        <div>
          <span className="text-xs font-mono uppercase text-teal-400 tracking-wider font-semibold">
            Pausa de 1 a 3 Minutos
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight mt-1 font-serif">
            Quero me acalmar
          </h1>
          <p className="text-sm text-slate-400 mt-1 leading-relaxed">
            Escolha uma prática suave para ajudar seu corpo a reencontrar apoio no momento presente. Você tem autonomia total para pausar ou pular a qualquer instante.
          </p>
        </div>

        {/* Exercises list */}
        <div className="space-y-3.5">
          {exercises.map((ex) => (
            <div
              key={ex.id}
              className="p-4 sm:p-5 rounded-2xl bg-[#0D151F] border border-slate-800 hover:border-teal-500/60 transition-all flex flex-col justify-between gap-3 shadow-md group"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 group-hover:text-teal-200 transition-colors">
                    {ex.name}
                  </h3>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-800/80 border border-slate-700 text-teal-300">
                    {ex.durationLabel}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed">
                  {ex.summary}
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Benefício: {ex.benefits}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                <span className="text-[11px] text-slate-400">
                  {ex.steps.length} passos guiados
                </span>
                <button
                  onClick={() => handleStart(ex)}
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-sm shadow-teal-950"
                >
                  <span>Iniciar no meu ritmo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Alternative options if user prefers writing or talking */}
        <div className="p-4 rounded-2xl bg-[#0B131C] border border-slate-800 text-xs text-slate-400 space-y-2">
          <p className="font-semibold text-slate-300">
            Prefere outra forma de apoio agora?
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onNavigate('journal')}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              Apenas escrever no diário
            </button>
            <button
              onClick={() => onNavigate('chat')}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              Colocar para fora com a IA
            </button>
            <button
              onClick={() => onNavigate('home')}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              Voltar ao início
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active or Completed State
  const step = selectedExercise.steps[currentStepIndex];

  return (
    <div className="max-w-xl mx-auto space-y-6 pb-12">
      {/* Top Controller Bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <span className="text-[11px] font-mono uppercase text-teal-400 font-semibold">
            {selectedExercise.name}
          </span>
          <p className="text-xs text-slate-400">
            {completed ? 'Prática concluída' : `Passo ${currentStepIndex + 1} de ${selectedExercise.steps.length}`}
          </p>
        </div>
        <button
          onClick={handleResetOrQuit}
          className="text-xs text-slate-400 hover:text-slate-200 px-3 py-1 rounded-xl bg-slate-800/80 transition-colors"
        >
          Trocar de exercício
        </button>
      </div>

      {!completed ? (
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#0E1622] via-[#0C131B] to-[#0A1017] border border-slate-800/90 shadow-2xl space-y-6 text-center animate-fadeIn relative overflow-hidden">
          {/* Visual Breathing / Focus Orb */}
          <div className="flex justify-center my-4 relative">
            <div 
              className={`w-32 h-32 sm:w-40 sm:h-40 rounded-full flex flex-col items-center justify-center transition-all duration-1000 border ${
                preferences.lowStimulusMode
                  ? 'bg-slate-800/80 border-slate-700 text-teal-300'
                  : selectedExercise.isBreathing
                    ? isBreathingIn
                      ? 'scale-110 bg-teal-950/60 border-teal-400/60 text-teal-200 shadow-2xl shadow-teal-500/20'
                      : 'scale-90 bg-slate-900 border-teal-800/40 text-teal-300'
                    : 'bg-teal-950/40 border-teal-500/40 text-teal-300 shadow-2xl shadow-teal-950/80 animate-pulse'
              }`}
            >
              {secondsRemaining !== null ? (
                <>
                  <span className="text-2xl sm:text-3xl font-mono font-bold text-teal-200">
                    {secondsRemaining}s
                  </span>
                  {selectedExercise.isBreathing && (
                    <span className="text-[11px] text-teal-300 font-medium mt-1">
                      {isBreathingIn ? 'Inspire...' : 'Expire...'}
                    </span>
                  )}
                </>
              ) : (
                <Wind className="w-10 h-10 text-teal-300" />
              )}
            </div>
          </div>

          {/* Current Step Instruction */}
          <div className="space-y-2 max-w-md mx-auto">
            <h2 className="text-lg sm:text-xl font-bold text-slate-100 font-serif">
              {step.title}
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {step.instruction}
            </p>
            {step.tip && (
              <p className="text-xs text-teal-400/90 pt-1 italic">
                Dica: {step.tip}
              </p>
            )}
          </div>

          {/* Controls */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            {secondsRemaining !== null && (
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-colors"
              >
                {isPaused ? <Play className="w-4 h-4 text-teal-400" /> : <Pause className="w-4 h-4 text-amber-400" />}
                <span>{isPaused ? 'Continuar tempo' : 'Pausar tempo'}</span>
              </button>
            )}

            <button
              onClick={handleNextStep}
              className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-md shadow-teal-950/50"
            >
              <span>{currentStepIndex < selectedExercise.steps.length - 1 ? 'Próximo passo' : 'Concluir'}</span>
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          {/* Persistent Skip button (Requirement 4) */}
          <div className="pt-2">
            <button
              onClick={handleResetOrQuit}
              className="text-xs text-slate-500 hover:text-slate-400 underline underline-offset-4"
            >
              Pular ou encerrar agora sem culpa
            </button>
          </div>
        </div>
      ) : (
        /* Completion View with Small Next Step */
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0E1620] border border-teal-800/40 shadow-2xl space-y-6 text-center animate-fadeIn">
          <div className="w-14 h-14 rounded-2xl bg-teal-900/40 text-teal-300 border border-teal-700/60 flex items-center justify-center mx-auto shadow-sm shadow-teal-950">
            <Check className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-100 font-serif">
              Momento de pausa concluído
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
              Obrigado por se dar essa pausa de alguns minutos. Como está a sensação no corpo agora? Não precisa estar perfeito; apenas repare na respiração.
            </p>
          </div>

          {/* Next Step Suggestion Card */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-left space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
              <Sparkles className="w-4 h-4" />
              <span>Sugestão de próximo passo pequeno (Opcional):</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200">
              Beber um copo de água fresca e sentar confortavelmente por 5 minutos antes de voltar às tarefas.
            </p>
            <div className="flex items-center justify-between gap-2 pt-1">
              <span className="text-[11px] text-slate-400">Você pode salvar este passo para hoje:</span>
              <button
                onClick={handleSaveNextStep}
                disabled={suggestedStepSaved}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  suggestedStepSaved
                    ? 'bg-emerald-950 border border-emerald-700 text-emerald-300'
                    : 'bg-amber-600 hover:bg-amber-500 text-slate-950'
                }`}
              >
                {suggestedStepSaved ? 'Passo salvo no seu dia!' : 'Salvar no meu plano'}
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 justify-center pt-2">
            <button
              onClick={() => onNavigate('home')}
              className="py-2.5 px-5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs transition-colors"
            >
              Voltar para o início
            </button>
            <button
              onClick={handleResetOrQuit}
              className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition-colors"
            >
              Experimentar outro exercício
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
