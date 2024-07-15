import Phaser from './lib/phaser.js';

/**
 * @typedef MiniMapSceneInitData
 * @type {object}
 * @property {Phaser.Tilemaps.Tilemap} levelTileMap
 */

export class MapScene extends Phaser.Scene {
  /** @type {boolean} */
  #mainMapShown;
  /** @type {Phaser.Tilemaps.Tilemap} */
  #levelTileMap;
  /** @type {number} */
  #levelRoomWidth;
  /** @type {number} */
  #levelRoomHeight;
  /** @type {number} */
  #mapRoomWidth;
  /** @type {number} */
  #mapRoomHeight;
  /** @type {number} */
  #lastScrollX;
  /** @type {number} */
  #lastScrollY;

  constructor() {
    super({ key: 'MapScene' });
  }

  /**
   * @param {MiniMapSceneInitData} data
   * @returns {void}
   */
  init(data) {
    this.#levelTileMap = data.levelTileMap;
    this.#lastScrollX = 0;
    this.#lastScrollY = 0;
    this.#mainMapShown = false;
  }

  /**
   * @returns {void}
   */
  create() {
    this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x000000).setOrigin(0);
    const map = this.add.tilemap('map');
    const tileset = map.addTilesetImage('map-Sheet', 'minimapTileset');
    const layer = map.createLayer('map', tileset);
    const mapX = this.scale.width / 2 - layer.width / 2;
    const mapY = this.scale.height / 2 - layer.height / 2;
    layer.setPosition(mapX, mapY);
    this.toggleMap();

    // calculate dimensions of map based on actual level sizes
    this.#levelRoomHeight = this.#levelTileMap.heightInPixels / map.height;
    this.#levelRoomWidth = this.#levelTileMap.widthInPixels / map.width;
    this.#mapRoomHeight = map.tileHeight;
    this.#mapRoomWidth = map.tileWidth;

    this.registry.events.on('changedata', (parent, key, data) => {
      if (key !== 'playerPosition') {
        return;
      }
      if (this.#mainMapShown) {
        return;
      }

      // update the camera position based on the players location, so that the center point of the viewport
      // will be the players room location
      // to calculate the location, we need to take the players x and y position on the original map and
      // calculate the same x and y value on the minimap location
      const x = Math.floor(data.x / this.#levelRoomWidth);
      const y = Math.floor(data.y / this.#levelRoomHeight);

      const playerX = mapX + x * this.#mapRoomWidth;
      const playerY = mapY + y * this.#mapRoomHeight;
      const centeredX = playerX - this.#mapRoomWidth;
      const centeredY = playerY - this.#mapRoomHeight;

      this.cameras.main.setScroll(centeredX, centeredY);
    });
  }

  /**
   * @returns {void}
   */
  toggleMap() {
    if (this.cameras.main.width === 24) {
      this.#mainMapShown = true;
      this.#lastScrollX = this.cameras.main.scrollX;
      this.#lastScrollY = this.cameras.main.scrollY;
      this.cameras.main.setScroll(0, 0);
      this.cameras.main.setViewport(0, 0, this.scale.width, this.scale.height);
    } else {
      this.#mainMapShown = false;
      this.cameras.main.setViewport(this.scale.width - 26, 2, 24, 24);
      this.cameras.main.setScroll(this.#lastScrollX, this.#lastScrollY);
    }
    this.registry.set('mainMapShown', this.#mainMapShown);
  }
}
