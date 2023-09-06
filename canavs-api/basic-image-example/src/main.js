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

  // TODO: add main logic
})();
