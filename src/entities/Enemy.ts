import Phaser from 'phaser';

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  private health: number = 3;
  private moveSpeed: number = 50;
  private direction: 1 | -1 = 1;
  private patrolDistance: number = 100;
  private startX: number;
  private isDead: boolean = false;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'enemy');
    
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    this.startX = x;
    this.setCollideWorldBounds(true);
    this.setBounce(0);
    this.setSize(24, 28);
    this.setOffset(4, 4);
  }

  update(): void {
    if (this.isDead) return;

    // Simple patrol behavior
    this.setVelocityX(this.moveSpeed * this.direction);

    // Change direction at patrol limits
    if (Math.abs(this.x - this.startX) > this.patrolDistance) {
      this.direction *= -1;
      this.setFlipX(this.direction < 0);
    }

    // Change direction if hitting a wall
    if (this.body!.blocked.left && this.direction === -1) {
      this.direction = 1;
      this.setFlipX(false);
    } else if (this.body!.blocked.right && this.direction === 1) {
      this.direction = -1;
      this.setFlipX(true);
    }
  }

  takeDamage(amount: number): void {
    if (this.isDead) return;

    this.health -= amount;
    
    // Flash white when hit
    this.setTint(0xffffff);
    this.scene.time.delayedCall(100, () => {
      this.setTint(0xff0000);
    });

    if (this.health <= 0) {
      this.die();
    }
  }

  private die(): void {
    this.isDead = true;
    this.setVelocity(0, -200);
    this.setAngularVelocity(720);
    this.setAlpha(0.7);
    
    // Destroy after falling
    this.scene.time.delayedCall(1000, () => {
      this.destroy();
    });
  }
}