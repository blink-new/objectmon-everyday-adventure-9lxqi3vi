import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Move } from '../types/game';

export function BattleScreen() {
  const { state, endBattle, addObjectMon } = useGame();
  const { battle, player } = state;
  const [selectedAction, setSelectedAction] = useState<'fight' | 'bag' | 'switch' | 'run' | null>(null);
  const [battleAnimation, setBattleAnimation] = useState<string>('');
  const [showCaptureAttempt, setShowCaptureAttempt] = useState(false);

  if (!battle) return null;

  const { playerObjectMon, opponentObjectMon, battleLog, canCapture } = battle;

  // Handle player turn actions
  const handleFight = () => {
    setSelectedAction('fight');
  };

  const handleBag = () => {
    setSelectedAction('bag');
  };

  const handleSwitch = () => {
    setSelectedAction('switch');
  };

  const handleRun = () => {
    if (Math.random() < 0.5) { // 50% chance to escape
      endBattle('flee');
    } else {
      // Failed to escape
      setBattleAnimation('shake');
      setTimeout(() => setBattleAnimation(''), 500);
    }
  };

  const handleMoveSelect = (move: Move) => {
    setBattleAnimation('bounce');
    
    // Simple damage calculation
    const damage = Math.floor(move.power * 0.5 + Math.random() * 20);
    
    setTimeout(() => {
      setBattleAnimation('');
      // Check if opponent fainted
      if (opponentObjectMon.hp - damage <= 0) {
        if (canCapture && Math.random() < 0.3) { // 30% chance to auto-capture
          setShowCaptureAttempt(true);
          setTimeout(() => {
            addObjectMon(opponentObjectMon);
            endBattle('capture');
          }, 2000);
        } else {
          endBattle('win');
        }
      } else {
        // Continue battle (AI turn would happen here)
        setTimeout(handleAITurn, 1000);
      }
    }, 1000);
  };

  const handleAITurn = () => {
    // Simple AI: random move
    setBattleAnimation('shake');
    
    setTimeout(() => {
      setBattleAnimation('');
      // Check if player ObjectMon fainted
      if (playerObjectMon.hp <= 20) { // Simplified check
        endBattle('lose');
      }
    }, 1000);
  };

  const handleUseCapsule = () => {
    if (!canCapture) return;
    
    setShowCaptureAttempt(true);
    
    // Use item logic would go here
    const itemIndex = player.inventory.findIndex(item => item.id === 'basic_capsule');
    if (itemIndex === -1) return;
    
    setTimeout(() => {
      const captureChance = 0.4; // Base 40% capture rate
      if (Math.random() < captureChance) {
        addObjectMon(opponentObjectMon);
        endBattle('capture');
      } else {
        setShowCaptureAttempt(false);
        setTimeout(handleAITurn, 1000);
      }
    }, 2000);
  };

  const renderMainMenu = () => (
    <div className="grid grid-cols-2 gap-2 h-full">
      <button
        onClick={handleFight}
        className="gb-button pixel-font text-sm p-2"
      >
        FIGHT
      </button>
      <button
        onClick={handleBag}
        className="gb-button pixel-font text-sm p-2"
      >
        BAG
      </button>
      <button
        onClick={handleSwitch}
        className="gb-button pixel-font text-sm p-2 opacity-50"
        disabled={player.party.length <= 1}
      >
        SWITCH
      </button>
      <button
        onClick={handleRun}
        className="gb-button pixel-font text-sm p-2"
      >
        RUN
      </button>
    </div>
  );

  const renderMoveMenu = () => (
    <div className="grid grid-cols-2 gap-2 h-full">
      {playerObjectMon.moves.map((move, index) => (
        <button
          key={index}
          onClick={() => handleMoveSelect(move)}
          className="gb-button pixel-font text-xs p-2 text-left"
        >
          <div>{move.name}</div>
          <div className="text-xs opacity-75">
            {move.pp}/{move.maxPP} PP
          </div>
        </button>
      ))}
      <button
        onClick={() => setSelectedAction(null)}
        className="gb-button pixel-font text-xs p-2"
      >
        BACK
      </button>
    </div>
  );

  const renderBagMenu = () => (
    <div className="grid grid-cols-2 gap-2 h-full">
      {canCapture && (
        <button
          onClick={handleUseCapsule}
          className="gb-button pixel-font text-xs p-2"
        >
          BASIC CAPSULE
        </button>
      )}
      <button
        onClick={() => setSelectedAction(null)}
        className="gb-button pixel-font text-xs p-2"
      >
        BACK
      </button>
    </div>
  );

  return (
    <div className="game-screen gameboy-screen flex flex-col">
      {/* Battle Field */}
      <div className="flex-1 flex flex-col justify-between p-4" 
           style={{ backgroundColor: 'var(--gb-lightest)' }}>
        
        {/* Opponent ObjectMon */}
        <div className="text-center">
          <div className="mb-2">
            <div className={`w-16 h-16 mx-auto border-2 border-[var(--gb-darkest)] ${battleAnimation === 'shake' ? 'shake' : ''}`}
                 style={{ backgroundColor: 'var(--gb-light)' }}>
              <div className="flex items-center justify-center h-full pixel-font text-xs" 
                   style={{ color: 'var(--gb-darkest)' }}>
                {opponentObjectMon.name}
              </div>
            </div>
          </div>
          <div className="text-xs pixel-font" style={{ color: 'var(--gb-darkest)' }}>
            {opponentObjectMon.name} Lv.{opponentObjectMon.level}
          </div>
          {/* HP Bar */}
          <div className="w-24 mx-auto mt-1 health-bar">
            <div 
              className="health-fill h-2"
              style={{ width: `${(opponentObjectMon.hp / opponentObjectMon.maxHp) * 100}%` }}
            />
          </div>
        </div>

        {/* VS Text */}
        <div className="text-center pixel-font text-lg" style={{ color: 'var(--gb-darkest)' }}>
          VS
        </div>

        {/* Player ObjectMon */}
        <div className="text-center">
          <div className="text-xs pixel-font mb-1" style={{ color: 'var(--gb-darkest)' }}>
            {playerObjectMon.name} Lv.{playerObjectMon.level}
          </div>
          {/* HP Bar */}
          <div className="w-24 mx-auto mb-2 health-bar">
            <div 
              className="health-fill h-2"
              style={{ width: `${(playerObjectMon.hp / playerObjectMon.maxHp) * 100}%` }}
            />
          </div>
          <div className={`w-16 h-16 mx-auto border-2 border-[var(--gb-darkest)] ${battleAnimation === 'bounce' ? 'bounce' : ''}`}
               style={{ backgroundColor: 'var(--gb-light)' }}>
            <div className="flex items-center justify-center h-full pixel-font text-xs" 
                 style={{ color: 'var(--gb-darkest)' }}>
              {playerObjectMon.name}
            </div>
          </div>
        </div>
      </div>

      {/* Battle Log */}
      <div className="h-16 border-t-2 border-[var(--gb-darkest)] p-2 text-box">
        <div className="pixel-font text-xs" style={{ color: 'var(--gb-darkest)' }}>
          {battleLog[battleLog.length - 1]}
          {showCaptureAttempt && (
            <div className="mt-1 fade-in">
              Attempting to capture...
            </div>
          )}
        </div>
      </div>

      {/* Battle Menu */}
      <div className="h-20 border-t-2 border-[var(--gb-darkest)] p-2" 
           style={{ backgroundColor: 'var(--gb-light)' }}>
        {selectedAction === 'fight' && renderMoveMenu()}
        {selectedAction === 'bag' && renderBagMenu()}
        {selectedAction === 'switch' && (
          <div className="text-center pixel-font text-xs" style={{ color: 'var(--gb-darkest)' }}>
            Switch not implemented yet
          </div>
        )}
        {!selectedAction && renderMainMenu()}
      </div>
    </div>
  );
}