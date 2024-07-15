import Phaser from './lib/phaser.js';

/**
 * @typedef {keyof typeof MAP_ICON_TYPE} MapIconType
 */

/**
 * @typedef MapIcon
 * @type {object}
 * @property {string} id
 * @property {MapIconType} iconType
 * @property {number} x
 * @property {number} y
 */

/**
 * @typedef MiniMapSceneInitData
 * @type {object}
 * @property {MapIcon[]} mapIcons
 * @property {number} worldWidth
 * @property {number} worldHeight
 */

export const MAP_ICON_TYPE = Object.freeze({
  PLAYER: 'PLAYER',
  QUEST: 'QUEST',
});

export class MiniMapScene extends Phaser.Scene {
  /** @type {{[key: string]: MapIcon}} */
  #mapIcons;
  /** @type {{[key: string]: Phaser.GameObjects.Image | Phaser.GameObjects.Shape}} */
  #mapIconGameObjects;
  /** @type {Phaser.GameObjects.Container} */
  #mapContainer;
  /** @type {number} */
  #miniMapWidth;
  /** @type {number} */
  #miniMapHeight;
  /** @type {number} */
  #worldWidth;
  /** @type {number} */
  #worldHeight;

  constructor() {
    super({ key: 'MiniMapScene' });
  }

  /**
   * @param {MiniMapSceneInitData} data
   * @returns {void}
   */
  init(data) {
    this.#mapIcons = {};
    data.mapIcons.forEach((icon) => {
      this.#mapIcons[icon.id] = icon;
    });
    this.#worldHeight = data.worldHeight;
    this.#worldWidth = data.worldWidth;
  }

  /**
   * @returns {void}
   */
  create() {
    const mapImage = this.add.image(0, 0, 'map').setScale(0.25).setOrigin(0);
    const mapBackground = this.add
      .rectangle(0, 0, mapImage.displayWidth, mapImage.displayHeight, 0x000000)
      .setOrigin(0);
    this.#miniMapHeight = mapImage.displayHeight;
    this.#miniMapWidth = mapImage.displayWidth;

    this.#mapContainer = this.add.container(this.scale.width - this.#miniMapWidth - 10, 10, []).setDepth(2);
    this.#mapContainer.add([mapBackground, mapImage]);

    this.#createMapIcons();
  }

  /**
   * @returns {void}
   */
  toggleMap() {
    this.#mapContainer.setVisible(!this.#mapContainer.visible);
  }

  /**
   * @param {string} iconId
   * @param {number} worldX
   * @param {number} worldY
   * @returns {void}
   */
  updateIconPosition(iconId, worldX, worldY) {
    if (this.#mapIconGameObjects[iconId] === undefined) {
      return;
    }

    const iconPosition = this.#calculateIconPosition(worldX, worldY);
    this.#mapIconGameObjects[iconId].setPosition(iconPosition.x, iconPosition.y);
  }

  /**
   * @param {string} iconId
   * @returns {void}
   */
  removeIcon(iconId) {
    delete this.#mapIcons[iconId];
    if (this.#mapIconGameObjects[iconId] === undefined) {
      return;
    }
    this.#mapIconGameObjects[iconId].destroy();
    delete this.#mapIconGameObjects[iconId];
  }

  /**
   * @returns {void}
   */
  #createMapIcons() {
    this.#mapIconGameObjects = {};
    Object.keys(this.#mapIcons).forEach((key) => {
      const mapIcon = this.#mapIcons[key];
      const iconPosition = this.#calculateIconPosition(mapIcon.x, mapIcon.y);
      /** @type {Phaser.GameObjects.Shape | Phaser.GameObjects.Image} */
      let gameObject;
      if (mapIcon.iconType === MAP_ICON_TYPE.PLAYER) {
        gameObject = this.add.circle(iconPosition.x, iconPosition.y, 4, 0xff0000, 1).setOrigin(0);
      } else {
        gameObject = this.add.image(iconPosition.x, iconPosition.y, 'questIcon').setScale(0.4).setOrigin(0);
      }
      this.#mapIconGameObjects[key] = gameObject;
      this.#mapContainer.add(gameObject);
    });
  }

  /**
   * @param {number} worldX
   * @param {number} worldY
   * @returns {{x: number, y: number}}
   */
  #calculateIconPosition(worldX, worldY) {
    const xRatio = worldX / this.#worldWidth;
    const yRatio = worldY / this.#worldHeight;

    return {
      x: xRatio * this.#miniMapWidth,
      y: yRatio * this.#miniMapHeight,
    };
  }
}
