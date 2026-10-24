import React, { useState } from 'react';
import { GameStorageService } from '../../services/gameStorage';
import { GardenPlant } from '../../types/games';
import { AmbientSound } from '../../services/soundService';
import { Sparkles, Droplets, Plus, Flower2, Heart, ArrowLeft } from 'lucide-react';

interface CloudGardenGameProps {
  onBack: () => void;
}

export const CloudGardenGame: React.FC<CloudGardenGameProps> = ({ onBack }) => {
  const [garden, setGarden] = useState(() => GameStorageService.getGardenState());
  const [activeMessage, setActiveMessage] = useState<string>('Toque em uma planta para regar ou plantar uma nova semente.');

  const handleWaterPlant = (id: string) => {
    AmbientSound.playGentleChime();
    const updatedPlants = garden.plants.map(p => {
      if (p.id === id) {
        const nextStage = p.stage < 3 ? p.stage + 1 : 3;
        return { ...p, stage: nextStage, wateredAt: new Date().toISOString() };
      }
      return p;
    });
    const newCoins = garden.coins + 2;
    const updatedState = { ...garden, plants: updatedPlants, coins: newCoins };
    setGarden(updatedState);
    GameStorageService.saveGardenState(updatedState);
    setActiveMessage('Você regou com carinho. A planta cresceu um pouquinho!');
  };

  const handlePlantNew = (type: GardenPlant['type'], name: string) => {
    AmbientSound.playGentleChime();
    const newPlant: GardenPlant = {
      id: `plant-${Date.now()}`,
      type,
      name,
      stage: 0,
      wateredAt: new Date().toISOString(),
      plantedAt: new Date().toISOString()
    };
    const updatedState = { ...garden, plants: [...garden.plants, newPlant], coins: garden.coins + 5 };
    setGarden(updatedState);
    GameStorageService.saveGardenState(updatedState);
    setActiveMessage(`Você plantou "${name}". Regue quando quiser vê-la florescer.`);
  };

  const getPlantVisual = (type: GardenPlant['type'], stage: number) => {
    const icons = {
      sunflower: ['🌱', '🌿', '🌻', '🌻✨'],
      lavender: ['🌱', '🌿', '🌾', '💜🌾'],
      fern: ['🌱', '🌿', '🌴', '🌿✨'],
      cherry_blossom: ['🌱', '🌿', '🌸', '🌸✨'],
      succulent: ['🌱', '🪴', '🌵', '🌵💚']
    };
    return icons[type]?.[stage] || '🌱';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-300 bg-slate-900 border border-slate-800 hover:bg-slate-800 py-2 px-3 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao AmparoPlay</span>
        </button>
        <div className="flex items-center gap-2 bg-teal-950/80 border border-teal-800/60 px-3 py-1.5 rounded-xl text-teal-300 text-xs font-semibold">
          <Sparkles className="w-4 h-4 text-teal-400" />
          <span>Folhas de Sereno: {garden.coins}</span>
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-teal-950/40 border border-slate-800/80 p-6 rounded-3xl shadow-xl text-center space-y-3">
        <div className="w-14 h-14 bg-teal-500/10 border border-teal-500/30 rounded-2xl mx-auto flex items-center justify-center text-teal-300 text-2xl">
          🌻
        </div>
        <h2 className="text-xl font-bold font-serif text-slate-100">Jardim das Nuvens</h2>
        <p className="text-sm text-slate-300 max-w-md mx-auto">
          Um espaço verde que floresce no seu ritmo. Suas plantas nunca murcham e não há prazos.
        </p>
        <div className="inline-block bg-teal-950/60 border border-teal-700/50 text-teal-200 text-xs px-3 py-1 rounded-lg">
          {activeMessage}
        </div>
      </div>

      {/* Garden Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {garden.plants.map((plant) => (
          <div
            key={plant.id}
            onClick={() => handleWaterPlant(plant.id)}
            className="group bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800/90 hover:border-teal-500/50 p-5 rounded-3xl text-center cursor-pointer transition-all shadow-lg flex flex-col items-center justify-between min-h-[160px]"
          >
            <div className="text-xs text-slate-400 font-mono tracking-wide">Estágio {plant.stage + 1}/4</div>
            <div className="text-4xl group-hover:scale-110 transition-transform my-2">
              {getPlantVisual(plant.type, plant.stage)}
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-200">{plant.name}</div>
              <div className="text-xs text-teal-400 mt-1 flex items-center justify-center gap-1 opacity-80 group-hover:opacity-100">
                <Droplets className="w-3.5 h-3.5" />
                <span>Toque para regar</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Plant New Seed Bar */}
      <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
          <Flower2 className="w-4 h-4 text-teal-400" />
          <span>Plantar nova semente:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handlePlantNew('sunflower', 'Novo Girassol')}
            className="px-3 py-1.5 rounded-xl text-xs bg-amber-950/50 hover:bg-amber-900/70 border border-amber-700/60 text-amber-200 transition-all flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Girassol
          </button>
          <button
            onClick={() => handlePlantNew('lavender', 'Nova Lavanda')}
            className="px-3 py-1.5 rounded-xl text-xs bg-purple-950/50 hover:bg-purple-900/70 border border-purple-700/60 text-purple-200 transition-all flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Lavanda
          </button>
          <button
            onClick={() => handlePlantNew('cherry_blossom', 'Flor de Cerejeira')}
            className="px-3 py-1.5 rounded-xl text-xs bg-rose-950/50 hover:bg-rose-900/70 border border-rose-700/60 text-rose-200 transition-all flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Cerejeira
          </button>
          <button
            onClick={() => handlePlantNew('succulent', 'Suculenta Mansa')}
            className="px-3 py-1.5 rounded-xl text-xs bg-teal-950/50 hover:bg-teal-900/70 border border-teal-700/60 text-teal-200 transition-all flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Suculenta
          </button>
        </div>
      </div>
    </div>
  );
};
