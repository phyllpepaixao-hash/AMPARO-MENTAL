import React, { useState } from 'react';
import { GameStorageService } from '../../services/gameStorage';
import { AmbientSound } from '../../services/soundService';
import { ArrowLeft, Sparkles, Heart, Utensils, Award } from 'lucide-react';

interface PenguinGameProps {
  onBack: () => void;
}

export const PenguinGame: React.FC<PenguinGameProps> = ({ onBack }) => {
  const [penguin, setPenguin] = useState(() => GameStorageService.getPenguinState());
  const [message, setMessage] = useState('Pingo está feliz por ter sua companhia hoje.');

  const handleFeed = () => {
    AmbientSound.playGentleChime();
    const newHunger = Math.min(100, penguin.hunger + 15);
    const newHappy = Math.min(100, penguin.happiness + 10);
    const updated = { ...penguin, hunger: newHunger, happiness: newHappy, lastFedAt: new Date().toISOString() };
    setPenguin(updated);
    GameStorageService.savePenguinState(updated);
    setMessage('Pingo saboreou o petisco com um pequeno balanço de cabeça satisfeito!');
  };

  const handlePet = () => {
    AmbientSound.playGentleChime();
    const newHappy = Math.min(100, penguin.happiness + 15);
    const updated = { ...penguin, happiness: newHappy };
    setPenguin(updated);
    GameStorageService.savePenguinState(updated);
    setMessage('Pingo fechou os olhinhos de felicidade e deu um abraço quentinho.');
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
          <span>Amigo: {penguin.name}</span>
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-teal-950/40 border border-slate-800/80 p-6 rounded-3xl shadow-xl text-center space-y-3">
        <div className="w-20 h-20 bg-teal-500/10 border border-teal-500/30 rounded-full mx-auto flex items-center justify-center text-4xl shadow-inner animate-bounce">
          🐧
        </div>
        <h2 className="text-xl font-bold font-serif text-slate-100">Cuidar do Pingo</h2>
        <p className="text-sm text-slate-300 max-w-md mx-auto">
          Um companheiro fofinho e aconchegante para momentos de pausa leve.
        </p>
        <div className="inline-block bg-teal-950/60 border border-teal-700/50 text-teal-200 text-xs px-3 py-1 rounded-lg">
          {message}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl text-center space-y-2">
          <div className="text-xs text-slate-400">Fome & Energia</div>
          <div className="text-lg font-bold text-teal-300">{penguin.hunger}%</div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="bg-teal-400 h-full rounded-full transition-all" style={{ width: `${penguin.hunger}%` }}></div>
          </div>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl text-center space-y-2">
          <div className="text-xs text-slate-400">Alegria</div>
          <div className="text-lg font-bold text-rose-300">{penguin.happiness}%</div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="bg-rose-400 h-full rounded-full transition-all" style={{ width: `${penguin.happiness}%` }}></div>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-3">
        <button
          onClick={handleFeed}
          className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white shadow-lg transition-all flex items-center gap-1.5"
        >
          <Utensils className="w-4 h-4" />
          <span>Dar Petisco</span>
        </button>
        <button
          onClick={handlePet}
          className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-rose-600/80 hover:bg-rose-500 text-white shadow-lg transition-all flex items-center gap-1.5"
        >
          <Heart className="w-4 h-4" />
          <span>Fazer Carinho</span>
        </button>
      </div>
    </div>
  );
};
