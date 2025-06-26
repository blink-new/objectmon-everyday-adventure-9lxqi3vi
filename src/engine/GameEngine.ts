// ObjectMon Game Engine
// Handles rendering, movement, collision, and game loop

export const TILE_SIZE = 16;
export const SCREEN_WIDTH = 20; // tiles
export const SCREEN_HEIGHT = 18; // tiles
export const FPS = 60;

// Game Boy Color Palette
export const PALETTE = {
  lightest: '#e0f8d0',
  light: '#88c070', 
  dark: '#346856',
  darkest: '#081820'
};

export interface Sprite {
  x: number;
  y: number;
  width: number;
  height: number;
  frameX: number;
  frameY: number;
  animated: boolean;
  frames: number;
  frameSpeed: number;
  currentFrame: number;
  frameTimer: number;
}

export interface Entity {
  id: string;
  x: number;
  y: number;
  sprite: Sprite;
  solid: boolean;
  type: 'player' | 'npc' | 'object' | 'item';
  direction: 'up' | 'down' | 'left' | 'right';
  moving: boolean;
  moveSpeed: number;
  targetX?: number;
  targetY?: number;
}

export interface Tile {
  id: number;
  solid: boolean;
  encounter: boolean;
  animated: boolean;
  frames?: number;
  animSpeed?: number;
  event?: string;
}

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private lastTime: number = 0;
  private accumulator: number = 0;
  private readonly timestep: number = 1000 / FPS;
  
  // Game state
  private entities: Map<string, Entity> = new Map();
  private tileMap: number[][] = [];
  private collisionMap: boolean[][] = [];
  private encounterMap: boolean[][] = [];
  private animatedTiles: Map<string, { frame: number; timer: number }> = new Map();
  
  // Camera
  private cameraX: number = 0;
  private cameraY: number = 0;
  
  // Input handling
  private keys: Set<string> = new Set();
  private inputQueue: string[] = [];
  
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.ctx.imageSmoothingEnabled = false;
    
    // Set up input listeners
    this.setupInput();
  }
  
  private setupInput() {
    window.addEventListener('keydown', (e) => {
      const key = e.key.toLowerCase();
      if (!this.keys.has(key)) {
        this.keys.add(key);
        this.inputQueue.push(key);
      }
      
      // Prevent arrow key scrolling
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
        e.preventDefault();
      }
    });
    
    window.addEventListener('keyup', (e) => {
      this.keys.delete(e.key.toLowerCase());
    });
  }
  
  public start() {
    this.lastTime = performance.now();
    this.gameLoop();
  }
  
  private gameLoop = () => {
    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;
    
    this.accumulator += deltaTime;
    
    // Fixed timestep with interpolation
    while (this.accumulator >= this.timestep) {
      this.update(this.timestep);
      this.accumulator -= this.timestep;
    }
    
    const interpolation = this.accumulator / this.timestep;
    this.render(interpolation);
    
    requestAnimationFrame(this.gameLoop);
  };
  
  private update(deltaTime: number) {
    // Process input
    this.processInput();
    
    // Update entities
    this.updateEntities(deltaTime);
    
    // Update animated tiles
    this.updateAnimatedTiles(deltaTime);
    
    // Update camera
    this.updateCamera();
    
    // Clear input queue
    this.inputQueue = [];
  }
  
  private processInput() {
    const player = this.entities.get('player');
    if (!player || player.moving) return;
    
    // Handle movement input
    if (this.keys.has('arrowup') || this.keys.has('w')) {
      this.moveEntity(player, 'up');
    } else if (this.keys.has('arrowdown') || this.keys.has('s')) {
      this.moveEntity(player, 'down');
    } else if (this.keys.has('arrowleft') || this.keys.has('a')) {
      this.moveEntity(player, 'left');
    } else if (this.keys.has('arrowright') || this.keys.has('d')) {
      this.moveEntity(player, 'right');
    }
    
    // Handle action input
    if (this.inputQueue.includes(' ') || this.inputQueue.includes('z')) {
      this.handleAction();
    }
  }
  
  private moveEntity(entity: Entity, direction: 'up' | 'down' | 'left' | 'right') {
    entity.direction = direction;
    
    let targetX = entity.x;
    let targetY = entity.y;
    
    switch (direction) {
      case 'up': targetY--; break;
      case 'down': targetY++; break;
      case 'left': targetX--; break;
      case 'right': targetX++; break;
    }
    
    // Check bounds
    if (targetX < 0 || targetX >= this.tileMap[0].length || 
        targetY < 0 || targetY >= this.tileMap.length) {
      return;
    }
    
    // Check collision
    if (this.collisionMap[targetY][targetX]) {
      return;
    }
    
    // Check entity collision
    for (const [id, other] of this.entities) {
      if (id !== entity.id && other.solid && 
          other.x === targetX && other.y === targetY) {
        return;
      }
    }
    
    // Start movement
    entity.moving = true;
    entity.targetX = targetX;
    entity.targetY = targetY;
  }
  
  private updateEntities(deltaTime: number) {
    for (const entity of this.entities.values()) {
      // Update movement
      if (entity.moving && entity.targetX !== undefined && entity.targetY !== undefined) {
        const dx = entity.targetX - entity.x;
        const dy = entity.targetY - entity.y;
        const step = entity.moveSpeed * deltaTime / 1000;
        
        if (Math.abs(dx) <= step && Math.abs(dy) <= step) {
          // Arrived at target
          entity.x = entity.targetX;
          entity.y = entity.targetY;
          entity.moving = false;
          entity.targetX = undefined;
          entity.targetY = undefined;
          
          // Check for encounters
          if (entity.type === 'player' && this.encounterMap[entity.y][entity.x]) {
            this.triggerEncounter();
          }
        } else {
          // Move towards target
          if (dx > 0) entity.x += step;
          else if (dx < 0) entity.x -= step;
          if (dy > 0) entity.y += step;
          else if (dy < 0) entity.y -= step;
        }
      }
      
      // Update sprite animation
      if (entity.sprite.animated) {
        entity.sprite.frameTimer += deltaTime;
        if (entity.sprite.frameTimer >= entity.sprite.frameSpeed) {
          entity.sprite.frameTimer = 0;
          entity.sprite.currentFrame = (entity.sprite.currentFrame + 1) % entity.sprite.frames;
        }
      }
    }
  }
  
  private updateAnimatedTiles(deltaTime: number) {
    for (const [key, anim] of this.animatedTiles) {
      anim.timer += deltaTime;
      if (anim.timer >= 200) { // 200ms per frame
        anim.timer = 0;
        anim.frame = (anim.frame + 1) % 4; // Assume 4 frames
      }
    }
  }
  
  private updateCamera() {
    const player = this.entities.get('player');
    if (!player) return;
    
    // Center camera on player
    this.cameraX = player.x - Math.floor(SCREEN_WIDTH / 2);
    this.cameraY = player.y - Math.floor(SCREEN_HEIGHT / 2);
    
    // Clamp to map bounds
    this.cameraX = Math.max(0, Math.min(this.cameraX, this.tileMap[0].length - SCREEN_WIDTH));
    this.cameraY = Math.max(0, Math.min(this.cameraY, this.tileMap.length - SCREEN_HEIGHT));
  }
  
  private render(interpolation: number) {
    // Clear canvas
    this.ctx.fillStyle = PALETTE.lightest;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Render tiles
    this.renderTiles();
    
    // Render entities
    this.renderEntities(interpolation);
    
    // Render UI overlay
    this.renderUI();
  }
  
  private renderTiles() {
    for (let y = 0; y < SCREEN_HEIGHT; y++) {
      for (let x = 0; x < SCREEN_WIDTH; x++) {
        const mapX = x + this.cameraX;
        const mapY = y + this.cameraY;
        
        if (mapY >= 0 && mapY < this.tileMap.length && 
            mapX >= 0 && mapX < this.tileMap[0].length) {
          const tileId = this.tileMap[mapY][mapX];
          this.drawTile(x * TILE_SIZE, y * TILE_SIZE, tileId, mapX, mapY);
        }
      }
    }
  }
  
  private drawTile(screenX: number, screenY: number, tileId: number, mapX: number, mapY: number) {
    // Simple tile rendering with colors
    let color = PALETTE.light;
    
    switch (tileId) {
      case 0: color = PALETTE.light; break; // Grass
      case 1: color = PALETTE.dark; break; // Tall grass
      case 2: color = PALETTE.darkest; break; // Tree
      case 3: color = '#e8b8c8'; break; // Building
      case 4: color = '#4080ff'; break; // Water
      case 5: color = '#d0b090'; break; // Path
    }
    
    this.ctx.fillStyle = color;
    this.ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
    
    // Draw tile borders for certain types
    if (tileId === 1) { // Tall grass
      this.ctx.strokeStyle = PALETTE.dark;
      this.ctx.lineWidth = 1;
      this.ctx.strokeRect(screenX + 0.5, screenY + 0.5, TILE_SIZE - 1, TILE_SIZE - 1);
    }
  }
  
  private renderEntities(interpolation: number) {
    // Sort entities by Y position for proper layering
    const sortedEntities = Array.from(this.entities.values()).sort((a, b) => a.y - b.y);
    
    for (const entity of sortedEntities) {
      let renderX = entity.x;
      let renderY = entity.y;
      
      // Interpolate position for smooth movement
      if (entity.moving && entity.targetX !== undefined && entity.targetY !== undefined) {
        const dx = entity.targetX - entity.x;
        const dy = entity.targetY - entity.y;
        renderX += dx * interpolation;
        renderY += dy * interpolation;
      }
      
      // Convert to screen coordinates
      const screenX = (renderX - this.cameraX) * TILE_SIZE;
      const screenY = (renderY - this.cameraY) * TILE_SIZE;
      
      // Skip if off-screen
      if (screenX < -TILE_SIZE || screenX > this.canvas.width ||
          screenY < -TILE_SIZE || screenY > this.canvas.height) {
        continue;
      }
      
      // Draw entity
      this.drawEntity(screenX, screenY, entity);
    }
  }
  
  private drawEntity(x: number, y: number, entity: Entity) {
    // Simple entity rendering
    const size = 14;
    const offset = (TILE_SIZE - size) / 2;
    
    this.ctx.fillStyle = entity.type === 'player' ? PALETTE.darkest : PALETTE.dark;
    this.ctx.fillRect(x + offset, y + offset, size, size);
    
    // Add border
    this.ctx.strokeStyle = entity.type === 'player' ? PALETTE.light : PALETTE.lightest;
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(x + offset, y + offset, size, size);
  }
  
  private renderUI() {
    // Render any UI elements (health bars, menus, etc.)
  }
  
  private handleAction() {
    // Check for interactions
    const player = this.entities.get('player');
    if (!player) return;
    
    // Check facing direction for interaction
    let checkX = player.x;
    let checkY = player.y;
    
    switch (player.direction) {
      case 'up': checkY--; break;
      case 'down': checkY++; break;
      case 'left': checkX--; break;
      case 'right': checkX++; break;
    }
    
    // Check for NPCs or objects to interact with
    for (const entity of this.entities.values()) {
      if (entity.x === checkX && entity.y === checkY && entity.type === 'npc') {
        this.triggerInteraction(entity);
        break;
      }
    }
  }
  
  private triggerEncounter() {
    // Trigger wild ObjectMon encounter
    if (Math.random() < 0.15) { // 15% chance
      window.dispatchEvent(new CustomEvent('wild-encounter'));
    }
  }
  
  private triggerInteraction(entity: Entity) {
    // Trigger NPC interaction
    window.dispatchEvent(new CustomEvent('npc-interaction', { detail: entity }));
  }
  
  // Public methods for game management
  public loadMap(tileMap: number[][], collisionMap: boolean[][], encounterMap: boolean[][]) {
    this.tileMap = tileMap;
    this.collisionMap = collisionMap;
    this.encounterMap = encounterMap;
  }
  
  public addEntity(entity: Entity) {
    this.entities.set(entity.id, entity);
  }
  
  public removeEntity(id: string) {
    this.entities.delete(id);
  }
  
  public getEntity(id: string): Entity | undefined {
    return this.entities.get(id);
  }
  
  public getInputQueue(): string[] {
    return [...this.inputQueue];
  }
  
  public clearInputQueue() {
    this.inputQueue = [];
  }
}