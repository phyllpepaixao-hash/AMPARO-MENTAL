export interface NextStepIdea {
  id: string;
  category: 'Corpo & Fisiologia' | 'Ambiente & Espaço' | 'Conexão Humana' | 'Mente & Descanso';
  action: string;
  minutes: number;
  description: string;
  whyItHelps: string;
}

export const NEXT_STEP_IDEAS: NextStepIdea[] = [
  {
    id: 'step-water',
    category: 'Corpo & Fisiologia',
    action: 'Beber um copo de água fresca com calma',
    minutes: 2,
    description: 'Encha um copo, sinta a temperatura e beba devagar, prestando atenção em cada gole.',
    whyItHelps: 'A desidratação leve mimetiza sintomas de ansiedade e fadiga. É um reset biológico simples.',
  },
  {
    id: 'step-window',
    category: 'Ambiente & Espaço',
    action: 'Abrir a janela e olhar a linha do horizonte',
    minutes: 3,
    description: 'Deixe o ar circular no cômodo e fixe o olhar no ponto mais distante que puder ver.',
    whyItHelps: 'Mudar a profundidade focal reduz a tensão ocular e manda sinal de amplitude para o cérebro.',
  },
  {
    id: 'step-face-wash',
    category: 'Corpo & Fisiologia',
    action: 'Lavar o rosto com água fria ou morna',
    minutes: 3,
    description: 'Sinta o contato da água com a testa, bochechas e nuca. Enxágue devagar.',
    whyItHelps: 'Estimula o reflexo de mergulho dos mamíferos, desacelerando a frequência cardíaca.',
  },
  {
    id: 'step-stretch',
    category: 'Corpo & Fisiologia',
    action: 'Alongar o pescoço e soltar os braços',
    minutes: 4,
    description: 'Incline suavemente a cabeça de um lado para o outro. Gire os ombros três vezes para trás.',
    whyItHelps: 'Desfaz a rigidez postural provocada pelo reflexo de alerta ou estresse contínuo.',
  },
  {
    id: 'step-tea',
    category: 'Corpo & Fisiologia',
    action: 'Preparar uma bebida quente ou chá de ervas',
    minutes: 8,
    description: 'Aqueça a água, sinta o aroma do chá e segure a xícara morna entre as mãos.',
    whyItHelps: 'A temperatura aconchegante nas mãos estimula a percepção de segurança afetiva.',
  },
  {
    id: 'step-clean-surface',
    category: 'Ambiente & Espaço',
    action: 'Liberar apenas 1 superfície física',
    minutes: 5,
    description: 'Guarde ou afaste objetos de uma única mesa ou da cabeceira da cama. Só uma.',
    whyItHelps: 'Reduz a poluição visual imediata sem exigir a energia de uma faxina completa.',
  },
  {
    id: 'step-human-ping',
    category: 'Conexão Humana',
    action: 'Mandar um emoji ou mensagem rápida para alguém seguro',
    minutes: 2,
    description: 'Não precisa explicar tudo. Apenas: "Lembrei de você hoje, espero que esteja bem!"',
    whyItHelps: 'Quebra o ciclo de isolamento sem a pressão de sustentar uma conversa profunda.',
  },
  {
    id: 'step-pro-contact',
    category: 'Conexão Humana',
    action: 'Salvar o contato de um profissional ou serviço do SUS (CAPS)',
    minutes: 10,
    description: 'Anote o telefone ou endereço do posto de saúde mais próximo para quando precisar.',
    whyItHelps: 'Tira a decisão do abstrato e cria uma rede de proteção prática ao seu alcance.',
  },
  {
    id: 'step-screen-break',
    category: 'Mente & Descanso',
    action: 'Colocar o celular no modo avião por 15 minutos',
    minutes: 15,
    description: 'Deixe o aparelho em outro cômodo ou fora do campo de visão imediato.',
    whyItHelps: 'Corta a antecipação de notificações e permite que o sistema nervoso descanse.',
  },
  {
    id: 'step-write-unload',
    category: 'Mente & Descanso',
    action: 'Despejar 5 linhas no diário e fechar',
    minutes: 5,
    description: 'Escreva sem se preocupar com gramática ou coerência: tudo o que está entalado agora.',
    whyItHelps: 'Tira a carga da memória de trabalho e coloca no papel.',
  }
];
