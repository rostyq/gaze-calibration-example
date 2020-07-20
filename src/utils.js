export function rainbow(numOfSteps, step) {
  // This function generates vibrant, "evenly spaced" colours (i.e. no clustering). This is ideal for creating easily distinguishable vibrant markers in Google Maps and other apps.
  // Adam Cole, 2011-Sept-14
  // HSV to RBG adapted from: http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
  let r, g, b;
  let h = step / numOfSteps;
  let i = ~~(h * 6);
  let f = h * 6 - i;
  let q = 1 - f;
  switch(i % 6){
    case 0: r = 1; g = f; b = 0; break;
    case 1: r = q; g = 1; b = 0; break;
    case 2: r = 0; g = 1; b = f; break;
    case 3: r = 0; g = q; b = 1; break;
    case 4: r = f; g = 0; b = 1; break;
    case 5: r = 1; g = 0; b = q; break;
  }
  let c = "#" + ("00" + (~ ~(r * 255)).toString(16)).slice(-2) + ("00" + (~ ~(g * 255)).toString(16)).slice(-2) + ("00" + (~ ~(b * 255)).toString(16)).slice(-2);
  return (c);
}

export function generateTargets(rows=3, cols=3, pad=10, ratio=1.0) {
  let xpad = pad * ratio, ypad = pad;
  let xstep = (100 - 2 * xpad) / (cols - 1);
  let ystep = (100 - 2 * ypad) / (rows - 1);
  let path = [];

  for (let row = 0; row < rows; row++) {
    const y = ypad + ystep * row;
    for (let col = 0; col < cols; col++) {
      const x = xpad + xstep * col;
      path.push({ x, y });
    }
  }

  return path;
}

export function randomScreenOutsidePosition(dx=10, dy=10) {
  let x, y;
  switch (Math.floor(Math.random() * 4)) {
    case 0:
      x = -dx, y = Math.random() * 100 >> 0;
      break;
    case 1:
      x = 100 + dx, y = Math.random() * 100 >> 0;
      break;
    case 2:
      y = -dy, x = Math.random() * 100 >> 0;
      break;
    case 3:
      y = 100 + dy, x = Math.random() * 100 >> 0;
      break;
  }

  return { x, y };
}

export function screenRatio() {
  return window.screen.height / window.screen.width;
}

export function shuffle(array) {
    let counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        let index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}

export function loadScript(src, name) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = src;
    document.head.append(script);

    if (name == undefined) {
      name = src.split('/').slice(-1)[0].split('.')[0];
    }

    script.addEventListener('load', () => resolve(window[name]));
    script.addEventListener('error', error => reject(error));
  });
}
