const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
const width = window.innerWidth;
const height = window.innerHeight;
const w = 10;
const rows = Math.floor(height / w);
const cols = Math.floor(width / w);
let grid = createGrid();
let dragging = false;
function setup() {
  document.body.appendChild(canvas);
  canvas.width = width;
  canvas.height = height;
  setInterval(draw, 30);
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
        fill("white");
        rect(i * w, j * w, w, w);

        let left, right;

        if (i - 1 > 0) left = grid[i - 1][j + 1];
        if (i + 1 < cols) right = grid[i + 1][j + 1];

        // Go down
        if (grid[i][j + 1] == 0) {
          nextGrid[i][j + 1] = val;
        }
        // Go right
        else if (right == 0) {
          nextGrid[i + 1][j + 1] = val;
        }
        // Go left
        else if (left == 0) {
          nextGrid[i - 1][j + 1] = val;
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
  grid[x][y] = 1;
}

setup();
canvas.addEventListener("mousemove", mouseDragged);
canvas.addEventListener("mousedown", (e) => {
  dragging = true;
});
canvas.addEventListener("mouseup", (e) => {
  dragging = false;
});
