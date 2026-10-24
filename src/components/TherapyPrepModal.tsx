import React, { useState } from 'react';
import { FileText, Copy, Check, X, Sparkles, Heart, Activity, Printer, MessageSquare } from 'lucide-react';
import { MoodCheckIn, JournalEntry, UserPreferences } from '../types';
import { AmbientSound } from '../services/soundService';

interface TherapyPrepModalProps {
  isOpen: boolean;
  onClose: () => void;
  checkIns: MoodCheckIn[];
  journalEntries: JournalEntry[];
  preferences: UserPreferences;
}

export const TherapyPrepModal: React.FC<TherapyPrepModalProps> = ({
  isOpen,
  onClose,
  checkIns,
  journalEntries,
  preferences,
}) => {
  const [hardestMoment, setHardestMoment] = useState('');
  const [medQuestions, setMedQuestions] = useState('');
  const [goalForSession, setGoalForSession] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Aggregate symptoms and feelings from checkins
  const recentCheckIns = checkIns.slice(0, 7);
  const feelingsSummary = recentCheckIns.map(c => c.feeling).join(', ') || 'Nenhum check-in recente';
  const allSensations = Array.from(new Set(recentCheckIns.flatMap(c => c.bodySensations)));

  const generateReportText = () => {
    const today = new Date().toLocaleDateString('pt-BR');
    const name = preferences.name ? `${preferences.name}` : 'Paciente / Usuário';

    return `📋 RESUMO DE APOIO PARA CONSULTA (TERAPIA / MÉDICO)
Data: ${today}
Nome: ${name}

1. SINAIS E SENSAÇÕES OBSERVADAS NA SEMANA:
- Estados emocionais mais presentes: ${feelingsSummary}
- Sintomas físicos percebidos no corpo: ${allSensations.length > 0 ? allSensations.join(', ') : 'Nenhum sintoma corporal marcante anotado'}

2. PRINCIPAL SOBRECARGA OU MOMENTO DIFÍCIL:
${hardestMoment.trim() || 'Não especificado previamente'}

3. DÚVIDAS / PONTOS PARA CONVERSAR SOBRE MEDICAÇÃO OU ROTINA:
${medQuestions.trim() || 'Nenhuma dúvida prévia registrada'}

4. O QUE GOSTARIA DE PRIORIZAR NESTA SESSÃO:
${goalForSession.trim() || 'Apenas escuta e acolhimento dos sentimentos'}

---
Gerado voluntariamente pelo app Entre. Este resumo foi preparado exclusivamente pela própria pessoa para apoiar sua conversa com profissional de saúde.`;
  };

  const handleCopy = () => {
    const text = generateReportText();
    navigator.clipboard.writeText(text);
    setCopied(true);
    AmbientSound.playGentleChime();
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsAppSend = () => {
    const text = generateReportText();
    const encoded = encodeURIComponent(text);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="prep-title"
        className="relative w-full max-w-2xl bg-[#0F1722] border border-teal-800/50 rounded-3xl shadow-2xl overflow-hidden my-4 max-h-[92vh] flex flex-col animate-fadeIn"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-teal-950/50 via-slate-900 to-[#101924] border-b border-slate-800 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-950/80 border border-teal-700/60 flex items-center justify-center text-teal-300 shadow-md">
              <FileText className="w-5 h-5 text-teal-300" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-teal-400 font-semibold tracking-wider">
                Apoio Clínico Externo
              </span>
              <h2 id="prep-title" className="text-lg font-bold text-slate-100 font-serif">
                Preparação para Consulta ou Terapia
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Fechar preparação de consulta"
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 text-xs sm:text-sm text-slate-200">
          <p className="text-xs text-slate-400 leading-relaxed">
            Muitas vezes chegamos na terapia ou no médico e esquecemos os sintomas ou o que realmente doeu na semana. Esta ferramenta organiza seus registros para que você possa falar com clareza e sem pressão.
          </p>

          {/* Aggregated recent insights */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-teal-300 font-mono uppercase tracking-wider block">
              Dados já consolidados dos seus check-ins:
            </span>
            <div className="text-xs text-slate-300 space-y-1">
              <p>• <strong>Check-ins recentes analisados:</strong> {recentCheckIns.length} registros</p>
              <p>• <strong>Sensações corporais recorrentes:</strong> {allSensations.length > 0 ? allSensations.join(', ') : 'Nenhuma anotada'}</p>
            </div>
          </div>

          {/* Form inputs */}
          <div className="space-y-3.5">
            <div className="space-y-1">
              <label htmlFor="prep-hardest" className="text-xs font-semibold text-slate-300 font-mono">
                1. O que foi mais difícil ou pesado nos últimos dias?
              </label>
              <textarea
                id="prep-hardest"
                rows={2}
                value={hardestMoment}
                onChange={(e) => setHardestMoment(e.target.value)}
                placeholder="Ex.: Uma discussão em família, insônia na quarta-feira, crise de choro no trabalho..."
                className="w-full text-xs sm:text-sm p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-teal-500 resize-none font-sans"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="prep-meds" className="text-xs font-semibold text-slate-300 font-mono">
                2. Dúvidas sobre medicação, efeitos colaterais ou rotina:
              </label>
              <input
                id="prep-meds"
                type="text"
                value={medQuestions}
                onChange={(e) => setMedQuestions(e.target.value)}
                placeholder="Ex.: Estou sentindo muita sonolência matinal, posso tomar em outro horário?"
                className="w-full text-xs sm:text-sm px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-teal-500 font-sans"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="prep-goal" className="text-xs font-semibold text-slate-300 font-mono">
                3. O que você gostaria de priorizar nesta sessão?
              </label>
              <input
                id="prep-goal"
                type="text"
                value={goalForSession}
                onChange={(e) => setGoalForSession(e.target.value)}
                placeholder="Ex.: Falar sobre meu cansaço com o trabalho sem medo de chorar"
                className="w-full text-xs sm:text-sm px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-teal-500 font-sans"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="p-4 rounded-2xl bg-teal-950/30 border border-teal-800/40 space-y-2.5">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="font-semibold text-teal-200">Pronto para levar à consulta:</span>
              <span className="text-[11px] text-slate-400">Compartilhamento 100% voluntário</span>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                onClick={handleCopy}
                className="flex-1 py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-teal-950"
              >
                {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Resumo Copiado!' : 'Copiar Resumo Formatado'}</span>
              </button>

              <button
                onClick={handleWhatsAppSend}
                className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <MessageSquare className="w-4 h-4" />
                <span className="hidden sm:inline">WhatsApp</span>
              </button>
            </div>
          </div>
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
