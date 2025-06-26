import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { BASE_OBJECTMONS } from '../data/objectmons';

export function StarterSelection() {
  const { chooseStarter } = useGame();
  const [selectedStarter, setSelectedStarter] = useState<number | null>(null);

  const starters = BASE_OBJECTMONS.slice(0, 3); // Toaster, Pencil, Mug

  const handleSelectStarter = (starterId: number) => {
    setSelectedStarter(starterId);
  };

  const handleConfirmSelection = () => {
    if (selectedStarter) {
      chooseStarter(selectedStarter);
    }
  };

  return (
    <div className="game-screen gameboy-screen flex flex-col p-4">
      <div className="text-center mb-6">
        <h2 className="text-lg pixel-font mb-2" style={{ color: 'var(--gb-darkest)' }}>
          Choose Your First ObjectMon!
        </h2>
        <p className="text-sm pixel-font" style={{ color: 'var(--gb-dark)' }}>
          Pick an everyday object to be your companion
        </p>
      </div>

      {/* Starter Options */}
      <div className="flex-1 grid grid-cols-1 gap-4">
        {starters.map((starter) => (
          <div
            key={starter.id}
            className={`p-4 border-2 cursor-pointer transition-all ${
              selectedStarter === starter.id 
                ? 'border-[var(--gb-darkest)] bg-[var(--gb-light)]' 
                : 'border-[var(--gb-dark)] bg-[var(--gb-lightest)]'
            }`}
            onClick={() => handleSelectStarter(starter.id!)}
          >
            <div className="flex items-center space-x-4">
              {/* ObjectMon Icon */}
              <div className="w-12 h-12 border border-[var(--gb-darkest)] flex items-center justify-center"
                   style={{ backgroundColor: 'var(--gb-light)' }}>
                <div className="pixel-font text-sm" style={{ color: 'var(--gb-darkest)' }}>
                  {starter.name![0]}
                </div>
              </div>

              {/* Info */}
              <div className="flex-1">
                <h3 className="pixel-font text-sm mb-1" style={{ color: 'var(--gb-darkest)' }}>
                  {starter.name}
                </h3>
                <div className="text-xs pixel-font mb-2" style={{ color: 'var(--gb-dark)' }}>
                  Types: {starter.types!.join(', ')}
                </div>
                
                {/* Stats */}
                <div className="grid grid-cols-3 gap-1 text-xs pixel-font" style={{ color: 'var(--gb-dark)' }}>
                  <div>HP: {starter.baseStats!.hp}</div>
                  <div>ATK: {starter.baseStats!.attack}</div>
                  <div>DEF: {starter.baseStats!.defense}</div>
                  <div>SPD: {starter.baseStats!.speed}</div>
                  <div>SP.A: {starter.baseStats!.spAttack}</div>
                  <div>SP.D: {starter.baseStats!.spDefense}</div>
                </div>
              </div>

              {/* Selection indicator */}
              {selectedStarter === starter.id && (
                <div className="w-4 h-4 border border-[var(--gb-darkest)]" 
                     style={{ backgroundColor: 'var(--gb-darkest)' }}>
                  <div className="w-full h-full flex items-center justify-center text-xs" 
                       style={{ color: 'var(--gb-lightest)' }}>
                    ✓
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Confirm Button */}
      <div className="mt-4">
        <button
          onClick={handleConfirmSelection}
          disabled={!selectedStarter}
          className={`w-full py-3 px-6 pixel-font text-lg ${
            selectedStarter 
              ? 'gb-button' 
              : 'opacity-50 cursor-not-allowed border-2 border-[var(--gb-dark)]'
          }`}
          style={{
            backgroundColor: selectedStarter ? 'var(--gb-light)' : 'var(--gb-dark)',
            color: 'var(--gb-darkest)'
          }}
        >
          {selectedStarter ? 'CHOOSE THIS OBJECTMON' : 'SELECT AN OBJECTMON'}
        </button>
      </div>

      <div className="mt-2 text-center">
        <p className="text-xs pixel-font" style={{ color: 'var(--gb-dark)' }}>
          This will be your first companion in the ObjectMon world!
        </p>
      </div>
    </div>
  );
}