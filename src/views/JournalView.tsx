import React, { useState } from 'react';
import { BookOpen, Plus, Trash2, Edit3, Lock, Unlock, Sparkles, Search, Check, X, Calendar, Copy, ShieldCheck } from 'lucide-react';
import { JournalEntry } from '../types';
import { AmbientSound } from '../services/soundService';

interface JournalViewProps {
  entries: JournalEntry[];
  onSaveEntry: (entry: JournalEntry) => void;
  onDeleteEntry: (id: string) => void;
  pinLockEnabled?: boolean;
  pinCode?: string | null;
}

const INSPIRATIONAL_PROMPTS = [
  'O que está pesando hoje?',
  'Do que meu corpo e mente precisam agora?',
  'O que foi um pequeno momento de alívio hoje?',
  'Se eu não precisasse agradar ninguém, o que eu faria agora?',
  'Quais são 3 coisas que posso deixar para amanhã sem culpa?',
];

export const JournalView: React.FC<JournalViewProps> = ({
  entries,
  onSaveEntry,
  onDeleteEntry,
  pinLockEnabled = false,
  pinCode = null,
}) => {
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    if (!pinLockEnabled) return true;
    return sessionStorage.getItem('entre_journal_unlocked_session') === 'true';
  });
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  const [isWriting, setIsWriting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState<string | undefined>(undefined);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleUnlockPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === pinCode || !pinCode) {
      setIsUnlocked(true);
      sessionStorage.setItem('entre_journal_unlocked_session', 'true');
      setPinError(false);
      AmbientSound.playGentleChime();
    } else {
      setPinError(true);
      setPinInput('');
    }
  };

  const handleLockJournal = () => {
    setIsUnlocked(false);
    sessionStorage.removeItem('entre_journal_unlocked_session');
    setPinInput('');
  };

  const handleStartNew = (prompt?: string) => {
    setEditingId(null);
    setTitle('');
    setContent('');
    setSelectedPrompt(prompt);
    setTags(prompt ? ['Reflexão Guiada'] : []);
    setIsWriting(true);
  };

  const handleEdit = (entry: JournalEntry) => {
    setEditingId(entry.id);
    setTitle(entry.title);
    setContent(entry.content);
    setSelectedPrompt(entry.promptUsed);
    setTags(entry.tags || []);
    setIsWriting(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const today = new Date().toISOString().split('T')[0];
    const newEntry: JournalEntry = {
      id: editingId || `journal-${Date.now()}`,
      timestamp: new Date().toISOString(),
      date: today,
      title: title.trim() || (selectedPrompt ? selectedPrompt : 'Reflexão livre'),
      promptUsed: selectedPrompt,
      content: content.trim(),
      tags: tags.length > 0 ? tags : undefined,
    };

    onSaveEntry(newEntry);
    AmbientSound.playGentleChime();
    setIsWriting(false);
    setEditingId(null);
    setTitle('');
    setContent('');
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleCopyEntry = (entry: JournalEntry) => {
    const text = `${entry.title}\n${entry.date}\n\n${entry.content}`;
    navigator.clipboard.writeText(text);
    setCopiedId(entry.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // If locked by PIN
  if (pinLockEnabled && !isUnlocked) {
    return (
      <div className="max-w-md mx-auto py-12 px-4 space-y-6 text-center animate-fadeIn">
        <div className="w-16 h-16 rounded-3xl bg-indigo-950/60 border border-indigo-700/60 flex items-center justify-center text-indigo-300 mx-auto shadow-xl">
          <Lock className="w-8 h-8" />
        </div>

        <div className="space-y-1.5">
          <h2 className="text-xl font-bold text-slate-100 font-serif">
            Diário Protegido por PIN
          </h2>
          <p className="text-xs text-slate-400">
            Digite o código de 4 dígitos configurado para desbloquear suas anotações confidenciais.
          </p>
        </div>

        <form onSubmit={handleUnlockPin} className="space-y-3 max-w-xs mx-auto">
          <input
            type="password"
            maxLength={4}
            pattern="[0-9]*"
            inputMode="numeric"
            autoFocus
            value={pinInput}
            onChange={(e) => {
              setPinError(false);
              setPinInput(e.target.value.replace(/\D/g, ''));
            }}
            placeholder="••••"
            className="w-full text-center tracking-[1em] text-2xl font-mono py-3 rounded-2xl bg-slate-950 border border-slate-800 text-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />

          {pinError && (
            <p className="text-xs text-rose-400 font-semibold animate-shake">
              Código PIN incorreto. Tente novamente.
            </p>
          )}

          <button
            type="submit"
            disabled={pinInput.length !== 4}
            className={`w-full py-2.5 rounded-2xl font-bold text-xs transition-all ${
              pinInput.length === 4
                ? 'bg-teal-600 hover:bg-teal-500 text-white shadow-md shadow-teal-950'
                : 'bg-slate-900 text-slate-600 cursor-not-allowed'
            }`}
          >
            Desbloquear Diário
          </button>
        </form>
      </div>
    );
  }

  const filteredEntries = entries.filter(e => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      e.title.toLowerCase().includes(q) ||
      e.content.toLowerCase().includes(q) ||
      e.tags?.some(t => t.toLowerCase().includes(q))
    );
  });

  return (
    <div className="max-w-xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-mono uppercase text-teal-400 font-semibold">
            <Lock className="w-3.5 h-3.5" />
            <span>Armazenado neste dispositivo</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight mt-0.5 font-serif">
            Diário e Histórico
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
            Suas anotações são guardadas neste navegador e não são enviadas ao serviço de IA. O armazenamento local não equivale a criptografia: proteja o acesso ao seu dispositivo.
          </p>
        </div>
        {!isWriting && (
          <div className="flex items-center gap-2 shrink-0">
            {pinLockEnabled && (
              <button
                onClick={handleLockJournal}
                title="Bloquear diário com PIN agora"
                className="p-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-indigo-300 border border-slate-800 transition-colors flex items-center gap-1.5 text-xs font-semibold"
              >
                <Lock className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Bloquear</span>
              </button>
            )}
            <button
              onClick={() => handleStartNew()}
              className="px-4 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-sm shadow-teal-950"
            >
              <Plus className="w-4 h-4" />
              <span>Escrever</span>
            </button>
          </div>
        )}
      </div>

      {/* Writing / Editing Form */}
      {isWriting ? (
        <form onSubmit={handleSave} className="p-5 sm:p-6 rounded-3xl bg-[#0F1722] border border-teal-800/40 shadow-2xl space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-teal-200 font-serif">
              {editingId ? 'Editar registro' : 'Nova reflexão no diário'}
            </h2>
            <button
              type="button"
              onClick={() => setIsWriting(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Cancelar
            </button>
          </div>

          {selectedPrompt && (
            <div className="p-3.5 rounded-2xl bg-teal-950/40 border border-teal-900/60 text-xs text-teal-200 font-serif italic">
              <span className="font-semibold block mb-0.5 font-sans not-italic text-[11px] uppercase tracking-wider text-teal-400">
                Pergunta reflexiva:
              </span>
              <span>"{selectedPrompt}"</span>
            </div>
          )}

          <div className="space-y-1">
            <label htmlFor="journal-title" className="text-xs font-semibold text-slate-300">
              Título (Opcional)
            </label>
            <input
              id="journal-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex.: Uma tarde de pausa, pensamentos de hoje..."
              className="w-full text-xs sm:text-sm px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="journal-content" className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>Seus pensamentos livres</span>
              <span className="text-[10px] text-slate-500 font-mono">Sem julgamentos</span>
            </label>
            <textarea
              id="journal-content"
              required
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Escreva livremente o que estiver passando por você agora..."
              className="w-full text-xs sm:text-sm p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-teal-500 resize-y leading-relaxed font-sans"
            />
          </div>

          {/* Tags */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Tags / Rótulos pessoais (Opcional)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Ex.: Trabalho, Pausa, Ansiedade..."
                className="flex-1 text-xs px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3.5 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold hover:bg-slate-700"
              >
                Adicionar
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300"
                  >
                    #{t}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(t)}
                      className="text-slate-500 hover:text-rose-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsWriting(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-sm shadow-teal-950"
            >
              <Check className="w-4 h-4" />
              <span>Salvar no diário</span>
            </button>
          </div>
        </form>
      ) : (
        /* Inspirational Prompts */
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>Perguntas para destravar a escrita:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {INSPIRATIONAL_PROMPTS.slice(0, 4).map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleStartNew(prompt)}
                className="p-3.5 text-left rounded-2xl bg-[#0D151F] border border-slate-800 hover:border-teal-500/60 transition-all text-xs text-slate-300 hover:text-teal-200 font-serif leading-relaxed"
              >
                "{prompt}"
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Entries List & Search */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Seus Registros ({filteredEntries.length})
          </h2>
          {entries.length > 2 && (
            <div className="relative w-48">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar palavra..."
                className="w-full text-xs pl-8 pr-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
          )}
        </div>

        {filteredEntries.length === 0 ? (
          <div className="p-8 text-center rounded-3xl bg-slate-900/40 border border-slate-800/80 space-y-2">
            <BookOpen className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-xs sm:text-sm text-slate-400">
              Nenhuma anotação encontrada no seu diário.
            </p>
            <button
              onClick={() => handleStartNew()}
              className="text-xs text-teal-400 hover:text-teal-300 underline underline-offset-2 font-medium"
            >
              Começar uma primeira reflexão agora
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredEntries.map((entry) => (
              <div
                key={entry.id}
                className="p-5 rounded-3xl bg-[#0D151F] border border-slate-800 hover:border-slate-700 transition-all space-y-2.5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-100 font-serif">
                      {entry.title}
                    </h3>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5 font-mono">
                      <Calendar className="w-3 h-3" />
                      <span>{entry.date}</span>
                      {entry.promptUsed && <span>• Reflexão guiada</span>}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleCopyEntry(entry)}
                      className="p-1.5 text-slate-500 hover:text-slate-300 transition-colors rounded-lg hover:bg-slate-800"
                      title="Copiar texto do diário"
                    >
                      {copiedId === entry.id ? <Check className="w-3.5 h-3.5 text-teal-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => handleEdit(entry)}
                      className="p-1.5 text-slate-500 hover:text-slate-300 transition-colors rounded-lg hover:bg-slate-800"
                      title="Editar anotação"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteEntry(entry.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors rounded-lg hover:bg-slate-800"
                      title="Excluir anotação"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-wrap font-sans">
                  {entry.content}
                </p>

                {entry.tags && entry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1.5 border-t border-slate-800/80">
                    {entry.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-teal-300 font-medium"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
