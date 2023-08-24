import Phaser from './lib/phaser.js';

class MainScene extends Phaser.Scene {
  #spriteSheetAssetName = 'lightning';

  constructor() {
    super(MainScene.name);
  }

  preload() {
    this.load.spritesheet(this.#spriteSheetAssetName, 'assets/lightning.png', {
      frameWidth: 32,
      frameHeight: 96,
    });
  }

  create() {
    this.anims.create({
      key: this.#spriteSheetAssetName,
      frames: this.anims.generateFrameNumbers(this.#spriteSheetAssetName),
      frameRate: 4,
    });

    const lightning = this.add
      .sprite(this.scale.width / 2, 0, this.#spriteSheetAssetName, 0)
      .setOrigin(0.5, 0)
      .setScale(5);

    lightning.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      console.log('animation completed');
    });

    let counter = 0;
    lightning.on(
      Phaser.Animations.Events.ANIMATION_COMPLETE_KEY +
        this.#spriteSheetAssetName,
      () => {
        counter += 1;
        console.log(`lightning strike: ${counter}`);
        lightning.setAlpha(0).setFrame(0).setX(Phaser.Math.Between(100, 700));
        this.time.delayedCall(800, () => {
          lightning.setAlpha(1);
          lightning.play(this.#spriteSheetAssetName);
        });
      }
    );

    lightning.play(this.#spriteSheetAssetName);
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
