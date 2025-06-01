import Phaser from 'phaser';
import { Player } from '../entities/Player';
import { Enemy } from '../entities/Enemy';

export class GameScene extends Phaser.Scene {
  private player!: Player;
  private enemies!: Phaser.GameObjects.Group;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private bullets!: Phaser.GameObjects.Group;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keys!: Record<string, Phaser.Input.Keyboard.Key>;

  constructor() {
    super({ key: 'GameScene' });
  }

  create(): void {
    // Add background
    const background = this.add.image(0, 0, 'background');
    background.setOrigin(0, 0);
    background.setScrollFactor(0.5); // Parallax effect
    
    // Create platforms
    this.createLevel();

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

    // Add some enemies
    this.spawnEnemies();

    // Set up collisions
    this.setupCollisions();

    // Create input
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.keys = this.input.keyboard!.addKeys('X,C,Z') as Record<string, Phaser.Input.Keyboard.Key>;

    // Camera follow player
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBounds(0, 0, 1600, 600);
  }

  update(): void {
    // Handle player input
    this.player.update(this.cursors, this.keys);

    // Check if player fell off the world
    if (this.player.y > 600) {
      this.scene.start('GameOverScene');
    }

    // Clean up off-screen bullets
    this.bullets.children.entries.forEach((bullet) => {
      const b = bullet as Phaser.Physics.Arcade.Sprite;
      if (b.x < 0 || b.x > 1600 || b.y < 0 || b.y > 600) {
        b.destroy();
      }
    });
  }

  private createLevel(): void {
    this.platforms = this.physics.add.staticGroup();

    // Ground
    for (let i = 0; i < 50; i++) {
      this.platforms.create(i * 32, 568, 'platform');
    }

    // Platforms
    this.platforms.create(400, 400, 'platform');
    this.platforms.create(432, 400, 'platform');
    this.platforms.create(464, 400, 'platform');
    
    this.platforms.create(650, 320, 'platform');
    this.platforms.create(682, 320, 'platform');
    
    this.platforms.create(200, 250, 'platform');
    this.platforms.create(232, 250, 'platform');
    
    this.platforms.create(800, 450, 'platform');
    this.platforms.create(832, 450, 'platform');
    this.platforms.create(864, 450, 'platform');
    
    this.platforms.create(1000, 350, 'platform');
    this.platforms.create(1032, 350, 'platform');
    
    this.platforms.create(1200, 280, 'platform');
    this.platforms.create(1232, 280, 'platform');
    this.platforms.create(1264, 280, 'platform');
  }

  private spawnEnemies(): void {
    const enemyPositions = [
      { x: 500, y: 350 },
      { x: 700, y: 270 },
      { x: 900, y: 400 },
      { x: 1100, y: 300 },
      { x: 1300, y: 230 },
    ];

    enemyPositions.forEach(pos => {
      const enemy = new Enemy(this, pos.x, pos.y);
      this.enemies.add(enemy);
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