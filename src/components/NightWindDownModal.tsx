import React, { useState } from 'react';
import { Moon, Sparkles, X, Check, Battery, Heart, Shield, Waves, Bell } from 'lucide-react';
import { AmbientSound } from '../services/soundService';

interface NightWindDownModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveStep?: (action: string, reflection?: string) => void;
}

const ENERGY_LEVELS = [
  { val: 1, label: 'Esgotada', desc: 'Corpo e mente pedindo parada total', icon: '🪫' },
  { val: 2, label: 'Baixa', desc: 'Energia apenas para o indispensável', icon: '🔋' },
  { val: 3, label: 'Moderada', desc: 'Sustentando o ritmo com esforço', icon: '⚡' },
  { val: 4, label: 'Boa', desc: 'Presença tranquila e corpo funcional', icon: '🌿' },
  { val: 5, label: 'Em Paz', desc: 'Sensação de leveza e descanso', icon: '✨' },
];

export const NightWindDownModal: React.FC<NightWindDownModalProps> = ({
  isOpen,
  onClose,
  onSaveStep,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedEnergy, setSelectedEnergy] = useState<number>(2);
  const [releaseThought, setReleaseThought] = useState('');
  const [gratitudeNote, setGratitudeNote] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleFinish = () => {
    AmbientSound.play('brown_noise'); // Start calming sleep sound
    AmbientSound.playGentleChime();
    setIsSaved(true);
    if (onSaveStep) {
      const parts: string[] = [];
      const energyObj = ENERGY_LEVELS.find(e => e.val === selectedEnergy);
      if (energyObj) parts.push(`Nível de energia ao deitar: ${energyObj.label} (${energyObj.desc})`);
      if (releaseThought.trim()) parts.push(`O que escolho deixar para trás: "${releaseThought.trim()}"`);
      if (gratitudeNote.trim()) parts.push(`Momento de conforto lembrado: "${gratitudeNote.trim()}"`);
      
      const reflection = parts.length > 0 ? parts.join('\n\n') : undefined;
      onSaveStep('Deixar o celular longe da cama e descansar em silêncio', reflection);
    }
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="night-title"
        className="relative w-full max-w-lg bg-gradient-to-b from-[#111824] via-[#0C121A] to-[#080D12] border border-amber-900/40 rounded-3xl shadow-2xl overflow-hidden my-4 max-h-[92vh] flex flex-col animate-fadeIn"
      >
        {/* Header with Warm Candlelight Glow */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-950/40 via-slate-900 to-[#101924] border-b border-amber-900/30 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-950/70 border border-amber-700/60 flex items-center justify-center text-amber-300 shadow-md">
              <Moon className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-amber-400 font-semibold tracking-wider">
                Ritual de Sono & Desaceleração
              </span>
              <h2 id="night-title" className="text-lg font-bold text-slate-100 font-serif">
                Encerrando o Dia com Calma
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Fechar desaceleração noturna"
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 text-xs sm:text-sm text-slate-200">
          {/* STEP 1: Energy Level Check */}
          {step === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-amber-200 font-serif">
                  1. Como está a sua bateria de energia neste fim de dia?
                </h3>
                <p className="text-xs text-slate-400">
                  Sem autocrítica. Apenas reconheça quanta energia física e mental sobrou.
                </p>
              </div>

              <div className="space-y-2">
                {ENERGY_LEVELS.map((lvl) => (
                  <button
                    key={lvl.val}
                    onClick={() => setSelectedEnergy(lvl.val)}
                    className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between gap-3 transition-all ${
                      selectedEnergy === lvl.val
                        ? 'bg-amber-950/70 border-amber-500 text-amber-100 shadow-md'
                        : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{lvl.icon}</span>
                      <div>
                        <div className="text-xs font-bold">{lvl.label}</div>
                        <div className="text-[10px] text-slate-400">{lvl.desc}</div>
                      </div>
                    </div>
                    {selectedEnergy === lvl.val && (
                      <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    )}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full mt-3 py-3 rounded-2xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-md shadow-amber-950/40"
              >
                Próximo passo: Soltar o dia
              </button>
            </div>
          )}

          {/* STEP 2: Release & Gratitude */}
          {step === 2 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-amber-200 font-serif">
                  2. O que você escolhe deixar para trás esta noite?
                </h3>
                <p className="text-xs text-slate-400">
                  Tudo o que não foi concluído hoje pode esperar com segurança até amanhã.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 font-mono">
                  O que já acabou e não precisa de você agora:
                </label>
                <textarea
                  rows={3}
                  value={releaseThought}
                  onChange={(e) => setReleaseThought(e.target.value)}
                  placeholder="Ex.: Uma cobrança do trabalho, a sensação de que não fiz o suficiente..."
                  className="w-full text-xs sm:text-sm p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none font-sans"
                />
              </div>

              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-semibold text-slate-300 font-mono">
                  Um pequeno instante seguro ou bom de hoje:
                </label>
                <input
                  type="text"
                  value={gratitudeNote}
                  onChange={(e) => setGratitudeNote(e.target.value)}
                  placeholder="Ex.: O café da manhã, a cama confortável, uma risada..."
                  className="w-full text-xs sm:text-sm px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-amber-500 font-sans"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setStep(1)}
                  className="py-2.5 px-4 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Voltar
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs transition-all shadow-md"
                >
                  Ir para relaxamento somático
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Somatic Bedtime Release */}
          {step === 3 && (
            <div className="space-y-4 animate-fadeIn text-center">
              <div className="w-16 h-16 rounded-full bg-amber-950/60 border border-amber-600/50 flex items-center justify-center text-amber-300 mx-auto animate-pulse">
                <Sparkles className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-100 font-serif">
                  Escaneamento e Permissão para Descansar
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-sm mx-auto">
                  Solte o peso da cabeça sobre o travesseiro. Descole a língua do céu da boca. Solte os ombros e permita que a gravidade cuide de você agora.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-900/40 text-amber-200 text-xs text-left space-y-1.5">
                <div className="flex items-center gap-2 font-bold font-mono">
                  <Waves className="w-4 h-4 text-amber-400" />
                  <span>Áudio de sono ativado automaticamente:</span>
                </div>
                <p className="text-slate-300">
                  Ao concluir, ativaremos o suave <em>Ruído Marrom</em> para acolher seus ouvidos e bloquear ruídos externos enquanto você pega no sono.
                </p>
              </div>

              {isSaved ? (
                <div className="p-3.5 rounded-2xl bg-teal-950/70 border border-teal-700 text-teal-200 font-bold text-xs animate-fadeIn">
                  ✨ Boa noite e bom descanso. Seu dia está encerrado com carinho.
                </div>
              ) : (
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setStep(2)}
                    className="py-2.5 px-4 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                  >
                    Voltar
                  </button>
                  <button
                    onClick={handleFinish}
                    className="flex-1 py-3 rounded-2xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-md shadow-amber-950"
                  >
                    Concluir ritual e descansar
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>Passo {step} de 3</span>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
