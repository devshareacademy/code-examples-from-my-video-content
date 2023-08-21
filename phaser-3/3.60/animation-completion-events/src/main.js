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
      .setScale(2)
      .setAlpha(0.5);

    const cropWidth = this.#icicle.displayWidth;
    const cropHeight = this.#icicle.displayHeight;
    this.offset = this.#icicle.getTopLeft();

    //icicle.play(this.#iceAttackAnimationName);

    this.#icicle.setCrop(0, 0, cropWidth / 2, cropHeight);

    this.graphics = this.add.graphics();
    this.graphics.clear();
    this.graphics.lineStyle(1, 0x00ff00);
    this.graphics.strokeRect(
      this.#icicle.x - this.#icicle.displayWidth / 2,
      this.#icicle.displayHeight / 2,
      this.#icicle.displayWidth,
      this.#icicle.displayHeight / 2
    );

    // overlay.fillStyle(0x000000, 0.8).fillRect(0, 0, 800, 600);
    // const maskGraphics = this.make.graphics();
    // maskGraphics.fillStyle(0xffffff);
    // maskGraphics.fillRect(icicle.x, icicle.y, 256, 256);
    // const mask = new Phaser.Display.Masks.BitmapMask(this, maskGraphics);
    // mask.invertAlpha = true;
    // overlay.setMask(mask);
  }

  update() {
    //this.#icicle.y += 1;
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
  scene: [MainScene],
};

const game = new Phaser.Game(gameConfig);
