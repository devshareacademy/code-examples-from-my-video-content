import { makeDraggable } from './draggable.js';
import Phaser from './lib/phaser.js';

class GameScene extends Phaser.Scene {
  constructor() {
    super(GameScene.name);
  }

  create() {
    const rectangle = this.add.rectangle(this.scale.width / 2, this.scale.height / 2, 100, 100, 0xffff00);
    makeDraggable(rectangle);
    this.add
      .text(this.scale.width / 2, 550, 'try dragging the rectangle around the scene', {
        align: 'center',
        fontSize: '22px',
        wordWrap: {
          width: this.scale.width - 50,
        },
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
    height: 600,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    mode: Phaser.Scale.FIT,
  },
  backgroundColor: '#5c5b5b',
  scene: [GameScene],
};

const game = new Phaser.Game(gameConfig);
