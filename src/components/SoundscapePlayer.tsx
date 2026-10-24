import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, CloudRain, Radio, Waves, Bell, Sparkles, X } from 'lucide-react';
import { AmbientSound, SoundscapeType } from '../services/soundService';

interface SoundscapePlayerProps {
  lowStimulus?: boolean;
}

export const SoundscapePlayer: React.FC<SoundscapePlayerProps> = ({ lowStimulus }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSound, setActiveSound] = useState<SoundscapeType>('off');
  const [volume, setVolume] = useState(0.35);

  const options: { id: SoundscapeType; label: string; desc: string; icon: any }[] = [
    { id: 'rain', label: 'Chuva Suave', desc: 'Gotas aconchegantes na janela', icon: CloudRain },
    { id: 'brown_noise', label: 'Ruído Marrom', desc: 'Grave profundo para acalmar a mente', icon: Radio },
    { id: 'waves', label: 'Ondas Serenas', desc: 'Ritmo suave de respiração do mar', icon: Waves },
    { id: 'zen_tone', label: 'Ressonância 432Hz', desc: 'Tom harmônico de relaxamento', icon: Bell },
  ];

  const handleToggleSound = (type: SoundscapeType) => {
    if (activeSound === type) {
      AmbientSound.stop();
      setActiveSound('off');
    } else {
      AmbientSound.play(type);
      setActiveSound(type);
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    AmbientSound.setVolume(newVol);
  };

  const handleStopAll = () => {
    AmbientSound.stop();
    setActiveSound('off');
  };

  return (
    <div className="relative">
      {/* Sound button in header or widget */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-all ${
          activeSound !== 'off'
            ? 'bg-teal-950/90 border-teal-500/70 text-teal-300 shadow-sm shadow-teal-950/60'
            : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
        }`}
        title="Sons ambientes para acalmar"
        aria-label="Controle de sons ambientes de acolhimento"
      >
        {activeSound !== 'off' ? (
          <>
            <Volume2 className="w-4 h-4 text-teal-300 animate-pulse" />
            <span className="hidden sm:inline text-[11px] font-semibold text-teal-200">
              {options.find(o => o.id === activeSound)?.label || 'Som Ativo'}
            </span>
          </>
        ) : (
          <>
            <VolumeX className="w-4 h-4" />
            <span className="hidden sm:inline text-[11px]">Sons Calmantes</span>
          </>
        )}
      </button>

      {/* Popover Menu */}
      {isOpen && (
        <div 
          className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-[#0E1620] border border-slate-700/80 rounded-2xl p-4 shadow-2xl z-50 animate-fadeIn space-y-3.5 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-teal-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Sons Ambientes de Acolhimento
              </h4>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg"
              aria-label="Fechar painel de sons"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            Sintetizados localmente via Web Audio. Zero consumo de dados, sem arquivos externos.
          </p>

          {/* Sound options */}
          <div className="space-y-1.5">
            {options.map((opt) => {
              const Icon = opt.icon;
              const isPlaying = activeSound === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => handleToggleSound(opt.id)}
                  className={`w-full p-2.5 rounded-xl text-left border flex items-center justify-between gap-3 transition-all ${
                    isPlaying
                      ? 'bg-teal-950/80 border-teal-500 text-teal-200 shadow-sm'
                      : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800/70 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`p-1.5 rounded-lg ${isPlaying ? 'bg-teal-900 text-teal-300' : 'bg-slate-800 text-slate-400'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold">{opt.label}</div>
                      <div className="text-[10px] text-slate-400 leading-tight">{opt.desc}</div>
                    </div>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-teal-400 animate-ping' : 'bg-transparent'}`} />
                </button>
              );
            })}
          </div>

          {/* Volume slider */}
          {activeSound !== 'off' && (
            <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Volume suave:</span>
                <span className="font-mono text-teal-300 font-bold">{Math.round(volume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.9"
                step="0.05"
                value={volume}
                onChange={(e) => handleVolumeChange(Number(e.target.value))}
                className="w-full accent-teal-400 bg-slate-800 rounded-lg h-1.5 cursor-pointer"
              />
            </div>
          )}

          {/* Bottom actions */}
          <div className="pt-1 flex items-center justify-between text-[11px]">
            <button
              onClick={() => AmbientSound.playGentleChime()}
              className="text-slate-400 hover:text-teal-300 flex items-center gap-1 transition-colors"
            >
              <Bell className="w-3 h-3" />
              <span>Testar sino zen</span>
            </button>
            {activeSound !== 'off' && (
              <button
                onClick={handleStopAll}
                className="text-rose-400 hover:text-rose-300 font-semibold transition-colors"
              >
                Silenciar
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
