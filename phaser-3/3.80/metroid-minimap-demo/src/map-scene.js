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
  /** @type {{[key: string]: boolean}} */
  #roomsVisited;
  /** @type {Phaser.Tilemaps.TilemapLayer} */
  #mapTilemapLayer;
  /** @type {{[key: string]: boolean}} */
  #items;
  /** @type {Phaser.Tilemaps.TilemapLayer} */
  #itemTilemapLayer;
  /** @type {Phaser.GameObjects.Rectangle} */
  #playerCursor;

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
    this.#roomsVisited = {};
    this.#items = {};
  }

  /**
   * @returns {void}
   */
  create() {
    this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x000000).setOrigin(0);
    const map = this.add.tilemap('map');
    const tileset = map.addTilesetImage('map-Sheet', 'minimapTileset');
    this.#mapTilemapLayer = map.createLayer('map', tileset);
    const iconTileset = map.addTilesetImage('objects', 'icons');
    this.#itemTilemapLayer = map.createLayer('items', iconTileset);
    const mapX = this.scale.width / 2 - this.#mapTilemapLayer.width / 2;
    const mapY = this.scale.height / 2 - this.#mapTilemapLayer.height / 2;
    this.#mapTilemapLayer.setPosition(mapX, mapY);
    this.#itemTilemapLayer.setPosition(mapX, mapY);
    this.toggleMap();

    // calculate dimensions of map based on actual level sizes
    this.#levelRoomHeight = this.#levelTileMap.heightInPixels / map.height;
    this.#levelRoomWidth = this.#levelTileMap.widthInPixels / map.width;
    this.#mapRoomHeight = map.tileHeight;
    this.#mapRoomWidth = map.tileWidth;
    for (let x = 0; x < map.width; x += 1) {
      for (let y = 0; y < map.height; y += 1) {
        const tile = this.#mapTilemapLayer.getTileAt(x, y);
        if (tile === null) {
          continue;
        }
        tile.setVisible(false);
        this.#roomsVisited[this.#createRoomVisitedKey(x, y)] = false;

        // handle items
        const itemTile = this.#itemTilemapLayer.getTileAt(x, y);
        if (itemTile === null) {
          continue;
        }
        itemTile.setVisible(false);
        this.#items[this.#createRoomVisitedKey(x, y)] = false;
      }
    }

    this.#playerCursor = this.add.rectangle(0, 0, this.#mapRoomWidth, this.#mapRoomHeight, 0xff0000).setOrigin(0);
    this.tweens.add({
      targets: this.#playerCursor,
      alpha: 0,
      yoyo: true,
      repeat: -1,
      duration: 800,
      ease: Phaser.Math.Easing.Sine.InOut,
    });

    this.registry.events.on('changedata', (parent, key, data) => {
      if (key !== 'playerPosition' && key !== 'mapPickedUp' && key !== 'itemsPickedUp') {
        return;
      }
      if (key === 'mapPickedUp') {
        this.#showMap();
        return;
      }
      if (key === 'itemsPickedUp') {
        const itemTile = this.#itemTilemapLayer.getTileAtWorldXY(this.#playerCursor.x, this.#playerCursor.y);
        itemTile.index = 25;
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

      if (!this.#roomsVisited[this.#createRoomVisitedKey(x, y)]) {
        this.#roomsVisited[this.#createRoomVisitedKey(x, y)] = true;
        const tile = this.#mapTilemapLayer.getTileAt(x, y);
        if (tile === null) {
          return;
        }
        tile.setVisible(true);
        tile.index = tile.index + 11;
      }

      // handle item
      if (!this.#items[this.#createRoomVisitedKey(x, y)]) {
        this.#items[this.#createRoomVisitedKey(x, y)] = true;
        const tile = this.#itemTilemapLayer.getTileAt(x, y);
        if (tile === null) {
          return;
        }
        tile.setVisible(true);
      }

      this.#playerCursor.setPosition(centeredX + this.#mapRoomWidth, centeredY + this.#mapRoomHeight);
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

  /**
   * @param {number} x
   * @param {number} y
   * @returns {string}
   */
  #createRoomVisitedKey(x, y) {
    return `${x}:${y}`;
  }

  /**
   * @returns {void}
   */
  #showMap() {
    Object.keys(this.#roomsVisited).forEach((key) => {
      const coordinate = key.split(':');
      const tile = this.#mapTilemapLayer.getTileAt(parseInt(coordinate[0], 10), parseInt(coordinate[1], 10));
      if (tile === null) {
        return;
      }
      tile.setVisible(true);
    });

    Object.keys(this.#items).forEach((key) => {
      const coordinate = key.split(':');
      const tile = this.#itemTilemapLayer.getTileAt(parseInt(coordinate[0], 10), parseInt(coordinate[1], 10));
      if (tile === null) {
        return;
      }
      tile.setVisible(true);
    });
  }
}
