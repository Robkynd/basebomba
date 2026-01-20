console.log("JS LOADED");

const TILE_EMPTY = 0;
const TILE_WALL  = 1;
const TILE_BLOCK = 2;
const TILE_HARD  = 3;

const TILE = 32;
const COLS = 24;
const ROWS = 14;

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = COLS * TILE;
canvas.height = ROWS * TILE;

let map = [];

function generateMap() {
  map = [];
  for (let y = 0; y < ROWS; y++) {
    let row = [];
    for (let x = 0; x < COLS; x++) {
      if (y === 0 || y === ROWS-1 || x === 0 || x === COLS-1) {
        row.push(1); // wall
      } else {
      const r = Math.random();

if (r < 0.15) row.push(TILE_BLOCK);
else if (r < 0.25) row.push(TILE_HARD);
else row.push(TILE_EMPTY);   // block / empty
      }
    }
    map.push(row);
  }

  // clear spawn
  map[1][1] = 0;
  map[1][2] = 0;
  map[2][1] = 0;
}

const player = {
  x: 1,
  y: 1
};

function draw() {
  ctx.clearRect(0,0,canvas.width,canvas.height);

  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      if (map[y][x] === TILE_WALL) ctx.fillStyle = "#555";
else if (map[y][x] === TILE_BLOCK) ctx.fillStyle = "#a66";
else if (map[y][x] === TILE_HARD) ctx.fillStyle = "#664400";
else continue;
      else continue;

      ctx.fillRect(x*TILE, y*TILE, TILE, TILE);
    }
  }

  // player
  ctx.fillStyle = "cyan";
  ctx.fillRect(player.x*TILE, player.y*TILE, TILE, TILE);
}

function move(dx, dy) {
  const nx = player.x + dx;
  const ny = player.y + dy;

  if (map[ny][nx] === TITLE_EMPTY) {
    player.x = nx;
    player.y = ny;
    draw();
  }
}

function dropBomb() {
  alert("💣 soon...");
}

generateMap();
draw();
