import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, ShieldAlert, Sparkles, Trash2, Phone, AlertTriangle, ArrowRight, Check, Copy, Volume2, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';
import { ChatMessage, UserPreferences, NextStepPlan } from '../types';
import { SafetyService, SAFETY_TEST_CASES } from '../services/safetyService';
import { StorageService } from '../services/storage';

interface ChatViewProps {
  preferences: UserPreferences;
  onOpenCrisis: () => void;
  onSavePlan?: (plan: NextStepPlan) => void;
  onNavigate: (tab: string) => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  preferences,
  onOpenCrisis,
  onSavePlan,
  onNavigate,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = StorageService.getChatHistory();
    if (saved.length > 0) return saved;
    return [
      {
        id: 'msg-welcome',
        sender: 'assistant',
        text: 'Olá. Eu sou a inteligência artificial de acolhimento do Entre.\n\nEste é um espaço seguro e sem cobranças para desabafar ou organizar o que está passando pela sua cabeça. Como você está se sentindo neste exato momento?',
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        suggestedNextStep: 'Respirar fundo uma vez antes de começar a escrever',
      }
    ];
  });

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showTestCases, setShowTestCases] = useState(false);
  const [savedStepId, setSavedStepId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<'checking' | 'gemini' | 'local'>('checking');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check backend health
  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        if (data.hasGeminiKey) {
          setApiStatus('gemini');
        } else {
          setApiStatus('local');
        }
      })
      .catch(() => setApiStatus('local'));
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isTyping) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    StorageService.saveChatHistory(newHistory);
    setInputText('');
    setIsTyping(true);

    try {
      const result = await SafetyService.processUserInputAsync(
        text,
        newHistory,
        preferences.name
      );

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: result.isCrisisAlert ? 'system_crisis' : 'assistant',
        text: result.response,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        suggestedNextStep: result.suggestedNextStep,
        isCrisisAlert: result.isCrisisAlert,
        category: result.category,
      };

      const finalHistory = [...newHistory, assistantMsg];
      setMessages(finalHistory);
      StorageService.saveChatHistory(finalHistory);
    } catch (err) {
      console.error(err);
      const fallbackMsg: ChatMessage = {
        id: `assistant-err-${Date.now()}`,
        sender: 'assistant',
        text: 'Estou com você neste instante. Reconheço o quanto o dia pode estar pesado. O que você acha de beber um pouco de água agora e sentar confortavelmente por um minuto?',
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        suggestedNextStep: 'Beber um copo de água fresca',
      };
      setMessages([...newHistory, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearHistory = () => {
    StorageService.clearChatHistory();
    setMessages([
      {
        id: `msg-welcome-${Date.now()}`,
        sender: 'assistant',
        text: 'Conversa limpa com privacidade total. O que você gostaria de colocar para fora agora?',
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      }
    ]);
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleSpeakText = (id: string, text: string) => {
    if ('speechSynthesis' in window) {
      if (speakingId === id) {
        window.speechSynthesis.cancel();
        setSpeakingId(null);
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.rate = 0.95;
      utterance.onend = () => setSpeakingId(null);
      utterance.onerror = () => setSpeakingId(null);
      setSpeakingId(id);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSaveStepToPlan = (stepText: string, msgId: string) => {
    if (!onSavePlan) return;
    const today = new Date().toISOString().split('T')[0];
    const newPlan: NextStepPlan = {
      id: `plan-${Date.now()}`,
      date: today,
      priority: 'Apoio emocional de hoje',
      smallAction: stepText,
      smallActionMinutes: 5,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    onSavePlan(newPlan);
    setSavedStepId(msgId);
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col h-[calc(100vh-10.5rem)] pb-2">
      {/* Top Clinical & AI Disclaimer Banner */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-900 via-[#101923] to-slate-900 border border-slate-800/80 flex items-center justify-between gap-3 text-xs mb-3 shadow-sm">
        <div className="flex items-center gap-2.5 text-slate-300">
          <div className="w-7 h-7 rounded-lg bg-indigo-950 border border-indigo-700/60 flex items-center justify-center text-indigo-300 shrink-0">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-100">Escuta Apoiada por IA</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-teal-300">
                {apiStatus === 'gemini' ? '✨ Gemini 3.8 Flash' : '🛡️ Modo Seguro Guardrail'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Reflexão empática para o momento presente. Não realiza diagnósticos nem substitui terapia.
            </p>
          </div>
        </div>

        <button
          onClick={handleClearHistory}
          title="Apagar histórico desta conversa do navegador"
          className="text-slate-500 hover:text-rose-400 transition-colors p-1.5 rounded-lg hover:bg-slate-800/60"
          aria-label="Limpar conversa"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Safety Test Suite Collapsible (Prompt Section 3 Requirement) */}
      <div className="mb-3 rounded-2xl border border-indigo-900/50 bg-indigo-950/20 overflow-hidden backdrop-blur-sm">
        <button
          onClick={() => setShowTestCases(!showTestCases)}
          className="w-full p-2.5 px-3.5 text-left text-xs font-semibold text-indigo-300 hover:text-indigo-200 flex items-center justify-between transition-colors"
        >
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-indigo-400" />
            <span>Casos de Teste de Segurança Clínica (9 Cenários da Equipe)</span>
          </div>
          {showTestCases ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showTestCases && (
          <div className="p-3.5 border-t border-indigo-950/70 bg-[#0A1017] space-y-2 text-xs">
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Clique em qualquer cenário abaixo para disparar o prompt e verificar como o modelo Gemini e os guardrails clínicos respondem:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
              {SAFETY_TEST_CASES.map((tc) => (
                <button
                  key={tc.id}
                  onClick={() => handleSendMessage(tc.userPrompt)}
                  className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/70 text-left transition-all group hover:bg-slate-800/60"
                >
                  <div className="font-semibold text-slate-200 group-hover:text-indigo-300 flex items-center justify-between">
                    <span>{tc.title}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{tc.category}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 truncate mt-1 italic">
                    "{tc.userPrompt}"
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Message Feed */}
      <div className="flex-1 overflow-y-auto space-y-4 px-1 pr-2">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          const isCrisis = msg.sender === 'system_crisis' || msg.isCrisisAlert;

          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'} animate-fadeIn`}
            >
              {!isUser && (
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                  isCrisis 
                    ? 'bg-rose-950 text-rose-300 border border-rose-700/60' 
                    : 'bg-indigo-950 text-indigo-300 border border-indigo-700/60'
                }`}>
                  {isCrisis ? <AlertTriangle className="w-4 h-4 text-rose-400" /> : <Bot className="w-4 h-4" />}
                </div>
              )}

              <div className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-sm ${
                isUser
                  ? 'bg-teal-700 text-white rounded-tr-none'
                  : isCrisis
                    ? 'bg-rose-950/70 border border-rose-800 text-rose-100 rounded-tl-none'
                    : 'bg-[#101922] border border-slate-800 text-slate-200 rounded-tl-none'
              }`}>
                <div className="whitespace-pre-wrap">{msg.text}</div>

                {/* Crisis Call-to-Action Buttons */}
                {isCrisis && (
                  <div className="mt-3.5 pt-3 border-t border-rose-800/80 space-y-2">
                    <p className="font-semibold text-rose-200 text-xs">
                      Precisa falar com alguém imediatamente?
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <a
                        href="tel:188"
                        className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        Ligar 188 (CVV Gratuito)
                      </a>
                      <button
                        onClick={onOpenCrisis}
                        className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-rose-700 text-rose-200 text-xs font-semibold transition-colors"
                      >
                        Ver contatos completos & mensagem pronta
                      </button>
                    </div>
                  </div>
                )}

                {/* Voluntary Next Step Pill (Section 4 Requirement) */}
                {msg.suggestedNextStep && (
                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-1.5 text-amber-300/90">
                      <Sparkles className="w-3.5 h-3.5 shrink-0" />
                      <span className="italic">Próximo passo: {msg.suggestedNextStep}</span>
                    </div>
                    {onSavePlan && (
                      <button
                        onClick={() => handleSaveStepToPlan(msg.suggestedNextStep!, msg.id)}
                        disabled={savedStepId === msg.id}
                        className={`text-[11px] font-semibold px-2 py-1 rounded-lg transition-colors whitespace-nowrap ${
                          savedStepId === msg.id
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-slate-800 hover:bg-slate-700 text-amber-200'
                        }`}
                      >
                        {savedStepId === msg.id ? 'Salvo no dia!' : 'Adicionar ao plano'}
                      </button>
                    )}
                  </div>
                )}

                {/* Auxiliary Message Utilities */}
                <div className="mt-2.5 pt-1.5 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyText(msg.id, msg.text)}
                      className="hover:text-slate-300 flex items-center gap-1 transition-colors"
                      title="Copiar mensagem"
                    >
                      {copiedId === msg.id ? <Check className="w-3 h-3 text-teal-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedId === msg.id ? 'Copiado' : 'Copiar'}</span>
                    </button>
                    {!isUser && (
                      <button
                        onClick={() => handleSpeakText(msg.id, msg.text)}
                        className={`hover:text-slate-300 flex items-center gap-1 transition-colors ${speakingId === msg.id ? 'text-teal-400 font-bold' : ''}`}
                        title="Ouvir em voz alta"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>{speakingId === msg.id ? 'Ouvindo...' : 'Ouvir'}</span>
                      </button>
                    )}
                  </div>
                  <span className={isUser ? 'text-teal-200' : 'text-slate-500'}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-xl bg-teal-900/60 text-teal-300 border border-teal-700/60 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {isTyping && (
          <div className="flex gap-3 items-center text-xs text-slate-400 animate-fadeIn">
            <div className="w-8 h-8 rounded-xl bg-indigo-950 text-indigo-300 border border-indigo-800 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="px-3.5 py-2.5 rounded-2xl bg-[#101922] border border-slate-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce delay-150" />
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce delay-300" />
              <span className="text-[11px] text-slate-400 ml-1">Processando reflexão segura...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="pt-3 border-t border-slate-800 flex gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Escreva como você está se sentindo hoje..."
          className="flex-1 px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 text-xs sm:text-sm placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-teal-500"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isTyping}
          aria-label="Enviar mensagem"
          className={`px-4 py-3 rounded-2xl flex items-center justify-center transition-all ${
            inputText.trim() && !isTyping
              ? 'bg-teal-600 hover:bg-teal-500 text-white shadow-md shadow-teal-950'
              : 'bg-slate-900 text-slate-600 cursor-not-allowed'
          }`}
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
