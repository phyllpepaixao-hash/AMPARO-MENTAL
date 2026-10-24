import React, { useState } from 'react';
import { ShieldCheck, Download, Upload, Trash2, RefreshCw, Lock, AlertTriangle, Check, FileJson, Info } from 'lucide-react';
import { UserPreferences, MoodCheckIn, NextStepPlan, JournalEntry } from '../types';
import { StorageService } from '../services/storage';

interface PrivacyViewProps {
  preferences: UserPreferences;
  onUpdatePreferences: (prefs: UserPreferences) => void;
  checkIns: MoodCheckIn[];
  plans: NextStepPlan[];
  journalEntries: JournalEntry[];
  onDataReset: () => void;
  onReloadDemo: () => void;
  onDataImported?: () => void;
}

export const PrivacyView: React.FC<PrivacyViewProps> = ({
  preferences,
  onUpdatePreferences,
  checkIns,
  plans,
  journalEntries,
  onDataReset,
  onReloadDemo,
  onDataImported,
}) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleExportData = () => {
    const jsonString = StorageService.exportAllData();
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `entre_meus_dados_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = StorageService.importAllData(content);
        if (success) {
          setImportStatus('Dados restaurados com sucesso!');
          if (onDataImported) onDataImported();
          setTimeout(() => setImportStatus(null), 3500);
        } else {
          setImportStatus('Erro: O arquivo selecionado não contém um formato de backup válido.');
          setTimeout(() => setImportStatus(null), 4000);
        }
      }
    };
    reader.readAsText(file);
    // Reset file input value
    e.target.value = '';
  };

  const handleWipeAll = () => {
    StorageService.clearAllData();
    onDataReset();
    setShowConfirmDelete(false);
  };

  const toggleAIConsent = () => {
    onUpdatePreferences({
      ...preferences,
      consents: {
        ...preferences.consents,
        aiAssistanceAccepted: !preferences.consents.aiAssistanceAccepted,
      }
    });
  };

  const toggleReduceMotion = () => {
    onUpdatePreferences({
      ...preferences,
      reduceMotion: !preferences.reduceMotion,
    });
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div>
        <span className="text-xs font-mono uppercase text-teal-400 tracking-wider font-semibold">
          Transparência & LGPD
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight mt-1">
          Centro de Privacidade e Dados
        </h1>
        <p className="text-sm text-slate-400 mt-1 leading-relaxed">
          Seus sentimentos e pensamentos são confidenciais. Você tem controle total sobre o que é guardado, exportado ou apagado.
        </p>
      </div>

      {/* Local Storage Status Box */}
      <div className="p-4 rounded-2xl bg-teal-950/30 border border-teal-800/40 space-y-2">
        <div className="flex items-center gap-2 text-teal-300 font-semibold text-xs uppercase tracking-wider">
          <Lock className="w-4 h-4" />
          <span>Dados locais e transparência sobre a IA</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Check-ins, diário e planos são armazenados neste navegador. O histórico do chat também fica salvo localmente, mas, quando a IA está habilitada, as mensagens enviadas para receber uma resposta são encaminhadas ao servidor do aplicativo e podem ser processadas pelo provedor de IA. Não inclua informações que você não queira compartilhar com esse serviço. O armazenamento do navegador não é criptografia e pode ser acessado por alguém com acesso ao dispositivo ou ao perfil do navegador.
        </p>
        <div className="pt-2 flex flex-wrap gap-3 text-xs text-slate-400">
          <span>• Check-ins armazenados: <strong className="text-slate-200">{checkIns.length}</strong></span>
          <span>• Entradas no diário: <strong className="text-slate-200">{journalEntries.length}</strong></span>
          <span>• Planos de ação: <strong className="text-slate-200">{plans.length}</strong></span>
        </div>
      </div>

      {/* Data Management Actions */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
          Ações de Controle dos Seus Dados
        </h2>

        {importStatus && (
          <div className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center gap-2 animate-fadeIn ${
            importStatus.startsWith('Erro')
              ? 'bg-rose-950/60 border-rose-800 text-rose-200'
              : 'bg-emerald-950/60 border-emerald-800 text-emerald-200'
          }`}>
            <Check className="w-4 h-4 shrink-0" />
            <span>{importStatus}</span>
          </div>
        )}

        {/* Export JSON */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Download className="w-4 h-4 text-teal-400" />
              Exportar todos os meus dados (JSON)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Baixe uma cópia estruturada completa de todos os seus registros para guardar ou levar onde quiser.
            </p>
          </div>
          <button
            onClick={handleExportData}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 font-semibold text-xs flex items-center gap-1.5 transition-colors shrink-0"
          >
            {downloadSuccess ? <Check className="w-4 h-4 text-teal-400" /> : <FileJson className="w-4 h-4" />}
            <span>{downloadSuccess ? 'Baixado!' : 'Exportar'}</span>
          </button>
        </div>

        {/* Import JSON */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Upload className="w-4 h-4 text-emerald-400" />
              Restaurar Backup (JSON)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Recupere seus check-ins, passos e diário a partir de um arquivo JSON salvo anteriormente.
            </p>
          </div>
          <label className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 font-semibold text-xs flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer">
            <Upload className="w-4 h-4 text-emerald-400" />
            <span>Restaurar</span>
            <input
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleFileImport}
            />
          </label>
        </div>

        {/* Reload Demo Data (for Evaluators) */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-indigo-400" />
              Carregar dados fictícios de demonstração
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Popula o app com exemplos de check-ins, passos e diário para avaliar a experiência sem precisar digitar tudo.
            </p>
          </div>
          <button
            onClick={onReloadDemo}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 font-semibold text-xs transition-colors shrink-0"
          >
            Carregar
          </button>
        </div>

        {/* Erase All Data */}
        <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-900/40 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-rose-200 flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-rose-400" />
              Apagar todos os meus dados agora
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Remove instantaneamente todo o histórico, preferências e check-ins deste navegador. Irreversível.
            </p>
          </div>
          <button
            onClick={() => setShowConfirmDelete(true)}
            className="px-3.5 py-2 rounded-xl bg-rose-900/60 hover:bg-rose-900 text-rose-200 font-semibold text-xs transition-colors shrink-0"
          >
            Apagar tudo
          </button>
        </div>
      </div>

      {/* Granular Consent Toggles */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
          Consentimentos e Preferências de Acessibilidade
        </h2>

        <div className="space-y-3 text-xs">
          {/* AI Assistance Toggle */}
          <div className="flex items-center justify-between gap-3 py-1">
            <div>
              <p className="font-semibold text-slate-200">
                Uso da Assistência de Escuta por IA
              </p>
              <p className="text-slate-400 text-[11px]">
                Permite que a IA gere reflexões e sugestões de pequenos passos no chat.
              </p>
            </div>
            <button
              onClick={toggleAIConsent}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                preferences.consents.aiAssistanceAccepted
                  ? 'bg-teal-900/60 text-teal-300 border border-teal-700'
                  : 'bg-slate-800 text-slate-500'
              }`}
            >
              {preferences.consents.aiAssistanceAccepted ? 'Ativado' : 'Desativado'}
            </button>
          </div>

          {/* Reduce motion */}
          <div className="flex items-center justify-between gap-3 py-1 border-t border-slate-800">
            <div>
              <p className="font-semibold text-slate-200">
                Reduzir Movimentos e Animações
              </p>
              <p className="text-slate-400 text-[11px]">
                Desativa efeitos pulsantes e transições rápidas para maior conforto vestibular.
              </p>
            </div>
            <button
              onClick={toggleReduceMotion}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                preferences.reduceMotion
                  ? 'bg-teal-900/60 text-teal-300 border border-teal-700'
                  : 'bg-slate-800 text-slate-500'
              }`}
            >
              {preferences.reduceMotion ? 'Ativado' : 'Desativado'}
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Delete */}
      {showConfirmDelete && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0F1722] border border-rose-900/80 rounded-2xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-300">
              <AlertTriangle className="w-6 h-6 text-rose-400" />
              <h3 className="font-bold text-base text-rose-100">
                Confirmar exclusão definitiva
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Você tem certeza? Isso apagará todos os seus registros de check-in, anotações do diário e planos salvos no seu aparelho. Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
              >
                Cancelar
              </button>
              <button
                onClick={handleWipeAll}
                className="px-4 py-2 rounded-xl bg-rose-700 hover:bg-rose-600 text-white text-xs font-bold shadow-md shadow-rose-950"
              >
                Sim, apagar tudo agora
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
