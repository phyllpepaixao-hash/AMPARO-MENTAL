import React, { useState } from 'react';
import { GameStorageService } from '../../services/gameStorage';
import { AmbientSound } from '../../services/soundService';
import { ArrowLeft, Sparkles, Fish as FishIcon, Utensils } from 'lucide-react';

interface AquariumGameProps {
  onBack: () => void;
}

export const AquariumGame: React.FC<AquariumGameProps> = ({ onBack }) => {
  const [aquarium, setAquarium] = useState(() => GameStorageService.getAquariumState());
  const [ripple, setRipple] = useState(false);
  const [message, setMessage] = useState('Toque na água para gerar ondulações calmantes ou alimentar os peixinhos.');

  const handleFeed = () => {
    AmbientSound.playGentleChime();
    if (aquarium.foodCount <= 0) {
      setMessage('As rações acabaram por hoje. Volte mais tarde ou descanse.');
      return;
    }
    const updated = {
      ...aquarium,
      foodCount: aquarium.foodCount - 1,
      lastFedAt: new Date().toISOString()
    };
    setAquarium(updated);
    GameStorageService.saveAquariumState(updated);
    setMessage('Você alimentou os habitantes do aquário. Eles nadam mais alegremente!');
  };

  const handleRippleWater = () => {
    AmbientSound.playGentleChime();
    setRipple(true);
    setTimeout(() => setRipple(false), 1500);
    setMessage('Ondulações suaves se espalham pela água cristalina.');
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
          <span>Rações disponíveis: {aquarium.foodCount}</span>
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-teal-950/40 border border-slate-800/80 p-6 rounded-3xl shadow-xl text-center space-y-3">
        <div className="w-14 h-14 bg-teal-500/10 border border-teal-500/30 rounded-2xl mx-auto flex items-center justify-center text-teal-300 text-2xl">
          🐠
        </div>
        <h2 className="text-xl font-bold font-serif text-slate-100">Aquário Tranquilo</h2>
        <p className="text-sm text-slate-300 max-w-md mx-auto">
          Observe o movimento fluido das criaturas marinhas em águas calmas.
        </p>
        <div className="inline-block bg-teal-950/60 border border-teal-700/50 text-teal-200 text-xs px-3 py-1 rounded-lg">
          {message}
        </div>
      </div>

      {/* Tank View */}
      <div
        onClick={handleRippleWater}
        className="relative h-64 bg-gradient-to-b from-sky-950/60 via-teal-950/70 to-slate-950 border border-teal-800/50 rounded-3xl overflow-hidden cursor-pointer shadow-2xl flex items-center justify-center"
      >
        {ripple && (
          <div className="absolute inset-0 bg-teal-400/10 animate-ping rounded-3xl pointer-events-none"></div>
        )}

        <div className="absolute inset-0 flex items-center justify-around px-8">
          {aquarium.fish.map((f, i) => (
            <div
              key={f.id}
              className={`text-4xl animate-bounce ${f.color}`}
              style={{
                animationDuration: `${3 + i}s`,
                transform: i % 2 === 0 ? 'scaleX(-1)' : 'none'
              }}
            >
              {i === 0 ? '🪼' : i === 1 ? '🐠' : '⭐'}
            </div>
          ))}
        </div>

        <div className="absolute bottom-4 left-0 right-0 text-center text-xs text-teal-300/80 font-serif">
          Toque na água para gerar ondas de serenidade
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleFeed}
          className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white shadow-lg transition-all flex items-center gap-1.5"
        >
          <Utensils className="w-4 h-4" />
          <span>Alimentar Peixinhos</span>
        </button>
      </div>
    </div>
  );
};
