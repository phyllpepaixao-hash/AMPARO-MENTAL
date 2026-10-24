import React, { useState } from 'react';
import { X, ShieldCheck, FileText, Compass, AlertCircle, CheckCircle2, Cpu } from 'lucide-react';

interface ProjectSpecsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectSpecsModal: React.FC<ProjectSpecsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'architecture' | 'ethics' | 'roadmap'>('summary');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="specs-title"
        className="relative w-full max-w-3xl bg-[#0F1722] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-4 max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-900 border-b border-slate-800 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-mono px-2 py-0.5 rounded bg-teal-950 border border-teal-800 text-teal-300 font-semibold">
                Documentação do Projeto
              </span>
              <span className="text-xs text-slate-400">Versão 1.0 (Protótipo Funcional)</span>
            </div>
            <h2 id="specs-title" className="text-lg sm:text-xl font-bold text-slate-100 mt-1 font-serif">
              Amparo — Não passe por tudo sozinho
            </h2>
            <p className="text-xs text-slate-400">
              Planejamento multidisciplinar: Produto, UX & Acessibilidade, Engenharia, Saúde Mental e Segurança de IA.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar especificações"
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-4 gap-1 overflow-x-auto">
          {[
            { id: 'summary', label: '1. Resumo de Produto', icon: FileText },
            { id: 'architecture', label: '2. Arquitetura & Fluxos', icon: Compass },
            { id: 'ethics', label: '3. Princípios Clínicos & IA', icon: ShieldCheck },
            { id: 'roadmap', label: '4. Checklist Pré-Produção', icon: AlertCircle },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3 py-2.5 text-xs font-medium border-b-2 transition-all whitespace-nowrap ${
                  isActive
                    ? 'border-teal-400 text-teal-300 bg-teal-950/30'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1 text-xs sm:text-sm text-slate-300 leading-relaxed">
          {activeTab === 'summary' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-teal-950/30 border border-teal-800/40">
                <h3 className="font-semibold text-teal-200 text-sm mb-1">
                  Slogan & Posicionamento
                </h3>
                <p className="italic text-slate-200">
                  “Um próximo passo, no seu ritmo.”
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                  <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider mb-1.5 text-teal-400">
                    O Problema
                  </h4>
                  <p className="text-slate-300">
                    Adultos vivenciando ansiedade, sobrecarga, desânimo ou solidão muitas vezes se sentem paralisados diante de rotinas complexas ou aplicativos que exigem "pontuações perfeitas", streaks punitivos e longas conversas com robôs que fingem ser terapeutas.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                  <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider mb-1.5 text-teal-400">
                    Público-Alvo
                  </h4>
                  <p className="text-slate-300">
                    Pessoas adultas em momentos de cansaço ou crise situacional. Não pressupõe transtorno mental; acolhe tanto oscilações normais da vida quanto apoia quem já realiza acompanhamento profissional externo.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                  <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider mb-1.5 text-teal-400">
                    Proposta de Valor
                  </h4>
                  <p className="text-slate-300">
                    Ajudar a atravessar o momento presente e escolher um próximo passo pequeno (2 a 10 minutos), seguro e viável. Menos cobrança, mais acolhimento prático.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                  <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider mb-1.5 text-teal-400">
                    O Diferencial Central
                  </h4>
                  <p className="text-slate-300">
                    Não prender a pessoa na tela nem criar dependência de chat. Finaliza interações oferecendo uma ação de cuidado no mundo real (beber água, descansar, abrir a janela ou contatar um ser humano).
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-800/40 text-amber-200">
                <h4 className="font-semibold text-xs uppercase tracking-wider mb-1">
                  Limites Inegociáveis do Aplicativo
                </h4>
                <p>
                  Não é serviço médico, não faz triagem diagnóstica, não substitui psicoterapia, não receita medicamentos e não fornece atendimento humano de emergência continuado.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'architecture' && (
            <div className="space-y-4">
              <h3 className="font-bold text-slate-200 text-sm">Mapa de Navegação & Topologia de Dados</h3>
              
              <div className="p-3 rounded-lg bg-slate-950 font-mono text-[11px] text-teal-300 border border-slate-800 overflow-x-auto space-y-1">
                <div>[Entrada] Onboarding ➔ Consentimentos Granulares ➔ Armazenamento Local</div>
                <div>├── [Home] "O que seria útil agora?" + Botão Permanente de Emergência</div>
                <div>│    ├── 1. "Quero me acalmar" ➔ Grounding 5-4-3-2-1 / Pés no Chão / Respiração 4-4 / Pausa</div>
                <div>│    ├── 2. "Quero colocar para fora" ➔ Escuta IA Não-Clínica + Interceptor de Crise</div>
                <div>│    └── 3. "Preciso de um próximo passo" ➔ Plano Leve de 24h (1 Prioridade, 1 Microação)</div>
                <div>├── [Diário] Escrita Livre + Prompts Reflexivos + 100% Local</div>
                <div>├── [Progresso] Auto-observações (Sem pontuação diagnóstica ou punição)</div>
                <div>├── [Crise & Apoio] Telefones Oficiais Verificados (CVV 188 / SAMU / SNS 24) + Mensagem Amigo</div>
                <div>├── [Biblioteca] Psicoeducação com Comitê Revisional</div>
                <div>└── [Centro de Privacidade] Exportação JSON, Limpeza Total (LGPD) e Toggles</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <h4 className="font-bold text-teal-400 text-xs mb-1">Local-First Storage</h4>
                  <p className="text-slate-400 text-xs">
                    Todos os check-ins, textos do diário e planos residem exclusivamente no navegador do usuário via LocalStorage. Nenhum dado sensível é trafegado para servidores remotos por padrão.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <h4 className="font-bold text-teal-400 text-xs mb-1">Deterministic Crisis Interceptor</h4>
                  <p className="text-slate-400 text-xs">
                    Expressões de autoagressão, suicídio ou violência disparam um interceptor determinístico local, sem depender de alucinações de LLM.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ethics' && (
            <div className="space-y-3">
              <h3 className="font-bold text-slate-200 text-sm">Diretrizes de Segurança Clínica e de IA</h3>
              
              <div className="space-y-2">
                {[
                  { rule: 'Zero Diagnósticos', desc: 'A IA nunca diz "você tem depressão ou ansiedade". Reflete a dor e sugere avaliação com psicólogo/médico.' },
                  { rule: 'Zero Conselho Medicamentoso', desc: 'Nunca opina sobre dosagens, iniciar ou suspender remédios controlados.' },
                  { rule: 'Sem Positividade Tóxica ou Culpa', desc: 'Valida a dificuldade antes de propor qualquer ação. Não diz "tudo vai ficar bem" de forma vazia.' },
                  { rule: 'Regra da Pergunta Única', desc: 'No máximo uma pergunta por interação para não sobrecarregar a capacidade cognitiva do usuário.' },
                  { rule: 'Antidependência de IA', desc: 'Reforça com transparência que é um software e que vínculos com humanos reais são insubstituíveis.' },
                  { rule: 'Liberdade sem Forçar Respiração', desc: 'Oferece sempre ancoragem sensorial tátil ou pausa silenciosa caso a respiração cause desconforto.' },
                ].map((item, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-200 text-xs block">{item.rule}</span>
                      <span className="text-slate-400 text-xs">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'roadmap' && (
            <div className="space-y-3">
              <h3 className="font-bold text-slate-200 text-sm">Checklist Obrigatório Antes do Lançamento Público</h3>
              <p className="text-xs text-slate-400">
                Como este é um protótipo de alta fidelidade construído para avaliação, as seguintes etapas formais devem ser executadas antes de disponibilização geral:
              </p>

              <div className="space-y-2">
                {[
                  { area: 'Revisão Clínica', item: 'Auditoria de todos os textos, exercícios e árvores de decisão por psicólogos e psiquiatras registrados (CRP/CRM).' },
                  { area: 'Jurídico & LGPD', item: 'Elaboração dos Termos de Uso e Política de Privacidade formais com assessoria jurídica especializada em dados de saúde (art. 11 LGPD).' },
                  { area: 'Validação de Hotlines', item: 'Protocolo de teste trimestral automatizado para confirmação contínua da disponibilidade de linhas 188 / 192 / SNS 24.' },
                  { area: 'Segurança & Backend', item: 'Criptografia em repouso ponta-a-ponta (E2EE) caso venha a existir sincronização em nuvem multi-dispositivo.' },
                  { area: 'Acessibilidade WCAG 2.2', item: 'Testes práticos de usabilidade com leitores de tela (NVDA, TalkBack, VoiceOver) e pessoas neurodivergentes.' }
                ].map((req, i) => (
                  <div key={i} className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 font-semibold">
                      {req.area}
                    </span>
                    <p className="text-slate-300 text-xs mt-1">{req.item}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs transition-colors"
          >
            Entendido, fechar
          </button>
        </div>
      </div>
    </div>
  );
};
