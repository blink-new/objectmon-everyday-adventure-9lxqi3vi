import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { SpriteManager } from '../engine/SpriteManager';
import { Move, ObjectMon } from '../types/game';
import { TYPE_EFFECTIVENESS } from '../types/game';

export function BattleScreen() {
  const { state, endBattle, dispatch } = useGame();
  const { battle } = state;
  const [battleMessage, setBattleMessage] = useState<string>('');
  const [menuMode, setMenuMode] = useState<'main' | 'fight' | 'bag' | 'objectmon' | 'run'>('main');
  const spriteManager = new SpriteManager();

  useEffect(() => {
    if (battle) {
      setBattleMessage(`A wild ${battle.opponentObjectMon.name} appeared!`);
    }
  }, [battle]);

  if (!battle) return null;

  const playerMon = battle.playerObjectMon;
  const opponentMon = battle.opponentObjectMon;

  const calculateDamage = (attacker: ObjectMon, defender: ObjectMon, move: Move): number => {
    const level = attacker.level;
    const attack = move.category === 'Physical' ? attacker.baseStats.attack : attacker.baseStats.spAttack;
    const defense = move.category === 'Physical' ? defender.baseStats.defense : defender.baseStats.spDefense;
    
    // Type effectiveness
    let effectiveness = 1;
    for (const defenderType of defender.types) {
      const typeEffect = TYPE_EFFECTIVENESS[move.type]?.[defenderType];
      if (typeEffect !== undefined) {
        effectiveness *= typeEffect;
      }
    }
    
    // Random factor
    const random = 0.85 + Math.random() * 0.15;
    
    // Damage formula
    const damage = ((((2 * level / 5 + 2) * move.power * attack / defense) / 50) + 2) * effectiveness * random;
    
    return Math.floor(damage);
  };

  const executeMove = (move: Move, isPlayer: boolean) => {
    const attacker = isPlayer ? playerMon : opponentMon;
    const defender = isPlayer ? opponentMon : playerMon;
    
    setBattleMessage(`${attacker.name} used ${move.name}!`);
    
    if (move.category !== 'Status') {
      const damage = calculateDamage(attacker, defender, move);
      defender.hp = Math.max(0, defender.hp - damage);
      
      setTimeout(() => {
        setBattleMessage(`It dealt ${damage} damage!`);
        
        if (defender.hp === 0) {
          setTimeout(() => {
            setBattleMessage(`${defender.name} fainted!`);
            setTimeout(() => {
              endBattle(isPlayer ? 'win' : 'lose');
            }, 2000);
          }, 1000);
        } else if (isPlayer) {
          // Opponent's turn
          setTimeout(() => {
            const opponentMove = opponentMon.moves[Math.floor(Math.random() * opponentMon.moves.length)];
            executeMove(opponentMove, false);
          }, 2000);
        }
      }, 1000);
    }
  };

  const handleFight = () => {
    setMenuMode('fight');
  };

  const handleBag = () => {
    setMenuMode('bag');
  };

  const handleObjectMon = () => {
    setMenuMode('objectmon');
  };

  const handleRun = () => {
    if (battle.battleType === 'Wild') {
      setBattleMessage('Got away safely!');
      setTimeout(() => {
        endBattle('flee');
      }, 1000);
    } else {
      setBattleMessage("Can't escape from a trainer battle!");
    }
  };

  const handleMoveSelect = (moveIndex: number) => {
    setMenuMode('main');
    executeMove(playerMon.moves[moveIndex], true);
  };

  const handleUseItem = (itemId: string) => {
    if (itemId === 'basic_capsule' && battle.battleType === 'Wild') {
      const catchRate = (3 * opponentMon.maxHp - 2 * opponentMon.hp) / (3 * opponentMon.maxHp);
      if (Math.random() < catchRate) {
        setBattleMessage(`${opponentMon.name} was caught!`);
        dispatch({ type: 'USE_ITEM', itemId });
        dispatch({ type: 'ADD_OBJECTMON', objectmon: opponentMon });
        setTimeout(() => {
          endBattle('capture');
        }, 2000);
      } else {
        setBattleMessage(`The capsule missed!`);
        dispatch({ type: 'USE_ITEM', itemId });
      }
    }
    setMenuMode('main');
  };

  const renderHealthBar = (current: number, max: number) => {
    const percentage = (current / max) * 100;
    let barColor = 'var(--gb-light)';
    if (percentage <= 20) barColor = 'var(--gb-darkest)';
    else if (percentage <= 50) barColor = 'var(--gb-dark)';

    return (
      <div className="health-bar w-full h-2 mb-1" style={{ background: 'var(--gb-darkest)' }}>
        <div 
          className="health-fill h-full transition-all duration-500"
          style={{ width: `${percentage}%`, background: barColor }}
        />
      </div>
    );
  };

  const renderBattleMenu = () => {
    switch (menuMode) {
      case 'main':
        return (
          <div className="grid grid-cols-2 gap-2 p-4">
            <button 
              onClick={handleFight}
              className="gb-button pixel-font text-sm py-2"
            >
              FIGHT
            </button>
            <button 
              onClick={handleBag}
              className="gb-button pixel-font text-sm py-2"
            >
              BAG
            </button>
            <button 
              onClick={handleObjectMon}
              className="gb-button pixel-font text-sm py-2"
            >
              OBJECTMON
            </button>
            <button 
              onClick={handleRun}
              className="gb-button pixel-font text-sm py-2"
            >
              RUN
            </button>
          </div>
        );
      
      case 'fight':
        return (
          <div className="grid grid-cols-2 gap-2 p-4">
            {playerMon.moves.map((move, index) => (
              <button
                key={index}
                onClick={() => handleMoveSelect(index)}
                className="gb-button pixel-font text-xs py-2"
              >
                <div>{move.name}</div>
                <div className="text-xs opacity-75">PP: {move.pp}/{move.maxPP}</div>
              </button>
            ))}
          </div>
        );
      
      case 'bag':
        return (
          <div className="p-4">
            {state.player.inventory.map((item) => (
              <button
                key={item.id}
                onClick={() => handleUseItem(item.id)}
                className="gb-button pixel-font text-sm py-2 w-full mb-2"
              >
                {item.name} x{item.quantity}
              </button>
            ))}
            <button
              onClick={() => setMenuMode('main')}
              className="gb-button pixel-font text-sm py-2 w-full"
            >
              BACK
            </button>
          </div>
        );
      
      default:
        return (
          <div className="p-4">
            <button
              onClick={() => setMenuMode('main')}
              className="gb-button pixel-font text-sm py-2 w-full"
            >
              BACK
            </button>
          </div>
        );
    }
  };

  return (
    <div className="game-screen gameboy-screen flex flex-col">
      {/* Battle Arena */}
      <div className="flex-1 relative" style={{ background: 'var(--gb-lightest)' }}>
        {/* Opponent */}
        <div className="absolute top-4 right-8">
          <div className="mb-2">
            <div className="pixel-font text-xs mb-1" style={{ color: 'var(--gb-darkest)' }}>
              {opponentMon.name} Lv{opponentMon.level}
            </div>
            {renderHealthBar(opponentMon.hp, opponentMon.maxHp)}
            <div className="pixel-font text-xs" style={{ color: 'var(--gb-dark)' }}>
              HP: {opponentMon.hp}/{opponentMon.maxHp}
            </div>
          </div>
          <canvas
            width={64}
            height={64}
            className="pixel-art"
            ref={(canvas) => {
              if (canvas) {
                const ctx = canvas.getContext('2d')!;
                ctx.imageSmoothingEnabled = false;
                spriteManager.drawSprite(ctx, opponentMon.name.toLowerCase(), 16, 16, 2);
              }
            }}
          />
        </div>

        {/* Player */}
        <div className="absolute bottom-4 left-8">
          <canvas
            width={64}
            height={64}
            className="pixel-art"
            ref={(canvas) => {
              if (canvas) {
                const ctx = canvas.getContext('2d')!;
                ctx.imageSmoothingEnabled = false;
                ctx.save();
                ctx.scale(-1, 1);
                spriteManager.drawSprite(ctx, playerMon.name.toLowerCase(), -48, 16, 2);
                ctx.restore();
              }
            }}
          />
          <div className="mt-2">
            <div className="pixel-font text-xs mb-1" style={{ color: 'var(--gb-darkest)' }}>
              {playerMon.name} Lv{playerMon.level}
            </div>
            {renderHealthBar(playerMon.hp, playerMon.maxHp)}
            <div className="pixel-font text-xs" style={{ color: 'var(--gb-dark)' }}>
              HP: {playerMon.hp}/{playerMon.maxHp}
            </div>
          </div>
        </div>
      </div>

      {/* Battle UI */}
      <div className="h-32 battle-ui">
        {battleMessage ? (
          <div className="p-4 pixel-font text-sm" style={{ color: 'var(--gb-darkest)' }}>
            {battleMessage}
          </div>
        ) : (
          renderBattleMenu()
        )}
      </div>
    </div>
  );
}