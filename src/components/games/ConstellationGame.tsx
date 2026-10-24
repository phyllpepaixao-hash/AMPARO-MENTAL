import React, { useState } from 'react';
import { AmbientSound } from '../../services/soundService';
import { ArrowLeft, Sparkles, Star, Trash2 } from 'lucide-react';

interface ConstellationGameProps {
  onBack: () => void;
}

export const ConstellationGame: React.FC<ConstellationGameProps> = ({ onBack }) => {
  const [thoughtInput, setThoughtInput] = useState('');
  const [dissolvedList, setDissolvedList] = useState<string[]>(['Ansiedade com o futuro', 'Cobrança excessiva']);
  const [connectedStars, setConnectedStars] = useState<number[]>([1, 2]);

  const handleDissolve = (e: React.FormEvent) => {
    e.preventDefault();
    if (!thoughtInput.trim()) return;
    AmbientSound.playGentleChime();
    setDissolvedList([thoughtInput.trim(), ...dissolvedList]);
    setThoughtInput('');
  };

  const handleConnectStar = (starId: number) => {
    if (!connectedStars.includes(starId)) {
      AmbientSound.playGentleChime();
      setConnectedStars([...connectedStars, starId]);
    }
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
          <span>Estrelas conectadas: {connectedStars.length}/5</span>
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-indigo-950/40 border border-slate-800/80 p-6 rounded-3xl shadow-xl text-center space-y-3">
        <div className="w-14 h-14 bg-indigo-500/10 border border-indigo-500/30 rounded-2xl mx-auto flex items-center justify-center text-indigo-300 text-2xl">
          ✨
        </div>
        <h2 className="text-xl font-bold font-serif text-slate-100">Constelação dos Pensamentos</h2>
        <p className="text-sm text-slate-300 max-w-md mx-auto">
          Digite um pensamento pesado para transformá-lo em poeira estelar ou conecte estrelas brilhantes no céu noturno.
        </p>
      </div>

      {/* Thought Dissolver Form */}
      <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl shadow-xl max-w-lg mx-auto space-y-4">
        <h3 className="text-sm font-semibold text-slate-200">Soltar um pensamento pesado no céu:</h3>
        <form onSubmit={handleDissolve} className="space-y-3">
          <input
            type="text"
            value={thoughtInput}
            onChange={e => setThoughtInput(e.target.value)}
            placeholder="O que está pesando na sua mente agora?"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg transition-all"
          >
            Transformar em Estrela
          </button>
        </form>

        {dissolvedList.length > 0 && (
          <div className="space-y-2 pt-2">
            <div className="text-xs font-medium text-slate-400">Pensamentos acolhidos no céu:</div>
            <div className="flex flex-wrap gap-2">
              {dissolvedList.map((t, idx) => (
                <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-950/60 border border-indigo-800/60 text-indigo-200 text-xs">
                  <Star className="w-3 h-3 text-indigo-400" />
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Star Sky Canvas simulation */}
      <div className="relative h-48 bg-slate-950 border border-indigo-900/50 rounded-3xl overflow-hidden flex items-center justify-around shadow-inner">
        {[1, 2, 3, 4, 5].map(starId => {
          const isConnected = connectedStars.includes(starId);
          return (
            <button
              key={starId}
              onClick={() => handleConnectStar(starId)}
              className={`p-3 rounded-full transition-all ${
                isConnected ? 'bg-indigo-500/30 text-indigo-300 scale-125 border border-indigo-400' : 'bg-slate-900 text-slate-500 hover:text-indigo-300'
              }`}
            >
              <Star className="w-6 h-6 fill-current" />
            </button>
          );
        })}
      </div>
    </div>
  );
};
