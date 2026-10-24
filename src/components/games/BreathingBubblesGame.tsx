import React, { useState, useEffect } from 'react';
import { AmbientSound } from '../../services/soundService';
import { ArrowLeft, Wind, Sparkles, RefreshCw } from 'lucide-react';

interface BreathingBubblesGameProps {
  onBack: () => void;
}

export const BreathingBubblesGame: React.FC<BreathingBubblesGameProps> = ({ onBack }) => {
  const [phase, setPhase] = useState<'idle' | 'inhale' | 'hold' | 'exhale'>('idle');
  const [instruction, setInstruction] = useState('Toque em "Iniciar Respiração" ou estoure as bolhas flutuantes abaixo.');
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [poppedCount, setPoppedCount] = useState(0);
  const [popBubbles, setPopBubbles] = useState<Array<{ id: number; popped: boolean; speed: number; size: string }>>([
    { id: 1, popped: false, speed: 2.2, size: 'w-14 h-14 text-2xl' },
    { id: 2, popped: false, speed: 2.8, size: 'w-16 h-16 text-3xl' },
    { id: 3, popped: false, speed: 2.1, size: 'w-12 h-12 text-xl' },
    { id: 4, popped: false, speed: 3.2, size: 'w-16 h-16 text-3xl' },
    { id: 5, popped: false, speed: 2.5, size: 'w-14 h-14 text-2xl' },
    { id: 6, popped: false, speed: 2.9, size: 'w-12 h-12 text-xl' },
    { id: 7, popped: false, speed: 2.4, size: 'w-16 h-16 text-3xl' },
    { id: 8, popped: false, speed: 3.0, size: 'w-14 h-14 text-2xl' },
  ]);

  useEffect(() => {
    let timer: any;
    if (phase === 'inhale') {
      setInstruction('Inspire suavemente pelo nariz...');
      setSecondsLeft(4);
      timer = setTimeout(() => setPhase('hold'), 4000);
    } else if (phase === 'hold') {
      setInstruction('Segure o ar com leveza...');
      setSecondsLeft(4);
      timer = setTimeout(() => setPhase('exhale'), 4000);
    } else if (phase === 'exhale') {
      setInstruction('Expire devagar pela boca...');
      setSecondsLeft(6);
      timer = setTimeout(() => setPhase('inhale'), 6000);
    }
    return () => clearTimeout(timer);
  }, [phase]);

  const handleStart = () => {
    AmbientSound.playGentleChime();
    setPhase('inhale');
  };

  const handleStop = () => {
    setPhase('idle');
    setInstruction('Sessão pausada. Respire no seu próprio ritmo.');
  };

  const handlePopBubble = (id: number) => {
    AmbientSound.playGentleChime();
    setPoppedCount(prev => prev + 1);
    setPopBubbles(prev => prev.map(b => b.id === id ? { ...b, popped: true } : b));

    // Respawn bubble after 1.2s
    setTimeout(() => {
      setPopBubbles(prev => prev.map(b => b.id === id ? { ...b, popped: false } : b));
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-300 bg-slate-900 border border-slate-800 hover:bg-slate-800 py-2 px-3 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao AmparoPlay</span>
        </button>
        <div className="flex items-center gap-2 bg-teal-950/80 border border-teal-800/60 px-3 py-1.5 rounded-xl text-teal-300 text-xs font-semibold">
          <Sparkles className="w-4 h-4 text-teal-400" />
          <span>Bolhas estouradas: {poppedCount}</span>
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-teal-950/40 border border-slate-800/80 p-6 rounded-3xl shadow-xl text-center space-y-4">
        <div className="w-14 h-14 bg-teal-500/10 border border-teal-500/30 rounded-2xl mx-auto flex items-center justify-center text-teal-300 text-2xl">
          🫧
        </div>
        <h2 className="text-xl font-bold font-serif text-slate-100">Bolhas de Respiro</h2>
        <p className="text-sm text-slate-300 max-w-md mx-auto">
          Acompanhe o ritmo da bolha central ou estoure as bolhas flutuantes para liberar a tensão acumulada.
        </p>

        {/* Central Breathing Bubble */}
        <div className="py-8 flex flex-col items-center justify-center relative">
          <div className={`w-40 h-40 rounded-full border-4 border-teal-400/60 bg-gradient-to-br from-teal-400/20 via-sky-500/15 to-indigo-600/20 flex flex-col items-center justify-center shadow-2xl transition-all duration-1000 ${
            phase === 'inhale' ? 'scale-125 bg-teal-400/30' : phase === 'exhale' ? 'scale-90 opacity-90' : 'scale-100'
          }`}>
            <Wind className="w-8 h-8 text-teal-300 mb-1 animate-pulse" />
            <span className="text-xs font-bold text-teal-200 uppercase tracking-wider">{phase === 'idle' ? 'Pronto' : phase}</span>
            {phase !== 'idle' && <span className="text-sm font-mono text-white mt-0.5">respire</span>}
          </div>

          <p className="text-sm font-medium text-teal-300 mt-6">{instruction}</p>
        </div>

        <div className="flex justify-center gap-3">
          {phase === 'idle' ? (
            <button
              onClick={handleStart}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-teal-600 hover:bg-teal-500 text-white shadow-lg transition-all"
            >
              Iniciar Respiração Guiada
            </button>
          ) : (
            <button
              onClick={handleStop}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
            >
              Pausar Respiração
            </button>
          )}
        </div>
      </div>

      {/* Floating Pop Bubbles */}
      <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl text-center space-y-4">
        <h3 className="text-sm font-semibold text-slate-200">Toque nas bolhas para estourá-las (elas reaparecem suavemente)</h3>
        <div className="flex flex-wrap justify-center items-center gap-4 min-h-[120px] py-4">
          {popBubbles.map(b => (
            <button
              key={b.id}
              onClick={() => !b.popped && handlePopBubble(b.id)}
              disabled={b.popped}
              className={`${b.size} rounded-full border flex items-center justify-center shadow-lg transition-all transform ${
                b.popped
                  ? 'scale-0 opacity-0 bg-teal-400/80 text-white duration-300 pointer-events-none'
                  : 'scale-100 opacity-100 bg-teal-500/15 hover:bg-teal-400/30 border-teal-400/50 text-teal-300 animate-bounce hover:scale-110 cursor-pointer'
              }`}
              style={{ animationDuration: `${b.speed}s` }}
              title="Estourar bolha"
            >
              {b.popped ? '✨' : '🫧'}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
