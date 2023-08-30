import Phaser from './lib/phaser.js';
import * as WebFontLoader from './lib/webfontloader.js';

class MainScene extends Phaser.Scene {
  constructor() {
    super(MainScene.name);
  }

  preload() {}

  create() {
    const w = this.scale.width / 2;
    this.add
      .text(w, 100, 'Default Font Family', {
        fontSize: 32,
        color: '#ffffff',
      })
      .setOrigin(0.5);
    const text = this.add
      .text(w, 200, 'Press Start 2P', {
        fontSize: 32,
        color: '#ffffff',
      })
      .setOrigin(0.5);
    const text2 = this.add
      .text(w, 300, 'Kenny Future Narrow', {
        fontSize: 40,
        color: '#ffffff',
      })
      .setOrigin(0.5);

    WebFontLoader.default.load({
      google: {
        families: ['Press Start 2P'],
      },
      custom: {
        families: ['Kenney-Future-Narrow'],
      },
      active: () => {
        text.setFontFamily('"Press Start 2P"').setColor('#ffffff');
        text2.setFontFamily('Kenney-Future-Narrow').setColor('#ffffff');
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
