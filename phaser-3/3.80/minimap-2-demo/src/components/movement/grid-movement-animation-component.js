import Phaser from '../../lib/phaser.js';
import { GridMovementComponent } from './grid-movement-component.js';

/**
 * @typedef IdleFrameConfig
 * @type {object}
 * @property {number} LEFT
 * @property {number} RIGHT
 * @property {number} UP
 * @property {number} DOWN
 */

/**
 * @typedef MovementAnimationConfig
 * @type {object}
 * @property {string} LEFT
 * @property {string} RIGHT
 * @property {string} UP
 * @property {string} DOWN
 */

/**
 * @typedef GridMovementAnimationComponentConfig
 * @type {object}
 * @property {GridMovementComponent} gridMovementComponent
 * @property {Phaser.GameObjects.Sprite} phaserGameObject
 * @property {IdleFrameConfig} idleFrameConfig
 * @property {MovementAnimationConfig} movementAnimationConfig
 */

export class GridMovementAnimationComponent {
  /** @type {Phaser.Scene} */
  #scene;
  /** @type {Phaser.GameObjects.Sprite} */
  #phaserGameObject;
  /** @type {GridMovementComponent} */
  #gridMovementComponent;
  /** @type {IdleFrameConfig} */
  #idleFrameConfig;
  /** @type {MovementAnimationConfig} */
  #movementAnimationConfig;

  /**
   * @param {GridMovementAnimationComponentConfig} config
   */
  constructor(config) {
    this.#scene = config.phaserGameObject.scene;
    this.#gridMovementComponent = config.gridMovementComponent;
    this.#phaserGameObject = config.phaserGameObject;
    this.#idleFrameConfig = config.idleFrameConfig;
    this.#movementAnimationConfig = config.movementAnimationConfig;

    // handle automatic call to update
    this.#scene.events.on(Phaser.Scenes.Events.PRE_RENDER, this.update, this);
    this.#scene.events.once(
      Phaser.Scenes.Events.SHUTDOWN,
      () => {
        this.#scene.events.off(Phaser.Scenes.Events.PRE_RENDER, this.update, this);
      },
      this
    );
  }

  /**
   * @returns {void}
   */
  update() {
    if (this.#phaserGameObject === undefined || this.#phaserGameObject.anims === undefined) {
      return;
    }

    if (this.#gridMovementComponent.isMoving) {
      // check to see if we need to play an animation
      if (
        !this.#phaserGameObject.anims.isPlaying ||
        this.#phaserGameObject.anims.currentAnim?.key !==
          this.#movementAnimationConfig[this.#gridMovementComponent.direction]
      ) {
        this.#phaserGameObject.play(this.#movementAnimationConfig[this.#gridMovementComponent.direction]);
      }
      return;
    }

    // stop the animation if needed
    if (this.#phaserGameObject.anims.isPlaying) {
      this.#phaserGameObject.stop();
    }

    // update idle frame if needed
    if (
      this.#phaserGameObject.frame.name.toString() !==
      this.#idleFrameConfig[this.#gridMovementComponent.direction].toString()
    ) {
      this.#phaserGameObject.setFrame(this.#idleFrameConfig[this.#gridMovementComponent.direction]);
    }
  }
}
