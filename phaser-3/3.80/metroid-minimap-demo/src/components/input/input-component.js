import { DIRECTION } from '../common/index.js';

export class InputComponent {
  /** @protected @type {boolean} */
  _up;
  /** @protected @type {boolean} */
  _down;
  /** @protected @type {boolean} */
  _left;
  /** @protected @type {boolean} */
  _right;
  /** @protected @type {boolean} */
  _space;

  constructor() {
    this.reset();
  }

  /** @type {boolean} */
  get leftIsDown() {
    return this._left;
  }

  /** @type {boolean} */
  get rightIsDown() {
    return this._right;
  }

  /** @type {boolean} */
  get downIsDown() {
    return this._down;
  }

  /** @type {boolean} */
  get upIsDown() {
    return this._up;
  }

  /** @type {boolean} */
  get spaceIsDown() {
    return this._space;
  }

  /** @type {import('../common/index.js').Direction | undefined} */
  get directionKeyPressed() {
    if (this._left) {
      return DIRECTION.LEFT;
    }
    if (this._right) {
      return DIRECTION.RIGHT;
    }
    if (this._up) {
      return DIRECTION.UP;
    }
    if (this._down) {
      return DIRECTION.DOWN;
    }
    return undefined;
  }

  /**
   * @returns {void}
   */
  reset() {
    this._up = false;
    this._down = false;
    this._right = false;
    this._left = false;
    this._space = false;
  }
}
