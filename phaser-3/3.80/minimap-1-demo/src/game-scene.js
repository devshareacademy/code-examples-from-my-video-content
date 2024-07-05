import Phaser from './lib/phaser.js';
import { DIRECTION } from './components/common/index.js';
import { EventBusComponent } from './components/events/event-bus-component.js';
import { KeyboardInputComponent } from './components/input/keyboard-input-component.js';
import { GridMovementAnimationComponent } from './components/movement/grid-movement-animation-component.js';
import { GRID_MOVEMENT_EVENTS, GridMovementComponent } from './components/movement/grid-movement-component.js';

const SCALE_FACTOR = 2;

export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  preload() {
    this.load.pack('assetPack', 'assets/data/assets.json');
    this.load.animation('gemData', 'assets/data/animations.json');
  }

  create() {
    const mainBg = this.add.image(0, 0, 'background').setOrigin(0).setScale(2);
    const player = this.add
      .sprite(220 * SCALE_FACTOR, 220 * SCALE_FACTOR, 'characters', 55)
      .setOrigin(0)
      .setScale(SCALE_FACTOR)
      .setName('player')
      .play('walk_down');
    this.cameras.main.setBounds(0, 0, this.scale.width * SCALE_FACTOR, this.scale.height * SCALE_FACTOR);
    this.cameras.main.startFollow(player);
    const playerEventBusComponent = new EventBusComponent();
    const keyboardInputComponent = new KeyboardInputComponent(this);
    const gridMovementComponent = new GridMovementComponent({
      inputComponent: keyboardInputComponent,
      currentDirection: DIRECTION.DOWN,
      phaserGameObject: player,
      gridTileSize: 32,
      eventBusComponent: playerEventBusComponent,
    });
    new GridMovementAnimationComponent({
      gridMovementComponent,
      phaserGameObject: player,
      idleFrameConfig: {
        DOWN: 55,
        LEFT: 67,
        RIGHT: 79,
        UP: 91,
      },
      movementAnimationConfig: {
        DOWN: 'walk_down',
        LEFT: 'walk_left',
        RIGHT: 'walk_right',
        UP: 'walk_up',
      },
    });

    // Example of how to listen for movement events from player game object
    // playerEventBusComponent.on(GRID_MOVEMENT_EVENTS.GRID_MOVEMENT_FINISHED, () => {
    //   console.log(player.x, player.y)
    // });

    // Example of how to get JSON data from cache
    // console.log(this.cache.json.get('quests'));

    /* start of code for camera minimap */
    // create a new background image that we will apply special effects to, this image will not be shown on the main camera
    const mapBg = this.add.image(0, 0, 'background').setOrigin(0).setScale(2);
    mapBg.postFX.addColorMatrix().grayscale(0.8);
    // create a 2nd camera that will be a zoomed out version of the main camera (birds eye view)
    const minimapCamera = this.cameras
      .add(
        this.scale.width - 230,
        10,
        this.scale.width * SCALE_FACTOR,
        this.scale.height * SCALE_FACTOR,
        false,
        'minimap'
      )
      .setOrigin(0)
      .setZoom(0.16);
    // ignore any game objects we don't want visible on the 2nd camera
    minimapCamera.ignore([player, mainBg]);

    // create icons for map
    const playerIcon = this.add.circle(player.x, player.y, 20, 0xff0000, 1).setOrigin(0, -1);
    playerEventBusComponent.on(GRID_MOVEMENT_EVENTS.GRID_MOVEMENT_FINISHED, () => {
      playerIcon.setPosition(player.x, player.y);
    });
    this.cameras.main.ignore([playerIcon, mapBg]);
    const questIcons = [];
    this.cache.json.get('quests').forEach((quest) => {
      console.log(quest);
      const icon = this.add.image(quest.x, quest.y, 'questIcon').setScale(2.5).setOrigin(0);
      questIcons.push(icon);
    });
    this.cameras.main.ignore(questIcons);

    /* end of code for camera minimap */

    // temp code to allow removal of quests
    const qKey = this.input.keyboard.addKey('q');
    qKey.once(Phaser.Input.Keyboard.Events.DOWN, () => {
      questIcons.forEach((quest) => {
        quest.destroy();
      });
    });
  }
}
