// Core ObjectMon Game Types

export interface ObjectMon {
  id: number;
  name: string;
  types: ObjectType[];
  baseStats: Stats;
  currentStats?: Stats;
  level: number;
  hp: number;
  maxHp: number;
  moves: Move[];
  abilities: string[];
  evolution?: Evolution;
  fusionCompat: string[];
  spriteUrl?: string;
  isShiny?: boolean;
  heldItem?: string;
  experience: number;
  statusEffect?: StatusEffect;
}

export interface Stats {
  hp: number;
  attack: number;
  defense: number;
  speed: number;
  spAttack: number;
  spDefense: number;
}

export interface Move {
  name: string;
  type: ObjectType;
  category: 'Physical' | 'Special' | 'Status';
  power: number;
  accuracy: number;
  pp: number;
  maxPP: number;
  effect?: string;
  description: string;
}

export interface Evolution {
  level?: number;
  item?: string;
  method: 'level' | 'item' | 'trade' | 'fusion';
  target: string;
}

export interface Fusion {
  parents: [string, string];
  result: string;
  stats: Stats;
  moves: string[];
  abilities: string[];
  special?: boolean;
}

export type ObjectType = 
  | 'Metal' | 'Plastic' | 'Wood' | 'Glass' | 'Paper' 
  | 'Electric' | 'Water' | 'Fire' | 'Composite' | 'Organic' 
  | 'Mechanical' | 'Digital' | 'Recycled';

export type StatusEffect = 
  | 'Burn' | 'Freeze' | 'Sleep' | 'Paralysis' | 'Confusion' 
  | 'Rust' | 'ShortCircuit' | 'Soak' | 'Jam';

export interface Player {
  name: string;
  id: string;
  position: Position;
  direction: Direction;
  sprite: string;
  party: ObjectMon[];
  pc: ObjectMon[];
  inventory: Item[];
  coins: number;
  badges: Badge[];
  objectdexSeen: number[];
  objectdexCaught: number[];
  currentRegion: string;
  gameFlags: Record<string, boolean>;
}

export interface Position {
  x: number;
  y: number;
  region: string;
}

export type Direction = 'up' | 'down' | 'left' | 'right';

export interface Item {
  id: string;
  name: string;
  type: 'Capsule' | 'Healing' | 'StatBooster' | 'Evolution' | 'Fusion' | 'Battle' | 'Quest';
  effect: string;
  price: number;
  quantity: number;
  description: string;
}

export interface Badge {
  id: string;
  name: string;
  gymLeader: string;
  region: string;
  type: ObjectType;
  obtained: boolean;
}

export interface NPC {
  id: string;
  name: string;
  type: 'Collector' | 'Shopkeeper' | 'Healer' | 'FusionScientist' | 'QuestGiver' | 'GymLeader';
  position: Position;
  sprite: string;
  dialogue: string[];
  party?: ObjectMon[];
  inventory?: Item[];
  movementPattern: 'Static' | 'Patrol' | 'Wander';
  interaction: 'Battle' | 'Trade' | 'Quest' | 'Shop' | 'Heal' | 'Info';
}

export interface Region {
  id: string;
  name: string;
  mapData: MapData;
  buildings: Building[];
  npcs: NPC[];
  encounters: EncounterTable;
  music: string;
  weather?: Weather;
}

export interface MapData {
  width: number;
  height: number;
  layers: MapLayer[];
  tilesets: string[];
}

export interface MapLayer {
  name: string;
  type: 'Tile' | 'Object';
  data: number[][];
  collision?: boolean[][];
  animated?: boolean;
  renderOrder: number;
}

export interface Building {
  id: string;
  name: string;
  type: 'PlayerHome' | 'Shop' | 'Hospital' | 'Gym' | 'FusionLab';
  position: Position;
  size: { width: number; height: number };
  interiorMap?: string;
  entrances: Position[];
  npcs: string[];
}

export interface EncounterTable {
  [area: string]: {
    objectId: string;
    weight: number;
    minLevel: number;
    maxLevel: number;
  }[];
}

export type Weather = 'Sunny' | 'Rain' | 'Storm' | 'Snow' | 'Fog' | 'Night';

export interface GameState {
  player: Player;
  currentScreen: GameScreen;
  currentRegion: Region;
  battle?: BattleState;
  menu?: MenuState;
  dialogue?: DialogueState;
  gameTime: number;
  weather: Weather;
  paused: boolean;
}

export type GameScreen = 
  | 'Title' | 'Overworld' | 'Battle' | 'Menu' | 'Inventory' 
  | 'ObjectDex' | 'FusionLab' | 'Shop' | 'Settings';

export interface BattleState {
  playerObjectMon: ObjectMon;
  opponentObjectMon: ObjectMon;
  isPlayerTurn: boolean;
  battleType: 'Wild' | 'Trainer' | 'Gym' | 'Raid';
  opponent?: NPC;
  battlePhase: 'Select' | 'Animation' | 'Status' | 'End';
  selectedMove?: Move;
  battleLog: string[];
  canCapture: boolean;
  experienceGained: number;
}

export interface MenuState {
  type: 'Main' | 'Battle' | 'Inventory' | 'ObjectDex' | 'Settings';
  selectedIndex: number;
  subMenu?: MenuState;
  items: MenuItem[];
}

export interface MenuItem {
  label: string;
  action: () => void;
  enabled: boolean;
  icon?: string;
}

export interface DialogueState {
  speaker: string;
  messages: string[];
  currentMessageIndex: number;
  choices?: DialogueChoice[];
  onComplete?: () => void;
}

export interface DialogueChoice {
  text: string;
  action: () => void;
}

// Type effectiveness chart
export const TYPE_EFFECTIVENESS: Record<ObjectType, Partial<Record<ObjectType, number>>> = {
  Metal: { Plastic: 2, Wood: 1, Glass: 0.5, Electric: 1 },
  Glass: { Paper: 2, Metal: 0.5, Wood: 1 },
  Electric: { Water: 2, Metal: 1.5, Plastic: 0.5 },
  Water: { Fire: 2, Electric: 0.5, Metal: 1.5 },
  Fire: { Wood: 2, Paper: 2, Water: 0.5, Metal: 1.5 },
  Wood: { Water: 0.5, Fire: 0.5, Metal: 0.5 },
  Paper: { Fire: 0.5, Water: 0.5, Glass: 0.5 },
  Plastic: { Metal: 0.5, Electric: 2, Fire: 0.5 },
  Composite: { Metal: 1, Plastic: 1, Wood: 1 },
  Organic: { Fire: 0.5, Water: 1.5, Electric: 0.5 },
  Mechanical: { Electric: 1.5, Metal: 1.5, Water: 0.5 },
  Digital: { Electric: 2, Water: 0, Metal: 1 },
  Recycled: { Metal: 1, Plastic: 1, Paper: 1 }
};