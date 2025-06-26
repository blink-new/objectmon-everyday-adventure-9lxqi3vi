import { Region, MapData, Building, NPC, EncounterTable } from '../types/game';

// Basic map data for Starter Town
const starterTownMapData: MapData = {
  width: 20,
  height: 18,
  layers: [
    {
      name: 'TerrainBase',
      type: 'Tile',
      data: Array(18).fill(null).map(() => Array(20).fill(1)), // All grass tiles
      renderOrder: 0
    },
    {
      name: 'Buildings',
      type: 'Tile', 
      data: Array(18).fill(null).map(() => Array(20).fill(0)), // No buildings for now
      collision: Array(18).fill(null).map(() => Array(20).fill(false)),
      renderOrder: 3
    },
    {
      name: 'TallGrass',
      type: 'Tile',
      data: Array(18).fill(null).map((_, y) => 
        Array(20).fill(null).map((_, x) => 
          // Add some tall grass patches
          (x > 2 && x < 8 && y > 5 && y < 12) || 
          (x > 12 && x < 18 && y > 8 && y < 15) ? 2 : 0
        )
      ),
      collision: Array(18).fill(null).map(() => Array(20).fill(false)),
      renderOrder: 2
    }
  ],
  tilesets: ['terrain', 'buildings']
};

// Starter Town buildings
const starterTownBuildings: Building[] = [
  {
    id: 'player_home',
    name: "Player's House",
    type: 'PlayerHome',
    position: { x: 10, y: 15, region: 'starter_town' },
    size: { width: 4, height: 4 },
    entrances: [{ x: 12, y: 17, region: 'starter_town' }],
    npcs: []
  },
  {
    id: 'starter_shop',
    name: 'ObjectMart',
    type: 'Shop',
    position: { x: 5, y: 8, region: 'starter_town' },
    size: { width: 4, height: 4 },
    entrances: [{ x: 7, y: 10, region: 'starter_town' }],
    npcs: ['shopkeeper_001']
  },
  {
    id: 'starter_hospital',
    name: 'ObjectMon Center',
    type: 'Hospital',
    position: { x: 15, y: 5, region: 'starter_town' },
    size: { width: 4, height: 4 },
    entrances: [{ x: 17, y: 7, region: 'starter_town' }],
    npcs: ['nurse_001']
  }
];

// Starter Town NPCs
const starterTownNPCs: NPC[] = [
  {
    id: 'professor_oak',
    name: 'Professor Oak',
    type: 'QuestGiver',
    position: { x: 8, y: 12, region: 'starter_town' },
    sprite: '/sprites/professor.png',
    dialogue: [
      'Welcome to the world of ObjectMon!',
      'These creatures are everyday objects that have come to life!',
      'Would you like to choose your first ObjectMon partner?'
    ],
    movementPattern: 'Static',
    interaction: 'Quest'
  },
  {
    id: 'rival_gary',
    name: 'Gary',
    type: 'Collector',
    position: { x: 12, y: 10, region: 'starter_town' },
    sprite: '/sprites/rival.png',
    dialogue: [
      'Hey! I just got my first ObjectMon!',
      "Let's battle to see who's stronger!"
    ],
    party: [],
    movementPattern: 'Wander',
    interaction: 'Battle'
  },
  {
    id: 'shopkeeper_001',
    name: 'Shop Owner',
    type: 'Shopkeeper',
    position: { x: 7, y: 9, region: 'starter_town' },
    sprite: '/sprites/shopkeeper.png',
    dialogue: [
      'Welcome to ObjectMart!',
      'We have everything you need for your ObjectMon journey!'
    ],
    inventory: [
      {
        id: 'basic_capsule',
        name: 'Basic Capsule',
        type: 'Capsule',
        effect: 'Captures wild ObjectMon',
        price: 200,
        quantity: 99,
        description: 'A basic capsule for capturing wild ObjectMon.'
      },
      {
        id: 'super_capsule',
        name: 'Super Capsule',
        type: 'Capsule',
        effect: 'Better capture rate than Basic Capsule',
        price: 600,
        quantity: 99,
        description: 'An improved capsule with better capture rate.'
      },
      {
        id: 'revive_mug',
        name: 'Revive Mug',
        type: 'Healing',
        effect: 'Revives fainted ObjectMon',
        price: 1500,
        quantity: 10,
        description: 'A special mug that can revive fainted ObjectMon.'
      }
    ],
    movementPattern: 'Static',
    interaction: 'Shop'
  },
  {
    id: 'nurse_001',
    name: 'Nurse Joy',
    type: 'Healer',
    position: { x: 17, y: 6, region: 'starter_town' },
    sprite: '/sprites/nurse.png',
    dialogue: [
      'Welcome to the ObjectMon Center!',
      'I can heal your ObjectMon to full health.',
      'Would you like me to heal your ObjectMon?'
    ],
    movementPattern: 'Static',
    interaction: 'Heal'
  }
];

// Encounter table for tall grass areas
const starterTownEncounters: EncounterTable = {
  TallGrass: [
    { objectId: 'Pencil', weight: 40, minLevel: 2, maxLevel: 4 },
    { objectId: 'Mug', weight: 30, minLevel: 2, maxLevel: 5 },
    { objectId: 'Clock', weight: 20, minLevel: 3, maxLevel: 5 },
    { objectId: 'Book', weight: 10, minLevel: 4, maxLevel: 6 }
  ]
};

// Starter Town region
export const STARTER_TOWN: Region = {
  id: 'starter_town',
  name: 'Starter Town',
  mapData: starterTownMapData,
  buildings: starterTownBuildings,
  npcs: starterTownNPCs,
  encounters: starterTownEncounters,
  music: '/audio/town_theme.ogg',
  weather: 'Sunny'
};

// Export all regions
export const REGIONS: Record<string, Region> = {
  starter_town: STARTER_TOWN
};