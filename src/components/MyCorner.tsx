import React, { useState } from 'react';
import { GameStorageService } from '../services/gameStorage';
import { Sparkles, CloudRain, Coffee, Sun, Moon, Check, ArrowLeft } from 'lucide-react';

interface MyCornerProps {
  onBack: () => void;
}

export const MyCorner: React.FC<MyCornerProps> = ({ onBack }) => {
  const [config, setConfig] = useState(() => GameStorageService.getRoomConfig());
  const [savedMsg, setSavedMsg] = useState(false);

  const handleUpdate = (updates: Partial<typeof config>) => {
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);
    GameStorageService.saveRoomConfig(newConfig);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2000);
  };

  const lightingStyles = {
    warm: 'bg-gradient-to-br from-amber-950/70 via-slate-900 to-slate-950 border-amber-500/30 text-amber-100',
    sunset: 'bg-gradient-to-br from-rose-950/70 via-slate-900 to-indigo-950 border-rose-500/30 text-rose-100',
    night: 'bg-gradient-to-br from-indigo-950/80 via-slate-950 to-slate-900 border-indigo-500/30 text-indigo-100',
    aurora: 'bg-gradient-to-br from-teal-950/70 via-slate-900 to-slate-950 border-teal-500/30 text-teal-100',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-300 bg-slate-900 border border-slate-800 hover:bg-slate-800 py-2 px-3 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao Início</span>
        </button>
        {savedMsg && (
          <div className="flex items-center gap-1.5 bg-teal-950 border border-teal-700/60 px-3 py-1 rounded-xl text-teal-300 text-xs">
            <Check className="w-3.5 h-3.5" />
            <span>Cantinho atualizado</span>
          </div>
        )}
      </div>

      <div className="bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-teal-950/40 border border-slate-800/80 p-6 rounded-3xl shadow-xl text-center space-y-3">
        <div className="w-14 h-14 bg-teal-500/10 border border-teal-500/30 rounded-2xl mx-auto flex items-center justify-center text-teal-300 text-2xl">
          🛋️
        </div>
        <h2 className="text-xl font-bold font-serif text-slate-100">Meu Cantinho Particular</h2>
        <p className="text-sm text-slate-300 max-w-md mx-auto">
          Personalize seu ambiente virtual de refúgio com iluminação, som e intenções do dia.
        </p>
      </div>

      {/* Room Preview Card */}
      <div className={`p-8 rounded-3xl border shadow-2xl relative overflow-hidden transition-all ${lightingStyles[config.lighting]}`}>
        {config.hasRain && (
          <div className="absolute inset-0 bg-sky-950/20 backdrop-blur-[1px] flex items-center justify-center pointer-events-none">
            <div className="text-sky-300 text-xs font-mono opacity-70 animate-pulse">🌧️ Chuva suave caindo na janela...</div>
          </div>
        )}

        <div className="relative z-10 space-y-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700/60 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>Iluminação: {config.lighting.toUpperCase()}</span>
          </div>

          <div className="max-w-md mx-auto bg-slate-900/70 border border-slate-800 p-5 rounded-2xl backdrop-blur-md shadow-inner space-y-2">
            <div className="text-xs uppercase tracking-wider font-mono text-teal-400">Intenção de Hoje</div>
            <p className="text-sm font-serif italic text-slate-100">"{config.dailyIntention}"</p>
          </div>

          <div className="flex justify-center items-center gap-4 text-2xl pt-2">
            <span>{config.mugType === 'tea' ? '🍵' : config.mugType === 'chocolate' ? '☕' : '💧'}</span>
            <span>{config.petId === 'penguin' ? '🐧' : config.petId === 'cat' ? '🐈' : '🌿'}</span>
          </div>
        </div>
      </div>

      {/* Customization Options */}
      <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl shadow-xl space-y-6">
        <h3 className="text-sm font-semibold text-slate-200">Ajustar Atmosfera do Cantinho</h3>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-400 block mb-2">Iluminação do Ambiente</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['warm', 'sunset', 'night', 'aurora'] as const).map(l => (
                <button
                  key={l}
                  onClick={() => handleUpdate({ lighting: l })}
                  className={`py-2 px-3 rounded-xl text-xs font-medium border capitalize transition-all ${
                    config.lighting === l ? 'bg-teal-950 border-teal-500 text-teal-300 shadow' : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-400 block mb-2">Intenção Diária</label>
            <input
              type="text"
              value={config.dailyIntention}
              onChange={e => handleUpdate({ dailyIntention: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-medium text-slate-300 flex items-center gap-2">
              <CloudRain className="w-4 h-4 text-sky-400" /> Ativar Som de Chuva na Janela
            </span>
            <button
              onClick={() => handleUpdate({ hasRain: !config.hasRain })}
              className={`w-12 h-6 rounded-full transition-colors relative ${config.hasRain ? 'bg-teal-600' : 'bg-slate-800'}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${config.hasRain ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
