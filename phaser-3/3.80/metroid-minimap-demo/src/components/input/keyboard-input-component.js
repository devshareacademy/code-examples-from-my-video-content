import Phaser from '../../lib/phaser.js';
import { InputComponent } from './input-component.js';

export class KeyboardInputComponent extends InputComponent {
  /** @type {Phaser.Types.Input.Keyboard.CursorKeys | undefined} */
  #cursorKeys;

  /**
   * @param {Phaser.Scene} scene
   */
  constructor(scene) {
    super();

    if (!scene.input.keyboard === undefined) {
      console.log('Phaser Keyboard Plugin is not enabled, KeyboardInputComponent will not work properly');
      return;
    }
    this.#cursorKeys = scene.input.keyboard.createCursorKeys();

    // handle automatic call to update
    scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    scene.events.once(
      Phaser.Scenes.Events.SHUTDOWN,
      () => {
        scene.events.off(Phaser.Scenes.Events.UPDATE, this.update, this);
      },
      this
    );
  }

  /**
   * @returns {void}
   */
  update() {
    if (this.#cursorKeys === undefined) {
      return;
    }
    this._up = this.#cursorKeys.up.isDown || false;
    this._down = this.#cursorKeys.down.isDown || false;
    this._left = this.#cursorKeys.left.isDown || false;
    this._right = this.#cursorKeys.right.isDown || false;
    this._space = this.#cursorKeys.space.isDown || false;
  }
}
