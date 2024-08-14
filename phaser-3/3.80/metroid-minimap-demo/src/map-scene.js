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
  #map;
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
    // create scene background
    this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x000000).setOrigin(0);
    // create map based on Tiled map data
    this.#map = this.add.tilemap('map');
    const tileset = this.#map.addTilesetImage('map-Sheet', 'minimapTileset');
    this.#mapTilemapLayer = this.#map.createLayer('map', tileset);
    const iconTileset = this.#map.addTilesetImage('objects', 'icons');
    this.#itemTilemapLayer = this.#map.createLayer('items', iconTileset);
    // update map location to be centered in scene
    const mapX = this.scale.width / 2 - this.#mapTilemapLayer.width / 2;
    const mapY = this.scale.height / 2 - this.#mapTilemapLayer.height / 2;
    this.#mapTilemapLayer.setPosition(mapX, mapY);
    this.#itemTilemapLayer.setPosition(mapX, mapY);
    // update scene to be in the minimap format
    this.toggleMap();

    // calculate dimensions of map based on actual level sizes
    this.#levelRoomHeight = this.#levelTileMap.heightInPixels / this.#map.height;
    this.#levelRoomWidth = this.#levelTileMap.widthInPixels / this.#map.width;
    this.#mapRoomHeight = this.#map.tileHeight;
    this.#mapRoomWidth = this.#map.tileWidth;

    this.#createRoomVisitedData();
    this.#createPlayerCursor();

    // register event listener for shared data changes
    this.registry.events.on('changedata', this.#handleRegistryDataUpdated);
  }

  /**
   * Toggle Phaser Scene between full scene view (display full map) and minimap view in the main Phaser game scene.
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
   * Used to populate to objects that are used for tracking which rooms and items should be
   * revealed to the player on the map. By default, no room and item data will be revealed
   * until the player enters that room (on the minimap).
   */
  #createRoomVisitedData() {
    for (let x = 0; x < this.#map.width; x += 1) {
      for (let y = 0; y < this.#map.height; y += 1) {
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
  }

  /**
   * Updates map data and view based on the shared data registry in the Phaser Game.
   * When the player moves in the main Phaser Scene, the players updated position is detected here
   * which will have the camera scroll and move to show the current room to the player.
   *
   * When an item is picked up in the game scene, the picked up item is detected here and the
   * map will update to reflect the item has been picked up by the player.
   *
   * Lastly, when the player clicks the `p` key to simulate map data being made to the player will
   * trigger the map being revealed to the player.
   */
  #handleRegistryDataUpdated(parent, key, data) {
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

    const playerX = this.#mapTilemapLayer.x + x * this.#mapRoomWidth;
    const playerY = this.#mapTilemapLayer.y + y * this.#mapRoomHeight;
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
  }

  #createPlayerCursor() {
    this.#playerCursor = this.add.rectangle(0, 0, this.#mapRoomWidth, this.#mapRoomHeight, 0xff0000).setOrigin(0);
    this.tweens.add({
      targets: this.#playerCursor,
      alpha: 0,
      yoyo: true,
      repeat: -1,
      duration: 800,
      ease: Phaser.Math.Easing.Sine.InOut,
    });
  }

  /**
   * Creates the unique key for tracking which rooms have been visited by the player.
   * @param {number} x
   * @param {number} y
   * @returns {string}
   */
  #createRoomVisitedKey(x, y) {
    return `${x}:${y}`;
  }

  /**
   * Updates all of the tiles in the Tilemap to now be visible, which simulates the player
   * picking up a map in the game and so all rooms will be revealed but will show they have
   * not been visited.
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
