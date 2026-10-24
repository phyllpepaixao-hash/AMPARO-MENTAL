import React, { useState } from 'react';
import { ShieldCheck, Heart, ArrowRight, Check, AlertTriangle, Compass, Sparkles } from 'lucide-react';
import { UserPreferences } from '../types';

interface OnboardingViewProps {
  onComplete: (prefs: UserPreferences) => void;
  initialPreferences: UserPreferences;
}

export const OnboardingView: React.FC<OnboardingViewProps> = ({
  onComplete,
  initialPreferences,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [name, setName] = useState(initialPreferences.name);
  const [country, setCountry] = useState<'BR' | 'PT' | 'OTHER'>(initialPreferences.selectedCountry || 'BR');
  const [allowBreathing, setAllowBreathing] = useState(initialPreferences.allowBreathingExercises);
  
  // Granular separate consents (Requirement 5 & 6)
  const [consentTerms, setConsentTerms] = useState(false);
  const [consentStorage, setConsentStorage] = useState(false);
  const [consentAI, setConsentAI] = useState(false);

  const handleFinish = () => {
    const updated: UserPreferences = {
      ...initialPreferences,
      name: name.trim(),
      selectedCountry: country,
      allowBreathingExercises: allowBreathing,
      onboardingCompleted: true,
      consents: {
        termsAndLimits: consentTerms,
        localStorageOnly: consentStorage,
        aiAssistanceAccepted: consentAI,
      },
      consentedAt: new Date().toISOString(),
    };
    onComplete(updated);
  };

  return (
    <div className="min-h-screen bg-[#0B131A] text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6">
      <div className="w-full max-w-lg bg-[#0F1722] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Progress indicator */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-400/30 via-teal-600/30 to-indigo-600/30 border border-teal-500/50 flex items-center justify-center text-teal-200 font-bold text-base font-serif shadow-sm">
              A
            </div>
            <span className="font-bold text-slate-100 text-sm font-serif tracking-tight">Amparo</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span>Passo {step} de 3</span>
            <div className="flex gap-1 ml-1">
              <span className={`w-2 h-2 rounded-full ${step >= 1 ? 'bg-teal-400' : 'bg-slate-700'}`} />
              <span className={`w-2 h-2 rounded-full ${step >= 2 ? 'bg-teal-400' : 'bg-slate-700'}`} />
              <span className={`w-2 h-2 rounded-full ${step >= 3 ? 'bg-teal-400' : 'bg-slate-700'}`} />
            </div>
          </div>
        </div>

        {/* STEP 1: Purpose & Welcome */}
        {step === 1 && (
          <div className="space-y-5 animate-fadeIn">
            <div>
              <span className="text-xs uppercase font-mono tracking-wider text-teal-400 font-semibold">
                Bem-vindo(a) ao Amparo
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 mt-1 font-serif">
                Não passe por tudo sozinho.
              </h1>
              <p className="text-slate-300 text-sm mt-2 leading-relaxed font-sans">
                Você não precisa carregar todo o peso em silêncio. Este espaço oferece acolhimento no momento presente, ferramentas de clareza e um próximo passo seguro, no seu ritmo.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-3">
                <Compass className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-200 uppercase">Acolhimento sem cobranças</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Sem metas punitivas, sem sequências de dias ou cobranças para estar sempre bem.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-3">
                <Heart className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-200 uppercase">Apoio para agora</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Atividades de 1 a 3 minutos para se acalmar, desabafar com privacidade ou planejar 1 micro-ação.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full mt-4 py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-teal-950/40"
            >
              <span>Conhecer os limites do app</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: Clear Clinical Limits (Requirement 2) */}
        {step === 2 && (
          <div className="space-y-5 animate-fadeIn">
            <div>
              <span className="text-xs uppercase font-mono tracking-wider text-amber-400 font-semibold">
                Transparência e Cuidados
              </span>
              <h2 className="text-xl font-bold text-slate-100 mt-1">
                O que o Entre é — e o que ele não é
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm mt-1.5 leading-relaxed">
                Para a sua segurança, é fundamental que saiba exatamente os limites deste serviço:
              </p>
            </div>

            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-900/50 space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p>
                  <strong>Não é tratamento médico nem psicoterapia:</strong> O Entre é uma ferramenta de apoio ao bem-estar e psicoeducação. Não substitui consultas com profissionais de saúde mental.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p>
                  <strong>Não faz diagnósticos nem receita remédios:</strong> Nenhuma conversa aqui serve como laudo médico ou orientação para alterar medicações.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p>
                  <strong>Não é pronto-socorro para emergências agudas:</strong> Se houver risco imediato à vida, oferecemos botões de emergência para ligação direta ao <strong>188 (CVV)</strong> ou <strong>192 (SAMU)</strong>.
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setStep(1)}
                className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
              >
                Voltar
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all"
              >
                <span>Entendi e quero personalizar</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Consents & Preferences */}
        {step === 3 && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <span className="text-xs uppercase font-mono tracking-wider text-teal-400 font-semibold">
                Preferências & Privacidade
              </span>
              <h2 className="text-xl font-bold text-slate-100 mt-1">
                Como prefere sua experiência?
              </h2>
            </div>

            {/* Optional name */}
            <div className="space-y-1.5">
              <label htmlFor="user-name" className="text-xs font-medium text-slate-300 flex items-center justify-between">
                <span>Como podemos te chamar? (Opcional)</span>
                <span className="text-[11px] text-slate-500">Pode deixar em branco</span>
              </label>
              <input
                id="user-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex.: Alex ou só um apelido"
                className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>

            {/* Country for crisis hotlines */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">
                País para linhas de crise e apoio gratuitas:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setCountry('BR')}
                  className={`py-1.5 px-2 text-xs rounded-lg border transition-all ${
                    country === 'BR'
                      ? 'bg-teal-950 border-teal-500 text-teal-200 font-medium'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  🇧🇷 Brasil (188)
                </button>
                <button
                  type="button"
                  onClick={() => setCountry('PT')}
                  className={`py-1.5 px-2 text-xs rounded-lg border transition-all ${
                    country === 'PT'
                      ? 'bg-teal-950 border-teal-500 text-teal-200 font-medium'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  🇵🇹 Portugal (SNS 24)
                </button>
                <button
                  type="button"
                  onClick={() => setCountry('OTHER')}
                  className={`py-1.5 px-2 text-xs rounded-lg border transition-all ${
                    country === 'OTHER'
                      ? 'bg-teal-950 border-teal-500 text-teal-200 font-medium'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  🌍 Outro País
                </button>
              </div>
            </div>

            {/* Breathing sensitivity toggle */}
            <div className="p-3 rounded-lg bg-slate-900/70 border border-slate-800 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-slate-200">
                  Exercícios de respiração
                </p>
                <p className="text-[11px] text-slate-400">
                  Algumas pessoas sentem ansiedade com foco na respiração. Se for seu caso, priorizamos grounding sensorial.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAllowBreathing(!allowBreathing)}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  allowBreathing ? 'bg-teal-900/60 text-teal-300 border border-teal-700' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {allowBreathing ? 'Permitir' : 'Evitar'}
              </button>
            </div>

            {/* Granular Consents (Requirement 5) */}
            <div className="space-y-2 pt-1 border-t border-slate-800">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={consentTerms}
                  onChange={(e) => setConsentTerms(e.target.checked)}
                  className="mt-0.5 rounded border-slate-700 text-teal-500 focus:ring-teal-500 bg-slate-900"
                />
                <span>
                  Compreendo os <strong>limites e propósitos</strong> do app (não é médico, não diagnostica e não substitui psicoterapia).
                </span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={consentStorage}
                  onChange={(e) => setConsentStorage(e.target.checked)}
                  className="mt-0.5 rounded border-slate-700 text-teal-500 focus:ring-teal-500 bg-slate-900"
                />
                <span>
                  Concordo em salvar meus check-ins e diário <strong>apenas localmente</strong> neste navegador, com liberdade para exportar ou apagar tudo quando desejar.
                </span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={consentAI}
                  onChange={(e) => setConsentAI(e.target.checked)}
                  className="mt-0.5 rounded border-slate-700 text-teal-500 focus:ring-teal-500 bg-slate-900"
                />
                <span>
                  Autorizo o uso da <strong>assistência de escuta por IA</strong> para apoio reflexivo e sugestões de pequenos passos.
                </span>
              </label>
            </div>

            {/* Finish Button */}
            <div className="flex gap-3 pt-3">
              <button
                onClick={() => setStep(2)}
                className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
              >
                Voltar
              </button>
              <button
                onClick={handleFinish}
                disabled={!consentTerms || !consentStorage}
                className={`flex-1 py-2.5 px-4 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-all ${
                  consentTerms && consentStorage
                    ? 'bg-teal-600 hover:bg-teal-500 text-white shadow-md shadow-teal-950/40'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <Check className="w-4 h-4" />
                <span>Começar a usar o Entre</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
