"use client";

import React from 'react';
import { Search, Sparkles, User } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
}) => {
  return (
    <header className="sticky top-0 z-30 pt-3 pb-2 px-4 md:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        
        {/* Left Side: Logo & Main Navigation Card Pill (Poki Style) */}
        <div className="flex items-center gap-3">
          {/* Logo Card */}
          <div className="bg-white rounded-2xl px-5 py-2.5 shadow-poki flex items-center gap-2 cursor-pointer transition-transform hover:scale-105">
            <span className="font-extrabold text-2xl tracking-tight text-slate-900 flex items-center gap-1">
              Cutie <span className="w-2.5 h-2.5 rounded-full bg-teal-500 inline-block animate-pulse"></span>
            </span>
          </div>

          {/* User / Settings Button Pill */}
          <div className="bg-white rounded-2xl p-2.5 shadow-poki flex items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors">
            <User className="w-5 h-5 text-slate-700" />
          </div>

          {/* Special / Featured Pill */}
          <div className="hidden sm:flex bg-white rounded-2xl px-3.5 py-2.5 shadow-poki items-center gap-2 cursor-pointer hover:bg-slate-50 transition-colors">
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span className="text-xs font-bold text-slate-800 tracking-wide">SPECIAL</span>
          </div>
        </div>

        {/* Right Side: Search Input Pill */}
        <div className="flex-1 max-w-xs sm:max-w-md">
          <div className="relative bg-white rounded-2xl shadow-poki flex items-center px-4 py-2.5 transition-all focus-within:ring-2 focus-within:ring-teal-500">
            <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Search 100 games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none outline-none text-sm text-slate-800 placeholder-slate-400 font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs bg-slate-200 text-slate-600 rounded-full w-4 h-4 flex items-center justify-center font-bold"
              >
                ×
              </button>
            )}
          </div>
        </div>

      </div>
    </header>
  );
};
