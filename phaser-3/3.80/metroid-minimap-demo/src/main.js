import Phaser from './lib/phaser.js';
import { GameScene } from './game-scene.js';
import { MapScene } from './map-scene.js';

/** @type {Phaser.Types.Core.GameConfig} */
const gameConfig = {
  type: Phaser.WEBGL,
  pixelArt: true,
  roundPixels: true,
  scale: {
    parent: 'game-container',
    width: 240,
    height: 176,
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  backgroundColor: '#5c5b5b',
  physics: {
    arcade: {
      gravity: {
        y: 0,
        x: 0,
      },
      debug: true,
    },
    default: 'arcade',
  },
  scene: [GameScene, MapScene],
};

const game = new Phaser.Game(gameConfig);
