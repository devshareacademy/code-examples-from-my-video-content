import Phaser from './lib/phaser.js';

const AssetKeys = Object.freeze({
  PANEL: 'PANEL',
});

const AssetCutFrames = Object.freeze({
  TL: 'TL',
  TM: 'TM',
  TR: 'TR',
  ML: 'ML',
  MM: 'MM',
  MR: 'MR',
  BL: 'BL',
  BM: 'BM',
  BR: 'BR',
});

class Game extends Phaser.Scene {
  constructor() {
    super({ key: 'Game' });
  }

  preload() {
    this.load.image(AssetKeys.PANEL, 'assets/kenneys-assets/ui-space-expansion/glassPanel.png');
    // this.load.image(AssetKeys.PANEL, 'assets/bdragon1727/border.png');
  }

  create() {
    // this.add.image(this.scale.width / 2, this.scale.height / 2, AssetKeys.PANEL, 0);
    // this.add.image(this.scale.width / 2, this.scale.height / 2, AssetKeys.PANEL, 0).setScale(7, 5);

    // setup config for new custom nine slice objects
    const cornerCut = 32;
    const targetWidth = 600;
    const targetHeight = 400;
    const texture = this.sys.textures.get(AssetKeys.PANEL);
    // get the original frame so we can the image dimensions
    /** @type {Phaser.Textures.Frame} */
    const baseFrame = texture.frames['__BASE'];
    console.log(baseFrame.width, baseFrame.height);

    // start in the top left corner for our first cut
    texture.add(AssetCutFrames.TL, 0, 0, 0, cornerCut, cornerCut);
    // for the middle, we need to calculate the width remaining after we take our two cuts
    texture.add(AssetCutFrames.TM, 0, cornerCut, 0, baseFrame.width - cornerCut * 2, cornerCut);
    // for the top right side corner we just need to take the total width and remove the cut length
    texture.add(AssetCutFrames.TR, 0, baseFrame.width - cornerCut, 0, cornerCut, cornerCut);

    // for the middle left, we take the overall image height and subtract the size of the two corner cuts to get new height
    texture.add(AssetCutFrames.ML, 0, 0, cornerCut, cornerCut, baseFrame.height - cornerCut * 2);
    // for the middle, we need to take the overall image height and width, subtract the two corner cuts to get the new dimensions
    texture.add(
      AssetCutFrames.MM,
      0,
      cornerCut,
      cornerCut,
      baseFrame.width - cornerCut * 2,
      baseFrame.height - cornerCut * 2
    );
    // for the middle right, we need to do similar logic that was done for the middle left piece
    texture.add(
      AssetCutFrames.MR,
      0,
      baseFrame.width - cornerCut,
      cornerCut,
      cornerCut,
      baseFrame.height - cornerCut * 2
    );

    // for the bottom left, we take the overall image height and subtract the corner cut
    texture.add(AssetCutFrames.BL, 0, 0, baseFrame.height - cornerCut, cornerCut, cornerCut);
    // for the middle and right, we do the same logic we did in th tm and tr frames, just at a lower y value
    texture.add(
      AssetCutFrames.BM,
      0,
      cornerCut,
      baseFrame.height - cornerCut,
      baseFrame.width - cornerCut * 2,
      cornerCut
    );
    texture.add(AssetCutFrames.BR, 0, baseFrame.width - cornerCut, baseFrame.height - cornerCut, cornerCut, cornerCut);

    const tl = this.add.image(0, 0, AssetKeys.PANEL, AssetCutFrames.TL).setOrigin(0);
    const tm = this.add.image(tl.displayWidth, 0, AssetKeys.PANEL, AssetCutFrames.TM).setOrigin(0);
    tm.displayWidth = targetWidth - cornerCut * 2;
    const tr = this.add.image(tl.displayWidth + tm.displayWidth, 0, AssetKeys.PANEL, AssetCutFrames.TR).setOrigin(0);

    const ml = this.add.image(0, tl.displayHeight, AssetKeys.PANEL, AssetCutFrames.ML).setOrigin(0);
    ml.displayHeight = targetHeight - cornerCut * 2;
    const mm = this.add.image(ml.displayWidth, ml.y, AssetKeys.PANEL, AssetCutFrames.MM).setOrigin(0);
    mm.displayHeight = targetHeight - cornerCut * 2;
    mm.displayWidth = targetWidth - cornerCut * 2;
    const mr = this.add.image(ml.displayWidth + mm.displayWidth, ml.y, AssetKeys.PANEL, AssetCutFrames.MR).setOrigin(0);
    mr.displayHeight = mm.displayHeight;

    const bl = this.add.image(0, tl.displayHeight + ml.displayHeight, AssetKeys.PANEL, AssetCutFrames.BL).setOrigin(0);
    const bm = this.add.image(bl.displayWidth, bl.y, AssetKeys.PANEL, AssetCutFrames.BM).setOrigin(0);
    bm.displayWidth = tm.displayWidth;
    const br = this.add.image(bl.displayWidth + bm.displayWidth, bl.y, AssetKeys.PANEL, AssetCutFrames.BR).setOrigin(0);

    // finally, create a container to group our new game objects together in
    this.add.container(100, 100, [tl, tm, tr, ml, mm, mr, bl, bm, br]);
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
  scene: [Game],
};

const game = new Phaser.Game(gameConfig);
