import { GardenState, AquariumState, PenguinState, RoomConfig } from '../types/games';

const GARDEN_KEY = 'amparo_garden_state_v1';
const AQUARIUM_KEY = 'amparo_aquarium_state_v1';
const PENGUIN_KEY = 'amparo_penguin_state_v1';
const ROOM_KEY = 'amparo_room_config_v1';

export const GameStorageService = {
  getGardenState(): GardenState {
    try {
      const data = localStorage.getItem(GARDEN_KEY);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    return {
      plants: [
        { id: 'p1', type: 'sunflower', name: 'Girassol da Manhã', stage: 2, wateredAt: new Date().toISOString(), plantedAt: new Date().toISOString() },
        { id: 'p2', type: 'lavender', name: 'Lavanda Calma', stage: 3, wateredAt: new Date().toISOString(), plantedAt: new Date().toISOString() }
      ],
      coins: 15,
      unlockedDecorations: ['stone_lamp', 'wooden_bench']
    };
  },

  saveGardenState(state: GardenState): void {
    try {
      localStorage.setItem(GARDEN_KEY, JSON.stringify(state));
    } catch (e) {
      console.error(e);
    }
  },

  getAquariumState(): AquariumState {
    try {
      const data = localStorage.getItem(AQUARIUM_KEY);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    return {
      fish: [
        { id: 'f1', color: 'text-teal-400', name: 'Água-viva Zen', size: 1, speed: 1 },
        { id: 'f2', color: 'text-sky-300', name: 'Peixinho Azul', size: 1.2, speed: 1.5 },
        { id: 'f3', color: 'text-indigo-400', name: 'Estrela Serena', size: 0.9, speed: 0.8 }
      ],
      foodCount: 5,
      lastFedAt: null
    };
  },

  saveAquariumState(state: AquariumState): void {
    try {
      localStorage.setItem(AQUARIUM_KEY, JSON.stringify(state));
    } catch (e) {
      console.error(e);
    }
  },

  getPenguinState(): PenguinState {
    try {
      const data = localStorage.getItem(PENGUIN_KEY);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    return {
      name: 'Pingo',
      hunger: 80,
      happiness: 90,
      accessory: 'Cachecol de Lã',
      lastFedAt: null
    };
  },

  savePenguinState(state: PenguinState): void {
    try {
      localStorage.setItem(PENGUIN_KEY, JSON.stringify(state));
    } catch (e) {
      console.error(e);
    }
  },

  getRoomConfig(): RoomConfig {
    try {
      const data = localStorage.getItem(ROOM_KEY);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    return {
      wallpaper: 'bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950',
      lighting: 'warm',
      hasRain: false,
      hasMusic: false,
      mugType: 'tea',
      petId: 'penguin',
      dailyIntention: 'Hoje escolho respirar fundo e fazer o que estiver ao meu alcance, sem pressa.'
    };
  },

  saveRoomConfig(config: RoomConfig): void {
    try {
      localStorage.setItem(ROOM_KEY, JSON.stringify(config));
    } catch (e) {
      console.error(e);
    }
  }
};
