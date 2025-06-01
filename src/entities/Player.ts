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

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'player');
    this.gameScene = scene;
    
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    this.setCollideWorldBounds(true);
    this.setBounce(0);
    this.setDrag(800, 0);
    this.setMaxVelocity(this.moveSpeed, 500);
    this.setSize(24, 42);
    this.setOffset(4, 6);
  }

  update(cursors: Phaser.Types.Input.Keyboard.CursorKeys, keys: Record<string, Phaser.Input.Keyboard.Key>): void {
    const onGround = this.body!.blocked.down;
    
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

    const bulletX = this.x + (this.facing === 'right' ? 20 : -20);
    const bulletY = this.y;
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