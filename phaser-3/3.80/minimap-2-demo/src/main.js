import { CameraExampleScene } from './camera-example-scene.js';
import { ImageExampleScene } from './image-example-scene.js';
import Phaser from './lib/phaser.js';

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
  scene: [CameraExampleScene, ImageExampleScene],
};

const game = new Phaser.Game(gameConfig);
