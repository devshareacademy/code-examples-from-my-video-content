import Phaser from './lib/phaser.js';

class Scene1 extends Phaser.Scene {
  constructor() {
    super(Scene1.name);
  }

  create() {
    this.add.rectangle(100, 100, 600, 400, 0x0000ff, 0.4).setOrigin(0);

    this.input.keyboard.once('keydown-SPACE', () => {
      this.cameras.main.fadeOut(1000, 0, 0, 0);
    });

    this.cameras.main.once(
      Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
      () => {
        this.scene.start(Scene2.name);
      }
    );

    this.cameras.main.fadeIn(1000, 0, 0, 0);
  }
}

class Scene2 extends Phaser.Scene {
  constructor() {
    super(Scene2.name);
  }

  create() {
    this.add.circle(200, 100, 200, 0x00ff00, 0.4).setOrigin(0);

    this.input.keyboard.once('keydown-SPACE', () => {
      this.cameras.main.fadeOut(1000, 0, 0, 0);
    });

    this.cameras.main.once(
      Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
      () => {
        this.scene.start(Scene1.name);
      }
    );

    this.cameras.main.fadeIn(1000, 0, 0, 0);
  }
}

const gameConfig = {
  type: Phaser.CANVAS,
  pixelArt: true,
  scale: {
    parent: 'game-container',
    width: 800,
    height: 600,
  },
  backgroundColor: '#5c5b5b',
  scene: [Scene1, Scene2],
};

const game = new Phaser.Game(gameConfig);
