import React, { useEffect, useCallback } from 'react';
import { useGame } from '../context/GameContext';
import { createObjectMon } from '../data/objectmons';

export function Overworld() {
  const { state, movePlayer, startBattle, startDialogue } = useGame();
  const { player, currentRegion } = state;

  // Handle keyboard input for movement
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    event.preventDefault();
    
    switch (event.key.toLowerCase()) {
      case 'arrowup':
      case 'w':
        movePlayer('up');
        break;
      case 'arrowdown':
      case 's':
        movePlayer('down');
        break;
      case 'arrowleft':
      case 'a':
        movePlayer('left');
        break;
      case 'arrowright':
      case 'd':
        movePlayer('right');
        break;
      case ' ':
      case 'z':
        handleInteraction();
        break;
      case 'enter':
        handleMenu();
        break;
    }
  }, [movePlayer]);

  // Handle interaction with objects/NPCs
  const handleInteraction = () => {
    // Check if player is on tall grass (encounter check)
    const currentTile = getTileAt(player.position.x, player.position.y);
    if (currentTile === 2) { // Tall grass tile
      // 15% chance for encounter
      if (Math.random() < 0.15) {
        const wildObjectMon = createObjectMon({ id: Math.floor(Math.random() * 6) + 1 }, 
          Math.floor(Math.random() * 3) + 3); // Level 3-5
        startBattle(wildObjectMon, true);
        return;
      }
    }

    // Check for NPCs at current position
    const npc = currentRegion.npcs.find(npc => 
      npc.position.x === player.position.x && 
      npc.position.y === player.position.y
    );
    
    if (npc) {
      if (npc.id === 'professor_oak' && player.party.length === 0) {
        // Starter selection dialogue
        startDialogue({
          speaker: 'Professor Oak',
          messages: [
            'Welcome to the world of ObjectMon!',
            'These creatures are everyday objects that have come to life!',
            'Choose your first ObjectMon partner!'
          ],
          currentMessageIndex: 0,
          onComplete: () => {
            // Show starter selection
            console.log('Show starter selection');
          }
        });
      } else {
        startDialogue({
          speaker: npc.name,
          messages: npc.dialogue,
          currentMessageIndex: 0
        });
      }
    }
  };

  const handleMenu = () => {
    // TODO: Open main menu
    console.log('Open menu');
  };

  // Get tile type at position
  const getTileAt = (x: number, y: number): number => {
    if (x < 0 || x >= currentRegion.mapData.width || y < 0 || y >= currentRegion.mapData.height) {
      return 0;
    }
    
    // Check tall grass layer first
    const tallGrassLayer = currentRegion.mapData.layers.find(layer => layer.name === 'TallGrass');
    if (tallGrassLayer) {
      return tallGrassLayer.data[y][x];
    }
    
    return 0;
  };

  // Set up keyboard listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  // Generate tiles for display
  const renderTiles = () => {
    const tiles = [];
    const { width, height } = currentRegion.mapData;
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const tileType = getTileAt(x, y);
        let tileColor = 'var(--gb-light)'; // Default grass
        
        if (tileType === 2) {
          tileColor = 'var(--gb-dark)'; // Tall grass
        }
        
        tiles.push(
          <div
            key={`${x}-${y}`}
            className="tile"
            style={{
              backgroundColor: tileColor,
              border: '1px solid var(--gb-darkest)',
              position: 'relative'
            }}
          >
            {/* Show player */}
            {player.position.x === x && player.position.y === y && (
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{ color: 'var(--gb-darkest)', fontSize: '12px' }}
              >
                {player.direction === 'up' && '↑'}
                {player.direction === 'down' && '↓'}
                {player.direction === 'left' && '←'}
                {player.direction === 'right' && '→'}
              </div>
            )}
            
            {/* Show NPCs */}
            {currentRegion.npcs.filter(npc => npc.position.x === x && npc.position.y === y).map(npc => (
              <div
                key={npc.id}
                className="absolute inset-0 flex items-center justify-center"
                style={{ color: 'var(--gb-darkest)', fontSize: '10px' }}
              >
                NPC
              </div>
            ))}
          </div>
        );
      }
    }
    return tiles;
  };

  return (
    <div className="game-screen gameboy-screen">
      {/* HUD */}
      <div className="h-8 flex justify-between items-center px-2 border-b-2 border-[var(--gb-darkest)]" 
           style={{ backgroundColor: 'var(--gb-light)' }}>
        <div className="pixel-font text-xs" style={{ color: 'var(--gb-darkest)' }}>
          {currentRegion.name}
        </div>
        <div className="pixel-font text-xs" style={{ color: 'var(--gb-darkest)' }}>
          ₿{player.coins}
        </div>
      </div>

      {/* Map Display */}
      <div className="flex-1 p-4 overflow-hidden">
        <div className="tile-grid">
          {renderTiles()}
        </div>
      </div>

      {/* Bottom HUD */}
      <div className="h-16 border-t-2 border-[var(--gb-darkest)] p-2" 
           style={{ backgroundColor: 'var(--gb-light)' }}>
        <div className="flex justify-between items-center h-full">
          {/* Party Status */}
          <div className="flex space-x-2">
            {player.party.slice(0, 6).map((objectmon, index) => (
              <div key={index} className="w-8 h-8 border border-[var(--gb-darkest)] flex items-center justify-center"
                   style={{ backgroundColor: 'var(--gb-lightest)' }}>
                <div className="text-xs pixel-font" style={{ color: 'var(--gb-darkest)' }}>
                  {objectmon.name[0]}
                </div>
              </div>
            ))}
            {/* Empty slots */}
            {Array(6 - player.party.length).fill(0).map((_, index) => (
              <div key={`empty-${index}`} className="w-8 h-8 border border-[var(--gb-darkest)]"
                   style={{ backgroundColor: 'var(--gb-dark)' }}>
              </div>
            ))}
          </div>

          {/* Controls hint */}
          <div className="text-xs pixel-font" style={{ color: 'var(--gb-darkest)' }}>
            SPACE: Action
          </div>
        </div>
      </div>
    </div>
  );
}