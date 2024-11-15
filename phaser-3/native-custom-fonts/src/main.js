import Phaser from './lib/phaser.js';

class MainScene extends Phaser.Scene {
  constructor() {
    super(MainScene.name);
  }

  preload() {
    this.load.font(
      'Kenney-Future-Narrow',
      'assets/fonts/Kenney-Future-Narrow.ttf',
      'truetype'
    );
    this.load.font(
      'PressStart2P',
      'https://raw.githubusercontent.com/google/fonts/refs/heads/main/ofl/pressstart2p/PressStart2P-Regular.ttf',
      'truetype'
    );
  }

  create() {
    const w = this.scale.width / 2;
    this.add
      .text(w, 100, 'Default Font Family', {
        fontSize: 40,
        color: '#ffffff',
      })
      .setOrigin(0.5);
    this.add
      .text(w, 200, 'Press Start 2P', {
        fontSize: 40,
        color: '#ffffff',
        fontFamily: 'PressStart2P',
      })
      .setOrigin(0.5);
    this.add
      .text(w, 300, 'Kenny Future Narrow', {
        fontSize: 40,
        color: '#ffffff',
        fontFamily: 'Kenney-Future-Narrow',
      })
      .setOrigin(0.5);
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
