import React, { useState } from 'react';
import { X, Phone, AlertTriangle, ShieldCheck, Heart, Send, Copy, Check, ExternalLink } from 'lucide-react';
import { VERIFIED_CRISIS_CONTACTS, TRUSTED_MESSAGE_TEMPLATES } from '../services/crisisData';
import { UserPreferences } from '../types';

interface CrisisModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: UserPreferences;
  onUpdateCountry: (country: 'BR' | 'PT' | 'OTHER') => void;
}

export const CrisisModal: React.FC<CrisisModalProps> = ({
  isOpen,
  onClose,
  preferences,
  onUpdateCountry,
}) => {
  const [selectedCountry, setSelectedCountry] = useState<'BR' | 'PT' | 'OTHER'>(preferences.selectedCountry);
  const [selectedTemplate, setSelectedTemplate] = useState(TRUSTED_MESSAGE_TEMPLATES[0].id);
  const [customMessage, setCustomMessage] = useState(TRUSTED_MESSAGE_TEMPLATES[0].text);
  const [copied, setCopied] = useState(false);
  const [safetyCheckAnswer, setSafetyCheckAnswer] = useState<'safe' | 'unsafe' | null>(null);

  if (!isOpen) return null;

  const contacts = VERIFIED_CRISIS_CONTACTS.filter(c => c.country === selectedCountry);

  const handleCountryChange = (country: 'BR' | 'PT' | 'OTHER') => {
    setSelectedCountry(country);
    onUpdateCountry(country);
  };

  const handleTemplateSelect = (id: string) => {
    setSelectedTemplate(id);
    const tmpl = TRUSTED_MESSAGE_TEMPLATES.find(t => t.id === id);
    if (tmpl) setCustomMessage(tmpl.text);
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(customMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsAppSend = () => {
    const encoded = encodeURIComponent(customMessage);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="crisis-title"
        className="relative w-full max-w-2xl bg-[#0F1722] border border-rose-900/60 rounded-2xl shadow-2xl overflow-hidden my-4 max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-rose-950/70 via-slate-900 to-[#0F1722] border-b border-rose-900/40 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-900/40 text-rose-300 border border-rose-700/50">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h2 id="crisis-title" className="text-lg sm:text-xl font-bold text-rose-100">
                Apoio em Crise & Recursos de Segurança
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                Você não precisa passar por isso sozinho(a). A ajuda humana está disponível.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar recursos de crise"
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-200">
          {/* Gentle Safety Question (Clinical Guideline Requirement) */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
            <p className="text-sm font-medium text-slate-200">
              Podemos checar sua segurança agora com calma:
            </p>
            <p className="text-sm text-slate-300">
              Você está em perigo físico imediato ou sente que consegue se manter em segurança neste momento?
            </p>
            <div className="flex flex-wrap gap-2.5 pt-1">
              <button
                onClick={() => setSafetyCheckAnswer('unsafe')}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                  safetyCheckAnswer === 'unsafe'
                    ? 'bg-rose-700 text-white ring-2 ring-rose-400'
                    : 'bg-rose-950/80 border border-rose-800 text-rose-200 hover:bg-rose-900/70'
                }`}
              >
                <AlertTriangle className="w-4 h-4 text-rose-300" />
                Estou em perigo imediato ou com medo
              </button>
              <button
                onClick={() => setSafetyCheckAnswer('safe')}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                  safetyCheckAnswer === 'safe'
                    ? 'bg-teal-700 text-white ring-2 ring-teal-400'
                    : 'bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-teal-300" />
                Consigo me manter em segurança agora
              </button>
            </div>

            {safetyCheckAnswer === 'unsafe' && (
              <div className="p-3.5 rounded-lg bg-rose-950/60 border border-rose-600/70 text-rose-100 text-xs sm:text-sm space-y-1.5 animate-fadeIn">
                <p className="font-semibold text-rose-200">
                  Por favor, procure socorro humano imediatamente:
                </p>
                <p>
                  Ligue agora para a emergência (<strong>192 - SAMU</strong> ou <strong>193 - Bombeiros</strong> no Brasil; <strong>112</strong> em Portugal) ou dirija-se à Unidade de Pronto Atendimento (UPA) mais próxima.
                </p>
              </div>
            )}

            {safetyCheckAnswer === 'safe' && (
              <div className="p-3.5 rounded-lg bg-teal-950/40 border border-teal-800/60 text-teal-100 text-xs sm:text-sm space-y-1 animate-fadeIn">
                <p className="font-semibold text-teal-200">
                  Ficamos aliviados por você estar em segurança neste instante.
                </p>
                <p>
                  Você pode usar os contatos abaixo para conversar com alguém treinado para acolher ou usar a mensagem preparada para falar com uma pessoa próxima.
                </p>
              </div>
            )}
          </div>

          {/* Country Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="country-select" className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Selecione seu país / região:
              </label>
              <span className="text-[11px] text-teal-400">Linhas Gratuitas e Verificadas</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleCountryChange('BR')}
                className={`py-2 px-3 rounded-lg text-xs font-medium border text-center transition-all ${
                  selectedCountry === 'BR'
                    ? 'bg-teal-950/80 border-teal-500 text-teal-200'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                🇧🇷 Brasil
              </button>
              <button
                onClick={() => handleCountryChange('PT')}
                className={`py-2 px-3 rounded-lg text-xs font-medium border text-center transition-all ${
                  selectedCountry === 'PT'
                    ? 'bg-teal-950/80 border-teal-500 text-teal-200'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                🇵🇹 Portugal
              </button>
              <button
                onClick={() => handleCountryChange('OTHER')}
                className={`py-2 px-3 rounded-lg text-xs font-medium border text-center transition-all ${
                  selectedCountry === 'OTHER'
                    ? 'bg-teal-950/80 border-teal-500 text-teal-200'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                🌍 Outro / Global
              </button>
            </div>
          </div>

          {/* Verified Crisis Contacts List */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Phone className="w-4 h-4 text-rose-400" />
              Contatos Oficiais e Telefones de Emergência:
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {contacts.map((contact) => (
                <div 
                  key={contact.id}
                  className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-bold text-slate-100 leading-snug">
                        {contact.name}
                      </h4>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 whitespace-nowrap">
                        {contact.hours}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                      {contact.description}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between gap-2">
                    <div className="text-[10px] text-slate-500 truncate" title={`Fonte: ${contact.verifiedSource}`}>
                      Verificado: {contact.verifiedDate}
                    </div>

                    {contact.callUrl.startsWith('tel:') ? (
                      <a
                        href={contact.callUrl}
                        className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        Ligar {contact.number}
                      </a>
                    ) : (
                      <a
                        href={contact.callUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-300 font-semibold text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Acessar site
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Prepare message for trusted friend or family (Requirement 5) */}
          <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-900/40 space-y-3">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-semibold text-indigo-200">
                Preparar mensagem para uma pessoa de confiança
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              Às vezes faltam palavras. Escolha um modelo e edite se quiser. O envio é 100% voluntário e feito pelo seu próprio aplicativo.
            </p>

            <div className="flex flex-wrap gap-1.5">
              {TRUSTED_MESSAGE_TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.id}
                  onClick={() => handleTemplateSelect(tmpl.id)}
                  className={`px-2.5 py-1 rounded-md text-xs transition-all ${
                    selectedTemplate === tmpl.id
                      ? 'bg-indigo-700 text-white font-medium'
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  {tmpl.title}
                </button>
              ))}
            </div>

            <textarea
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              rows={3}
              className="w-full text-xs sm:text-sm p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
              placeholder="Edite a mensagem antes de enviar..."
            />

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <span className="text-[11px] text-slate-500">
                Nenhum dado é salvo ou enviado sem a sua ação direta.
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyMessage}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-teal-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copiado!' : 'Copiar texto'}
                </button>
                <button
                  onClick={handleWhatsAppSend}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  Enviar no WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Este serviço de apoio é 100% gratuito e não exige login.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors"
          >
            Voltar ao aplicativo
          </button>
        </div>
      </div>
    </div>
  );
};
