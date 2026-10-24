import React from 'react';
import { BarChart3, BookOpen, ShieldAlert, Lock, Compass, RotateCcw, ChevronRight, User, Moon, Wind, FileText, Sparkles } from 'lucide-react';
import { UserPreferences } from '../types';

interface MoreViewProps {
  onNavigateSub: (subTab: string) => void;
  onOpenCrisis: () => void;
  onOpenSpecs: () => void;
  onOpenAuth: () => void;
  onOpenNightWindDown: () => void;
  onOpenThoughtDissolve: () => void;
  onOpenTherapyPrep: () => void;
  onRestartOnboarding: () => void;
  preferences: UserPreferences;
}

export const MoreView: React.FC<MoreViewProps> = ({
  onNavigateSub,
  onOpenCrisis,
  onOpenSpecs,
  onOpenAuth,
  onOpenNightWindDown,
  onOpenThoughtDissolve,
  onOpenTherapyPrep,
  onRestartOnboarding,
  preferences,
}) => {
  const account = preferences.account;

  const menuSections = [
    {
      id: 'auth',
      title: account?.isLoggedIn ? `Perfil (${account.name || 'Conectado'})` : 'Painel de Login & Perfil Seguro',
      desc: account?.isLoggedIn 
        ? `Conectado como ${account.email || 'Usuário'}. Gerenciar conta e PIN do diário.`
        : 'Entrar na sua conta, criar cadastro gratuito ou ativar bloqueio por PIN.',
      icon: User,
      color: 'text-teal-300',
      action: onOpenAuth,
    },
    {
      id: 'corner',
      title: 'Meu Cantinho Particular',
      desc: 'Personalize seu ambiente virtual de refúgio com iluminação, som e intenções.',
      icon: Sparkles,
      color: 'text-teal-300',
      action: () => onNavigateSub('corner'),
    },
    {
      id: 'night',
      title: 'Desaceleração Noturna & Sono',
      desc: 'Ritual com luz suave, escaneamento corporal, nível de energia e ruído marrom.',
      icon: Moon,
      color: 'text-amber-400',
      action: onOpenNightWindDown,
    },
    {
      id: 'dissolve',
      title: 'Dissolver Pensamento Pesado',
      desc: 'Ritual somático para desapegar de ruminações mentais com efeito visual de névoa.',
      icon: Wind,
      color: 'text-teal-400',
      action: onOpenThoughtDissolve,
    },
    {
      id: 'therapy-prep',
      title: 'Preparação para Consulta / Terapia',
      desc: 'Gera resumo estruturado dos check-ins da semana para levar ao psicólogo ou médico.',
      icon: FileText,
      color: 'text-indigo-400',
      action: onOpenTherapyPrep,
    },
    {
      id: 'progress',
      title: 'Progresso & Auto-observação',
      desc: 'Padrões e reflexões dos seus registros, sem pontuações ou notas diagnósticas.',
      icon: BarChart3,
      color: 'text-teal-400',
      action: () => onNavigateSub('progress'),
    },
    {
      id: 'library',
      title: 'Biblioteca de Conteúdos',
      desc: 'Artigos psicoeducativos curtos com leitor de áudio em voz alta.',
      icon: BookOpen,
      color: 'text-indigo-400',
      action: () => onNavigateSub('library'),
    },
    {
      id: 'crisis',
      title: 'Recursos de Crise & Apoio Humano',
      desc: 'Linhas telefônicas gratuitas verificadas (188, 192, SNS 24) e mensagens prontas.',
      icon: ShieldAlert,
      color: 'text-rose-400',
      action: onOpenCrisis,
    },
    {
      id: 'privacy',
      title: 'Centro de Privacidade & Dados',
      desc: 'Controle de dados locais, exportação JSON e exclusão definitiva com LGPD.',
      icon: Lock,
      color: 'text-emerald-400',
      action: () => onNavigateSub('privacy'),
    },
    {
      id: 'specs',
      title: 'Sobre o Projeto & Governança',
      desc: 'Resumo executivo de produto, limites clínicos, arquitetura e checklist de produção.',
      icon: Compass,
      color: 'text-amber-400',
      action: onOpenSpecs,
    },
  ];

  return (
    <div className="max-w-xl mx-auto space-y-6 pb-12">
      <div>
        <span className="text-xs font-mono uppercase text-teal-400 tracking-wider font-semibold">
          Menu Geral
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight mt-1 font-serif">
          Mais Recursos
        </h1>
        <p className="text-sm text-slate-400 mt-1 leading-relaxed">
          Acesse rituais de sono, desapego de pensamentos, ficha para terapeutas, controle de privacidade e suporte.
        </p>
      </div>

      <div className="space-y-2.5">
        {menuSections.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={item.action}
              className="w-full text-left p-4 sm:p-5 rounded-3xl bg-[#0D151F] border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between gap-3 group shadow-sm"
            >
              <div className="flex items-start gap-3.5">
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 shrink-0 group-hover:scale-105 transition-transform">
                  <Icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-100 group-hover:text-teal-200 transition-colors font-serif">
                    {item.title}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-slate-300 transition-colors shrink-0" />
            </button>
          );
        })}
      </div>

      {/* Restart onboarding helper */}
      <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
        <span>Deseja rever a introdução e termos?</span>
        <button
          onClick={onRestartOnboarding}
          className="flex items-center gap-1.5 text-teal-400 hover:text-teal-300 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Rever Boas-Vindas</span>
        </button>
      </div>
    </div>
  );
};
