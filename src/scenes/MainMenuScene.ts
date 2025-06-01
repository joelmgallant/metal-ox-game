import Phaser from 'phaser';

export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainMenuScene' });
  }

  create(): void {
    const { width, height } = this.cameras.main;

    // Title
    const title = this.add.text(width / 2, height / 3, 'MEGAMAN GAME', {
      fontSize: '48px',
      color: '#00ffff',
      fontFamily: 'monospace',
      stroke: '#0066cc',
      strokeThickness: 4,
    });
    title.setOrigin(0.5);

    // Start button
    const startButton = this.add.text(width / 2, height / 2, 'START GAME', {
      fontSize: '32px',
      color: '#ffffff',
      fontFamily: 'monospace',
      backgroundColor: '#0066cc',
      padding: { x: 20, y: 10 },
    });
    startButton.setOrigin(0.5);
    startButton.setInteractive({ useHandCursor: true });

    // Button hover effects
    startButton.on('pointerover', () => {
      startButton.setBackgroundColor('#0088ff');
      startButton.setScale(1.1);
    });

    startButton.on('pointerout', () => {
      startButton.setBackgroundColor('#0066cc');
      startButton.setScale(1);
    });

    startButton.on('pointerdown', () => {
      this.scene.start('GameScene');
    });

    // Controls info
    const controls = this.add.text(width / 2, height * 0.8, 
      'Controls:\nArrow Keys - Move\nSpace - Jump\nX - Shoot', {
      fontSize: '16px',
      color: '#ffffff',
      fontFamily: 'monospace',
      align: 'center',
      lineSpacing: 5,
    });
    controls.setOrigin(0.5);

    // Add floating animation to title
    this.tweens.add({
      targets: title,
      y: title.y + 10,
      duration: 2000,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1,
    });
  }
}