import Phaser from './lib/phaser.js';
import { GameScene } from './game-scene.js';
import { MiniMapScene } from './minimap-scene.js';

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
  scene: [GameScene, MiniMapScene],
};

const game = new Phaser.Game(gameConfig);
