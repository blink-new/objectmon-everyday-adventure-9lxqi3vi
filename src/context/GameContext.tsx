import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { GameState, GameScreen, Player, ObjectMon, BattleState, MenuState, DialogueState } from '../types/game';
import { createObjectMon } from '../data/objectmons';
import { STARTER_TOWN } from '../data/regions';

// Initial game state
const initialPlayer: Player = {
  name: 'Ash',
  id: 'player_001',
  position: { x: 10, y: 15, region: 'starter_town' },
  direction: 'down',
  sprite: '/sprites/player.png',
  party: [],
  pc: [],
  inventory: [
    {
      id: 'basic_capsule',
      name: 'Basic Capsule',
      type: 'Capsule',
      effect: 'Captures wild ObjectMon',
      price: 200,
      quantity: 5,
      description: 'A basic capsule for capturing wild ObjectMon.'
    }
  ],
  coins: 1000,
  badges: [],
  objectdexSeen: [],
  objectdexCaught: [],
  currentRegion: 'starter_town',
  gameFlags: {}
};

const initialState: GameState = {
  player: initialPlayer,
  currentScreen: 'Title',
  currentRegion: STARTER_TOWN,
  gameTime: 0,
  weather: 'Sunny',
  paused: false
};

// Action types
type GameAction = 
  | { type: 'SET_SCREEN'; screen: GameScreen }
  | { type: 'MOVE_PLAYER'; direction: string }
  | { type: 'START_BATTLE'; opponent: ObjectMon; isWild?: boolean }
  | { type: 'END_BATTLE'; result: 'win' | 'lose' | 'capture' | 'flee' }
  | { type: 'OPEN_MENU'; menu: MenuState }
  | { type: 'CLOSE_MENU' }
  | { type: 'START_DIALOGUE'; dialogue: DialogueState }
  | { type: 'ADVANCE_DIALOGUE' }
  | { type: 'END_DIALOGUE' }
  | { type: 'ADD_OBJECTMON'; objectmon: ObjectMon }
  | { type: 'USE_ITEM'; itemId: string; target?: ObjectMon }
  | { type: 'PAUSE_GAME' }
  | { type: 'RESUME_GAME' }
  | { type: 'CHOOSE_STARTER'; starterId: number }
  | { type: 'UPDATE_TIME'; deltaTime: number };

// Game reducer
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_SCREEN':
      return { ...state, currentScreen: action.screen };

    case 'MOVE_PLAYER': {
      const newDirection = action.direction as Player['direction'];
      let newX = state.player.position.x;
      let newY = state.player.position.y;

      // Calculate new position based on direction
      switch (newDirection) {
        case 'up': newY -= 1; break;
        case 'down': newY += 1; break;
        case 'left': newX -= 1; break;
        case 'right': newX += 1; break;
      }

      // TODO: Add collision detection here
      const canMove = true; // Placeholder

      if (canMove) {
        return {
          ...state,
          player: {
            ...state.player,
            position: { ...state.player.position, x: newX, y: newY },
            direction: newDirection
          }
        };
      }
      return {
        ...state,
        player: { ...state.player, direction: newDirection }
      };
    }

    case 'START_BATTLE': {
      const battleState: BattleState = {
        playerObjectMon: state.player.party[0],
        opponentObjectMon: action.opponent,
        isPlayerTurn: true,
        battleType: action.isWild ? 'Wild' : 'Trainer',
        battlePhase: 'Select',
        battleLog: [`A wild ${action.opponent.name} appears!`],
        canCapture: action.isWild || false,
        experienceGained: 0
      };
      return {
        ...state,
        currentScreen: 'Battle',
        battle: battleState
      };
    }

    case 'END_BATTLE':
      return {
        ...state,
        currentScreen: 'Overworld',
        battle: undefined
      };

    case 'OPEN_MENU':
      return {
        ...state,
        menu: action.menu
      };

    case 'CLOSE_MENU':
      return {
        ...state,
        menu: undefined
      };

    case 'START_DIALOGUE':
      return {
        ...state,
        dialogue: action.dialogue
      };

    case 'ADVANCE_DIALOGUE': {
      if (state.dialogue) {
        const nextIndex = state.dialogue.currentMessageIndex + 1;
        if (nextIndex >= state.dialogue.messages.length) {
          // End dialogue
          if (state.dialogue.onComplete) {
            state.dialogue.onComplete();
          }
          return { ...state, dialogue: undefined };
        }
        return {
          ...state,
          dialogue: {
            ...state.dialogue,
            currentMessageIndex: nextIndex
          }
        };
      }
      return state;
    }

    case 'END_DIALOGUE':
      return {
        ...state,
        dialogue: undefined
      };

    case 'ADD_OBJECTMON': {
      if (state.player.party.length < 6) {
        return {
          ...state,
          player: {
            ...state.player,
            party: [...state.player.party, action.objectmon],
            objectdexCaught: [...state.player.objectdexCaught, action.objectmon.id]
          }
        };
      } else {
        return {
          ...state,
          player: {
            ...state.player,
            pc: [...state.player.pc, action.objectmon],
            objectdexCaught: [...state.player.objectdexCaught, action.objectmon.id]
          }
        };
      }
    }

    case 'USE_ITEM': {
      const itemIndex = state.player.inventory.findIndex(item => item.id === action.itemId);
      if (itemIndex === -1) return state;

      const updatedInventory = [...state.player.inventory];
      if (updatedInventory[itemIndex].quantity > 1) {
        updatedInventory[itemIndex] = {
          ...updatedInventory[itemIndex],
          quantity: updatedInventory[itemIndex].quantity - 1
        };
      } else {
        updatedInventory.splice(itemIndex, 1);
      }

      return {
        ...state,
        player: {
          ...state.player,
          inventory: updatedInventory
        }
      };
    }

    case 'PAUSE_GAME':
      return { ...state, paused: true };

    case 'RESUME_GAME':
      return { ...state, paused: false };

    case 'CHOOSE_STARTER': {
      const starter = createObjectMon({ id: action.starterId }, 5);
      return {
        ...state,
        player: {
          ...state.player,
          party: [starter],
          objectdexSeen: [action.starterId],
          objectdexCaught: [action.starterId]
        },
        currentScreen: 'Overworld'
      };
    }

    case 'UPDATE_TIME':
      return {
        ...state,
        gameTime: state.gameTime + action.deltaTime
      };

    default:
      return state;
  }
}

// Game context
interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  
  // Convenience methods
  setScreen: (screen: GameScreen) => void;
  movePlayer: (direction: string) => void;
  startBattle: (opponent: ObjectMon, isWild?: boolean) => void;
  endBattle: (result: 'win' | 'lose' | 'capture' | 'flee') => void;
  openMenu: (menu: MenuState) => void;
  closeMenu: () => void;
  startDialogue: (dialogue: DialogueState) => void;
  advanceDialogue: () => void;
  endDialogue: () => void;
  addObjectMon: (objectmon: ObjectMon) => void;
  useItem: (itemId: string, target?: ObjectMon) => void;
  pauseGame: () => void;
  resumeGame: () => void;
  chooseStarter: (starterId: number) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Game loop for time updates
  useEffect(() => {
    const gameLoop = setInterval(() => {
      if (!state.paused) {
        dispatch({ type: 'UPDATE_TIME', deltaTime: 16 }); // ~60fps
      }
    }, 16);

    return () => clearInterval(gameLoop);
  }, [state.paused]);

  // Convenience methods
  const setScreen = useCallback((screen: GameScreen) => {
    dispatch({ type: 'SET_SCREEN', screen });
  }, []);

  const movePlayer = useCallback((direction: string) => {
    dispatch({ type: 'MOVE_PLAYER', direction });
  }, []);

  const startBattle = useCallback((opponent: ObjectMon, isWild = true) => {
    dispatch({ type: 'START_BATTLE', opponent, isWild });
  }, []);

  const endBattle = useCallback((result: 'win' | 'lose' | 'capture' | 'flee') => {
    dispatch({ type: 'END_BATTLE', result });
  }, []);

  const openMenu = useCallback((menu: MenuState) => {
    dispatch({ type: 'OPEN_MENU', menu });
  }, []);

  const closeMenu = useCallback(() => {
    dispatch({ type: 'CLOSE_MENU' });
  }, []);

  const startDialogue = useCallback((dialogue: DialogueState) => {
    dispatch({ type: 'START_DIALOGUE', dialogue });
  }, []);

  const advanceDialogue = useCallback(() => {
    dispatch({ type: 'ADVANCE_DIALOGUE' });
  }, []);

  const endDialogue = useCallback(() => {
    dispatch({ type: 'END_DIALOGUE' });
  }, []);

  const addObjectMon = useCallback((objectmon: ObjectMon) => {
    dispatch({ type: 'ADD_OBJECTMON', objectmon });
  }, []);

  const useItem = useCallback((itemId: string, target?: ObjectMon) => {
    dispatch({ type: 'USE_ITEM', itemId, target });
  }, []);

  const pauseGame = useCallback(() => {
    dispatch({ type: 'PAUSE_GAME' });
  }, []);

  const resumeGame = useCallback(() => {
    dispatch({ type: 'RESUME_GAME' });
  }, []);

  const chooseStarter = useCallback((starterId: number) => {
    dispatch({ type: 'CHOOSE_STARTER', starterId });
  }, []);

  const contextValue: GameContextType = {
    state,
    dispatch,
    setScreen,
    movePlayer,
    startBattle,
    endBattle,
    openMenu,
    closeMenu,
    startDialogue,
    advanceDialogue,
    endDialogue,
    addObjectMon,
    useItem,
    pauseGame,
    resumeGame,
    chooseStarter
  };

  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}