import React, { useState } from 'react';
import { BookOpen, Search, Clock, ArrowRight, ShieldCheck, X, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { PSYCHOEDUCATION_ARTICLES } from '../services/articlesData';
import { PsychoEducationArticle } from '../types';

export const LibraryView: React.FC = () => {
  const [selectedArticle, setSelectedArticle] = useState<PsychoEducationArticle | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isSpeaking, setIsSpeaking] = useState(false);

  const categories = ['all', 'Ansiedade & Estresse', 'Autocompaixão', 'Relações & Ajuda', 'Rotina Possível'];

  const filteredArticles = PSYCHOEDUCATION_ARTICLES.filter(art => {
    const matchesCat = selectedCategory === 'all' || art.category === selectedCategory;
    const matchesQuery = !searchQuery || 
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const handleToggleSpeakArticle = (article: PsychoEducationArticle) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }
      window.speechSynthesis.cancel();
      const textToRead = `${article.title}. ${article.subtitle}. ${article.paragraphs.join('. ')}. Ponto central para lembrar: ${article.keyTakeaway}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = 'pt-BR';
      utterance.rate = 0.95;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleCloseModal = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setSelectedArticle(null);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div>
        <span className="text-xs font-mono uppercase text-teal-400 tracking-wider font-semibold">
          Psicoeducação e Apoio
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight mt-1 font-serif">
          Biblioteca de Conteúdos
        </h1>
        <p className="text-sm text-slate-400 mt-1 leading-relaxed">
          Leituras breves (3 a 4 min) para compreender o funcionamento da mente, desarmar a ansiedade e cultivar autocompaixão. Sem promessas milagrosas.
        </p>
      </div>

      {/* Filter and Search */}
      <div className="space-y-2.5">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por assunto ou palavra..."
            className="w-full text-xs sm:text-sm pl-10 pr-3 py-2.5 rounded-2xl bg-[#0D1520] border border-slate-800 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl border whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-teal-950 border-teal-600 text-teal-200 font-semibold'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat === 'all' ? 'Todos os temas' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Cards Grid */}
      <div className="space-y-3">
        {filteredArticles.map((article) => (
          <div
            key={article.id}
            onClick={() => setSelectedArticle(article)}
            className="p-4 sm:p-5 rounded-3xl bg-[#0D151F] border border-slate-800 hover:border-teal-500/60 transition-all cursor-pointer group shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                <span className="font-mono text-teal-400">{article.category}</span>
                <span className="flex items-center gap-1 font-mono">
                  <Clock className="w-3 h-3" />
                  {article.readTimeMinutes} min de leitura
                </span>
              </div>
              <h2 className="text-base font-bold text-slate-100 group-hover:text-teal-200 transition-colors font-serif">
                {article.title}
              </h2>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed line-clamp-2">
                {article.summary}
              </p>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[10px] text-slate-500 italic">
                {article.reviewedBy}
              </span>
              <span className="text-xs font-semibold text-teal-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                Ler artigo <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Article Reader Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
          <div 
            role="dialog"
            aria-modal="true"
            aria-labelledby="reader-title"
            className="relative w-full max-w-2xl bg-[#0E1622] border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-4 max-h-[92vh] flex flex-col"
          >
            {/* Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 to-[#101924] border-b border-slate-800 flex items-start justify-between gap-3">
              <div>
                <span className="text-[11px] font-mono uppercase text-teal-400 font-semibold">
                  {selectedArticle.category} • {selectedArticle.readTimeMinutes} min de leitura
                </span>
                <h3 id="reader-title" className="text-lg sm:text-xl font-bold text-slate-100 mt-1 font-serif">
                  {selectedArticle.title}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {selectedArticle.subtitle}
                </p>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => handleToggleSpeakArticle(selectedArticle)}
                  className={`p-2 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-colors ${
                    isSpeaking 
                      ? 'bg-teal-900/80 border-teal-500 text-teal-200' 
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                  }`}
                  title={isSpeaking ? 'Pausar leitura em voz alta' : 'Ouvir artigo em voz alta'}
                  aria-label="Leitura em voz alta do artigo"
                >
                  {isSpeaking ? <VolumeX className="w-4 h-4 text-teal-300 animate-pulse" /> : <Volume2 className="w-4 h-4" />}
                  <span className="hidden sm:inline text-[11px]">{isSpeaking ? 'Pausar' : 'Ouvir'}</span>
                </button>

                <button
                  onClick={handleCloseModal}
                  aria-label="Fechar artigo"
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              {selectedArticle.paragraphs.map((p, i) => (
                <p key={i} className="leading-relaxed">
                  {p}
                </p>
              ))}

              {/* Key Takeaway */}
              <div className="p-4 rounded-2xl bg-teal-950/40 border border-teal-800/60 text-teal-100 space-y-1 mt-6">
                <span className="text-xs font-bold text-teal-300 uppercase tracking-wider block font-mono">
                  Ponto Central para Lembrar:
                </span>
                <p className="italic text-xs sm:text-sm font-serif">
                  "{selectedArticle.keyTakeaway}"
                </p>
              </div>

              {/* Clinical review note */}
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-2 text-[11px] text-slate-500">
                <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0" />
                <span>
                  Conteúdo psicoeducativo geral. Não substitui consulta médica ou psicoterapia individualizada.
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
              >
                Concluir leitura
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
