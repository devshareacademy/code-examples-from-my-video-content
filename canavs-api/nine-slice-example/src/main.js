/**
 * @typedef SubRectangle
 * @type {[number, number, number, number]}
 */

/**
 * @param {string} src
 * @returns {Promise<HTMLImageElement>}
 */
function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.addEventListener(
      'load',
      () => {
        resolve(img);
      },
      false
    );
    img.src = src;
  });
}

/*
    A                          B
  +---+----------------------+---+
C | 1 |          2           | 3 |
  +---+----------------------+---+
  |   |                      |   |
  | 4 |          5           | 6 |
  |   |                      |   |
  +---+----------------------+---+
D | 7 |          8           | 9 |
  +---+----------------------+---+

areas 1, 3, 7 and 9 (the corners) will remain unscaled
areas 2 and 8 will be stretched horizontally only
areas 4 and 6 will be stretched vertically only
area 5 will be stretched both horizontally and vertically
*/

/**
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {HTMLImageElement} img
 * @param {number} leftWidth
 * @param {number} rightWidth
 * @param {number} topHeight
 * @param {number} bottomHeight
 * @param {number} x
 * @param {number} y
 * @param {number} width
 * @param {number} height
 * @returns {void}
 */
function drawNineSliceImage(ctx, img, leftWidth, rightWidth, topHeight, bottomHeight, x, y, width, height) {
  const totalWidthCut = leftWidth + rightWidth;
  const totalHeightCut = topHeight + bottomHeight;
  // break the main image up into 9 parts, based on the size of the slice.
  // each piece should be [x, y, width, height]

  // start in the top left corner for our first cut
  /** @type {SubRectangle} */
  const topLeft = [0, 0, leftWidth, topHeight];
  // for the middle, we need to calculate the width remaining after we take our two cuts
  /** @type {SubRectangle} */
  const topMiddle = [leftWidth, 0, img.width - totalWidthCut, topHeight];
  // for the top right side corner we just need to take the total width and remove the cut length
  /** @type {SubRectangle} */
  const topRight = [img.width - rightWidth, 0, rightWidth, topHeight];

  // for the middle left, we take the overall image height and subtract the size of the two corner cuts to get new height
  const middleRowHeight = img.height - totalHeightCut;
  /** @type {SubRectangle} */
  const middleLeft = [0, topHeight, leftWidth, middleRowHeight];
  // for the middle, we need to take the overall image height and width, subtract the two corner cuts to get the new dimensions
  /** @type {SubRectangle} */
  const center = [leftWidth, topHeight, img.width - totalWidthCut, middleRowHeight];
  // for the middle right, we need to do similar logic that was done for the middle left piece
  /** @type {SubRectangle} */
  const middleRight = [img.width - rightWidth, topHeight, rightWidth, middleRowHeight];

  // for the bottom left, we take the overall image height and subtract the corner cut
  const bottomRowY = img.height - bottomHeight;
  /** @type {SubRectangle} */
  const bottomLeft = [0, bottomRowY, leftWidth, bottomHeight];
  // for the bottom middle, we do the same logic we did in the top middle frame, just at a lower y value
  /** @type {SubRectangle} */
  const bottomMiddle = [leftWidth, bottomRowY, img.width - totalWidthCut, bottomHeight];
  // for the bottom right, we do the same logic we did in the top right frame, just at a lower y value
  /** @type {SubRectangle} */
  const bottomRight = [img.width - rightWidth, bottomRowY, rightWidth, bottomHeight];

  // now that we have our nine sub rectangles that make up the original source image, we can draw those onto the canvas element
  // drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight) Note: the sx, sy, sWidth, and sHeight where already calculated above

  // draw the top row
  ctx.drawImage(img, ...topLeft, x, y, leftWidth, topHeight);
  ctx.drawImage(img, ...topMiddle, x + leftWidth, y, width - totalWidthCut, topHeight);
  ctx.drawImage(img, ...topRight, x + width - rightWidth, y, rightWidth, topHeight);
  // draw the middle row
  ctx.drawImage(img, ...middleLeft, x, y + topHeight, leftWidth, height - totalHeightCut);
  ctx.drawImage(img, ...center, x + leftWidth, y + topHeight, width - totalWidthCut, height - totalHeightCut);
  ctx.drawImage(img, ...middleRight, x + width - rightWidth, y + topHeight, rightWidth, height - totalHeightCut);
  // draw the bottom row
  ctx.drawImage(img, ...bottomLeft, x, y + height - bottomHeight, leftWidth, bottomHeight);
  ctx.drawImage(img, ...bottomMiddle, x + leftWidth, y + height - bottomHeight, width - totalWidthCut, bottomHeight);
  ctx.drawImage(img, ...bottomRight, x + width - rightWidth, y + height - bottomHeight, rightWidth, bottomHeight);
}

void (async function () {
  const canvas = document.getElementById('game');
  if (!(canvas instanceof HTMLCanvasElement)) {
    console.log('HTMLCanvasElement not found');
    return;
  }
  const ctx = canvas.getContext('2d');
  if (!(ctx instanceof CanvasRenderingContext2D)) {
    console.log('CanvasRenderingContext2D not found');
    return;
  }

  const img = await loadImage('assets/bdragon1727/border.png');
  // const img = await loadImage('assets/kenneys-assets/ui-space-expansion/glassPanel.png');

  // // example of drawing image directly
  // ctx.drawImage(img, 0, 0);
  // // example of scaling by providing width and height on destination
  // ctx.drawImage(img, 0, 0, img.width * 1.5, img.height * 1.5);
  //ctx.drawImage(img, 25, 25, 350, 250);

  // example of using nine slice technique to scale image
  drawNineSliceImage(ctx, img, 32, 32, 32, 32, 25, 25, 350, 250);
})();
