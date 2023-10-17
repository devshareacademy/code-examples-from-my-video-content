import Phaser from './lib/phaser.js';

const ASSET_KEY = 'BG';

class Scene1 extends Phaser.Scene {
  /** @type {Phaser.GameObjects.Graphics} */
  #g;

  constructor() {
    super(Scene1.name);
  }

  preload() {
    this.load.image(ASSET_KEY, '/assets/preview.png');
  }

  create() {
    const { width, height } = this.scale;
    this.#g = this.add.graphics();
    this.#g.fillCircle(width / 2, height / 2, 150);
    const mask = this.#g.createGeometryMask();
    this.cameras.main.setMask(mask);

    this.add.image(0, 0, ASSET_KEY).setOrigin(0).setScale;

    this.input.keyboard.once('keydown-SPACE', () => {
      this.scene.start(Scene2.name);
    });
  }

  update() {
    const p = this.input.activePointer;

    this.#g.clear().fillCircle(p.x, p.y, 150);
  }
}

class Scene2 extends Phaser.Scene {
  constructor() {
    super(Scene2.name);
  }

  preload() {
    this.load.image(ASSET_KEY, '/assets/preview.png');
  }

  create() {
    const { width, height } = this.scale;
    const g = this.add.graphics();
    const rectShape = new Phaser.Geom.Rectangle(0, height / 2, width, 0);
    g.fillRectShape(rectShape);
    const mask = g.createGeometryMask();
    this.cameras.main.setMask(mask);

    this.add.image(0, 0, ASSET_KEY).setOrigin(0).setScale;

    this.events.once(Phaser.Scenes.Events.CREATE, () => {
      this.tweens.add({
        onUpdate: () => {
          g.clear().fillRectShape(rectShape);
        },
        delay: 400,
        duration: 1500,
        height: {
          ease: Phaser.Math.Easing.Expo.InOut,
          from: 0,
          start: 0,
          to: height,
        },
        y: {
          ease: Phaser.Math.Easing.Expo.InOut,
          from: height / 2,
          start: height / 2,
          to: 0,
        },
        targets: rectShape,
        onComplete: () => {
          mask.destroy();
          this.cameras.main.clearMask();

          this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start(Scene1.name);
          });
        },
      });
    });
  }
}

const gameConfig = {
  type: Phaser.CANVAS,
  pixelArt: true,
  scale: {
    parent: 'game-container',
    width: 1000,
    height: 750,
  },
};

const game = new Phaser.Game(gameConfig);
game.scene.add(Scene1.name, Scene1);
game.scene.add(Scene2.name, Scene2);
game.scene.start(Scene1.name);
