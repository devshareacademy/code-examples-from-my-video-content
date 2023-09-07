import { encodedImage } from './encoded-image';

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

/**
 * @returns {Promise<HTMLImageElement>}
 */
function getEncodedImage() {
  return new Promise((resolve) => {
    const img = new Image();
    img.addEventListener(
      'load',
      () => {
        resolve(img);
      },
      false
    );
    img.src = encodedImage;
  });
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

  const img = await loadImage('assets/grunge-tileset.png');
  // const img = await getEncodedImage();
  console.log(img.width, img.height);
  // example of drawing image directly
  // drawImage(image, dx, dy)
  ctx.drawImage(img, 0, 0);

  // example of scaling by providing width and height on destination
  // drawImage(image, dx, dy, dWidth, dHeight)
  // ctx.drawImage(img, 0, 0, img.width * 1.5, img.height * 1.5);

  // example of slicing image by providing the source image values and destination canvas details
  // drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
  // ctx.drawImage(img, 200, 0, 200, 160, 100, 0, 200, 160);
})();
