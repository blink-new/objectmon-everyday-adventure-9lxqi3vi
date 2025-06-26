import React, { useEffect } from 'react';
import { GameEngine, Entity } from '../engine/GameEngine';
import { SpriteManager } from '../engine/SpriteManager';
import { useGame } from '../context/GameContext';

interface OverworldProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  engineRef: React.MutableRefObject<GameEngine | null>;
}

// Starter Town map data (20x18)
const STARTER_TOWN_MAP = [
  [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [2,0,0,0,5,5,5,5,0,0,0,0,0,3,3,3,3,0,0,2],
  [2,0,0,0,5,5,5,5,0,0,0,0,0,3,3,3,3,0,0,2],
  [2,0,0,0,5,5,5,5,0,0,0,0,0,3,3,3,3,0,0,2],
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

// Collision map (true = solid)
const COLLISION_MAP = STARTER_TOWN_MAP.map(row => 
  row.map(tile => tile === 2 || tile === 3) // Trees and buildings are solid
);

// Encounter map (true = can encounter wild ObjectMon)
const ENCOUNTER_MAP = STARTER_TOWN_MAP.map(row => 
  row.map(tile => tile === 1) // Tall grass has encounters
);

export function Overworld({ canvasRef, engineRef }: OverworldProps) {
  const { state } = useGame();
  const spriteManager = new SpriteManager();

  useEffect(() => {
    if (!canvasRef.current || !engineRef.current) return;

    const engine = engineRef.current;
    
    // Load the map
    engine.loadMap(STARTER_TOWN_MAP, COLLISION_MAP, ENCOUNTER_MAP);

    // Add player entity
    const playerEntity: Entity = {
      id: 'player',
      x: state.player.position.x,
      y: state.player.position.y,
      sprite: {
        x: 0, y: 0,
        width: 16, height: 16,
        frameX: 0, frameY: 0,
        animated: false,
        frames: 1,
        frameSpeed: 0,
        currentFrame: 0,
        frameTimer: 0
      },
      solid: true,
      type: 'player',
      direction: state.player.direction,
      moving: false,
      moveSpeed: 4 // tiles per second
    };
    engine.addEntity(playerEntity);

    // Add some NPCs
    const npc1: Entity = {
      id: 'npc1',
      x: 7,
      y: 8,
      sprite: {
        x: 0, y: 0,
        width: 16, height: 16,
        frameX: 0, frameY: 0,
        animated: false,
        frames: 1,
        frameSpeed: 0,
        currentFrame: 0,
        frameTimer: 0
      },
      solid: true,
      type: 'npc',
      direction: 'down',
      moving: false,
      moveSpeed: 0
    };
    engine.addEntity(npc1);

    const npc2: Entity = {
      id: 'npc2',
      x: 14,
      y: 5,
      sprite: {
        x: 0, y: 0,
        width: 16, height: 16,
        frameX: 0, frameY: 0,
        animated: false,
        frames: 1,
        frameSpeed: 0,
        currentFrame: 0,
        frameTimer: 0
      },
      solid: true,
      type: 'npc',
      direction: 'left',
      moving: false,
      moveSpeed: 0
    };
    engine.addEntity(npc2);

    // Start the game loop
    engine.start();

    // Custom render function to use our sprite manager
    const originalRender = (engine as any).render.bind(engine);
    (engine as any).render = function(interpolation: number) {
      const ctx = canvasRef.current!.getContext('2d')!;
      ctx.imageSmoothingEnabled = false;
      
      // Clear canvas
      ctx.fillStyle = '#e0f8d0';
      ctx.fillRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
      
      // Call original render for tiles
      originalRender(interpolation);
      
      // Custom entity rendering with sprites
      const cameraX = (engine as any).cameraX;
      const cameraY = (engine as any).cameraY;
      
      // Draw entities with proper sprites
      const entities = (engine as any).entities as Map<string, Entity>;
      const sortedEntities = Array.from(entities.values()).sort((a, b) => a.y - b.y);
      
      for (const entity of sortedEntities) {
        let renderX = entity.x;
        let renderY = entity.y;
        
        if (entity.moving && entity.targetX !== undefined && entity.targetY !== undefined) {
          const dx = entity.targetX - entity.x;
          const dy = entity.targetY - entity.y;
          renderX += dx * interpolation;
          renderY += dy * interpolation;
        }
        
        const screenX = (renderX - cameraX) * 16;
        const screenY = (renderY - cameraY) * 16;
        
        if (screenX < -16 || screenX > canvasRef.current!.width ||
            screenY < -16 || screenY > canvasRef.current!.height) {
          continue;
        }
        
        // Draw sprite based on entity type
        let spriteName = 'player';
        if (entity.type === 'npc') spriteName = 'npc';
        
        spriteManager.drawSprite(ctx, spriteName, screenX, screenY);
      }
    };

  }, [state.player.position.x, state.player.position.y, state.player.direction, spriteManager]);

  return (
    <div className="game-screen gameboy-screen">
      <canvas 
        ref={canvasRef}
        width={320}
        height={288}
        className="w-full h-full"
        style={{ imageRendering: 'pixelated' }}
      />
      
      {/* HUD Overlay */}
      <div className="absolute top-2 left-2 text-xs pixel-font" style={{ color: 'var(--gb-darkest)' }}>
        <div>Coins: {state.player.coins}</div>
        <div>Party: {state.player.party.length}/6</div>
      </div>
      
      {/* Instructions */}
      <div className="absolute bottom-2 left-2 right-2 text-xs pixel-font text-center" style={{ color: 'var(--gb-darkest)' }}>
        Use ARROW KEYS to move • SPACE to interact
      </div>
    </div>
  );
}