import Phaser from './lib/phaser.js';
import { GameScene } from './game-scene.js';

const gameConfig = {
  type: Phaser.WEBGL,
  pixelArt: true,
  scale: {
    parent: 'game-container',
    width: 688,
    height: 544,
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  backgroundColor: '#5c5b5b',
  scene: [GameScene],
};

const game = new Phaser.Game(gameConfig);
