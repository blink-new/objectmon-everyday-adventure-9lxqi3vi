import { ObjectMon, Move, ObjectType } from '../types/game';

// Base ObjectMon moves
export const MOVES: Record<string, Move> = {
  // Toaster moves
  Toast: {
    name: 'Toast',
    type: 'Fire',
    category: 'Special',
    power: 40,
    accuracy: 100,
    pp: 25,
    maxPP: 25,
    effect: '10% chance to burn',
    description: 'Toasts the opponent with searing heat.'
  },
  CrumbShot: {
    name: 'Crumb Shot',
    type: 'Metal',
    category: 'Physical',
    power: 30,
    accuracy: 95,
    pp: 35,
    maxPP: 35,
    description: 'Fires hot crumbs at the opponent.'
  },
  Overheat: {
    name: 'Overheat',
    type: 'Fire',
    category: 'Special',
    power: 90,
    accuracy: 90,
    pp: 5,
    maxPP: 5,
    effect: 'Lowers user SP_ATK by 2 stages',
    description: 'Unleashes maximum heat but exhausts the user.'
  },
  Eject: {
    name: 'Eject',
    type: 'Metal',
    category: 'Physical',
    power: 50,
    accuracy: 100,
    pp: 15,
    maxPP: 15,
    description: 'Forcefully ejects to damage the opponent.'
  },

  // Pencil moves
  Sketch: {
    name: 'Sketch',
    type: 'Paper',
    category: 'Status',
    power: 0,
    accuracy: 100,
    pp: 20,
    maxPP: 20,
    effect: 'Copies last move used by opponent',
    description: 'Sketches and copies the opponent\'s last move.'
  },
  Sharpen: {
    name: 'Sharpen',
    type: 'Metal',
    category: 'Status',
    power: 0,
    accuracy: 100,
    pp: 30,
    maxPP: 30,
    effect: 'Raises user ATK by 1 stage',
    description: 'Sharpens the tip to increase attack power.'
  },
  InkBlast: {
    name: 'Ink Blast',
    type: 'Water',
    category: 'Special',
    power: 65,
    accuracy: 100,
    pp: 20,
    maxPP: 20,
    effect: '30% chance to lower accuracy',
    description: 'Sprays ink to damage and potentially blind.'
  },
  PaperCut: {
    name: 'Paper Cut',
    type: 'Paper',
    category: 'Physical',
    power: 35,
    accuracy: 95,
    pp: 30,
    maxPP: 30,
    effect: '10% chance to cause bleeding (DoT)',
    description: 'A precise cut that may cause ongoing damage.'
  },

  // Mug moves
  Splash: {
    name: 'Splash',
    type: 'Water',
    category: 'Special',
    power: 40,
    accuracy: 100,
    pp: 25,
    maxPP: 25,
    description: 'Splashes hot liquid at the opponent.'
  },
  Steep: {
    name: 'Steep',
    type: 'Water',
    category: 'Status',
    power: 0,
    accuracy: 100,
    pp: 15,
    maxPP: 15,
    effect: 'Heals user for 25% of max HP',
    description: 'Steeps to restore health gradually.'
  },
  HandleBash: {
    name: 'Handle Bash',
    type: 'Metal',
    category: 'Physical',
    power: 60,
    accuracy: 90,
    pp: 20,
    maxPP: 20,
    description: 'Strikes with a heavy ceramic handle.'
  },
  HotSip: {
    name: 'Hot Sip',
    type: 'Fire',
    category: 'Special',
    power: 55,
    accuracy: 100,
    pp: 15,
    maxPP: 15,
    effect: '20% chance to burn',
    description: 'Serves scorching hot liquid.'
  },

  // Clock moves
  Tick: {
    name: 'Tick',
    type: 'Mechanical',
    category: 'Status',
    power: 0,
    accuracy: 100,
    pp: 40,
    maxPP: 40,
    effect: 'Gradually damages opponent each turn',
    description: 'Creates anxiety with constant ticking.'
  },
  Alarm: {
    name: 'Alarm',
    type: 'Electric',
    category: 'Special',
    power: 70,
    accuracy: 100,
    pp: 10,
    maxPP: 10,
    effect: 'Always goes first',
    description: 'Startles opponent with a loud alarm.'
  },

  // Book moves
  PaperStorm: {
    name: 'Paper Storm',
    type: 'Paper',
    category: 'Special',
    power: 80,
    accuracy: 85,
    pp: 10,
    maxPP: 10,
    description: 'Unleashes a flurry of sharp pages.'
  },
  Knowledge: {
    name: 'Knowledge',
    type: 'Digital',
    category: 'Status',
    power: 0,
    accuracy: 100,
    pp: 20,
    maxPP: 20,
    effect: 'Raises all stats by 1 stage',
    description: 'Gains wisdom to boost all abilities.'
  }
};

// Base ObjectMon definitions
export const BASE_OBJECTMONS: Partial<ObjectMon>[] = [
  {
    id: 1,
    name: 'Toaster',
    types: ['Metal', 'Electric'],
    baseStats: {
      hp: 40,
      attack: 50,
      defense: 35,
      speed: 25,
      spAttack: 45,
      spDefense: 30
    },
    moves: [MOVES.Toast, MOVES.CrumbShot, MOVES.Overheat, MOVES.Eject],
    abilities: ['AutoHeat', 'CrumbShield'],
    evolution: {
      method: 'level',
      level: 18,
      target: 'Smart Toaster'
    },
    fusionCompat: ['Mug', 'Bread', 'Knife', 'Clock'],
    experience: 0
  },
  {
    id: 2,
    name: 'Pencil',
    types: ['Wood', 'Paper'],
    baseStats: {
      hp: 30,
      attack: 60,
      defense: 25,
      speed: 55,
      spAttack: 20,
      spDefense: 20
    },
    moves: [MOVES.Sketch, MOVES.Sharpen, MOVES.InkBlast, MOVES.PaperCut],
    abilities: ['Sketch', 'Sharp Point'],
    evolution: {
      method: 'level',
      level: 20,
      target: 'Mechanical Pencil'
    },
    fusionCompat: ['Notebook', 'Eraser', 'Ruler', 'Lamp'],
    experience: 0
  },
  {
    id: 3,
    name: 'Mug',
    types: ['Water', 'Composite'],
    baseStats: {
      hp: 55,
      attack: 30,
      defense: 40,
      speed: 20,
      spAttack: 35,
      spDefense: 45
    },
    moves: [MOVES.Splash, MOVES.Steep, MOVES.HandleBash, MOVES.HotSip],
    abilities: ['Heat Retain', 'Ceramic Body'],
    evolution: {
      method: 'item',
      item: 'Travel Lid',
      target: 'Travel Mug'
    },
    fusionCompat: ['Toaster', 'Spoon', 'Kettle', 'Book'],
    experience: 0
  },
  {
    id: 4,
    name: 'Clock',
    types: ['Mechanical', 'Electric'],
    baseStats: {
      hp: 50,
      attack: 35,
      defense: 60,
      speed: 40,
      spAttack: 30,
      spDefense: 50
    },
    moves: [MOVES.Tick, MOVES.Alarm, MOVES.CrumbShot, MOVES.Sharpen],
    abilities: ['Precise Time', 'Wake Up Call'],
    fusionCompat: ['Toaster', 'Lamp', 'Phone', 'Watch'],
    experience: 0
  },
  {
    id: 5,
    name: 'Book',
    types: ['Paper', 'Digital'],
    baseStats: {
      hp: 45,
      attack: 25,
      defense: 30,
      speed: 35,
      spAttack: 70,
      spDefense: 60
    },
    moves: [MOVES.PaperStorm, MOVES.Knowledge, MOVES.PaperCut, MOVES.Sketch],
    abilities: ['Wisdom', 'Page Turner'],
    fusionCompat: ['Pencil', 'Mug', 'Lamp', 'Phone'],
    experience: 0
  },
  {
    id: 6,
    name: 'Lamp',
    types: ['Electric', 'Glass'],
    baseStats: {
      hp: 35,
      attack: 25,
      defense: 45,
      speed: 30,
      spAttack: 65,
      spDefense: 55
    },
    moves: [MOVES.InkBlast, MOVES.Knowledge, MOVES.Alarm, MOVES.HotSip],
    abilities: ['Illumination', 'Bright Idea'],
    fusionCompat: ['Clock', 'Book', 'Pencil', 'Phone'],
    experience: 0
  }
];

// Special fusion results
export const FUSION_RECIPES = [
  {
    parents: ['Toaster', 'Mug'] as [string, string],
    result: 'ToasterMug',
    stats: {
      hp: 55,
      attack: 55,
      defense: 45,
      speed: 30,
      spAttack: 55,
      spDefense: 40
    },
    moves: ['Steam Blast', 'Ceramic Crash', 'Hot Chocolate', 'Double Brew'],
    abilities: ['Heat Retain', 'Dual Function'],
    special: true
  },
  {
    parents: ['Pencil', 'Book'] as [string, string],
    result: 'Notebook',
    stats: {
      hp: 40,
      attack: 45,
      defense: 30,
      speed: 50,
      spAttack: 60,
      spDefense: 50
    },
    moves: ['Study Notes', 'Sketch', 'Paper Storm', 'Knowledge'],
    abilities: ['Research', 'Note Taking'],
    special: true
  },
  {
    parents: ['Clock', 'Lamp'] as [string, string],
    result: 'Alarm Clock',
    stats: {
      hp: 45,
      attack: 30,
      defense: 55,
      speed: 40,
      spAttack: 50,
      spDefense: 55
    },
    moves: ['Wake Up Call', 'Bright Flash', 'Tick', 'Alarm'],
    abilities: ['Morning Routine', 'Time Light'],
    special: true
  }
];

// Helper function to create a full ObjectMon from partial data
export function createObjectMon(partial: Partial<ObjectMon>, level: number = 5): ObjectMon {
  const baseObjectMon = BASE_OBJECTMONS.find(obj => obj.id === partial.id);
  if (!baseObjectMon) {
    throw new Error(`ObjectMon with id ${partial.id} not found`);
  }

  const maxHp = Math.floor((baseObjectMon.baseStats!.hp * 2 + 31) * level / 100) + level + 10;
  
  return {
    id: baseObjectMon.id!,
    name: baseObjectMon.name!,
    types: baseObjectMon.types!,
    baseStats: baseObjectMon.baseStats!,
    level,
    hp: maxHp,
    maxHp,
    moves: baseObjectMon.moves!,
    abilities: baseObjectMon.abilities!,
    evolution: baseObjectMon.evolution,
    fusionCompat: baseObjectMon.fusionCompat!,
    experience: partial.experience || 0,
    ...partial
  };
}

// Starter ObjectMons for new players
export const STARTER_OBJECTMONS = [
  createObjectMon({ id: 1 }, 5), // Toaster
  createObjectMon({ id: 2 }, 5), // Pencil  
  createObjectMon({ id: 3 }, 5)  // Mug
];