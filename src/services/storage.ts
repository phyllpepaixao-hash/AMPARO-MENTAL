import { UserPreferences, MoodCheckIn, JournalEntry, NextStepPlan, ChatMessage } from '../types';

const STORAGE_KEYS = {
  PREFERENCES: 'entre_user_preferences_v1',
  CHECKINS: 'entre_mood_checkins_v1',
  JOURNAL: 'entre_journal_entries_v1',
  PLANS: 'entre_next_step_plans_v1',
  CHAT_HISTORY: 'entre_chat_history_v1',
};

export const DEFAULT_PREFERENCES: UserPreferences = {
  name: '',
  selectedCountry: 'BR',
  preferredActivities: ['grounding_54321', 'micro_actions', 'journal'],
  avoidedActivities: [],
  allowBreathingExercises: true,
  lowStimulusMode: false,
  reduceMotion: false,
  onboardingCompleted: false,
  consents: {
    termsAndLimits: false,
    localStorageOnly: false,
    aiAssistanceAccepted: false,
  },
  consentedAt: null,
  account: {
    isLoggedIn: false,
    email: null,
    name: '',
    avatarSeed: 'serene-teal',
    pinLockEnabled: false,
    pinCode: null,
    memberSince: 'Outubro de 2026',
    isJournalLocked: false,
  },
};

export const StorageService = {
  getPreferences(): UserPreferences {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
      if (!data) return DEFAULT_PREFERENCES;
      return { ...DEFAULT_PREFERENCES, ...JSON.parse(data) };
    } catch {
      return DEFAULT_PREFERENCES;
    }
  },

  savePreferences(prefs: UserPreferences): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(prefs));
    } catch (e) {
      console.warn('Erro ao salvar preferências localmente:', e);
    }
  },

  getCheckIns(): MoodCheckIn[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CHECKINS);
      if (!data) return [];
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  saveCheckIn(checkIn: MoodCheckIn): MoodCheckIn[] {
    try {
      const current = this.getCheckIns();
      // Replace if today's checkin exists or prepend
      const filtered = current.filter(c => c.id !== checkIn.id);
      const updated = [checkIn, ...filtered];
      localStorage.setItem(STORAGE_KEYS.CHECKINS, JSON.stringify(updated));
      return updated;
    } catch {
      return [];
    }
  },

  deleteCheckIn(id: string): MoodCheckIn[] {
    try {
      const current = this.getCheckIns();
      const updated = current.filter(c => c.id !== id);
      localStorage.setItem(STORAGE_KEYS.CHECKINS, JSON.stringify(updated));
      return updated;
    } catch {
      return [];
    }
  },

  getJournalEntries(): JournalEntry[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.JOURNAL);
      if (!data) return [];
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  saveJournalEntry(entry: JournalEntry): JournalEntry[] {
    try {
      const current = this.getJournalEntries();
      const index = current.findIndex(e => e.id === entry.id);
      let updated: JournalEntry[];
      if (index >= 0) {
        updated = [...current];
        updated[index] = entry;
      } else {
        updated = [entry, ...current];
      }
      localStorage.setItem(STORAGE_KEYS.JOURNAL, JSON.stringify(updated));
      return updated;
    } catch {
      return [];
    }
  },

  deleteJournalEntry(id: string): JournalEntry[] {
    try {
      const current = this.getJournalEntries();
      const updated = current.filter(e => e.id !== id);
      localStorage.setItem(STORAGE_KEYS.JOURNAL, JSON.stringify(updated));
      return updated;
    } catch {
      return [];
    }
  },

  getPlans(): NextStepPlan[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PLANS);
      if (!data) return [];
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  savePlan(plan: NextStepPlan): NextStepPlan[] {
    try {
      const current = this.getPlans();
      const index = current.findIndex(p => p.id === plan.id);
      let updated: NextStepPlan[];
      if (index >= 0) {
        updated = [...current];
        updated[index] = plan;
      } else {
        updated = [plan, ...current];
      }
      localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(updated));
      return updated;
    } catch {
      return [];
    }
  },

  deletePlan(id: string): NextStepPlan[] {
    try {
      const current = this.getPlans();
      const updated = current.filter(p => p.id !== id);
      localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(updated));
      return updated;
    } catch {
      return [];
    }
  },

  importAllData(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.preferences) localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(parsed.preferences));
      if (parsed.checkIns) localStorage.setItem(STORAGE_KEYS.CHECKINS, JSON.stringify(parsed.checkIns));
      if (parsed.journalEntries) localStorage.setItem(STORAGE_KEYS.JOURNAL, JSON.stringify(parsed.journalEntries));
      if (parsed.plans) localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(parsed.plans));
      return true;
    } catch (e) {
      console.warn('Erro ao importar dados:', e);
      return false;
    }
  },

  getChatHistory(): ChatMessage[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CHAT_HISTORY);
      if (!data) return [];
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  saveChatHistory(history: ChatMessage[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(history));
    } catch (e) {
      console.warn('Erro ao salvar histórico do chat local:', e);
    }
  },

  clearChatHistory(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.CHAT_HISTORY);
    } catch (e) {
      console.warn(e);
    }
  },

  clearAllData(): void {
    try {
      Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
    } catch (e) {
      console.warn('Erro ao limpar dados locais:', e);
    }
  },

  exportAllData(): string {
    const backup = {
      exportedAt: new Date().toISOString(),
      app: 'Entre',
      version: '1.0.0-prototype',
      privacyNotice: 'Este arquivo contém apenas dados que você criou e armazenou no seu navegador.',
      preferences: this.getPreferences(),
      checkIns: this.getCheckIns(),
      journalEntries: this.getJournalEntries(),
      plans: this.getPlans(),
    };
    return JSON.stringify(backup, null, 2);
  },

  loadDemoData(): void {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const twoDaysAgo = new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0];

    const demoCheckIns: MoodCheckIn[] = [
      {
        id: 'demo-checkin-1',
        date: today,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        feeling: 'tired',
        bodySensations: ['Tensão nos ombros', 'Olhos pesados'],
        note: 'Dia agitado no trabalho, precisei de uma pausa para respirar.',
        voluntaryNextStep: 'Beber um copo de água e afastar a tela por 10 minutos',
      },
      {
        id: 'demo-checkin-2',
        date: yesterday,
        timestamp: '15:20',
        feeling: 'restless',
        bodySensations: ['Agitação interna'],
        note: 'Muita coisa para fazer ao mesmo tempo.',
        voluntaryNextStep: 'Escrever no diário o que estava na cabeça',
      },
      {
        id: 'demo-checkin-3',
        date: twoDaysAgo,
        timestamp: '19:40',
        feeling: 'calm',
        bodySensations: ['Corpo relaxado'],
        note: 'Consegui descansar no final da tarde.',
        voluntaryNextStep: 'Preparar um chá quente',
      }
    ];

    const demoJournal: JournalEntry[] = [
      {
        id: 'demo-journal-1',
        timestamp: new Date().toISOString(),
        date: today,
        title: 'Desacelerando o ritmo',
        promptUsed: 'O que está pesando hoje?',
        content: 'Percebi que estava tentando resolver as coisas de uma semana inteira em apenas uma tarde. Preciso lembrar de fazer uma coisa por vez.',
        tags: ['Pausa', 'Trabalho'],
      },
      {
        id: 'demo-journal-2',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        date: yesterday,
        title: 'Um respiro no fim do dia',
        promptUsed: 'Do que meu corpo e mente precisam agora?',
        content: 'Preciso de menos barulho e um pouco de água. O exercício de grounding me ajudou a sair do turbilhão de pensamentos.',
        tags: ['Cuidado', 'Silêncio'],
      }
    ];

    const demoPlans: NextStepPlan[] = [
      {
        id: 'demo-plan-1',
        date: today,
        priority: 'Desacelerar o corpo antes de dormir',
        smallAction: 'Lavar o rosto com água morna e deixar o celular longe da cama',
        smallActionMinutes: 5,
        humanSupport: 'Dar boa noite para quem mora comigo',
        completed: false,
        createdAt: new Date().toISOString(),
      }
    ];

    try {
      localStorage.setItem(STORAGE_KEYS.CHECKINS, JSON.stringify(demoCheckIns));
      localStorage.setItem(STORAGE_KEYS.JOURNAL, JSON.stringify(demoJournal));
      localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(demoPlans));
    } catch (e) {
      console.warn(e);
    }
  }
};
