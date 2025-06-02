import Phaser from 'phaser';

export class Player extends Phaser.Physics.Arcade.Sprite {
  public health: number = 6;
  public isInvulnerable: boolean = false;
  
  private jumpPower: number = -800;
  private moveSpeed: number = 200;
  private isCharging: boolean = false;
  private chargeTime: number = 0;
  private canShoot: boolean = true;
  private shootCooldown: number = 300;
  private facing: 'left' | 'right' = 'right';
  private gameScene: Phaser.Scene;
  private debugGraphics: Phaser.GameObjects.Graphics;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'player');
    this.gameScene = scene;
    
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    
    this.setCollideWorldBounds(false); // Allow infinite scrolling
    this.setBounce(0);
    this.setDrag(800, 0);
    this.setMaxVelocity(this.moveSpeed, 500);


    // Scale down the sprite to appropriate game size
    this.setScale(0.1); // Adjust this value as needed

    // Custom bounding box - adjust these values as needed
    // setSize(width, height) - the size of the collision box
    // setOffset(x, y) - offset from top-left of sprite
    this.setSize(500, 800); 
    this.setOffset(200, 0);
    
    // Create debug graphics for bounding box
    this.debugGraphics = scene.add.graphics();
    this.drawDebugBounds();
  }
  
  private drawDebugBounds(): void {
    this.debugGraphics.clear();
    this.debugGraphics.lineStyle(2, 0x00ff00, 1);
    
    // Get the physics body bounds
    const body = this.body as Phaser.Physics.Arcade.Body;
    if (body) {
      this.debugGraphics.strokeRect(
        body.x,
        body.y,
        body.width,
        body.height
      );
    }
  }

  update(cursors: Phaser.Types.Input.Keyboard.CursorKeys, keys: Record<string, Phaser.Input.Keyboard.Key>): void {
    const onGround = this.body!.blocked.down;
    
    // Update debug bounds drawing
    this.drawDebugBounds();
    
    // Horizontal movement
    if (cursors.left.isDown) {
      this.setVelocityX(-this.moveSpeed);
      this.facing = 'left';
      this.setFlipX(true);
    } else if (cursors.right.isDown) {
      this.setVelocityX(this.moveSpeed);
      this.facing = 'right';
      this.setFlipX(false);
    } else {
      this.setVelocityX(0);
    }

    // Jumping
    if (cursors.space.isDown && onGround) {
      this.setVelocityY(this.jumpPower);
    }

    // Shooting
    if (keys['X'].isDown) {
      if (!this.isCharging) {
        this.isCharging = true;
        this.chargeTime = 0;
      } else {
        this.chargeTime += this.gameScene.game.loop.delta;
      }
    } else if (keys['X'].isUp && this.isCharging) {
      this.shoot();
      this.isCharging = false;
      this.chargeTime = 0;
    }

    // Visual feedback for charging
    if (this.isCharging) {
      const chargeLevel = Math.min(this.chargeTime / 1000, 1);
      this.setTint(Phaser.Display.Color.GetColor(
        255,
        255 - Math.floor(chargeLevel * 100),
        255 - Math.floor(chargeLevel * 200)
      ));
    } else {
      this.clearTint();
    }

    // Update invulnerability flashing
    if (this.isInvulnerable) {
      this.setAlpha(Math.sin(this.gameScene.time.now * 0.05) * 0.5 + 0.5);
    } else {
      this.setAlpha(1);
    }
  }

  private shoot(): void {
    if (!this.canShoot) return;

    const bulletX = this.x + (this.facing === 'right' ? 40 : -40);
    const bulletY = this.y + 8;
    const bulletVelocity = this.facing === 'right' ? 400 : -400;
    const isCharged = this.chargeTime >= 1000; // Charged if held for 1+ seconds

    // Create bullet through GameScene
    (this.gameScene as any).createBullet(bulletX, bulletY, bulletVelocity, isCharged);

    // Apply cooldown
    this.canShoot = false;
    this.gameScene.time.delayedCall(this.shootCooldown, () => {
      this.canShoot = true;
    });

    // Visual feedback
    this.gameScene.cameras.main.shake(50, isCharged ? 0.005 : 0.002);
  }

  takeDamage(amount: number): void {
    if (this.isInvulnerable) return;

    this.health -= amount;
    this.isInvulnerable = true;

    // Knockback
    const knockbackX = this.facing === 'right' ? -200 : 200;
    this.setVelocity(knockbackX, -200);

    // Flash red
    this.setTint(0xff0000);
    this.gameScene.time.delayedCall(100, () => {
      this.clearTint();
    });

    // Invulnerability period
    this.gameScene.time.delayedCall(1500, () => {
      this.isInvulnerable = false;
    });
  }
}