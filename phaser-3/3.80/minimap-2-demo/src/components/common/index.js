/**
 * @typedef Coordinate
 * @type {object}
 * @property {number} x the position of this coordinate
 * @property {number} y the position of this coordinate
 */

/**
 * @typedef {keyof typeof DIRECTION} Direction
 */

/** @enum {Direction} */
export const DIRECTION = Object.freeze({
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
  UP: 'UP',
  DOWN: 'DOWN',
});

/**
 * Utility function to ensure we handle the full possible range of types when checking a variable for a possible
 * type in a union.
 *
 * A good example of this is when we check for all of the possible values in a `switch` statement, and we want
 * to ensure we check for all possible values in an enum type object.
 * @param {never} _value
 * @returns {never}
 */
export function exhaustiveGuard(_value) {
  throw new Error(`Error! Reached forbidden guard function with unexpected value: ${JSON.stringify(_value)}`);
}
