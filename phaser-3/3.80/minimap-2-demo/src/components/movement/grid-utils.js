import { DIRECTION, exhaustiveGuard } from '../common/index.js';

/**
 * @param {import('../common/index').Coordinate} currentPosition
 * @param {import('../common/index').Direction} direction
 * @param {number} tileSize
 * @returns {import('../common/index').Coordinate}
 */
export function getTargetPositionFromGameObjectPositionAndDirection(currentPosition, direction, tileSize) {
  /** @type {import('../common/index').Coordinate} */
  const targetPosition = { ...currentPosition };
  switch (direction) {
    case DIRECTION.DOWN:
      targetPosition.y += tileSize;
      break;
    case DIRECTION.UP:
      targetPosition.y -= tileSize;
      break;
    case DIRECTION.LEFT:
      targetPosition.x -= tileSize;
      break;
    case DIRECTION.RIGHT:
      targetPosition.x += tileSize;
      break;
    default:
      exhaustiveGuard(direction);
  }
  return targetPosition;
}
