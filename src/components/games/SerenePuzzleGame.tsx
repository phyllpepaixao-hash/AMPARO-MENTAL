import React, { useState } from 'react';
import { AmbientSound } from '../../services/soundService';
import { ArrowLeft, Sparkles, RefreshCw, CheckCircle2 } from 'lucide-react';

interface SerenePuzzleGameProps {
  onBack: () => void;
}

export const SerenePuzzleGame: React.FC<SerenePuzzleGameProps> = ({ onBack }) => {
  const [tiles, setTiles] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 0]);
  const [moves, setMoves] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const winningState = [1, 2, 3, 4, 5, 6, 7, 8, 0];

  const handleShuffle = () => {
    AmbientSound.playGentleChime();
    const shuffled = [3, 1, 2, 4, 0, 6, 7, 5, 8];
    setTiles(shuffled);
    setMoves(0);
    setIsCompleted(false);
  };

  const handleTileClick = (index: number) => {
    if (isCompleted) return;
    const emptyIndex = tiles.indexOf(0);
    const row = Math.floor(index / 3);
    const col = index % 3;
    const emptyRow = Math.floor(emptyIndex / 3);
    const emptyCol = emptyIndex % 3;

    const isAdjacent = Math.abs(row - emptyRow) + Math.abs(col - emptyCol) === 1;
    if (isAdjacent) {
      AmbientSound.playGentleChime();
      const newTiles = [...tiles];
      newTiles[emptyIndex] = newTiles[index];
      newTiles[index] = 0;
      setTiles(newTiles);
      setMoves(m => m + 1);

      if (newTiles.every((val, idx) => val === winningState[idx])) {
        setIsCompleted(true);
      }
    }
  };

  const tileLabels: Record<number, { symbol: string; text: string }> = {
    1: { symbol: '🌿', text: 'Respirar' },
    2: { symbol: '🌊', text: 'Calma' },
    3: { symbol: '☀️', text: 'Luz' },
    4: { symbol: '🍃', text: 'Paz' },
    5: { symbol: '🌸', text: 'Fluir' },
    6: { symbol: '☕', text: 'Pausa' },
    7: { symbol: '🌙', text: 'Noite' },
    8: { symbol: '✨', text: 'Equilíbrio' },
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
          <span>Movimentos: {moves}</span>
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-teal-950/40 border border-slate-800/80 p-6 rounded-3xl shadow-xl text-center space-y-3">
        <div className="w-14 h-14 bg-teal-500/10 border border-teal-500/30 rounded-2xl mx-auto flex items-center justify-center text-teal-300 text-2xl">
          🧩
        </div>
        <h2 className="text-xl font-bold font-serif text-slate-100">Quebra-cabeça Sereno</h2>
        <p className="text-sm text-slate-300 max-w-md mx-auto">
          Organize as peças em ordem com tranquilidade. Sem cronômetro, sem pressão.
        </p>

        {isCompleted && (
          <div className="p-3 bg-teal-950/80 border border-teal-700/80 rounded-2xl text-teal-200 text-xs flex items-center justify-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-teal-400" />
            <span>Parabéns! Você completou o quebra-cabeça em {moves} movimentos.</span>
          </div>
        )}
      </div>

      {/* Puzzle Board */}
      <div className="max-w-xs mx-auto bg-slate-900/90 border border-slate-800 p-4 rounded-3xl shadow-2xl">
        <div className="grid grid-cols-3 gap-2.5 aspect-square">
          {tiles.map((val, idx) => {
            if (val === 0) {
              return <div key={idx} className="bg-slate-950/40 rounded-2xl border border-dashed border-slate-800"></div>;
            }
            const info = tileLabels[val];
            return (
              <button
                key={idx}
                onClick={() => handleTileClick(idx)}
                className="bg-slate-800 hover:bg-teal-950/60 border border-slate-700 hover:border-teal-500/60 rounded-2xl flex flex-col items-center justify-center p-2 text-slate-100 shadow-md transition-all group"
              >
                <span className="text-2xl group-hover:scale-110 transition-transform">{info.symbol}</span>
                <span className="text-[10px] font-medium text-slate-300 mt-1">{info.text}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={handleShuffle}
            className="px-4 py-2 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all inline-flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Embaralhar Peças</span>
          </button>
        </div>
      </div>
    </div>
  );
};
