"use client";

import React, { useState, useRef } from 'react';
import { Game } from '@/data/games';
import { Play, Star, Sparkles } from 'lucide-react';

interface GameCardProps {
  game: Game;
  onSelectGame: (game: Game) => void;
}

export const GameCard: React.FC<GameCardProps> = ({ game, onSelectGame }) => {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {
        // Video autoplay policy fallback handling
      });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const tileClassMap: Record<string, string> = {
    '1x1': 'tile-1x1',
    '2x2': 'tile-2x2',
    '2x1': 'tile-2x1',
    '1x2': 'tile-1x2',
  };

  return (
    <div
      onClick={() => onSelectGame(game)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`group relative cursor-pointer overflow-hidden rounded-[22px] bg-white shadow-tile hover:shadow-tileHover transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.03] active:scale-[0.98] ${tileClassMap[game.gridSize] || 'tile-1x1'}`}
    >
      {/* Game Thumbnail Image */}
      <img
        src={game.thumbnail}
        alt={game.title}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isHovered && game.previewVideo ? 'opacity-0' : 'opacity-100'
        }`}
        loading="lazy"
      />

      {/* Hover Video Preview (Plays on cursor touch/hover) */}
      {game.previewVideo && (
        <video
          ref={videoRef}
          src={game.previewVideo}
          muted
          loop
          playsInline
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}

      {/* Animated Canvas Overlay fallback when hovered */}
      {isHovered && !game.previewVideo && (
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] flex items-center justify-center transition-opacity duration-300">
          <div className="w-12 h-12 rounded-full bg-white/90 shadow-lg flex items-center justify-center transform scale-110">
            <Play className="w-6 h-6 text-teal-600 fill-teal-600 ml-1" />
          </div>
        </div>
      )}

      {/* Special Badge (Poki-style) */}
      {game.isSpecial && (
        <div className="absolute top-2.5 left-2.5 bg-amber-400 text-slate-950 font-black text-[10px] tracking-wider px-2 py-0.5 rounded-full shadow flex items-center gap-1 uppercase">
          <Sparkles className="w-3 h-3 fill-slate-950" />
          SPECIAL
        </div>
      )}

      {/* Game Title & Plays Info Overlay on Hover */}
      <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end">
        <h3 className="text-white font-bold text-xs sm:text-sm truncate drop-shadow">
          {game.title}
        </h3>
        <div className="flex items-center justify-between text-[11px] text-slate-200 mt-0.5">
          <span className="font-semibold text-teal-300">{game.category}</span>
          <span className="flex items-center gap-0.5 text-amber-300 font-bold">
            <Star className="w-3 h-3 fill-amber-300" />
            {game.rating}
          </span>
        </div>
      </div>
    </div>
  );
};
