import Phaser from './lib/phaser.js';
import * as WebFontLoader from './lib/webfontloader.js';

class MainScene extends Phaser.Scene {
  constructor() {
    super(MainScene.name);
  }

  preload() {}

  create() {
    const text = this.add.text(
      50,
      50,
      'The face of the\nmoon was in\nshadow.',
      {
        fontSize: 40,
        color: '#ffffff',
      }
    );

    WebFontLoader.default.load({
      google: {
        families: ['Press Start 2P'],
      },
      active: () => {
        setTimeout(() => {
          text.setFontFamily('"Press Start 2P"').setColor('#ffffff');
        }, 1500);
      },
    });
  }
}

const gameConfig = {
  type: Phaser.CANVAS,
  pixelArt: true,
  scale: {
    parent: 'game-container',
    width: 800,
    height: 480,
  },
  backgroundColor: '#5c5b5b',
  scene: [MainScene],
};

const game = new Phaser.Game(gameConfig);
