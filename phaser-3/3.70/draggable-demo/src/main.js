import Phaser from './lib/phaser.js';

const ASSETS = {
  BACKGROUND: { key: 'BACKGROUND', path: 'background.png' },
  SHIP: { key: 'SHIP', path: 'ship-a1.png' },
  ROCK: { key: 'ROCK', path: 'big-a.png' },
};

export class Game extends Phaser.Scene {
  constructor() {
    super({ key: 'Game' });
  }

  preload() {
    this.load.setPath('assets/starfighter');
    Object.values(ASSETS).forEach((asset) => {
      this.load.image(asset.key, asset.path);
    });
  }

  create() {
    this.add
      .image(
        this.scale.width / 2,
        this.scale.height / 2,
        ASSETS.BACKGROUND.key,
        0
      )
      .setAngle(-90)
      .setAlpha(0.7)
      .setScale(2.5);
    const ship = this.add
      .image(this.scale.width / 2, this.scale.height - 200, ASSETS.SHIP.key, 0)
      .setScale(3);
    ship.setInteractive({
      draggable: true,
    });
    ship.on('drag', (pointer, dragX, dragY) => {
      console.log(pointer);
      console.log(dragX, dragY);
      ship.setPosition(dragX, dragY);
    });

    const rock = this.add
      .image(this.scale.width / 2, 150, ASSETS.ROCK.key, 0)
      .setScale(3);

    rock.setInteractive({
      draggable: true,
    });

    rock.on('drag', (pointer, x, y) => {
      rock.x = x;
      rock.y = y;
    });
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
