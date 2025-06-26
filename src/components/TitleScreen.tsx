import React from 'react';
import { useGame } from '../context/GameContext';

export function TitleScreen() {
  const { setScreen } = useGame();

  const handleStartGame = () => {
    setScreen('Overworld');
  };

  return (
    <div className="game-screen gameboy-screen flex flex-col items-center justify-center p-8">
      {/* Title Logo */}
      <div className="text-center mb-8">
        <h1 className="text-4xl pixel-font mb-2" style={{ color: 'var(--gb-darkest)' }}>
          OBJECTMON
        </h1>
        <h2 className="text-lg pixel-font" style={{ color: 'var(--gb-dark)' }}>
          EVERYDAY ADVENTURE
        </h2>
      </div>

      {/* Subtitle */}
      <div className="text-center mb-6">
        <p className="text-sm pixel-font" style={{ color: 'var(--gb-dark)' }}>
          Collect, Battle & Fuse Everyday Objects!
        </p>
      </div>

      {/* Menu Options */}
      <div className="space-y-4 w-full max-w-xs">
        <button
          onClick={handleStartGame}
          className="w-full py-3 px-6 gb-button pixel-font text-lg"
        >
          NEW GAME
        </button>
        
        <button
          className="w-full py-3 px-6 gb-button pixel-font text-lg opacity-50 cursor-not-allowed"
          disabled
        >
          CONTINUE
        </button>
        
        <button
          className="w-full py-3 px-6 gb-button pixel-font text-lg opacity-50 cursor-not-allowed"
          disabled
        >
          SETTINGS
        </button>
      </div>

      {/* Version */}
      <div className="mt-8 text-center">
        <p className="text-xs pixel-font" style={{ color: 'var(--gb-dark)' }}>
          Version 1.0.0
        </p>
      </div>

      {/* Instructions */}
      <div className="mt-4 text-center">
        <p className="text-xs pixel-font" style={{ color: 'var(--gb-dark)' }}>
          Use ARROW KEYS or WASD to move
        </p>
        <p className="text-xs pixel-font" style={{ color: 'var(--gb-dark)' }}>
          SPACE or Z to confirm • X or ESC to cancel
        </p>
      </div>
    </div>
  );
}