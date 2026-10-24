import React, { useState } from 'react';
import { AmbientSound } from '../../services/soundService';
import { ArrowLeft, Sparkles, CheckCircle, Eye, Hand, Ear, Smile, Coffee } from 'lucide-react';

interface GroundingGameProps {
  onBack: () => void;
}

export const GroundingGame: React.FC<GroundingGameProps> = ({ onBack }) => {
  const [step, setStep] = useState(0);
  const [inputVal, setInputVal] = useState('');
  const [collectedItems, setCollectedItems] = useState<string[]>([]);

  const steps = [
    { count: 5, label: 'coisas que você CONSEGUE VER ao seu redor', icon: Eye, placeholder: 'Ex: uma planta, a luz da janela...' },
    { count: 4, label: 'coisas que você CONSEGUE TOCAR (texturas)', icon: Hand, placeholder: 'Ex: a roupa macia, a mesa firme...' },
    { count: 3, label: 'sons que você CONSEGUE OUVIR agora', icon: Ear, placeholder: 'Ex: o som do vento, respiração...' },
    { count: 2, label: 'cheiros que você CONSEGUE SENTIR', icon: Smile, placeholder: 'Ex: café, ar fresco, sabonete...' },
    { count: 1, label: 'gosto que você CONSEGUE SENTIR na boca', icon: Coffee, placeholder: 'Ex: água fresca, hortelã...' },
  ];

  const current = steps[step];
  const Icon = current?.icon || Eye;

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    AmbientSound.playGentleChime();
    const newItems = [...collectedItems, inputVal.trim()];
    setCollectedItems(newItems);
    setInputVal('');

    if (step < steps.length - 1) {
      setStep(s => s + 1);
    } else {
      setStep(steps.length);
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
          <span>Técnica 5-4-3-2-1</span>
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-teal-950/40 border border-slate-800/80 p-6 rounded-3xl shadow-xl text-center space-y-3">
        <div className="w-14 h-14 bg-teal-500/10 border border-teal-500/30 rounded-2xl mx-auto flex items-center justify-center text-teal-300 text-2xl">
          ⚓
        </div>
        <h2 className="text-xl font-bold font-serif text-slate-100">Missão Cinco Sentidos</h2>
        <p className="text-sm text-slate-300 max-w-md mx-auto">
          Conecte-se com o momento presente ancorando sua atenção nos sentidos físicos.
        </p>
      </div>

      {step < steps.length ? (
        <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl shadow-xl max-w-lg mx-auto space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-950 border border-teal-700/60 flex items-center justify-center text-teal-300">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-teal-400 font-mono">Passo {step + 1} de 5</div>
              <div className="text-base font-bold text-slate-100">Cite {current.count} {current.label}</div>
            </div>
          </div>

          <form onSubmit={handleAddItem} className="space-y-4">
            <input
              type="text"
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              placeholder={current.placeholder}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500"
            />
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-sm shadow-lg transition-all"
            >
              Avançar na Ancoragem
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl shadow-xl max-w-lg mx-auto text-center space-y-4">
          <div className="w-12 h-12 bg-teal-500/20 text-teal-300 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold font-serif text-slate-100">Ancoragem Concluída</h3>
          <p className="text-sm text-slate-300">
            Você trouxe sua mente de volta ao presente com sucesso. Sinta a calma fluir.
          </p>
          <button
            onClick={() => { setStep(0); setCollectedItems([]); }}
            className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
          >
            Reiniciar Exercício
          </button>
        </div>
      )}
    </div>
  );
};
