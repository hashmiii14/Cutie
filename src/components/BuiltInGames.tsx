"use client";

import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw, Trophy } from 'lucide-react';

interface BuiltInGameProps {
  gameId: string;
  title: string;
}

export const BuiltInGames: React.FC<BuiltInGameProps> = ({ gameId, title }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // Determine game type based on ID
  const type = gameId.includes('snake') ? 'snake'
    : gameId.includes('2048') ? '2048'
    : gameId.includes('flappy') ? 'flappy'
    : gameId.includes('pacman') || gameId.includes('space') ? 'shooter'
    : gameId.includes('slope') || gameId.includes('runner') ? 'runner'
    : 'brick';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let localScore = 0;
    let isDead = false;

    // Canvas Size Setup
    canvas.width = 640;
    canvas.height = 440;

    // --- GAME ENGINE LOGIC ---

    if (type === 'snake') {
      const gridSize = 20;
      let snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
      let food = { x: 15, y: 15 };
      let dx = 1, dy = 0;
      let moveInterval = 0;

      const handleKey = (e: KeyboardEvent) => {
        if (e.key === 'ArrowUp' && dy === 0) { dx = 0; dy = -1; }
        if (e.key === 'ArrowDown' && dy === 0) { dx = 0; dy = 1; }
        if (e.key === 'ArrowLeft' && dx === 0) { dx = -1; dy = 0; }
        if (e.key === 'ArrowRight' && dx === 0) { dx = 1; dy = 0; }
      };
      window.addEventListener('keydown', handleKey);

      const loop = () => {
        if (isDead) return;
        moveInterval++;
        if (moveInterval % 6 === 0) {
          const head = { x: snake[0].x + dx, y: snake[0].y + dy };
          
          // Collision check
          if (head.x < 0 || head.x >= canvas.width / gridSize || head.y < 0 || head.y >= canvas.height / gridSize) {
            isDead = true;
            setGameOver(true);
            return;
          }
          for (let part of snake) {
            if (part.x === head.x && part.y === head.y) {
              isDead = true;
              setGameOver(true);
              return;
            }
          }

          snake.unshift(head);
          if (head.x === food.x && head.y === food.y) {
            localScore += 10;
            setScore(localScore);
            food = {
              x: Math.floor(Math.random() * (canvas.width / gridSize)),
              y: Math.floor(Math.random() * (canvas.height / gridSize))
            };
          } else {
            snake.pop();
          }
        }

        // Draw background
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw food
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(food.x * gridSize + gridSize/2, food.y * gridSize + gridSize/2, gridSize/2 - 2, 0, Math.PI * 2);
        ctx.fill();

        // Draw snake
        snake.forEach((part, idx) => {
          ctx.fillStyle = idx === 0 ? '#10b981' : '#34d399';
          ctx.fillRect(part.x * gridSize + 1, part.y * gridSize + 1, gridSize - 2, gridSize - 2);
        });

        animationFrameId = requestAnimationFrame(loop);
      };
      loop();

      return () => {
        window.removeEventListener('keydown', handleKey);
        cancelAnimationFrame(animationFrameId);
      };
    } else if (type === 'flappy') {
      let birdY = 200;
      let velocity = 0;
      let gravity = 0.45;
      let pipes: { x: number; top: number; bottom: number }[] = [];
      let frame = 0;

      const jump = () => {
        velocity = -7.5;
      };
      const handleKey = (e: KeyboardEvent) => { if (e.code === 'Space' || e.key === 'ArrowUp') jump(); };
      canvas.addEventListener('click', jump);
      window.addEventListener('keydown', handleKey);

      const loop = () => {
        if (isDead) return;
        frame++;
        velocity += gravity;
        birdY += velocity;

        if (birdY > canvas.height || birdY < 0) {
          isDead = true;
          setGameOver(true);
          return;
        }

        if (frame % 90 === 0) {
          const gap = 120;
          const top = Math.floor(Math.random() * (canvas.height - gap - 60)) + 30;
          pipes.push({ x: canvas.width, top, bottom: canvas.height - top - gap });
        }

        ctx.fillStyle = '#0284c7';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw pipes
        ctx.fillStyle = '#22c55e';
        for (let i = 0; i < pipes.length; i++) {
          let p = pipes[i];
          p.x -= 2.5;
          ctx.fillRect(p.x, 0, 48, p.top);
          ctx.fillRect(p.x, canvas.height - p.bottom, 48, p.bottom);

          // Check bird collision
          if (p.x < 120 && p.x + 48 > 90) {
            if (birdY < p.top || birdY > canvas.height - p.bottom) {
              isDead = true;
              setGameOver(true);
              return;
            }
          }

          if (p.x + 48 === 90) {
            localScore += 1;
            setScore(localScore);
          }
        }

        // Draw bird
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(100, birdY, 14, 0, Math.PI * 2);
        ctx.fill();

        animationFrameId = requestAnimationFrame(loop);
      };
      loop();

      return () => {
        canvas.removeEventListener('click', jump);
        window.removeEventListener('keydown', handleKey);
        cancelAnimationFrame(animationFrameId);
      };
    } else {
      // Space Shooter / Runner Engine
      let playerX = 300;
      let bullets: { x: number; y: number }[] = [];
      let enemies: { x: number; y: number }[] = [];
      let frame = 0;

      const handleKey = (e: KeyboardEvent) => {
        if (e.key === 'ArrowLeft' && playerX > 20) playerX -= 25;
        if (e.key === 'ArrowRight' && playerX < canvas.width - 40) playerX += 25;
        if (e.code === 'Space') bullets.push({ x: playerX + 15, y: canvas.height - 40 });
      };
      window.addEventListener('keydown', handleKey);

      const loop = () => {
        if (isDead) return;
        frame++;

        if (frame % 40 === 0) {
          enemies.push({ x: Math.random() * (canvas.width - 30), y: 0 });
        }

        ctx.fillStyle = '#0b0f19';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Player
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(playerX, canvas.height - 30, 30, 20);

        // Bullets
        ctx.fillStyle = '#f43f5e';
        for (let i = bullets.length - 1; i >= 0; i--) {
          let b = bullets[i];
          b.y -= 7;
          ctx.fillRect(b.x, b.y, 4, 10);
          if (b.y < 0) bullets.splice(i, 1);
        }

        // Enemies
        ctx.fillStyle = '#a855f7';
        for (let i = enemies.length - 1; i >= 0; i--) {
          let en = enemies[i];
          en.y += 3;
          ctx.fillRect(en.x, en.y, 25, 25);

          if (en.y > canvas.height - 40 && Math.abs(en.x - playerX) < 30) {
            isDead = true;
            setGameOver(true);
            return;
          }

          // Bullet hits enemy
          for (let j = bullets.length - 1; j >= 0; j--) {
            let b = bullets[j];
            if (b.x > en.x && b.x < en.x + 25 && b.y > en.y && b.y < en.y + 25) {
              enemies.splice(i, 1);
              bullets.splice(j, 1);
              localScore += 10;
              setScore(localScore);
              break;
            }
          }
        }

        animationFrameId = requestAnimationFrame(loop);
      };
      loop();

      return () => {
        window.removeEventListener('keydown', handleKey);
        cancelAnimationFrame(animationFrameId);
      };
    }
  }, [gameId, type, gameOver]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-slate-950 p-4">
      
      {/* Canvas Game Area */}
      <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-900">
        <canvas ref={canvasRef} className="block cursor-pointer max-w-full h-auto" />

        {/* Score Overlay */}
        <div className="absolute top-3 left-4 flex items-center gap-4 text-white font-bold text-sm bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-700 backdrop-blur">
          <span>SCORE: <span className="text-teal-400">{score}</span></span>
        </div>

        {/* Game Over Screen */}
        {gameOver && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-30">
            <h3 className="text-3xl font-extrabold text-rose-500 mb-2">GAME OVER</h3>
            <p className="text-slate-300 text-sm mb-4">Final Score: <span className="font-bold text-teal-400 text-lg">{score}</span></p>
            <button
              onClick={() => { setGameOver(false); setScore(0); }}
              className="px-6 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl flex items-center gap-2 transition-transform hover:scale-105"
            >
              <RotateCcw className="w-4 h-4" /> PLAY AGAIN
            </button>
          </div>
        )}
      </div>

      {/* Control Help Bar */}
      <p className="text-xs text-slate-400 mt-3 text-center">
        🎮 Controls: Use <span className="font-bold text-teal-300">Arrow Keys / Spacebar / Touch</span> to play
      </p>

    </div>
  );
};
