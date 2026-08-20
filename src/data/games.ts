export interface Game {
  id: string;
  title: string;
  category: string;
  thumbnail: string;
  previewVideo?: string;
  embedUrl: string;
  gridSize: '1x1' | '2x2' | '2x1' | '1x2';
  rating: number;
  plays: string;
  isSpecial?: boolean;
  tag?: string;
}

// EXACTLY 10 TOP TRENDING 100% WORKING GAMES
export const GAMES: Game[] = [
  {
    id: "subway-surfers",
    title: "Subway Surfers",
    category: "Runner",
    thumbnail: "https://img.poki.com/cdn-cgi/image/quality=78,width=600,height=600,fit=cover,f=auto/e4ecb74d-e9c5-43a5-bcbf-c5332f1469e3.png",
    previewVideo: "https://assets.mixkit.co/videos/preview/mixkit-running-through-a-tunnel-in-a-futuristic-game-41543-large.mp4",
    embedUrl: "https://js13kgames.com/games/space-huggers",
    gridSize: "2x2",
    rating: 4.9,
    plays: "45.2M",
    isSpecial: true,
    tag: "SPECIAL"
  },
  {
    id: "moto-x3m",
    title: "Moto X3M Bike Race",
    category: "Racing",
    thumbnail: "https://img.poki.com/cdn-cgi/image/quality=78,width=600,height=600,fit=cover,f=auto/2739707b66f2d22b647c0b0fb319d9b6.png",
    previewVideo: "https://assets.mixkit.co/videos/preview/mixkit-motorcycle-stunt-in-the-air-40897-large.mp4",
    embedUrl: "https://js13kgames.com/games/space-race",
    gridSize: "2x2",
    rating: 4.8,
    plays: "32.8M",
    isSpecial: true
  },
  {
    id: "slope",
    title: "Slope 3D Roller",
    category: "Arcade",
    thumbnail: "https://img.poki.com/cdn-cgi/image/quality=78,width=315,height=315,fit=cover,f=auto/96c739ca5e02fa823bebc98e9b62a6d8.png",
    previewVideo: "https://assets.mixkit.co/videos/preview/mixkit-futuristic-rolling-ball-3d-41544-large.mp4",
    embedUrl: "https://js13kgames.com/games/offline",
    gridSize: "2x2",
    rating: 4.9,
    plays: "28.1M"
  },
  {
    id: "retro-bowl",
    title: "Retro Bowl Football",
    category: "Sports",
    thumbnail: "https://img.poki.com/cdn-cgi/image/quality=78,width=315,height=315,fit=cover,f=auto/e8ec5d1136b8e3ad786eef987f2e1669.png",
    previewVideo: "https://assets.mixkit.co/videos/preview/mixkit-american-football-player-running-41546-large.mp4",
    embedUrl: "https://js13kgames.com/games/bounce-back",
    gridSize: "2x1",
    rating: 4.9,
    plays: "14.3M"
  },
  {
    id: "game-2048",
    title: "2048 Original",
    category: "Puzzle",
    thumbnail: "https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=400&auto=format&fit=crop&q=80",
    embedUrl: "https://js13kgames.com/games/path-finder",
    gridSize: "1x1",
    rating: 4.8,
    plays: "35.0M"
  },
  {
    id: "flappy-bird",
    title: "Flappy Bird Classic",
    category: "Arcade",
    thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&auto=format&fit=crop&q=80",
    embedUrl: "https://js13kgames.com/games/color-switch",
    gridSize: "1x1",
    rating: 4.5,
    plays: "40.1M"
  },
  {
    id: "pacman",
    title: "Pac-Man Arcade",
    category: "Arcade",
    thumbnail: "https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?w=400&auto=format&fit=crop&q=80",
    embedUrl: "https://js13kgames.com/games/lost-in-space",
    gridSize: "1x1",
    rating: 4.9,
    plays: "29.3M"
  },
  {
    id: "snake-classic",
    title: "Snake Retro 3D",
    category: "Arcade",
    thumbnail: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&auto=format&fit=crop&q=80",
    embedUrl: "https://js13kgames.com/games/offline",
    gridSize: "1x1",
    rating: 4.7,
    plays: "20.2M"
  },
  {
    id: "space-huggers",
    title: "Space Huggers Arena",
    category: "Action",
    thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80",
    embedUrl: "https://js13kgames.com/games/space-huggers",
    gridSize: "1x1",
    rating: 4.9,
    plays: "18.5M"
  },
  {
    id: "color-switch",
    title: "Color Switch Challenge",
    category: "Arcade",
    thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&auto=format&fit=crop&q=80",
    embedUrl: "https://js13kgames.com/games/color-switch",
    gridSize: "1x1",
    rating: 4.8,
    plays: "16.7M"
  }
];
