console.log("JS LOADED");

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
        row.push(Math.random() < 0.2 ? 2 : 0); // block / empty
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
      if (map[y][x] === 1) ctx.fillStyle = "#555";
      else if (map[y][x] === 2) ctx.fillStyle = "#a66";
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

  if (map[ny][nx] === 0) {
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
