import React, { useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';

// Game Boy palette
const PALETTE = {
  lightest: '#e0f8d0',
  light: '#88c070',
  dark: '#346856',
  darkest: '#081820',
};

const WIDTH = 20;
const HEIGHT = 18;

// 0 = grass, 1 = tall grass, 2 = tree, 3 = building, 4 = path
const MAP = [
  [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [2,0,0,0,1,1,1,1,0,0,0,0,0,3,3,3,3,0,0,2],
  [2,0,0,0,1,1,1,1,0,0,0,0,0,3,3,3,3,0,0,2],
  [2,0,0,0,1,1,1,1,0,0,0,0,0,3,3,3,3,0,0,2],
  [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [2,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,2],
  [2,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,2],
  [2,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,2],
  [2,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,2],
  [2,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,2],
  [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [2,0,3,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [2,0,3,3,3,3,0,0,0,0,0,0,3,3,3,3,0,0,0,2],
  [2,0,3,3,3,3,0,0,0,0,0,0,3,3,3,3,0,0,0,2],
  [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2]
];

const COLLISION = [2,3]; // Trees and buildings
const ENCOUNTER = 1; // Tall grass

const NPCS = [
  { x: 7, y: 8, color: PALETTE.darkest },
  { x: 14, y: 5, color: PALETTE.darkest },
];

export function Overworld() {
  const { state, movePlayer, startBattle } = useGame();
  const { player } = state;
  const containerRef = useRef<HTMLDivElement>(null);

  // Movement and encounter logic
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      let dir: 'up'|'down'|'left'|'right'|undefined;
      if (e.key === 'ArrowUp' || e.key === 'w') dir = 'up';
      if (e.key === 'ArrowDown' || e.key === 's') dir = 'down';
      if (e.key === 'ArrowLeft' || e.key === 'a') dir = 'left';
      if (e.key === 'ArrowRight' || e.key === 'd') dir = 'right';
      if (!dir) return;
      e.preventDefault();
      // Calculate new position
      let { x, y } = player.position;
      if (dir === 'up') y -= 1;
      if (dir === 'down') y += 1;
      if (dir === 'left') x -= 1;
      if (dir === 'right') x += 1;
      // Bounds check
      if (x < 0 || x >= WIDTH || y < 0 || y >= HEIGHT) return;
      // Collision check
      if (COLLISION.includes(MAP[y][x])) return;
      movePlayer(dir);
      // Tall grass encounter
      if (MAP[y][x] === ENCOUNTER && Math.random() < 0.15) {
        // Random wild ObjectMon (Toaster, Pencil, Mug)
        const wildId = [1,2,3][Math.floor(Math.random()*3)];
        startBattle({ id: wildId } as any, true);
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [player.position, movePlayer, startBattle]);

  return (
    <div ref={containerRef} className="game-screen gameboy-screen relative" style={{ width: 320, height: 288, background: PALETTE.lightest, border: `8px solid ${PALETTE.darkest}` }}>
      <div className="tile-grid absolute left-0 top-0" style={{ width: 320, height: 288, gridTemplateColumns: 'repeat(20, 16px)', gridTemplateRows: 'repeat(18, 16px)' }}>
        {MAP.map((row, y) =>
          row.map((tile, x) => {
            let bg = PALETTE.light;
            if (tile === 1) bg = PALETTE.dark; // Tall grass
            if (tile === 2) bg = PALETTE.darkest; // Tree
            if (tile === 3) bg = PALETTE.lightest; // Building
            return (
              <div key={x + '-' + y} className="tile" style={{ width: 16, height: 16, background: bg, position: 'relative', border: tile === 1 ? `1px solid ${PALETTE.dark}` : undefined }}>
                {/* Player */}
                {player.position.x === x && player.position.y === y && (
                  <div style={{ width: 14, height: 14, background: PALETTE.darkest, borderRadius: 2, position: 'absolute', left: 1, top: 1, zIndex: 2, border: `2px solid ${PALETTE.light}` }} />
                )}
                {/* NPCs */}
                {NPCS.find(n => n.x === x && n.y === y) && (
                  <div style={{ width: 14, height: 14, background: PALETTE.dark, borderRadius: 2, position: 'absolute', left: 1, top: 1, zIndex: 2, border: `2px solid ${PALETTE.lightest}` }} />
                )}
              </div>
            );
          })
        )}
      </div>
      {/* HUD Overlay */}
      <div className="absolute top-2 left-2 text-xs pixel-font" style={{ color: PALETTE.darkest }}>
        <div>Coins: {player.coins}</div>
        <div>Party: {player.party.length}/6</div>
      </div>
      <div className="absolute bottom-2 left-2 right-2 text-xs pixel-font text-center" style={{ color: PALETTE.darkest }}>
        Use ARROW KEYS/WASD to move • SPACE to interact
      </div>
    </div>
  );
}
