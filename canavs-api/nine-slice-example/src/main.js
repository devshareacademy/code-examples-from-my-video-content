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
  // const img = await loadImage(
  //   'assets/kenneys-assets/ui-space-expansion/glassPanel.png'
  // );

  // example of drawing image directly
  ctx.drawImage(img, 0, 0);
  // example of scaling by providing width and height on destination
  ctx.drawImage(img, 0, 0, img.width * 1.5, img.height * 1.5);
  ctx.drawImage(img, 0, 0, img.width * 3.5, img.height * 2.5);

  // example of using nine slice technique to scale image
})();
