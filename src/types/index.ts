export type FeelingType = 
  | 'energized' 
  | 'calm' 
  | 'tired' 
  | 'heavy' 
  | 'restless' 
  | 'confused' 
  | 'dont_know' 
  | 'prefer_not_to_say';

export interface UserAccount {
  isLoggedIn: boolean;
  email: string | null;
  name: string;
  avatarSeed: string;
  pinLockEnabled: boolean;
  pinCode: string | null;
  memberSince: string;
  isJournalLocked: boolean;
}

export interface UserPreferences {
  name: string;
  selectedCountry: 'BR' | 'PT' | 'OTHER';
  preferredActivities: string[];
  avoidedActivities: string[];
  allowBreathingExercises: boolean;
  lowStimulusMode: boolean;
  reduceMotion: boolean;
  onboardingCompleted: boolean;
  consents: {
    termsAndLimits: boolean;
    localStorageOnly: boolean;
    aiAssistanceAccepted: boolean;
  };
  consentedAt: string | null;
  account?: UserAccount;
}

export interface MoodCheckIn {
  id: string;
  date: string; // YYYY-MM-DD
  timestamp: string;
  feeling: FeelingType;
  bodySensations: string[];
  note?: string;
  voluntaryNextStep?: string;
}

export interface JournalEntry {
  id: string;
  timestamp: string;
  date: string;
  title: string;
  promptUsed?: string;
  content: string;
  tags?: string[];
}

export interface NextStepPlan {
  id: string;
  date: string;
  priority: string;
  smallAction: string;
  smallActionMinutes: number;
  humanSupport?: string;
  completed: boolean;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system_crisis';
  text: string;
  timestamp: string;
  suggestedNextStep?: string;
  isCrisisAlert?: boolean;
  category?: 'normal' | 'crisis' | 'diagnosis_attempt' | 'medication_advice' | 'dependency_warning';
}

export interface CrisisContact {
  id: string;
  country: 'BR' | 'PT' | 'OTHER';
  name: string;
  number: string;
  hours: string;
  description: string;
  verifiedSource: string;
  verifiedDate: string;
  callUrl: string;
  category: 'emergency' | 'emotional_support' | 'vulnerable_groups' | 'health_service';
}

export interface PsychoEducationArticle {
  id: string;
  title: string;
  subtitle: string;
  readTimeMinutes: number;
  category: 'Ansiedade & Estresse' | 'Autocompaixão' | 'Relações & Ajuda' | 'Rotina Possível';
  summary: string;
  paragraphs: string[];
  reviewedBy: string;
  keyTakeaway: string;
}

export interface SafetyTestCase {
  id: string;
  title: string;
  category: string;
  userPrompt: string;
  expectedBehavior: string;
}
