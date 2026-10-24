export interface ExerciseStep {
  title: string;
  instruction: string;
  tip?: string;
  durationSeconds?: number;
}

export interface CalmingExercise {
  id: string;
  name: string;
  type: 'grounding' | 'somatic' | 'breathing' | 'silent_pause';
  durationLabel: string;
  summary: string;
  benefits: string;
  isBreathing: boolean;
  steps: ExerciseStep[];
}

export const CALMING_EXERCISES: CalmingExercise[] = [
  {
    id: 'ex-suspiro-fisiologico',
    name: 'Suspiro Fisiológico (Reset do Sistema Nervoso)',
    type: 'breathing',
    durationLabel: '1 min',
    summary: 'Dupla inspiração pelo nariz e uma expiração longa e profunda pela boca.',
    benefits: 'A técnica mais rápida da neurociência para desarmar taquicardia e ansiedade aguda.',
    isBreathing: true,
    steps: [
      {
        title: 'Preparação do corpo',
        instruction: 'Acomode a coluna confortavelmente. Deixe os ombros caírem e relaxe a mandíbula.',
        tip: 'Você fará 2 inspirações seguidas pelo nariz sem soltar o ar no meio.'
      },
      {
        title: 'Inspiração 1 (Profunda)',
        instruction: 'Puxe bastante ar pelo nariz enchendo a maior parte dos pulmões (cerca de 80%).',
        durationSeconds: 3
      },
      {
        title: 'Inspiração 2 (Curta no topo)',
        instruction: 'Sem soltar o ar, dê mais um puxãozinho extra de ar pelo nariz para abrir totalmente os alvéolos.',
        durationSeconds: 1
      },
      {
        title: 'Expiração Longa e Lenta pela Boca',
        instruction: 'Solte todo o ar pela boca suavemente e sem pressa, como se suspirasse um alívio imenso.',
        durationSeconds: 6
      },
      {
        title: 'Repita por 3 ciclos',
        instruction: 'Repare no alívio imediato da tensão no peito. O coração desacelera o ritmo naturalmente.',
        tip: 'Excelente para antes de reuniões difíceis ou crises de ansiedade.'
      }
    ]
  },
  {
    id: 'ex-54321',
    name: 'Ancoragem Sensorial 5-4-3-2-1',
    type: 'grounding',
    durationLabel: '2 a 3 min',
    summary: 'Conecte sua atenção ao espaço ao seu redor através dos cinco sentidos.',
    benefits: 'Interrompe o fluxo acelerado de pensamentos ansiosos e reconecta você à realidade imediata.',
    isBreathing: false,
    steps: [
      {
        title: '5 coisas que você pode ver',
        instruction: 'Olhe devagar ao seu redor. Encontre 5 objetos ou detalhes (uma sombra, um ponto de luz, a textura de uma parede, um livro, uma cor).',
        tip: 'Não precisa ter pressa. Observe cada um por alguns segundos.'
      },
      {
        title: '4 coisas que você pode tocar',
        instruction: 'Perceba 4 sensações físicas de toque: o tecido da sua roupa, a sola do sapato no chão, a superfície da mesa ou a temperatura da sua pele.',
        tip: 'Toque em algo com texturas diferentes se estiver ao alcance.'
      },
      {
        title: '3 sons que você pode ouvir',
        instruction: 'Feche os olhos ou suavize o olhar. Repare em 3 sons ao fundo: o som do vento, um motor distante, o ruído do ar ou da respiração.',
        tip: 'Mesmo em lugares silenciosos, existem pequenos sons sutis.'
      },
      {
        title: '2 aromas ou cheiros presentes',
        instruction: 'Inspire suavemente pelo nariz. Tente notar 2 aromas ou cheiros (café, sabonete, tecido limpo ou apenas o ar fresco da janela).',
        tip: 'Se não sentir cheiros marcantes, lembre-se do aroma de algo reconfortante.'
      },
      {
        title: '1 coisa que você pode saborear ou agradecer',
        instruction: 'Sinta o gosto que está na sua boca agora, tome um gole de água ou reconheça um pequeno instante de segurança neste segundo.',
        tip: 'Você completou a ancoragem. Respire no seu ritmo e repare como seu corpo está agora.'
      }
    ]
  },
  {
    id: 'ex-pes-chao',
    name: 'Pés no Chão e Peso do Corpo (Somático)',
    type: 'somatic',
    durationLabel: '1 a 2 min',
    summary: 'Perceba o chão sustentando você e solte a gravidade sobre os apoios.',
    benefits: 'Excelente para quando a cabeça parece "flutuando" ou desconectada da realidade.',
    isBreathing: false,
    steps: [
      {
        title: 'Sentir o apoio da gravidade',
        instruction: 'Se estiver sentado(a) ou de pé, coloque os dois pés planos no chão. Sinta o peso que a terra e o piso sustentam.',
        tip: 'Você não precisa segurar o mundo. O chão está segurando você.'
      },
      {
        title: 'Pressionar suavemente os calcanhares',
        instruction: 'Pressione um pouco os calcanhares e os dedos contra o solo. Sinta a firmeza desse contato físico.',
        tip: 'Note a estabilidade da superfície sólida abaixo.'
      },
      {
        title: 'Soltar os ombros e a mandíbula',
        instruction: 'Permita que os ombros desçam um centímetro. Descole a língua do céu da boca e relaxe a testa.',
        tip: 'Nenhuma postura perfeita é necessária. Apenas solte o peso.'
      },
      {
        title: 'Reconhecer que você está aqui',
        instruction: 'Diga mentalmente para você: "Estou aqui. Estou seguro(a) agora neste espaço. Um passo de cada vez."',
        tip: 'Abra os olhos devagar quando se sentir pronto(a).'
      }
    ]
  },
  {
    id: 'ex-box-breathing',
    name: 'Respiração Quadrada (Box Breathing 4-4-4-4)',
    type: 'breathing',
    durationLabel: '2 min',
    summary: 'Quatro tempos iguais de inspiração, retenção com ar, expiração e pausa no vazio.',
    benefits: 'Regula o foco mental e neutraliza a dispersão ou pânico.',
    isBreathing: true,
    steps: [
      {
        title: '1. Inspire (4 segundos)',
        instruction: 'Puxe o ar devagar pelo nariz contando até 4.',
        durationSeconds: 4
      },
      {
        title: '2. Segure com ar (4 segundos)',
        instruction: 'Mantenha os pulmões cheios confortavelmente sem tensionar a garganta.',
        durationSeconds: 4
      },
      {
        title: '3. Solte o ar (4 segundos)',
        instruction: 'Expire suavemente pela boca ou nariz até esvaziar os pulmões.',
        durationSeconds: 4
      },
      {
        title: '4. Segure no vazio (4 segundos)',
        instruction: 'Fique na pausa pacífica antes do próximo ciclo de ar.',
        durationSeconds: 4
      }
    ]
  },
  {
    id: 'ex-respiracao-suave',
    name: 'Respiração em Ritmo Confortável (4-4)',
    type: 'breathing',
    durationLabel: '2 min',
    summary: 'Inspiração e expiração em fluxo contínuo e suave, sem retenções forçadas.',
    benefits: 'Sinaliza desaceleração para o nervo vago e sistema parassimpático.',
    isBreathing: true,
    steps: [
      {
        title: 'Ajuste inicial',
        instruction: 'Encontre uma posição que não comprima sua barriga. Deixe o ar sair naturalmente pela boca ou nariz.',
        tip: 'Aviso: Se focar na respiração aumentar sua ansiedade, pule sem culpa para a ancoragem sensorial.'
      },
      {
        title: 'Inspirar suavemente (4 segundos)',
        instruction: 'Inspire pelo nariz contando devagar até 4, sentindo o ar entrar sem esforço.',
        durationSeconds: 4
      },
      {
        title: 'Expirar suavemente (4 segundos)',
        instruction: 'Solte o ar com calma contando até 4, como se apagasse uma vela bem devagar.',
        durationSeconds: 4
      },
      {
        title: 'Repetição gentil',
        instruction: 'Mantenha esse fluxo por 3 a 5 ciclos. O objetivo não é respirar muito ar, mas sim respirar com ritmo regular.',
        tip: 'Deixe o corpo encontrar o ritmo que parece natural para ele hoje.'
      }
    ]
  },
  {
    id: 'ex-pausa-silenciosa',
    name: 'Pausa Silenciosa de 60 Segundos',
    type: 'silent_pause',
    durationLabel: '1 min',
    summary: 'Um minuto inteiro sem tarefas, notificações ou cobranças.',
    benefits: 'Cria uma folga no circuito de urgência mental.',
    isBreathing: false,
    steps: [
      {
        title: '60 segundos só para você',
        instruction: 'Não há nada que você precise resolver, responder ou planejar durante este minuto.',
        tip: 'Apenas acompanhe a pulsação suave na tela ou feche os olhos se for mais confortável.',
        durationSeconds: 60
      }
    ]
  }
];
