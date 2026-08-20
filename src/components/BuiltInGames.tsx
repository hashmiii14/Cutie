"use client";

import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw, Trophy, Play } from 'lucide-react';

interface BuiltInGameProps {
  gameId: string;
  title: string;
}

export const BuiltInGames: React.FC<BuiltInGameProps> = ({ gameId, title }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let localScore = 0;
    let isDead = false;

    canvas.width = 640;
    canvas.height = 420;

    // --- GAME TYPE IDENTIFICATION ---
    const isSnake = gameId.includes('snake');
    const isFlappy = gameId.includes('flappy');
    const isRunner = gameId.includes('subway') || gameId.includes('slope');
    const isMoto = gameId.includes('moto');
    const isShooter = gameId.includes('space') || gameId.includes('pacman');
    const isColor = gameId.includes('color');

    // 1. SNAKE GAME
    if (isSnake) {
      const gridSize = 20;
      let snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
      let food = { x: 15, y: 15 };
      let dx = 1, dy = 0;
      let moveInterval = 0;

      const handleKey = (e: KeyboardEvent) => {
        if ((e.key === 'ArrowUp' || e.key === 'w') && dy === 0) { dx = 0; dy = -1; }
        if ((e.key === 'ArrowDown' || e.key === 's') && dy === 0) { dx = 0; dy = 1; }
        if ((e.key === 'ArrowLeft' || e.key === 'a') && dx === 0) { dx = -1; dy = 0; }
        if ((e.key === 'ArrowRight' || e.key === 'd') && dx === 0) { dx = 1; dy = 0; }
      };
      window.addEventListener('keydown', handleKey);

      const loop = () => {
        if (isDead) return;
        moveInterval++;
        if (moveInterval % 5 === 0) {
          const head = { x: snake[0].x + dx, y: snake[0].y + dy };

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

        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(food.x * gridSize + gridSize/2, food.y * gridSize + gridSize/2, gridSize/2 - 2, 0, Math.PI * 2);
        ctx.fill();

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
    } 
    
    // 2. FLAPPY BIRD
    else if (isFlappy) {
      let birdY = 200;
      let velocity = 0;
      let gravity = 0.45;
      let pipes: { x: number; top: number; bottom: number }[] = [];
      let frame = 0;

      const jump = () => { velocity = -7.5; };
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

        if (frame % 85 === 0) {
          const gap = 120;
          const top = Math.floor(Math.random() * (canvas.height - gap - 60)) + 30;
          pipes.push({ x: canvas.width, top, bottom: canvas.height - top - gap });
        }

        ctx.fillStyle = '#0284c7';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#22c55e';
        for (let i = 0; i < pipes.length; i++) {
          let p = pipes[i];
          p.x -= 2.8;
          ctx.fillRect(p.x, 0, 48, p.top);
          ctx.fillRect(p.x, canvas.height - p.bottom, 48, p.bottom);

          if (p.x < 114 && p.x + 48 > 90) {
            if (birdY < p.top || birdY > canvas.height - p.bottom) {
              isDead = true;
              setGameOver(true);
              return;
            }
          }

          if (Math.abs(p.x - 90) < 2) {
            localScore += 1;
            setScore(localScore);
          }
        }

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
    } 
    
    // 3. SUBWAY / SLOPE RUNNER
    else if (isRunner) {
      let playerLane = 1; // 0: Left, 1: Center, 2: Right
      let obstacles: { lane: number; y: number }[] = [];
      let speed = 5;
      let frame = 0;

      const handleKey = (e: KeyboardEvent) => {
        if ((e.key === 'ArrowLeft' || e.key === 'a') && playerLane > 0) playerLane--;
        if ((e.key === 'ArrowRight' || e.key === 'd') && playerLane < 2) playerLane++;
      };
      window.addEventListener('keydown', handleKey);

      const loop = () => {
        if (isDead) return;
        frame++;
        localScore += 1;
        if (frame % 10 === 0) setScore(Math.floor(localScore / 10));

        if (frame % 45 === 0) {
          const lane = Math.floor(Math.random() * 3);
          obstacles.push({ lane, y: -40 });
        }

        // Draw track
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Lanes
        ctx.strokeStyle = '#334155';
        ctx.setLineDash([15, 15]);
        ctx.beginPath();
        ctx.moveTo(canvas.width / 3, 0); ctx.lineTo(canvas.width / 3, canvas.height);
        ctx.moveTo((canvas.width / 3) * 2, 0); ctx.lineTo((canvas.width / 3) * 2, canvas.height);
        ctx.stroke();

        // Player
        const laneWidth = canvas.width / 3;
        const playerX = playerLane * laneWidth + laneWidth / 2 - 20;
        ctx.fillStyle = '#06b6d4';
        ctx.fillRect(playerX, canvas.height - 70, 40, 50);

        // Obstacles
        ctx.fillStyle = '#f43f5e';
        for (let i = obstacles.length - 1; i >= 0; i--) {
          let obs = obstacles[i];
          obs.y += speed;
          const obsX = obs.lane * laneWidth + laneWidth / 2 - 25;
          ctx.fillRect(obsX, obs.y, 50, 30);

          if (obs.y > canvas.height - 90 && obs.y < canvas.height - 20 && obs.lane === playerLane) {
            isDead = true;
            setGameOver(true);
            return;
          }
          if (obs.y > canvas.height) obstacles.splice(i, 1);
        }

        animationFrameId = requestAnimationFrame(loop);
      };
      loop();

      return () => {
        window.removeEventListener('keydown', handleKey);
        cancelAnimationFrame(animationFrameId);
      };
    }

    // 4. MOTO X3M BIKE STUNT
    else if (isMoto) {
      let bikeY = 250;
      let bikeAngle = 0;
      let terrainOffset = 0;
      let frame = 0;

      const handleKey = (e: KeyboardEvent) => {
        if (e.key === 'ArrowLeft') bikeAngle -= 0.15;
        if (e.key === 'ArrowRight') bikeAngle += 0.15;
      };
      window.addEventListener('keydown', handleKey);

      const loop = () => {
        if (isDead) return;
        frame++;
        terrainOffset += 4;
        localScore += 1;
        setScore(Math.floor(localScore / 10));

        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw Hills
        ctx.fillStyle = '#334155';
        ctx.beginPath();
        ctx.moveTo(0, canvas.height);
        for (let x = 0; x <= canvas.width; x += 10) {
          const y = canvas.height - 80 + Math.sin((x + terrainOffset) * 0.02) * 30;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(canvas.width, canvas.height);
        ctx.fill();

        // Bike
        ctx.save();
        ctx.translate(150, bikeY);
        ctx.rotate(bikeAngle);
        ctx.fillStyle = '#eab308';
        ctx.fillRect(-20, -10, 40, 20);
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(-15, 10, 10, 0, Math.PI * 2);
        ctx.arc(15, 10, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        if (Math.abs(bikeAngle) > Math.PI * 0.8) {
          isDead = true;
          setGameOver(true);
          return;
        }

        animationFrameId = requestAnimationFrame(loop);
      };
      loop();

      return () => {
        window.removeEventListener('keydown', handleKey);
        cancelAnimationFrame(animationFrameId);
      };
    }

    // 5. SHOOTER / SPACE / COLOR
    else {
      let playerX = 300;
      let bullets: { x: number; y: number }[] = [];
      let enemies: { x: number; y: number }[] = [];
      let frame = 0;

      const handleKey = (e: KeyboardEvent) => {
        if ((e.key === 'ArrowLeft' || e.key === 'a') && playerX > 20) playerX -= 25;
        if ((e.key === 'ArrowRight' || e.key === 'd') && playerX < canvas.width - 40) playerX += 25;
        if (e.code === 'Space') bullets.push({ x: playerX + 15, y: canvas.height - 40 });
      };
      window.addEventListener('keydown', handleKey);

      const loop = () => {
        if (isDead) return;
        frame++;

        if (frame % 35 === 0) {
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
          b.y -= 8;
          ctx.fillRect(b.x, b.y, 4, 10);
          if (b.y < 0) bullets.splice(i, 1);
        }

        // Enemies
        ctx.fillStyle = '#a855f7';
        for (let i = enemies.length - 1; i >= 0; i--) {
          let en = enemies[i];
          en.y += 3.5;
          ctx.fillRect(en.x, en.y, 25, 25);

          if (en.y > canvas.height - 40 && Math.abs(en.x - playerX) < 30) {
            isDead = true;
            setGameOver(true);
            return;
          }

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
  }, [gameId, gameOver]);

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
              <RotateCcw className="w-4 h-4" /> RESTART GAME
            </button>
          </div>
        )}
      </div>

      {/* Control Help Bar */}
      <p className="text-xs text-slate-400 mt-3 text-center">
        🎮 Controls: Use <span className="font-bold text-teal-300">Arrow Keys / WASD / Spacebar / Touch</span> to play
      </p>

    </div>
  );
};
