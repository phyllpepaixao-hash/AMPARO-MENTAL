import React, { useState } from 'react';
import { X, Check, Heart, Sparkles } from 'lucide-react';
import { FeelingType, MoodCheckIn } from '../types';
import { AmbientSound } from '../services/soundService';

interface CheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (checkIn: MoodCheckIn) => void;
  existingCheckIn?: MoodCheckIn;
}

const FEELING_OPTIONS: { id: FeelingType; label: string; desc: string; icon: string }[] = [
  { id: 'energized', label: 'Com energia', desc: 'Disposição física ou ânimo para agir', icon: '⚡' },
  { id: 'calm', label: 'Tranquilo(a)', desc: 'Sensação de paz ou respiração fluida', icon: '🌿' },
  { id: 'tired', label: 'Cansado(a)', desc: 'Corpo pedindo descanso ou sono', icon: '🍂' },
  { id: 'heavy', label: 'Pesado(a)', desc: 'Desânimo, tristeza ou peso nos ombros', icon: '🌧️' },
  { id: 'restless', label: 'Agitado(a)', desc: 'Inquietação mental ou ansiedade presente', icon: '🌪️' },
  { id: 'confused', label: 'Confuso(a)', desc: 'Muitos pensamentos misturados', icon: '🌫️' },
  { id: 'dont_know', label: 'Não sei definir', desc: 'Apenas estou aqui, sem rótulo claro', icon: '🫧' },
  { id: 'prefer_not_to_say', label: 'Prefiro não responder', desc: 'Guardar para si neste momento', icon: '🔒' },
];

const SENSATION_OPTIONS = [
  'Tensão nos ombros ou pescoço',
  'Nó na garganta ou peito apertado',
  'Respiração curta ou acelerada',
  'Mandíbula travada',
  'Corpo solto e relaxado',
  'Sensação de peso no estômago',
  'Olhos pesados ou fadiga visual',
  'Sem sensação corporal marcante',
];

export const CheckInModal: React.FC<CheckInModalProps> = ({
  isOpen,
  onClose,
  onSave,
  existingCheckIn,
}) => {
  const [feeling, setFeeling] = useState<FeelingType>(existingCheckIn?.feeling || 'calm');
  const [selectedSensations, setSelectedSensations] = useState<string[]>(existingCheckIn?.bodySensations || []);
  const [note, setNote] = useState(existingCheckIn?.note || '');
  const [voluntaryStep, setVoluntaryStep] = useState(existingCheckIn?.voluntaryNextStep || '');

  if (!isOpen) return null;

  const toggleSensation = (item: string) => {
    if (selectedSensations.includes(item)) {
      setSelectedSensations(selectedSensations.filter(s => s !== item));
    } else {
      setSelectedSensations([...selectedSensations, item]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const today = new Date().toISOString().split('T')[0];
    const newRecord: MoodCheckIn = {
      id: existingCheckIn?.id || `checkin-${Date.now()}`,
      date: today,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      feeling,
      bodySensations: selectedSensations,
      note: note.trim() || undefined,
      voluntaryNextStep: voluntaryStep.trim() || undefined,
    };
    onSave(newRecord);
    AmbientSound.playGentleChime();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkin-title"
        className="relative w-full max-w-lg bg-[#0F1722] border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-4 max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 to-[#101924] border-b border-slate-800 flex items-start justify-between gap-3">
          <div>
            <span className="text-[11px] font-mono uppercase text-teal-400 font-semibold tracking-wider">
              Registro Voluntário • Sem Notas
            </span>
            <h2 id="checkin-title" className="text-lg font-bold text-slate-100 mt-0.5 font-serif">
              Como você está se sentindo agora?
            </h2>
            <p className="text-xs text-slate-400">
              Não há notas boas ou ruins. Apenas observe seu estado com acolhimento.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar check-in"
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 overflow-y-auto space-y-5 flex-1">
          {/* Feeling Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono">
              1. O que melhor descreve seu estado neste momento?
            </label>
            <div className="grid grid-cols-2 gap-2">
              {FEELING_OPTIONS.map((opt) => (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => setFeeling(opt.id)}
                  className={`p-3 rounded-2xl text-left border transition-all ${
                    feeling === opt.id
                      ? 'bg-teal-950/90 border-teal-500 text-teal-200 shadow-sm shadow-teal-950'
                      : 'bg-[#0D151F] border-slate-800 text-slate-300 hover:bg-slate-800/70 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold">
                    <span>{opt.icon}</span>
                    <span>{opt.label}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5 leading-tight">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Body Sensations */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono">
              2. O que seu corpo está sentindo?
            </label>
            <div className="flex flex-wrap gap-1.5">
              {SENSATION_OPTIONS.map((item) => {
                const isSelected = selectedSensations.includes(item);
                return (
                  <button
                    type="button"
                    key={item}
                    onClick={() => toggleSensation(item)}
                    className={`px-3 py-1.5 rounded-xl text-xs transition-all border ${
                      isSelected
                        ? 'bg-indigo-950 border-indigo-500 text-indigo-200 font-medium shadow-sm'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Optional Note */}
          <div className="space-y-1.5">
            <label htmlFor="checkin-note" className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center justify-between font-mono">
              <span>3. Alguma anotação breve? (Opcional)</span>
              <span className="text-[10px] text-slate-500 font-normal">Privado no aparelho</span>
            </label>
            <textarea
              id="checkin-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ex.: Uma tarde longa de reuniões, preciso de silêncio..."
              rows={2}
              className="w-full text-xs sm:text-sm p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-teal-500 resize-none font-sans"
            />
          </div>

          {/* Optional Next Step */}
          <div className="space-y-1.5">
            <label htmlFor="checkin-step" className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center justify-between font-mono">
              <span>4. Um próximo passo voluntário para agora</span>
              <span className="text-[10px] text-teal-400 font-normal">Sem obrigação</span>
            </label>
            <input
              id="checkin-step"
              type="text"
              value={voluntaryStep}
              onChange={(e) => setVoluntaryStep(e.target.value)}
              placeholder="Ex.: Tomar um copo d'água e afastar o olhar da tela"
              className="w-full text-xs sm:text-sm px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-teal-500 font-sans"
            />
          </div>

          {/* Buttons */}
          <div className="pt-2 flex items-center justify-between gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold transition-all flex items-center justify-center gap-1.5 shadow-md shadow-teal-950/50"
            >
              <Check className="w-4 h-4" />
              <span>Salvar check-in</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
