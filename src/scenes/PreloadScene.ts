import Phaser from 'phaser';

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload(): void {
    this.createLoadingBar();
    
    // Load actual player sprite
    this.load.image('player', 'assets/sprites/player.png');
    
    // Create placeholder graphics for other assets
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
    
    // Charged bullet sprite (pink)
    graphics.clear();
    graphics.fillStyle(0xff69b4);
    graphics.fillCircle(6, 6, 6);
    graphics.generateTexture('chargedBullet', 12, 12);
    
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
    
    // Background texture with gradient sky
    graphics.clear();
    // Create gradient effect manually with multiple rectangles
    const skyColors = [
      { y: 0, height: 200, color: 0x001a33 },    // Dark blue at top
      { y: 200, height: 200, color: 0x004080 },  // Medium blue in middle
      { y: 400, height: 200, color: 0x0066cc }   // Lighter blue at bottom
    ];
    
    skyColors.forEach(section => {
      graphics.fillStyle(section.color);
      graphics.fillRect(0, section.y, 1600, section.height);
    });
    
    // Add some stars
    graphics.fillStyle(0xffffff, 0.8);
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * 1600;
      const y = Math.random() * 300;
      const size = Math.random() * 2;
      graphics.fillCircle(x, y, size);
    }
    
    // Add some distant mountains
    graphics.fillStyle(0x1a1a2e, 0.8);
    graphics.beginPath();
    graphics.moveTo(0, 400);
    graphics.lineTo(200, 350);
    graphics.lineTo(400, 380);
    graphics.lineTo(600, 320);
    graphics.lineTo(800, 360);
    graphics.lineTo(1000, 340);
    graphics.lineTo(1200, 370);
    graphics.lineTo(1400, 330);
    graphics.lineTo(1600, 350);
    graphics.lineTo(1600, 600);
    graphics.lineTo(0, 600);
    graphics.closePath();
    graphics.fillPath();
    
    graphics.generateTexture('background', 1600, 600);
    
    graphics.destroy();
  }
}