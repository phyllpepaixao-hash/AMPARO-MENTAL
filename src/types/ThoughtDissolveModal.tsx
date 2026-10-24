import React, { useState } from 'react';
import { Wind, Sparkles, X, RotateCcw, Heart, ShieldCheck } from 'lucide-react';
import { AmbientSound } from '../services/soundService';

interface ThoughtDissolveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThoughtDissolveModal: React.FC<ThoughtDissolveModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [thought, setThought] = useState('');
  const [isDissolving, setIsDissolving] = useState(false);
  const [isDissolved, setIsDissolved] = useState(false);

  if (!isOpen) return null;

  const handleDissolve = () => {
    if (!thought.trim() || isDissolving) return;

    setIsDissolving(true);
    AmbientSound.playGentleChime();

    setTimeout(() => {
      setIsDissolving(false);
      setIsDissolved(true);
    }, 2200);
  };

  const handleReset = () => {
    setThought('');
    setIsDissolving(false);
    setIsDissolved(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="dissolve-title"
        className="relative w-full max-w-lg bg-[#0F1722] border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-4 max-h-[92vh] flex flex-col animate-fadeIn"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 to-[#101924] border-b border-slate-800 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-950/70 border border-teal-700/60 flex items-center justify-center text-teal-300 shadow-md">
              <Wind className="w-5 h-5 text-teal-300" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-teal-400 font-semibold tracking-wider">
                Desapego Somático
              </span>
              <h2 id="dissolve-title" className="text-lg font-bold text-slate-100 font-serif">
                Dissolver um Pensamento Pesado
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Fechar ritual de desapego"
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 text-xs sm:text-sm text-slate-200 text-center">
          {!isDissolved ? (
            <div className="space-y-4">
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
                Escreva abaixo aquela frase ou cobrança que está martelando na sua cabeça neste momento:
              </p>

              <div className="relative">
                <textarea
                  rows={4}
                  disabled={isDissolving}
                  value={thought}
                  onChange={(e) => setThought(e.target.value)}
                  placeholder="Ex.: 'Eu deveria ter feito diferente', 'Eu não vou dar conta', 'Todo mundo está me julgando'..."
                  className={`w-full text-xs sm:text-sm p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-teal-500 resize-none font-sans transition-all duration-1000 ${
                    isDissolving
                      ? 'opacity-0 scale-90 blur-md pointer-events-none'
                      : 'opacity-100 scale-100'
                  }`}
                />

                {isDissolving && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-teal-300 space-y-2 animate-fadeIn">
                    <Sparkles className="w-8 h-8 animate-spin" />
                    <span className="text-xs font-mono font-semibold tracking-wider">
                      Dissolvendo este pensamento no ar...
                    </span>
                  </div>
                )}
              </div>

              <button
                onClick={handleDissolve}
                disabled={!thought.trim() || isDissolving}
                className={`w-full py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${
                  thought.trim() && !isDissolving
                    ? 'bg-teal-600 hover:bg-teal-500 text-white shadow-md shadow-teal-950'
                    : 'bg-slate-900 text-slate-600 cursor-not-allowed'
                }`}
              >
                <Wind className="w-4 h-4" />
                <span>Soltar e dissolver este pensamento</span>
              </button>
            </div>
          ) : (
            <div className="space-y-5 py-4 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-teal-950/60 border border-teal-500/50 flex items-center justify-center text-teal-300 mx-auto shadow-xl">
                <Heart className="w-8 h-8 text-teal-300" />
              </div>

              <div className="space-y-2 max-w-sm mx-auto">
                <h3 className="text-xl font-bold text-slate-100 font-serif">
                  O pensamento se foi. Você continua aqui.
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-serif italic text-teal-100/90">
                  “Você não é a sua mente. Você é o espaço seguro e calmo onde os pensamentos passam, como nuvens no céu.”
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
                <button
                  onClick={onClose}
                  className="py-2.5 px-5 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition-colors shadow-md shadow-teal-950"
                >
                  Continuar em paz
                </button>
                <button
                  onClick={handleReset}
                  className="py-2.5 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Soltar outro pensamento</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
