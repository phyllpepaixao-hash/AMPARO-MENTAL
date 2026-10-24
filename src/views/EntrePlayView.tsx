import React, { useEffect, useState } from 'react';
import { CloudGardenGame } from '../components/games/CloudGardenGame';
import { BreathingBubblesGame } from '../components/games/BreathingBubblesGame';
import { SerenePuzzleGame } from '../components/games/SerenePuzzleGame';
import { AquariumGame } from '../components/games/AquariumGame';
import { GroundingGame } from '../components/games/GroundingGame';
import { ConstellationGame } from '../components/games/ConstellationGame';
import { PenguinGame } from '../components/games/PenguinGame';
import { ColorAtelierGame } from '../components/games/ColorAtelierGame';
import { Sparkles, Gamepad2, Heart, Search, Filter, Shield } from 'lucide-react';

interface EntrePlayViewProps {
  onNavigate: (tab: string) => void;
}

export const EntrePlayView: React.FC<EntrePlayViewProps> = ({ onNavigate }) => {
  const [activeGameId, setActiveGameId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('entreplay_favorites_v1');
      if (!saved) return ['garden', 'bubbles'];
      const parsed: unknown = JSON.parse(saved);
      return Array.isArray(parsed) && parsed.every((item) => typeof item === 'string') ? parsed : ['garden', 'bubbles'];
    } catch {
      return ['garden', 'bubbles'];
    }
  });

  useEffect(() => {
    try { localStorage.setItem('entreplay_favorites_v1', JSON.stringify(favorites)); } catch { /* Storage can be unavailable in private browsing. */ }
  }, [favorites]);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(f => f !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  const games = [
    {
      id: 'garden',
      title: 'Jardim das Nuvens',
      category: 'Criar',
      duration: '2-3 min',
      description: 'Plante e regue flores e sementes em um jardim acolhedor que nunca murcha.',
      icon: '🌻',
      component: CloudGardenGame
    },
    {
      id: 'bubbles',
      title: 'Bolhas de Respiro',
      category: 'Relaxar',
      duration: '1-2 min',
      description: 'Acompanhe a respiração guiada ou estoure bolhas flutuantes com leveza.',
      icon: '🫧',
      component: BreathingBubblesGame
    },
    {
      id: 'puzzle',
      title: 'Quebra-cabeça Sereno',
      category: 'Desafios Leves',
      duration: '3-5 min',
      description: 'Organize peças com símbolos de paz e serenidade sem pressa ou cronômetro.',
      icon: '🧩',
      component: SerenePuzzleGame
    },
    {
      id: 'aquarium',
      title: 'Aquário Tranquilo',
      category: 'Relaxar',
      duration: '1-3 min',
      description: 'Observe o nado suave dos peixinhos e gere ondulações de água calmantes.',
      icon: '🐠',
      component: AquariumGame
    },
    {
      id: 'grounding',
      title: 'Missão Cinco Sentidos',
      category: 'Pausa Rápida',
      duration: '2 min',
      description: 'Técnica guiada de ancoragem 5-4-3-2-1 para trazer a mente ao presente.',
      icon: '⚓',
      component: GroundingGame
    },
    {
      id: 'constellation',
      title: 'Constelação dos Pensamentos',
      category: 'Criar',
      duration: '2 min',
      description: 'Transforme pensamentos pesados em poeira estelar e conecte estrelas no céu.',
      icon: '✨',
      component: ConstellationGame
    },
    {
      id: 'penguin',
      title: 'Cuidar do Pingo',
      category: 'Relaxar',
      duration: '1 min',
      description: 'Um companheiro fofinho para dar petiscos, carinho e receber afeto.',
      icon: '🐧',
      component: PenguinGame
    },
    {
      id: 'atelier',
      title: 'Ateliê de Cores',
      category: 'Criar',
      duration: '3 min',
      description: 'Pinte padrões e manchas pastel em um canvas livre de julgamentos.',
      icon: '🎨',
      component: ColorAtelierGame
    },
  ];

  const filteredGames = games.filter(g => {
    if (selectedCategory === 'todos') return true;
    if (selectedCategory === 'favoritos') return favorites.includes(g.id);
    return g.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  if (activeGameId) {
    const activeGameObj = games.find(g => g.id === activeGameId);
    if (activeGameObj) {
      const ComponentToRender = activeGameObj.component;
      return <ComponentToRender onBack={() => setActiveGameId(null)} />;
    }
  }

  return (
    <div className="entre-play space-y-6">
      {/* Header Banner */}
      <div className="entre-play-hero bg-gradient-to-br from-teal-950/80 via-slate-900 to-indigo-950/70 border border-teal-800/60 p-6 rounded-3xl shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-teal-900/60 border border-teal-700/60 text-teal-300 text-xs font-semibold">
            <Gamepad2 className="w-4 h-4 text-teal-400" />
            <span>AmparoPlay — Pequenas Pausas</span>
          </div>
          <span className="text-xs text-slate-400 font-mono">8 Minijogos</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold font-serif text-slate-100">Um lugar para respirar, brincar e pausar.</h1>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            Atividades leves, sem punições, sem prazos e sem obrigatoriedade. Escolha o que trouxer mais paz ao seu momento.
          </p>
        </div>
      </div>

      {/* Filter Categories */}
      <div className="flex flex-wrap gap-2 items-center">
        {['todos', 'favoritos', 'relaxar', 'criar', 'desafios leves', 'pausa rápida'].map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-2 rounded-xl text-xs font-medium capitalize transition-all border ${
              selectedCategory === cat
                ? 'bg-teal-950 border-teal-500 text-teal-300 shadow'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredGames.map(game => {
          const isFav = favorites.includes(game.id);
          return (
            <div
              key={game.id}
              onClick={() => setActiveGameId(game.id)}
              role="group"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveGameId(game.id); } }}
              aria-label={`Abrir jogo ${game.title}`}
              className={`entre-game-card group bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800/90 hover:border-teal-500/60 p-5 rounded-3xl cursor-pointer transition-all shadow-lg flex flex-col justify-between ${game.id === 'garden' ? 'entre-game-card--garden' : game.id === 'bubbles' ? 'entre-game-card--bubbles' : game.id === 'puzzle' ? 'entre-game-card--puzzle' : game.id === 'aquarium' ? 'entre-game-card--aquarium' : ''}`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="entre-game-art w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    {game.icon}
                  </div>
                  <button
                    onClick={(e) => toggleFavorite(game.id, e)}
                    className={`p-2 rounded-xl border transition-all ${
                      isFav
                        ? 'bg-rose-950/60 border-rose-700/60 text-rose-300'
                        : 'bg-slate-950/60 border-slate-800 text-slate-500 hover:text-rose-400'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                  </button>
                </div>
                <h3 className="text-base font-bold text-slate-100 group-hover:text-teal-300 transition-colors font-serif">{game.title}</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed line-clamp-2">{game.description}</p>
              </div>

              <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-800/60 text-[11px] text-slate-400">
                <span className="bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">{game.category}</span>
                <span className="font-mono text-teal-400">{game.duration}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
