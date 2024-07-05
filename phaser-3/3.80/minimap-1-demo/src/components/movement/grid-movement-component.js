import Phaser from '../../lib/phaser.js';
import { EventBusComponent } from '../events/event-bus-component.js';
import { InputComponent } from '../input/input-component.js';
import { getTargetPositionFromGameObjectPositionAndDirection } from './grid-utils.js';

/**
 * @typedef GridMovementComponentConfig
 * @type {object}
 * @property {InputComponent} inputComponent
 * @property {EventBusComponent} eventBusComponent
 * @property {import('../common/index.js').Direction} currentDirection
 * @property {Phaser.GameObjects.Sprite} phaserGameObject
 * @property {number} gridTileSize
 */

export const GRID_MOVEMENT_EVENTS = Object.freeze({
  INPUT_STOPPED: 'INPUT_STOPPED',
  CHANGED_DIRECTION: 'CHANGED_DIRECTION',
  GRID_MOVEMENT_STARTED: 'GRID_MOVEMENT_STARTED',
  GRID_MOVEMENT_FINISHED: 'GRID_MOVEMENT_FINISHED',
});

export class GridMovementComponent {
  /** @type {Phaser.Scene} */
  #scene;
  /** @type {Phaser.GameObjects.Sprite} */
  #phaserGameObject;
  /** @type {EventBusComponent} */
  #eventBusComponent;
  /** @type {InputComponent} */
  #inputComponent;
  /** @type {import('../common/index.js').Direction} */
  #direction;
  /** @type {boolean} */
  #isMoving;
  /** @type {boolean} */
  #startedMoving;
  /** @type {import('../common/index.js').Coordinate} */
  #targetPosition;
  /** @type {import('../common/index.js').Coordinate} */
  #previousTargetPosition;
  /** @type {number} */
  #gridTileSize;

  /**
   * @param {GridMovementComponentConfig} config
   */
  constructor(config) {
    this.#scene = config.phaserGameObject.scene;
    this.#phaserGameObject = config.phaserGameObject;
    this.#inputComponent = config.inputComponent;
    this.#eventBusComponent = config.eventBusComponent;
    this.#direction = config.currentDirection;
    this.#isMoving = false;
    this.#startedMoving = false;
    /** @type {import('../common/index.js').Coordinate} */
    const currentPosition = {
      x: this.#phaserGameObject.x,
      y: this.#phaserGameObject.y,
    };
    this.#previousTargetPosition = { ...currentPosition };
    this.#targetPosition = { ...currentPosition };
    this.#gridTileSize = config.gridTileSize;

    // handle automatic call to update
    this.#scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    this.#scene.events.once(
      Phaser.Scenes.Events.SHUTDOWN,
      () => {
        this.#scene.events.off(Phaser.Scenes.Events.UPDATE, this.update, this);
      },
      this
    );
  }

  /** @type {boolean} */
  get isMoving() {
    return this.#isMoving;
  }

  /** @type {import('../common/index.js').Direction} */
  get direction() {
    return this.#direction;
  }

  /**
   * @returns {void}
   */
  update() {
    if (this.isMoving) {
      return;
    }

    const directionKeyPressed = this.#inputComponent.directionKeyPressed;
    if (directionKeyPressed === undefined) {
      if (this.#startedMoving) {
        // fire event so we can stop animations since there is no input
        this.#eventBusComponent.emit(GRID_MOVEMENT_EVENTS.INPUT_STOPPED, this.#direction);
        this.#startedMoving = false;
      }
      return;
    }
    const changedDirection = this.#direction !== this.#inputComponent.directionKeyPressed;
    this.#direction = directionKeyPressed;

    if (changedDirection) {
      this.#eventBusComponent.emit(GRID_MOVEMENT_EVENTS.CHANGED_DIRECTION, this.#direction);
    }

    this.#isMoving = true;
    this.#startedMoving = true;
    const updatedPosition = getTargetPositionFromGameObjectPositionAndDirection(
      this.#targetPosition,
      this.#direction,
      this.#gridTileSize
    );
    this.#previousTargetPosition = { ...this.#targetPosition };
    this.#targetPosition.x = updatedPosition.x;
    this.#targetPosition.y = updatedPosition.y;

    this.#eventBusComponent.emit(GRID_MOVEMENT_EVENTS.GRID_MOVEMENT_STARTED, this.#direction);
    this.#phaserGameObject.scene.add.tween({
      delay: 0,
      duration: 300,
      y: {
        from: this.#phaserGameObject.y,
        start: this.#phaserGameObject.y,
        to: this.#targetPosition.y,
      },
      x: {
        from: this.#phaserGameObject.x,
        start: this.#phaserGameObject.x,
        to: this.#targetPosition.x,
      },
      targets: this.#phaserGameObject,
      onComplete: () => {
        this.#isMoving = false;
        this.#previousTargetPosition = { ...this.#targetPosition };
        this.#eventBusComponent.emit(GRID_MOVEMENT_EVENTS.GRID_MOVEMENT_FINISHED, {
          direction: this.#direction,
          x: this.#phaserGameObject.x,
          y: this.#phaserGameObject.y,
        });
      },
    });
  }
}
