import Phaser from './lib/phaser.js';

export class Game extends Phaser.Scene {
  constructor() {
    super({ key: 'Game' });
  }

  create() {
    console.log('1');
    this.time.delayedCall(0, () => {
      console.log('2');
    });
    console.log('3');
    new Promise((resolve) => {
      setTimeout(() => {
        console.log('5');
        resolve();
      }, 3);
    });
    console.log('4');
  }
}

const gameConfig = {
  type: Phaser.CANVAS,
  pixelArt: true,
  scale: {
    parent: 'game-container',
    width: window.innerWidth, //1080,
    height: window.innerHeight, //1920,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    mode: Phaser.Scale.RESIZE,
  },
  backgroundColor: '#000000',
  scene: [Game],
};

const game = new Phaser.Game(gameConfig);
