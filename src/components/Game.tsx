import React from 'react';
import { useGame } from '../context/GameContext';
import { TitleScreen } from './TitleScreen';
import { Overworld } from './Overworld';
import { BattleScreen } from './BattleScreen';
import { StarterSelection } from './StarterSelection';
import { DialogueBox } from './DialogueBox';

export function Game() {
  const { state } = useGame();
  const { currentScreen, dialogue, player } = state;

  const renderCurrentScreen = () => {
    // Show starter selection if player has no ObjectMon and is in overworld
    if (currentScreen === 'Overworld' && player.party.length === 0) {
      return <StarterSelection />;
    }

    switch (currentScreen) {
      case 'Title':
        return <TitleScreen />;
      case 'Overworld':
        return <Overworld />;
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