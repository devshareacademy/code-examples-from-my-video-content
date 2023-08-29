import Phaser from './lib/phaser.js';

class MainScene extends Phaser.Scene {
  #iceSpriteSheetAssetName = 'icicle';
  #iceAttackAnimationName = 'fall';
  #iceBreakAnimationName = 'break';
  /** @type {Phaser.GameObjects.Sprite} */
  #icicle;

  constructor() {
    super(MainScene.name);
  }

  preload() {
    this.load.spritesheet(this.#iceSpriteSheetAssetName, 'assets/icicle.png', {
      frameWidth: 32,
      frameHeight: 48,
    });
  }

  create() {
    this.anims.create({
      key: this.#iceAttackAnimationName,
      frames: this.anims.generateFrameNumbers(this.#iceSpriteSheetAssetName, {
        frames: [0, 1, 2, 3, 4, 5, 6],
      }),
      frameRate: 4,
    });
    this.anims.create({
      key: this.#iceBreakAnimationName,
      frames: this.anims.generateFrameNumbers(this.#iceSpriteSheetAssetName, {
        frames: [7, 8],
      }),
      frameRate: 4,
    });

    this.#icicle = this.add
      .sprite(this.scale.width / 2, 0, this.#iceSpriteSheetAssetName, 6)
      .setOrigin(0.5, 0)
      .setScale(2);

    this.#icicle.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      console.log('animation completed');
    });
    this.#icicle.once(
      Phaser.Animations.Events.ANIMATION_COMPLETE_KEY +
        this.#iceAttackAnimationName,
      () => {
        console.log('attack animation completed');
        const cropWidth = this.#icicle.displayWidth * 0.5;
        const cropHeight = this.#icicle.displayHeight * 0.5;
        this.#icicle.setCrop(0, cropHeight / 2, cropWidth, cropHeight / 2);

        const icicleBase = this.add
          .sprite(this.scale.width / 2, 0, this.#iceSpriteSheetAssetName, 6)
          .setOrigin(0.5, 0)
          .setScale(2)
          .setAlpha(0.5);
        icicleBase.setCrop(0, 0, cropWidth, cropHeight / 2);

        const startYPos = this.#icicle.y;
        const endYPos = startYPos + 500;
        this.tweens.add({
          delay: 0,
          duration: 1200,
          y: {
            from: startYPos,
            start: startYPos,
            to: endYPos,
          },
          targets: this.#icicle,
          onComplete: () => {
            this.#icicle.play(this.#iceBreakAnimationName);
          },
        });
      }
    );
    this.#icicle.once(
      Phaser.Animations.Events.ANIMATION_COMPLETE_KEY +
        this.#iceBreakAnimationName,
      () => {
        this.#icicle.setAlpha(0);
      }
    );

    this.#icicle.play(this.#iceAttackAnimationName);
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
