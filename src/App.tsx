import React from 'react';
import { GameProvider } from './context/GameContext';
import { Game } from './components/Game';

function App() {
  return (
    <GameProvider>
      <div className="min-h-screen flex items-center justify-center p-4">
        <Game />
      </div>
    </GameProvider>
  );
}

export default App;