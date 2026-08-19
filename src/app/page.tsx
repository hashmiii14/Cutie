"use client";

import React, { useState, useMemo } from 'react';
import { Header } from '@/components/Header';
import { GameCard } from '@/components/GameCard';
import { GameModal } from '@/components/GameModal';
import { GAMES, Game } from '@/data/games';
import { Flame, Gamepad2, Trophy, Compass } from 'lucide-react';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeGame, setActiveGame] = useState<Game | null>(null);

  const filteredGames = useMemo(() => {
    return GAMES.filter((game) => {
      const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            game.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || game.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const categories = ['All', 'Runner', 'Racing', 'Sports', 'Action', 'Arcade', 'Puzzle', 'Board'];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Sticky Header */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Category Pills Bar (Poki Style Minimal) */}
      <div className="px-4 md:px-8 py-2 max-w-7xl mx-auto w-full overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white scale-105 shadow-md'
                  : 'bg-white/80 hover:bg-white text-slate-700 hover:scale-102'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Game Grid Container */}
      <main className="flex-1 px-4 md:px-8 py-4 max-w-7xl mx-auto w-full">
        {filteredGames.length > 0 ? (
          <div className="poki-grid pb-12">
            {filteredGames.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                onSelectGame={(g) => setActiveGame(g)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white/80 rounded-3xl p-12 text-center max-w-md mx-auto my-12 shadow-poki">
            <Gamepad2 className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">No games found</h3>
            <p className="text-sm text-slate-500 mt-1">Try searching for something else like "Subway" or "Racing"</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
              className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
            >
              Reset Search
            </button>
          </div>
        )}
      </main>

      {/* Poki-style Minimal Footer */}
      <footer className="mt-auto py-6 px-4 border-t border-white/20 bg-teal-600/10 text-center text-xs text-slate-800 font-medium">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-base tracking-tight text-slate-900">Cutie</span>
            <span>© {new Date().getFullYear()} Cutie Games Platform</span>
          </div>
          <p className="text-slate-700">Top 100 Trending Free Online Games</p>
        </div>
      </footer>

      {/* Game Modal Player */}
      <GameModal
        game={activeGame}
        onClose={() => setActiveGame(null)}
      />
    </div>
  );
}
