import React, { useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { SpriteManager } from '../engine/SpriteManager';

export function TitleScreen() {
  const { setScreen } = useGame();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const spriteManager = new SpriteManager();

  useEffect(() => {
    if (!canvasRef.current) return;
    
    const ctx = canvasRef.current.getContext('2d')!;
    ctx.imageSmoothingEnabled = false;
    
    // Clear canvas
    ctx.fillStyle = '#e0f8d0';
    ctx.fillRect(0, 0, 320, 288);
    
    // Draw title text
    ctx.fillStyle = '#081820';
    ctx.font = 'bold 32px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('OBJECTMON', 160, 60);
    
    ctx.font = '16px monospace';
    ctx.fillText('EVERYDAY ADVENTURE', 160, 85);
    
    // Draw some ObjectMon sprites
    spriteManager.drawSprite(ctx, 'toaster', 40, 110, 3);
    spriteManager.drawSprite(ctx, 'pencil', 130, 110, 3);
    spriteManager.drawSprite(ctx, 'mug', 220, 110, 3);
    
    // Animate sprites
    let frame = 0;
    const animate = () => {
      frame++;
      
      // Simple bounce animation
      const bounce = Math.sin(frame * 0.05) * 5;
      
      ctx.fillStyle = '#e0f8d0';
      ctx.fillRect(40, 110, 240, 80);
      
      spriteManager.drawSprite(ctx, 'toaster', 40, 110 + bounce, 3);
      spriteManager.drawSprite(ctx, 'pencil', 130, 110 - bounce, 3);
      spriteManager.drawSprite(ctx, 'mug', 220, 110 + bounce, 3);
      
      requestAnimationFrame(animate);
    };
    
    animate();
  }, [spriteManager]);

  const handleStartGame = () => {
    setScreen('Overworld');
  };

  return (
    <div className="game-screen gameboy-screen relative">
      <canvas 
        ref={canvasRef}
        width={320}
        height={288}
        className="absolute inset-0"
        style={{ imageRendering: 'pixelated' }}
      />
      
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-12">
        {/* Menu Options */}
        <div className="space-y-2 w-full max-w-xs px-8">
          <button
            onClick={handleStartGame}
            className="w-full py-2 px-4 gb-button pixel-font text-sm animate-pulse"
          >
            NEW GAME
          </button>
          
          <button
            className="w-full py-2 px-4 gb-button pixel-font text-sm opacity-50 cursor-not-allowed"
            disabled
          >
            CONTINUE
          </button>
          
          <button
            className="w-full py-2 px-4 gb-button pixel-font text-sm opacity-50 cursor-not-allowed"
            disabled
          >
            SETTINGS
          </button>
        </div>

        {/* Version */}
        <div className="mt-4 text-center">
          <p className="text-xs pixel-font" style={{ color: 'var(--gb-dark)' }}>
            Version 1.0.0
          </p>
        </div>

        {/* Instructions */}
        <div className="mt-2 text-center">
          <p className="text-xs pixel-font" style={{ color: 'var(--gb-dark)' }}>
            Press SPACE to start
          </p>
        </div>
      </div>
    </div>
  );
}