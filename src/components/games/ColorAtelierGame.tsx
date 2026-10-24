import React, { useState } from 'react';
import { AmbientSound } from '../../services/soundService';
import { ArrowLeft, Sparkles, Palette, RefreshCw } from 'lucide-react';

interface ColorAtelierGameProps {
  onBack: () => void;
}

export const ColorAtelierGame: React.FC<ColorAtelierGameProps> = ({ onBack }) => {
  const [selectedColor, setSelectedColor] = useState('bg-teal-500');
  const [canvasCells, setCanvasCells] = useState<string[]>(Array(24).fill('bg-slate-900'));

  const colors = [
    'bg-teal-500', 'bg-sky-400', 'bg-indigo-500', 'bg-purple-500', 
    'bg-rose-400', 'bg-amber-400', 'bg-emerald-400', 'bg-slate-800'
  ];

  const handlePaintCell = (idx: number) => {
    AmbientSound.playGentleChime();
    const updated = [...canvasCells];
    updated[idx] = selectedColor;
    setCanvasCells(updated);
  };

  const handleClear = () => {
    AmbientSound.playGentleChime();
    setCanvasCells(Array(24).fill('bg-slate-900'));
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
          <span>Ateliê de Cores</span>
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-teal-950/40 border border-slate-800/80 p-6 rounded-3xl shadow-xl text-center space-y-3">
        <div className="w-14 h-14 bg-teal-500/10 border border-teal-500/30 rounded-2xl mx-auto flex items-center justify-center text-teal-300 text-2xl">
          🎨
        </div>
        <h2 className="text-xl font-bold font-serif text-slate-100">Ateliê de Cores</h2>
        <p className="text-sm text-slate-300 max-w-md mx-auto">
          Crie padrões suaves de cores em um canvas relaxante e livre de julgamentos.
        </p>
      </div>

      {/* Color Palette Selector */}
      <div className="flex flex-wrap justify-center gap-3">
        {colors.map((c, i) => (
          <button
            key={i}
            onClick={() => setSelectedColor(c)}
            className={`w-10 h-10 rounded-full ${c} border-2 transition-all ${
              selectedColor === c ? 'border-white scale-110 shadow-lg' : 'border-slate-700'
            }`}
          />
        ))}
      </div>

      {/* Canvas Grid */}
      <div className="max-w-md mx-auto bg-slate-900/90 border border-slate-800 p-4 rounded-3xl shadow-2xl">
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5">
          {canvasCells.map((cellColor, idx) => (
            <button
              key={idx}
              onClick={() => handlePaintCell(idx)}
              className={`aspect-square rounded-2xl ${cellColor} border border-slate-800 hover:scale-105 transition-transform shadow`}
            />
          ))}
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={handleClear}
            className="px-4 py-2 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all inline-flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Limpar Canvas</span>
          </button>
        </div>
      </div>
    </div>
  );
};
