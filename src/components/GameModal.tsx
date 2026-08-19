"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Game } from '@/data/games';
import { X, Maximize2, RotateCcw, Loader2, Star, ExternalLink } from 'lucide-react';

interface GameModalProps {
  game: Game | null;
  onClose: () => void;
}

export const GameModal: React.FC<GameModalProps> = ({ game, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [key, setKey] = useState(0);
  const iframeContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (game) {
      setIsLoading(true);
      setKey((prev) => prev + 1);
    }
  }, [game]);

  if (!game) return null;

  const handleRefresh = () => {
    setIsLoading(true);
    setKey((prev) => prev + 1);
  };

  const handleFullscreen = () => {
    if (iframeContainerRef.current) {
      if (iframeContainerRef.current.requestFullscreen) {
        iframeContainerRef.current.requestFullscreen();
      }
    }
  };

  const handleOpenExternal = () => {
    window.open(game.embedUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div 
        ref={iframeContainerRef}
        className="relative w-full max-w-5xl h-[88vh] bg-slate-900 rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-800"
      >
        {/* Top Control Bar */}
        <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between shrink-0">
          
          {/* Game Info */}
          <div className="flex items-center gap-3">
            <img
              src={game.thumbnail}
              alt={game.title}
              className="w-10 h-10 rounded-xl object-cover border border-slate-700"
            />
            <div>
              <h2 className="text-white font-bold text-base leading-tight flex items-center gap-2">
                {game.title}
                <span className="text-xs bg-teal-500/20 text-teal-300 font-semibold px-2 py-0.5 rounded-full border border-teal-500/30">
                  {game.category}
                </span>
              </h2>
              <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                <span className="flex items-center gap-1 text-amber-400 font-bold">
                  <Star className="w-3 h-3 fill-amber-400" />
                  {game.rating}
                </span>
                <span>•</span>
                <span>{game.plays} plays</span>
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            
            {/* Open Direct in New Window */}
            <button
              onClick={handleOpenExternal}
              title="Open Game in Full Screen Tab"
              className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </button>

            {/* Refresh */}
            <button
              onClick={handleRefresh}
              title="Restart Game"
              className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Fullscreen */}
            <button
              onClick={handleFullscreen}
              title="Fullscreen Mode"
              className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            {/* Close Modal */}
            <button
              onClick={onClose}
              title="Close Game"
              className="p-2.5 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500 hover:text-white transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Game iFrame Player Body */}
        <div className="relative flex-1 bg-black w-full h-full overflow-hidden">
          
          {/* Loading Spinner */}
          {isLoading && (
            <div className="absolute inset-0 bg-slate-900 flex flex-col items-center justify-center gap-3 z-10">
              <Loader2 className="w-10 h-10 text-teal-400 animate-spin" />
              <p className="text-slate-300 text-sm font-medium">Loading {game.title}...</p>
            </div>
          )}

          {/* High-Performance Game iFrame (Without restrictive sandbox blocking WebGL) */}
          <iframe
            key={key}
            src={game.embedUrl}
            title={game.title}
            className="w-full h-full border-none"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen; pointer-lock"
            onLoad={() => setIsLoading(false)}
          />
        </div>

      </div>
    </div>
  );
};
