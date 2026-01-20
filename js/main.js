alert("BASEBOMBA RESET OK");

const TILE = 32;
const COLS = 24;
const ROWS = 14;

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = COLS * TILE;
canvas.height = ROWS * TILE;

// TILE TYPE
const EMPTY = 0;
const WALL  = 1;
const BLOCK = 2;
const HARD  = 3;

let map = [];

// PLAYER
const player = { x: 1, y: 1 };

// MAP GENERATOR
function generateMap() {
  map = [];
  for (let y = 0; y < ROWS; y++) {
    let row = [];
    for (let x = 0; x < COLS; x++) {
      if (x === 0 || y === 0 || x === COLS-1 || y === ROWS-1) {
        row.push(WALL);
      } else {
        const r = Math.random();

if (r < 0.2) row.push(BLOCK);      // 20% block hancur
else if (r < 0.3) row.push(HARD);  // 10% rintangan keras
else row.push(EMPTY);
      }
    }
    map.push(row);
  }

  // clear spawn
  map[1][1] = EMPTY;
  map[1][2] = EMPTY;
  map[2][1] = EMPTY;
}

// DRAW
function draw() {
  ctx.clearRect(0,0,canvas.width,canvas.height);

  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      if (map[y][x] === WALL) ctx.fillStyle = "#555";
      else if (map[y][x] === BLOCK) ctx.fillStyle = "#aa6666";
      else if (map[y][x] === HARD) ctx.fillStyle = "#663300";
      else continue;

      ctx.fillRect(x*TILE, y*TILE, TILE, TILE);
    }
  }

  // player
  ctx.fillStyle = "cyan";
  ctx.fillRect(player.x*TILE, player.y*TILE, TILE, TILE);
}

// MOVE
function move(dx, dy) {
  const nx = player.x + dx;
  const ny = player.y + dy;

  if (map[ny][nx] === EMPTY) {
    player.x = nx;
    player.y = ny;
    draw();
  }
}

// BOMB
function bomb() {
  alert("very soon 😌");
}

generateMap();
draw();
