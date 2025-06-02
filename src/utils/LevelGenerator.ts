import Phaser from 'phaser';

export interface LevelChunk {
  startX: number;
  endX: number;
  platforms: Phaser.Physics.Arcade.Sprite[];
  enemies: Phaser.GameObjects.GameObject[];
  chunkIndex: number;
}

export class LevelGenerator {
  private scene: Phaser.Scene;
  private chunkWidth: number = 800; // Width of each chunk
  private loadedChunks: Map<number, LevelChunk> = new Map();
  private platformGroup: Phaser.Physics.Arcade.StaticGroup;
  private enemyGroup: Phaser.GameObjects.Group;
  private lastGeneratedChunk: number = -1;
  
  constructor(
    scene: Phaser.Scene, 
    platformGroup: Phaser.Physics.Arcade.StaticGroup,
    enemyGroup: Phaser.GameObjects.Group
  ) {
    this.scene = scene;
    this.platformGroup = platformGroup;
    this.enemyGroup = enemyGroup;
  }
  
  update(playerX: number): void {
    // Calculate which chunk the player is in
    const currentChunk = Math.floor(playerX / this.chunkWidth);
    
    // Generate chunks ahead of the player
    const chunksAhead = 2;
    const chunksToGenerate = currentChunk + chunksAhead;
    
    // Generate new chunks if needed
    for (let i = this.lastGeneratedChunk + 1; i <= chunksToGenerate; i++) {
      this.generateChunk(i);
    }
    
    // Clean up old chunks behind the player
    const chunksBehind = 2;
    const oldestChunkToKeep = currentChunk - chunksBehind;
    
    this.loadedChunks.forEach((chunk, index) => {
      if (index < oldestChunkToKeep) {
        this.removeChunk(index);
      }
    });
  }
  
  private generateChunk(chunkIndex: number): void {
    const startX = chunkIndex * this.chunkWidth;
    const endX = startX + this.chunkWidth;
    
    const chunk: LevelChunk = {
      startX,
      endX,
      platforms: [],
      enemies: [],
      chunkIndex
    };
    
    // Generate ground for this chunk
    for (let x = startX; x < endX; x += 32) {
      const ground = this.platformGroup.create(x, 568, 'platform') as Phaser.Physics.Arcade.Sprite;
      chunk.platforms.push(ground);
    }
    
    // Generate platforms with different patterns based on chunk index
    const pattern = chunkIndex % 4; // Cycle through 4 different patterns
    
    switch (pattern) {
      case 0: // Ascending platforms
        this.createAscendingPlatforms(chunk, startX);
        break;
      case 1: // Gap jumping
        this.createGapPlatforms(chunk, startX);
        break;
      case 2: // Zigzag platforms
        this.createZigzagPlatforms(chunk, startX);
        break;
      case 3: // Mixed heights
        this.createMixedPlatforms(chunk, startX);
        break;
    }
    
    // Add enemies to chunk (if not the first chunk)
    if (chunkIndex > 0) {
      this.spawnEnemiesInChunk(chunk, startX);
    }
    
    this.loadedChunks.set(chunkIndex, chunk);
    this.lastGeneratedChunk = chunkIndex;
  }
  
  private createAscendingPlatforms(chunk: LevelChunk, startX: number): void {
    const platforms = [
      { x: 150, y: 450, width: 3 },
      { x: 300, y: 380, width: 2 },
      { x: 450, y: 310, width: 3 },
      { x: 650, y: 240, width: 2 },
    ];
    
    platforms.forEach(p => {
      for (let i = 0; i < p.width; i++) {
        const platform = this.platformGroup.create(
          startX + p.x + (i * 32), 
          p.y, 
          'platform'
        ) as Phaser.Physics.Arcade.Sprite;
        chunk.platforms.push(platform);
      }
    });
  }
  
  private createGapPlatforms(chunk: LevelChunk, startX: number): void {
    const platforms = [
      { x: 100, y: 400, width: 2 },
      { x: 300, y: 400, width: 2 },
      { x: 500, y: 350, width: 1 },
      { x: 650, y: 300, width: 2 },
    ];
    
    platforms.forEach(p => {
      for (let i = 0; i < p.width; i++) {
        const platform = this.platformGroup.create(
          startX + p.x + (i * 32), 
          p.y, 
          'platform'
        ) as Phaser.Physics.Arcade.Sprite;
        chunk.platforms.push(platform);
      }
    });
  }
  
  private createZigzagPlatforms(chunk: LevelChunk, startX: number): void {
    const platforms = [
      { x: 100, y: 400, width: 2 },
      { x: 250, y: 320, width: 2 },
      { x: 400, y: 400, width: 2 },
      { x: 550, y: 320, width: 2 },
      { x: 700, y: 250, width: 2 },
    ];
    
    platforms.forEach(p => {
      for (let i = 0; i < p.width; i++) {
        const platform = this.platformGroup.create(
          startX + p.x + (i * 32), 
          p.y, 
          'platform'
        ) as Phaser.Physics.Arcade.Sprite;
        chunk.platforms.push(platform);
      }
    });
  }
  
  private createMixedPlatforms(chunk: LevelChunk, startX: number): void {
    const platforms = [
      { x: 150, y: 450, width: 3 },
      { x: 350, y: 350, width: 1 },
      { x: 450, y: 280, width: 2 },
      { x: 600, y: 400, width: 2 },
      { x: 700, y: 320, width: 1 },
    ];
    
    platforms.forEach(p => {
      for (let i = 0; i < p.width; i++) {
        const platform = this.platformGroup.create(
          startX + p.x + (i * 32), 
          p.y, 
          'platform'
        ) as Phaser.Physics.Arcade.Sprite;
        chunk.platforms.push(platform);
      }
    });
  }
  
  private spawnEnemiesInChunk(chunk: LevelChunk, startX: number): void {
    // Spawn 1-3 enemies per chunk
    const enemyCount = Phaser.Math.Between(1, 3);
    
    for (let i = 0; i < enemyCount; i++) {
      const x = startX + Phaser.Math.Between(100, 700);
      const y = Phaser.Math.Between(200, 500);
      
      // Import Enemy class dynamically to avoid circular dependencies
      const Enemy = (this.scene as any).Enemy;
      if (Enemy) {
        const enemy = new Enemy(this.scene, x, y);
        this.enemyGroup.add(enemy);
        chunk.enemies.push(enemy);
      }
    }
  }
  
  private removeChunk(chunkIndex: number): void {
    const chunk = this.loadedChunks.get(chunkIndex);
    if (!chunk) return;
    
    // Destroy all platforms in the chunk
    chunk.platforms.forEach(platform => {
      platform.destroy();
    });
    
    // Destroy all enemies in the chunk
    chunk.enemies.forEach(enemy => {
      enemy.destroy();
    });
    
    this.loadedChunks.delete(chunkIndex);
  }
  
  reset(): void {
    // Clear all loaded chunks
    this.loadedChunks.forEach((chunk, index) => {
      this.removeChunk(index);
    });
    this.loadedChunks.clear();
    this.lastGeneratedChunk = -1;
  }
}