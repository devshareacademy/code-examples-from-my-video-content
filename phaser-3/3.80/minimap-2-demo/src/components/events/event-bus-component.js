import Phaser from '../../lib/phaser.js';

export const CUSTOM_EVENTS = Object.freeze({
  ENEMY_DESTROYED: 'ENEMY_DESTROYED',
  PLAYER_DESTROYED: 'PLAYER_DESTROYED',
  PLAYER_SPAWN: 'PLAYER_SPAWN',
});

export class EventBusComponent extends Phaser.Events.EventEmitter {
  constructor() {
    super();
  }
}
