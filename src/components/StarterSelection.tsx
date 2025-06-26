import React, { useState, useRef, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { STARTER_OBJECTMONS } from '../data/objectmons';
import { SpriteManager } from '../engine/SpriteManager';

export function StarterSelection() {
  const { chooseStarter, startDialogue } = useGame();
  const [selectedStarter, setSelectedStarter] = useState<number>(0);
  const [hoveredStarter, setHoveredStarter] = useState<number | null>(null);
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const spriteManager = new SpriteManager();

  useEffect(() => {
    // Start with a dialogue
    startDialogue({
      speaker: 'Professor Oak',
      messages: [
        'Welcome to the world of OBJECTMON!',
        'In this world, everyday objects come to life!',
        'You can collect, battle, and even fuse them together!',
        'But first, choose your starter ObjectMon...'
      ],
      currentMessageIndex: 0,
      onComplete: () => {
        // Dialogue complete
      }
    });
  }, [startDialogue]);

  useEffect(() => {
    // Draw sprites on canvases
    canvasRefs.current.forEach((canvas, index) => {
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d')!;
      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, 64, 64);
      
      const starter = STARTER_OBJECTMONS[index];
      const scale = hoveredStarter === index ? 3 : 2;
      const offset = hoveredStarter === index ? -8 : 0;
      
      spriteManager.drawSprite(ctx, starter.name.toLowerCase(), 16 + offset, 16 + offset, scale);
    });
  }, [hoveredStarter, spriteManager]);

  const handleChooseStarter = () => {
    const starter = STARTER_OBJECTMONS[selectedStarter];
    
    startDialogue({
      speaker: 'Professor Oak',
      messages: [
        `So you chose ${starter.name}!`,
        'An excellent choice!',
        'Take good care of it, and it will grow strong!',
        'Your adventure begins now!'
      ],
      currentMessageIndex: 0,
      onComplete: () => {
        chooseStarter(starter.id);
      }
    });
  };

  return (
    <div className="game-screen gameboy-screen flex flex-col items-center justify-center p-4">
      <h2 className="text-xl pixel-font mb-6" style={{ color: 'var(--gb-darkest)' }}>
        Choose Your Starter!
      </h2>

      <div className="flex gap-8 mb-8">
        {STARTER_OBJECTMONS.map((starter, index) => (
          <div
            key={starter.id}
            className={`cursor-pointer transition-transform ${
              selectedStarter === index ? 'scale-110' : ''
            }`}
            onClick={() => setSelectedStarter(index)}
            onMouseEnter={() => setHoveredStarter(index)}
            onMouseLeave={() => setHoveredStarter(null)}
          >
            <div 
              className={`p-2 border-4 rounded ${
                selectedStarter === index 
                  ? 'border-[var(--gb-darkest)]' 
                  : 'border-[var(--gb-dark)]'
              }`}
              style={{ background: 'var(--gb-light)' }}
            >
              <canvas
                ref={(el) => canvasRefs.current[index] = el}
                width={64}
                height={64}
                className="pixel-art"
                style={{ imageRendering: 'pixelated' }}
              />
            </div>
            <div className="text-center mt-2">
              <p className="pixel-font text-sm" style={{ color: 'var(--gb-darkest)' }}>
                {starter.name}
              </p>
              <p className="pixel-font text-xs" style={{ color: 'var(--gb-dark)' }}>
                {starter.types.join('/')}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Stats Display */}
      <div className="w-full max-w-md mb-6 p-4 border-2" style={{ 
        borderColor: 'var(--gb-darkest)',
        background: 'var(--gb-lightest)'
      }}>
        <h3 className="pixel-font text-sm mb-2" style={{ color: 'var(--gb-darkest)' }}>
          {STARTER_OBJECTMONS[selectedStarter].name} Stats:
        </h3>
        <div className="grid grid-cols-2 gap-2 text-xs pixel-font" style={{ color: 'var(--gb-dark)' }}>
          <div>HP: {STARTER_OBJECTMONS[selectedStarter].baseStats.hp}</div>
          <div>ATK: {STARTER_OBJECTMONS[selectedStarter].baseStats.attack}</div>
          <div>DEF: {STARTER_OBJECTMONS[selectedStarter].baseStats.defense}</div>
          <div>SPD: {STARTER_OBJECTMONS[selectedStarter].baseStats.speed}</div>
        </div>
        <div className="mt-2">
          <p className="pixel-font text-xs" style={{ color: 'var(--gb-dark)' }}>
            Moves: {STARTER_OBJECTMONS[selectedStarter].moves.map(m => m.name).join(', ')}
          </p>
        </div>
      </div>

      <button
        onClick={handleChooseStarter}
        className="gb-button pixel-font text-lg py-3 px-8 animate-pulse"
      >
        I CHOOSE YOU!
      </button>
    </div>
  );
}