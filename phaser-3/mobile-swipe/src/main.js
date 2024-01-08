import Phaser from './lib/phaser.js';
import { Swipe } from './swipe.js';

class GameScene extends Phaser.Scene {
  constructor() {
    super(GameScene.name);
  }

  create() {
    const data = [0, 20, 84, 20, 84, 0, 120, 50, 84, 100, 84, 80, 0, 80];
    const arrow = this.add
      .polygon(this.scale.width / 2, this.scale.height / 2, data, 0x0000ff, 0.5)
      .setScale(1.2, 0.8)
      .setStrokeStyle(2, 0xffffff);

    const swipe = new Swipe(this, {
      swipeDetectedCallback: (direction) => {
        console.log(direction);
        let angle = 0;
        switch (direction) {
          case 'DOWN':
            angle = 90;
            break;
          case 'UP':
            angle = -90;
            break;
          case 'RIGHT':
            angle = 0;
            break;
          case 'LEFT':
            angle = 180;
            break;
          default:
            break;
        }
        this.add.tween({
          targets: arrow,
          angle: angle,
          ease: Phaser.Math.Easing.Sine.Out,
          duration: 500,
        });
      },
    });

    this.add
      .text(this.scale.width / 2, 550, 'Swipe the screen to move the arrow', {
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
    width: 360,
    height: 640,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    mode: Phaser.Scale.FIT,
  },
  backgroundColor: '#5c5b5b',
  scene: [GameScene],
};

const game = new Phaser.Game(gameConfig);
