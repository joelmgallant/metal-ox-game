import Phaser from 'phaser';

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOverScene' });
  }

  create(): void {
    const { width, height } = this.cameras.main;

    // Game Over text
    const gameOverText = this.add.text(width / 2, height / 3, 'GAME OVER', {
      fontSize: '64px',
      color: '#ff0000',
      fontFamily: 'monospace',
      stroke: '#660000',
      strokeThickness: 6,
    });
    gameOverText.setOrigin(0.5);

    // Retry button
    const retryButton = this.add.text(width / 2, height / 2, 'RETRY', {
      fontSize: '32px',
      color: '#ffffff',
      fontFamily: 'monospace',
      backgroundColor: '#0066cc',
      padding: { x: 30, y: 10 },
    });
    retryButton.setOrigin(0.5);
    retryButton.setInteractive({ useHandCursor: true });

    // Menu button
    const menuButton = this.add.text(width / 2, height / 2 + 80, 'MAIN MENU', {
      fontSize: '24px',
      color: '#ffffff',
      fontFamily: 'monospace',
      backgroundColor: '#666666',
      padding: { x: 20, y: 10 },
    });
    menuButton.setOrigin(0.5);
    menuButton.setInteractive({ useHandCursor: true });

    // Button hover effects
    retryButton.on('pointerover', () => {
      retryButton.setBackgroundColor('#0088ff');
      retryButton.setScale(1.1);
    });

    retryButton.on('pointerout', () => {
      retryButton.setBackgroundColor('#0066cc');
      retryButton.setScale(1);
    });

    retryButton.on('pointerdown', () => {
      this.scene.start('GameScene');
    });

    menuButton.on('pointerover', () => {
      menuButton.setBackgroundColor('#888888');
      menuButton.setScale(1.1);
    });

    menuButton.on('pointerout', () => {
      menuButton.setBackgroundColor('#666666');
      menuButton.setScale(1);
    });

    menuButton.on('pointerdown', () => {
      this.scene.start('MainMenuScene');
    });

    // Flash effect on game over text
    this.tweens.add({
      targets: gameOverText,
      alpha: 0.3,
      duration: 500,
      ease: 'Power2',
      yoyo: true,
      repeat: -1,
    });
  }
}