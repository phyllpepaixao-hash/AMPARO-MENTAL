import React, { useState } from 'react';
import { X, Sparkles, Check, ShieldCheck, Heart, Zap, Crown } from 'lucide-react';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PremiumModal: React.FC<PremiumModalProps> = ({ isOpen, onClose }) => {
  const [isActivated, setIsActivated] = useState(() => {
    try {
      return localStorage.getItem('entre_is_premium') === 'true';
    } catch {
      return false;
    }
  });

  if (!isOpen) return null;

  const handleActivate = () => {
    setIsActivated(true);
    try {
      localStorage.setItem('entre_is_premium', 'true');
    } catch {}
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-gradient-to-br from-slate-900 via-[#0E1722] to-teal-950/60 border border-teal-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100 space-y-6">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/15 border border-teal-500/40 text-teal-300 text-xs font-semibold">
            <Crown className="w-4 h-4 text-amber-400 fill-current" />
            <span>Experiência Exclusiva</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-slate-100">Amparo Premium</h2>
          <p className="text-sm text-slate-300 max-w-sm mx-auto">
            Recursos avançados de autocuidado, ferramentas profissionais para terapia e personalização total sem anúncios ou limites.
          </p>
        </div>

        {/* Perks Grid */}
        <div className="space-y-3">
          {[
            { title: 'IA Emocional Ilimitada', desc: 'Sessões de escuta e reflexão sem restrições diárias' },
            { title: 'Todos os 8 Minijogos EntrePlay', desc: 'Jardim, aquário, constelação, ateliê e muito mais' },
            { title: 'Exportação para Terapeutas', desc: 'Geração de relatórios estruturados em PDF/Texto' },
            { title: 'Paisagens Sonoras HD Offline', desc: 'Ruído marrom, chuva, ondas e tons zen relaxantes' },
            { title: 'Privacidade Máxima com PIN', desc: 'Proteção biométrica e senha de acesso ao diário' }
          ].map((perk, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <div className="p-1 rounded-lg bg-teal-950 text-teal-300 shrink-0 mt-0.5 border border-teal-800">
                <Check className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-200">{perk.title}</h3>
                <p className="text-[11px] text-slate-400">{perk.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Action button */}
        <div className="pt-2 text-center space-y-3">
          {isActivated ? (
            <div className="p-4 rounded-2xl bg-teal-950/80 border border-teal-500 text-teal-200 text-xs font-medium flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-teal-400" />
              <span>Você é Membro Amparo Premium Ativo! Obrigado por apoiar o projeto.</span>
            </div>
          ) : (
            <>
              <button
                onClick={handleActivate}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-teal-600 via-teal-500 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-sm shadow-xl transition-all flex items-center justify-center gap-2 group"
              >
                <Zap className="w-4 h-4 text-amber-300 group-hover:scale-110 transition-transform" />
                <span>Ativar Amparo Premium (Grátis no Modo Beta)</span>
              </button>
              <p className="text-[11px] text-slate-400">
                Sem cobrança automática. Desenvolvido para o seu bem-estar com total privacidade.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
