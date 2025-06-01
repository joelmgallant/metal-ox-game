import Phaser from 'phaser';
import { gameConfig } from './config/GameConfig';
import { PreloadScene } from './scenes/PreloadScene';
import { MainMenuScene } from './scenes/MainMenuScene';
import { GameScene } from './scenes/GameScene';
import { GameOverScene } from './scenes/GameOverScene';

const config: Phaser.Types.Core.GameConfig = {
  ...gameConfig,
  scene: [PreloadScene, MainMenuScene, GameScene, GameOverScene],
};

new Phaser.Game(config);