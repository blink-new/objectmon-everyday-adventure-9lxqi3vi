import React from 'react';

// Game Boy palette
const PALETTE = {
  lightest: '#e0f8d0',
  light: '#88c070',
  dark: '#346856',
  darkest: '#081820',
  white: '#fff',
  black: '#000',
  sign: '#f8f8f8',
  roof: '#e8b8c8',
  flower: '#e8b8c8',
  path: '#e0f8d0',
};

// 20x18 grid, matching reference
const MAP = [
  // y=0
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  // y=1
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  // y=2
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  // y=3
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  // y=4
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  // y=5
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  // y=6
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  // y=7
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  // y=8
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  // y=9
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  // y=10
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  // y=11
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  // y=12
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  // y=13
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  // y=14
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  // y=15
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  // y=16
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  // y=17
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

// Tall grass patches (as in reference)
const TALL_GRASS = [
  // y, x
  [6, 4],[6, 5],[6, 6],[6, 7],[6, 8],[6, 9],[6, 10],
  [7, 4],[7, 5],[7, 6],[7, 7],[7, 8],[7, 9],[7, 10],
  [8, 4],[8, 5],[8, 6],[8, 7],[8, 8],[8, 9],[8, 10],
  [9, 4],[9, 5],[9, 6],[9, 7],[9, 8],[9, 9],[9, 10],
  [10, 4],[10, 5],[10, 6],[10, 7],[10, 8],[10, 9],[10, 10],
];

// Trees (as in reference)
const TREES = [
  // y, x
  [0, 0],[0, 1],[0, 2],[0, 3],[0, 4],[0, 5],[0, 6],[0, 7],[0, 8],[0, 9],[0, 10],[0, 11],[0, 12],[0, 13],[0, 14],[0, 15],[0, 16],[0, 17],[0, 18],[0, 19],
  [1, 0],[1, 19],
  [2, 0],[2, 19],
  [3, 0],[3, 19],
  [4, 0],[4, 19],
  [5, 0],[5, 19],
  [6, 0],[6, 19],
  [7, 0],[7, 19],
  [8, 0],[8, 19],
  [9, 0],[9, 19],
  [10, 0],[10, 19],
  [11, 0],[11, 19],
  [12, 0],[12, 19],
  [13, 0],[13, 19],
  [14, 0],[14, 19],
  [15, 0],[15, 19],
  [16, 0],[16, 19],
  [17, 0],[17, 1],[17, 2],[17, 3],[17, 4],[17, 5],[17, 6],[17, 7],[17, 8],[17, 9],[17, 10],[17, 11],[17, 12],[17, 13],[17, 14],[17, 15],[17, 16],[17, 17],[17, 18],[17, 19],
];

// Player and NPCs (as in reference)
const PLAYER = { x: 6, y: 8 };
const NPCS = [
  { x: 7, y: 8, color: PALETTE.darkest }, // NPC below player
  { x: 2, y: 10, color: PALETTE.darkest }, // NPC near sign
];

// Sign and building
const SIGN = { x: 2, y: 9 };
const BUILDING = { x: 1, y: 13, w: 4, h: 3 };

export function Overworld() {
  return (
    <div className="game-screen gameboy-screen flex flex-col items-center justify-center" style={{ width: 320, height: 288, background: PALETTE.lightest, border: `8px solid ${PALETTE.darkest}` }}>
      <div className="tile-grid" style={{ width: 320, height: 288, gridTemplateColumns: 'repeat(20, 16px)', gridTemplateRows: 'repeat(18, 16px)' }}>
        {MAP.map((row, y) =>
          row.map((_, x) => {
            // Tall grass
            const isGrass = TALL_GRASS.some(([gy, gx]) => gy === y && gx === x);
            // Tree
            const isTree = TREES.some(([ty, tx]) => ty === y && tx === x);
            // Player
            const isPlayer = PLAYER.x === x && PLAYER.y === y;
            // NPC
            const npc = NPCS.find(n => n.x === x && n.y === y);
            // Sign
            const isSign = SIGN.x === x && SIGN.y === y;
            // Building
            const isBuilding = x >= BUILDING.x && x < BUILDING.x + BUILDING.w && y >= BUILDING.y && y < BUILDING.y + BUILDING.h;

            let bg = PALETTE.light;
            if (isGrass) bg = PALETTE.dark;
            if (isTree) bg = PALETTE.darkest;
            if (isBuilding) bg = PALETTE.roof;
            if (isSign) bg = PALETTE.sign;

            return (
              <div key={x + '-' + y} className="tile" style={{ width: 16, height: 16, background: bg, position: 'relative', border: isGrass ? `1px solid ${PALETTE.dark}` : undefined }}>
                {/* Player */}
                {isPlayer && (
                  <div style={{ width: 14, height: 14, background: PALETTE.darkest, borderRadius: 2, position: 'absolute', left: 1, top: 1, zIndex: 2, border: `2px solid ${PALETTE.light}` }} />
                )}
                {/* NPCs */}
                {npc && (
                  <div style={{ width: 14, height: 14, background: npc.color, borderRadius: 2, position: 'absolute', left: 1, top: 1, zIndex: 2, border: `2px solid ${PALETTE.lightest}` }} />
                )}
                {/* Sign */}
                {isSign && (
                  <div style={{ width: 12, height: 8, background: PALETTE.sign, border: `2px solid ${PALETTE.darkest}`, position: 'absolute', left: 2, top: 4, zIndex: 2 }} />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
