import Phaser from './lib/phaser.js';
import { KeyboardInputComponent } from './components/input/keyboard-input-component.js';
import { PhysicsMovementComponent } from './components/movement/physics-movement-components.js';
import { MapScene } from './map-scene.js';

export class GameScene extends Phaser.Scene {
  /** @type {Phaser.Types.Physics.Arcade.SpriteWithDynamicBody} */
  #player;
  /** @type {Phaser.GameObjects.TileSprite} */
  #middleBackgroundTileSprite;
  /** @type {{x:number;y:number;}} */
  #lastPlayerPosition;

  constructor() {
    super({ key: 'GameScene' });
  }

  /**
   * @returns {void}
   */
  preload() {
    // environment
    this.load.image('background', 'assets/environment/background.png');
    this.load.image('middleground', 'assets/environment/middleground.png');
    // tileset
    this.load.image('tileset', 'assets/environment/tilesets.png');
    this.load.image('walls', 'assets/environment/walls.png');
    this.load.tilemapTiledJSON('level', 'assets/maps/map2.json');
    // minimap
    this.load.image('minimapTileset', 'assets/maps/map-Sheet.png');
    this.load.tilemapTiledJSON('map', 'assets/maps/minimap.json');
    // atlas sprites
    this.load.atlas('atlas', 'assets/atlas/atlas.png', 'assets/atlas/atlas.json');
    this.load.atlas('atlas-props', 'assets/atlas/atlas-props.png', 'assets/atlas/atlas-props.json');
  }

  /**
   * @returns {void}
   */
  create() {
    this.#createBackgrounds();
    const tileObjects = this.#createTileMap();
    this.#player = this.#createPlayer();
    this.#lastPlayerPosition = { x: this.#player.x, y: this.#player.y };
    this.#decorWorld();

    // add collisions
    this.physics.add.collider(this.#player, tileObjects.layer);
    // update camera
    this.cameras.main.startFollow(this.#player, false, 0.1, 1, 0.1);
    this.cameras.main.setBounds(0, 0, tileObjects.map.widthInPixels, tileObjects.map.heightInPixels);
    // map ui
    /** @type {import('./map-scene.js').MiniMapSceneInitData} */
    const dataToPass = { levelTileMap: tileObjects.map };
    this.scene.launch('MapScene', dataToPass);

    const mKey = this.input.keyboard.addKey('m');
    /** @type {MapScene} */ // @ts-ignore
    const miniMapScene = this.scene.get('MapScene');
    mKey.on(Phaser.Input.Keyboard.Events.DOWN, () => {
      miniMapScene.toggleMap();
    });
  }

  /**
   * @returns {void}
   */
  update() {
    if (this.#player.body.onFloor()) {
      if (this.#player.body.velocity.x !== 0) {
        if (this.#player.anims.getName() !== 'run') {
          this.#player.play('run');
        }
      } else {
        if (this.#player.anims.getName() !== 'idle') {
          this.#player.play('idle');
        }
      }
    } else {
      if (this.#player.body.velocity.y > 0) {
        if (this.#player.anims.getName() !== 'fall') {
          this.#player.play('fall');
        }
      } else if (this.#player.body.velocity.y < 0) {
        if (this.#player.anims.getName() !== 'jump') {
          this.#player.play('jump');
        }
      }
    }

    this.#middleBackgroundTileSprite.tilePositionX = this.#player.x * 0.25;
    if (this.#lastPlayerPosition.x !== this.#player.x || this.#lastPlayerPosition.y !== this.#player.y) {
      this.#lastPlayerPosition = { x: this.#player.x, y: this.#player.y };
      this.registry.set('playerPosition', { x: this.#player.x, y: this.#player.y });
    }
  }

  /**
   * @returns {void}
   */
  #createBackgrounds() {
    this.add.tileSprite(0, 0, this.scale.width, this.scale.height, 'background', 0).setOrigin(0).setScrollFactor(0);
    this.#middleBackgroundTileSprite = this.add
      .tileSprite(0, 0, this.scale.width, this.scale.height, 'middleground', 0)
      .setOrigin(0)
      .setScrollFactor(0);
  }

  /**
   * @returns {{ layer: Phaser.Tilemaps.TilemapLayer; map: Phaser.Tilemaps.Tilemap; }}
   */
  #createTileMap() {
    const map = this.add.tilemap('level');
    console.log(map);
    const tileset = map.addTilesetImage('tileset');
    const wallTileset = map.addTilesetImage('walls');
    map.createLayer('Tile Layer 2', wallTileset).setPosition(0, -16);
    const layer = map.createLayer('Tile Layer 1', tileset).setPosition(0, 0);

    // collision
    map.setCollisionBetween(27, 31);
    map.setCollision(33);
    map.setCollisionBetween(182, 185);
    map.setCollisionBetween(182, 185);
    map.setCollision(81);
    map.setCollision(83);
    map.setCollision(85);
    map.setCollision(87);
    map.setCollision(89);
    map.setCollision(114);
    map.setCollision(116);
    map.setCollision(93);
    map.setCollision(170);
    map.setCollisionBetween(172, 173);
    map.setCollision(175);
    map.setCollision(177);
    map.setCollisionBetween(179, 180);
    map.setCollision(166);
    map.setCollision(214);
    map.setCollision(215);
    map.setCollision(238);
    map.setCollision(239);
    map.setCollisionBetween(254, 257);
    map.setCollision(76);
    map.setCollision(100);
    map.setCollision(78);
    map.setCollision(102);
    map.setCollision(248);
    map.setCollision(249);
    map.setCollision(251);
    map.setCollision(252);
    map.setCollision(259);
    map.setCollision(260);
    map.setCollision(119);
    map.setCollision(206);
    map.setCollision(230);
    map.setCollision(209);
    map.setCollision(233);

    // one way
    this.#setOneWayCollision(38, map);
    this.#setOneWayCollision(42, map);
    this.#setOneWayCollision(187, map);
    this.#setOneWayCollision(188, map);

    // const g = this.add.graphics();
    // layer.renderDebug(g);

    return {
      map,
      layer,
    };
  }

  /**
   * @param {number} tileIndex
   * @param {Phaser.Tilemaps.Tilemap} map
   */
  #setOneWayCollision(tileIndex, map) {
    for (let x = 0; x < map.width; x++) {
      for (let y = 1; y < map.height; y++) {
        const tile = map.getTileAt(x, y);
        if (tile !== null) {
          if (tile.index == tileIndex) {
            tile.setCollision(false, false, true, false);
          }
        }
      }
    }
  }

  /**
   * @returns {Phaser.Types.Physics.Arcade.SpriteWithDynamicBody}
   */
  #createPlayer() {
    const player = this.physics.add.sprite(64, 70, 'atlas', 'player-idle-1');
    player.body.setGravityY(500);
    player.body.setSize(11, 40, true);

    //var s = 10;
    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNames('atlas', {
        prefix: 'player-idle-',
        start: 1,
        end: 4,
      }),
      repeat: -1,
      frameRate: 6,
    });
    this.anims.create({
      key: 'run',
      frames: this.anims.generateFrameNames('atlas', {
        prefix: 'player-run-',
        start: 1,
        end: 10,
      }),
      repeat: -1,
      frameRate: 10,
    });
    this.anims.create({
      key: 'jump',
      frames: this.anims.generateFrameNames('atlas', {
        prefix: 'player-jump-',
        start: 1,
        end: 6,
      }),
      repeat: -1,
      frameRate: 10,
    });
    this.anims.create({
      key: 'fall',
      frames: this.anims.generateFrameNames('atlas', {
        prefix: 'player-jump-',
        start: 3,
        end: 6,
      }),
      repeat: -1,
      frameRate: 10,
    });
    player.play('idle');

    const keyboardInputComponent = new KeyboardInputComponent(this);
    const playerPhysicsComponent = new PhysicsMovementComponent({
      speed: 100,
      inputComponent: keyboardInputComponent,
      phaserGameObject: player,
    });
    this.registry.events.on('changedata', (parent, key, data) => {
      if (key !== 'mainMapShown') {
        return;
      }
      playerPhysicsComponent.enableMovement = data;
    });

    return player;
  }

  #decorWorld() {
    this.#addProp(0, 4, 'gate-01');
    this.#addProp(6, 6, 'plant-big');
    this.#addProp(19, 18, 'plant-small');
    this.#addProp(13, 17, 'plant-big');
    this.#addProp(6, 6, 'plant-big');
    this.#addProp(21, 18, 'stone');
    this.#addProp(54, 6, 'stone-head');
    this.#addProp(52, -1, 'stalactite');
    this.#addProp(22, 12, 'stalactite');
  }

  #addProp(x, y, item) {
    this.add.image(x * 16, y * 16, 'atlas-props', item).setOrigin(0);
  }
}
