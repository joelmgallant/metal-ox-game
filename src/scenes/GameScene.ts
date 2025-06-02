import Phaser from 'phaser';
import { Player } from '../entities/Player';
import { Enemy } from '../entities/Enemy';
import { LevelGenerator } from '../utils/LevelGenerator';

export class GameScene extends Phaser.Scene {
  private player!: Player;
  private enemies!: Phaser.GameObjects.Group;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private bullets!: Phaser.GameObjects.Group;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keys!: Record<string, Phaser.Input.Keyboard.Key>;
  private debugText!: Phaser.GameObjects.Text;
  private levelGenerator!: LevelGenerator;
  Enemy = Enemy; // Store Enemy class reference for level generator

  constructor() {
    super({ key: 'GameScene' });
  }

  create(): void {
    // Add repeating background for infinite scrolling
    const bgWidth = 1600;
    const bgCount = 5; // Number of background tiles to create
    
    for (let i = 0; i < bgCount; i++) {
      const bg = this.add.image(i * bgWidth, 0, 'background');
      bg.setOrigin(0, 0);
      bg.setScrollFactor(0.5); // Parallax effect
      bg.setDepth(-1); // Ensure background stays behind
    }
    
    // Create platforms group
    this.platforms = this.physics.add.staticGroup();

    // Create player
    this.player = new Player(this, 100, 400);

    // Create enemy group
    this.enemies = this.add.group({
      classType: Enemy,
      runChildUpdate: true,
    });

    // Create bullets group
    this.bullets = this.add.group({
      classType: Phaser.Physics.Arcade.Sprite,
      maxSize: 10,
      runChildUpdate: true,
    });

    // Initialize level generator
    this.levelGenerator = new LevelGenerator(this, this.platforms, this.enemies);
    
    // Generate initial chunks
    this.levelGenerator.update(this.player.x);

    // Set up collisions
    this.setupCollisions();

    // Create input
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.keys = this.input.keyboard!.addKeys('X,C,Z') as Record<string, Phaser.Input.Keyboard.Key>;

    // Remove world bounds for infinite scrolling
    this.physics.world.setBounds(0, 0, Number.MAX_SAFE_INTEGER, 600);
    
    // Camera follow player
    this.cameras.main.startFollow(this.player);
    // Remove camera bounds for infinite scrolling
    this.cameras.main.removeBounds();
    
    // Create debug text
    this.debugText = this.add.text(this.cameras.main.width - 10, 10, '', {
      font: '14px monospace',
      color: '#00ff00',
      backgroundColor: '#000000',
      padding: { x: 5, y: 5 }
    });
    this.debugText.setOrigin(1, 0); // Align to top-right
    this.debugText.setScrollFactor(0); // Keep it fixed on screen
  }

  update(): void {
    // Handle player input
    this.player.update(this.cursors, this.keys);
    
    // Update level generation based on player position
    this.levelGenerator.update(this.player.x);
    
    // Update debug text with player position and chunk info
    const currentChunk = Math.floor(this.player.x / 800);
    this.debugText.setText(`Player Pos: (${Math.round(this.player.x)}, ${Math.round(this.player.y)})\nChunk: ${currentChunk}`);

    // Check if player fell off the world
    if (this.player.y > 600) {
      this.scene.start('GameOverScene');
    }

    // Clean up off-screen bullets
    const cameraLeft = this.cameras.main.scrollX - 100;
    const cameraRight = this.cameras.main.scrollX + this.cameras.main.width + 100;
    
    this.bullets.children.entries.forEach((bullet) => {
      const b = bullet as Phaser.Physics.Arcade.Sprite;
      if (b.x < cameraLeft || b.x > cameraRight || b.y < 0 || b.y > 600) {
        b.destroy();
      }
    });
  }


  private setupCollisions(): void {
    // Player collisions
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.enemies, this.platforms);

    // Bullet vs enemy collision
    this.physics.add.overlap(this.bullets, this.enemies, (bullet, enemy) => {
      const damage = (bullet as any).damage || 1;
      bullet.destroy();
      (enemy as Enemy).takeDamage(damage);
    });

    // Player vs enemy collision
    this.physics.add.overlap(this.player, this.enemies, () => {
      if (!this.player.isInvulnerable) {
        this.player.takeDamage(1);
        if (this.player.health <= 0) {
          this.scene.start('GameOverScene');
        }
      }
    });
  }

  createBullet(x: number, y: number, velocityX: number, isCharged: boolean = false): void {
    const bulletTexture = isCharged ? 'chargedBullet' : 'bullet';
    const bullet = this.bullets.get(x, y, bulletTexture);
    if (bullet) {
      bullet.setActive(true);
      bullet.setVisible(true);
      
      // Enable physics on the bullet
      this.physics.world.enable(bullet);
      
      // Now we can safely access the body
      if (bullet.body) {
        bullet.body.setVelocityX(velocityX * (isCharged ? 1.5 : 1)); // Charged bullets are faster
        bullet.body.setAllowGravity(false);
        bullet.body.setSize(isCharged ? 12 : 8, isCharged ? 12 : 8);
      }
      
      // Store damage value on the bullet
      (bullet as any).damage = isCharged ? 3 : 1;
      
      // Destroy bullet after 2 seconds
      this.time.delayedCall(2000, () => {
        bullet.destroy();
      });
    }
  }
}