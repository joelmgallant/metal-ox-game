import Phaser from 'phaser';

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload(): void {
    this.createLoadingBar();
    
    // Create placeholder graphics for now
    this.createPlaceholderAssets();
  }

  create(): void {
    this.scene.start('MainMenuScene');
  }

  private createLoadingBar(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);

    const loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: 'Loading...',
      style: {
        font: '20px monospace',
        color: '#ffffff',
      },
    });
    loadingText.setOrigin(0.5, 0.5);

    this.load.on('progress', (value: number) => {
      progressBar.clear();
      progressBar.fillStyle(0x00ff00, 1);
      progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30);
    });

    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
    });
  }

  private createPlaceholderAssets(): void {
    // Create colored rectangles as placeholder sprites
    const graphics = this.make.graphics({ x: 0, y: 0 });
    
    // Player sprite (blue)
    graphics.fillStyle(0x0000ff);
    graphics.fillRect(0, 0, 32, 48);
    graphics.generateTexture('player', 32, 48);
    
    // Enemy sprite (red)
    graphics.clear();
    graphics.fillStyle(0xff0000);
    graphics.fillRect(0, 0, 32, 32);
    graphics.generateTexture('enemy', 32, 32);
    
    // Bullet sprite (yellow)
    graphics.clear();
    graphics.fillStyle(0xffff00);
    graphics.fillCircle(4, 4, 4);
    graphics.generateTexture('bullet', 8, 8);
    
    // Platform tile (gray)
    graphics.clear();
    graphics.fillStyle(0x666666);
    graphics.fillRect(0, 0, 32, 32);
    graphics.generateTexture('platform', 32, 32);
    
    // Wall tile (dark gray)
    graphics.clear();
    graphics.fillStyle(0x333333);
    graphics.fillRect(0, 0, 32, 32);
    graphics.generateTexture('wall', 32, 32);
    
    graphics.destroy();
  }
}