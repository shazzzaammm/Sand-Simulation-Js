const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
const width = window.innerWidth;
const height = window.innerHeight;
const w = 10;
const rows = Math.floor(height / w);
const cols = Math.floor(width / w);
let grid = createGrid();
let dragging = false;
let hue = 0;
let toggleColors = false;
function setup() {
  document.body.appendChild(canvas);
  canvas.width = width;
  canvas.height = height;
  setInterval(draw, 30);
}

function HSVtoRGB(h, s, v) {
  var r, g, b, i, f, p, q, t;
  i = Math.floor(h * 6);
  f = h * 6 - i;
  p = v * (1 - s);
  q = v * (1 - f * s);
  t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0:
      (r = v), (g = t), (b = p);
      break;
    case 1:
      (r = q), (g = v), (b = p);
      break;
    case 2:
      (r = p), (g = v), (b = t);
      break;
    case 3:
      (r = p), (g = q), (b = v);
      break;
    case 4:
      (r = t), (g = p), (b = v);
      break;
    case 5:
      (r = v), (g = p), (b = q);
      break;
  }
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

function createGrid() {
  let arr = new Array(cols);
  for (let i = 0; i < cols; i++) {
    arr[i] = new Array(rows);
    for (let j = 0; j < rows; j++) {
      arr[i][j] = 0;
    }
  }
  return arr;
}

function draw() {
  background("black");
  let nextGrid = createGrid();
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      val = grid[i][j];
      if (val > 0) {
        color = HSVtoRGB(val, 1, 1);
        if (toggleColors) {
          fill(`rgb(${color.r},${color.g},${color.b})`);
        } else {
          fill("rgb(242,210,169)");
        }
        rect(i * w, j * w, w, w);

        let dirA, dirB;

        // pick randomly between left and right
        let direction = Math.random() > 0.5 ? -1 : 1;

        if (i - direction >= 0 && i - direction < cols) dirA = grid[i - direction][j + 1];
        if (i + direction >= 0 && i + direction < cols) dirB = grid[i + direction][j + 1];

        // Go down
        if (grid[i][j + 1] == 0) {
          nextGrid[i][j + 1] = val;
        }
        // Go one way
        else if (dirB == 0) {
          nextGrid[i + direction][j + 1] = val;
        }
        // Go the other way
        else if (dirA == 0) {
          nextGrid[i - direction][j + 1] = val;
        }
        // Stay
        else {
          nextGrid[i][j] = val;
        }
      }
    }
  }
  grid = nextGrid;
}

function fill(color) {
  ctx.fillStyle = color;
}

function rect(x, y, w, h) {
  ctx.fillRect(x, y, w, h);
}

function background(color) {
  fill(color);
  rect(0, 0, width, height);
}

function mouseDragged(e) {
  if (!dragging) return;
  x = Math.floor(e.pageX / w);
  y = Math.floor(e.pageY / w);
  if (x > cols - 1 || x <= 0) return;
  if (y > rows - 1 || y <= 0) return;
  if (grid[x][y] !== 0) return;
  grid[x][y] = hue;
  hue += 0.0005;
  if (hue >= 1) hue = 0;
}

setup();
canvas.addEventListener("mousemove", mouseDragged);
canvas.addEventListener("mousedown", (e) => {
  dragging = true;
});
canvas.addEventListener("mouseup", (e) => {
  dragging = false;
});

document.onkeydown = function (e) {
  if (e.key.toLowerCase() == "c") {
    toggleColors = !toggleColors;
  }
};
