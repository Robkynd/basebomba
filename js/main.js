const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const TILE = 32;
const COLS = 13;
const ROWS = 13;

canvas.width = COLS * TILE;
canvas.height = ROWS * TILE;

// 0 kosong, 1 wall, 2 block
const map = [];

for (let y = 0; y < ROWS; y++) {
  map[y] = [];
  for (let x = 0; x < COLS; x++) {
    if (
      y === 0 || y === ROWS - 1 ||
      x === 0 || x === COLS - 1 ||
      (x % 2 === 0 && y % 2 === 0)
    ) {
      map[y][x] = 1; // wall
    } else if (Math.random() < 0.3) {
      map[y][x] = 2; // block
    } else {
      map[y][x] = 0;
    }
  }
}

// spawn aman
map[1][1] = 0;
map[1][2] = 0;
map[2][1] = 0;

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      if (map[y][x] === 1) {
        ctx.fillStyle = "#444";
      } else if (map[y][x] === 2) {
        ctx.fillStyle = "#b5651d";
      } else {
        ctx.fillStyle = "#222";
      }
      ctx.fillRect(x * TILE, y * TILE, TILE, TILE);
    }
  }
}

draw();
