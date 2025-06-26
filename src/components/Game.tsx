import React, { useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { TitleScreen } from './TitleScreen';
import { Overworld } from './Overworld';
import { BattleScreen } from './BattleScreen';
import { StarterSelection } from './StarterSelection';
import { DialogueBox } from './DialogueBox';
import { GameEngine } from '../engine/GameEngine';
import { createObjectMon } from '../data/objectmons';

export function Game() {
  const { state, startBattle } = useGame();
  const { currentScreen, dialogue, player } = state;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);

  useEffect(() => {
    if (currentScreen === 'Overworld' && canvasRef.current && !engineRef.current) {
      // Initialize game engine
      engineRef.current = new GameEngine(canvasRef.current);
      
      // Set up event listeners
      const handleWildEncounter = () => {
        // Trigger a wild ObjectMon battle
        const wildObjectMon = createObjectMon({ id: Math.floor(Math.random() * 3) + 1 }, 5);
        startBattle(wildObjectMon, true);
      };

      const handleNPCInteraction = (event: CustomEvent) => {
        console.log('NPC interaction:', event.detail);
        // Handle NPC interaction (dialogue, battle, etc.)
      };

      window.addEventListener('wild-encounter', handleWildEncounter as EventListener);
      window.addEventListener('npc-interaction', handleNPCInteraction as EventListener);

      return () => {
        window.removeEventListener('wild-encounter', handleWildEncounter as EventListener);
        window.removeEventListener('npc-interaction', handleNPCInteraction as EventListener);
      };
    }
  }, [currentScreen, startBattle]);

  const renderCurrentScreen = () => {
    // Show starter selection if player has no ObjectMon and is in overworld
    if (currentScreen === 'Overworld' && player.party.length === 0) {
      return <StarterSelection />;
    }

    switch (currentScreen) {
      case 'Title':
        return <TitleScreen />;
      case 'Overworld':
        return <Overworld canvasRef={canvasRef} engineRef={engineRef} />;
      case 'Battle':
        return <BattleScreen />;
      default:
        return <TitleScreen />;
    }
  };

  return (
    <div className="relative">
      {renderCurrentScreen()}
      {dialogue && <DialogueBox />}
    </div>
  );
}