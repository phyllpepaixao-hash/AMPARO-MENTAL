export interface GardenPlant {
  id: string;
  type: 'sunflower' | 'lavender' | 'fern' | 'cherry_blossom' | 'succulent';
  name: string;
  stage: number; // 0 to 3
  wateredAt: string;
  plantedAt: string;
}

export interface GardenState {
  plants: GardenPlant[];
  coins: number; // earned gently by tending
  unlockedDecorations: string[];
}

export interface AquariumFish {
  id: string;
  color: string;
  name: string;
  size: number;
  speed: number;
}

export interface AquariumState {
  fish: AquariumFish[];
  foodCount: number;
  lastFedAt: string | null;
}

export interface PenguinState {
  name: string;
  hunger: number; // 0-100
  happiness: number; // 0-100
  accessory: string;
  lastFedAt: string | null;
}

export interface RoomConfig {
  wallpaper: string;
  lighting: 'warm' | 'sunset' | 'night' | 'aurora';
  hasRain: boolean;
  hasMusic: boolean;
  mugType: 'tea' | 'chocolate' | 'matcha' | 'water';
  petId: 'penguin' | 'cat' | 'none';
  dailyIntention: string;
}

export interface MiniGameSummary {
  id: string;
  title: string;
  category: 'Relaxar' | 'Criar' | 'Desafios Leves' | 'Pausa Rápida';
  duration: string;
  description: string;
  iconName: string;
  noTimer: boolean;
  lowStimulusFriendly: boolean;
}
