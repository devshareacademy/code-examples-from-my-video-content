import Phaser from '../../lib/phaser.js';
import { InputComponent } from '../input/input-component.js';

/**
 * @typedef PhysicsMovementComponentConfig
 * @type {object}
 * @property {InputComponent} inputComponent
 * @property {Phaser.Types.Physics.Arcade.SpriteWithDynamicBody} phaserGameObject
 * @property {number} speed
 */

export class PhysicsMovementComponent {
  /** @type {Phaser.Scene} */
  #scene;
  /** @type {Phaser.Types.Physics.Arcade.SpriteWithDynamicBody} */
  #phaserGameObject;
  /** @type {InputComponent} */
  #inputComponent;
  /** @type {number} */
  #speed;
  /** @type {boolean} */
  #inputLocked;

  /**
   * @param {PhysicsMovementComponentConfig} config
   */
  constructor(config) {
    this.#scene = config.phaserGameObject.scene;
    this.#phaserGameObject = config.phaserGameObject;
    this.#inputComponent = config.inputComponent;
    this.#speed = config.speed;
    this.#inputLocked = false;

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

  /**
   * @param {boolean} val
   */
  set enableMovement(val) {
    this.#inputLocked = val;
  }

  /**
   * @returns {void}
   */
  update() {
    if (this.#inputLocked) {
      this.#phaserGameObject.body.setVelocityX(0);
      return;
    }

    if (this.#inputComponent.leftIsDown) {
      this.#phaserGameObject.body.setVelocityX(this.#speed * -1);
      this.#phaserGameObject.setFlipX(true);
    } else if (this.#inputComponent.rightIsDown) {
      this.#phaserGameObject.body.setVelocityX(this.#speed);
      this.#phaserGameObject.setFlipX(false);
    } else {
      this.#phaserGameObject.body.setVelocityX(0);
    }

    if (this.#inputComponent.spaceIsDown && this.#phaserGameObject.body.onFloor()) {
      this.#phaserGameObject.body.velocity.y = -200;
    }
  }
}
