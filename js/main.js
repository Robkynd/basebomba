alert("BASEBOMBA TEMPLATE MAP OK");

const TILE = 32;
const COLS = 24;
const ROWS = 15;

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = COLS * TILE;
canvas.height = ROWS * TILE;

// TILE TYPE
const EMPTY = 0;
const WALL  = 1;
const SOFT1 = 2; // 1 bomb
const SOFT2 = 3; // 2 bomb

let map = [];

// PLAYER
const player = { x: 1, y: 1 };

// GENERATE BOMBERMAN-STYLE MAP
function generateMap() {
  map = [];

  // FIRST PASS: wall + empty (silang)
  for (let y = 0; y < ROWS; y++) {
    let row = [];
    for (let x = 0; x < COLS; x++) {

      // border wall
      if (x === 0 || y === 0 || x === COLS-1 || y === ROWS-1) {
        row.push(WALL);
      }
      // silang wall (bomberman classic)
      else if (x % 2 === 0 && y % 2 === 0) {
        row.push(WALL);
      }
      else {
        row.push(EMPTY);
      }
    }
    map.push(row);
  }

  // clear spawn area
  map[1][1] = EMPTY;
  map[1][2] = EMPTY;
  map[2][1] = EMPTY;

  // COLLECT EMPTY TILES
  let emptyTiles = [];
  for (let y = 1; y < ROWS-1; y++) {
    for (let x = 1; x < COLS-1; x++) {
      if (map[y][x] === EMPTY) {
        emptyTiles.push({x,y});
      }
    }
  }

  // SHUFFLE
  emptyTiles.sort(() => Math.random() - 0.5);

  const total = emptyTiles.length;
  const soft1Count = Math.floor(total * 0.50);
  const soft2Count = Math.floor(total * 0.30);

  // PLACE SOFT1
  for (let i = 0; i < soft1Count; i++) {
    const t = emptyTiles[i];
    map[t.y][t.x] = SOFT1;
  }

  // PLACE SOFT2
  for (let i = soft1Count; i < soft1Count + soft2Count; i++) {
    const t = emptyTiles[i];
    map[t.y][t.x] = SOFT2;
  }
}

// DRAW
function draw() {
  ctx.clearRect(0,0,canvas.width,canvas.height);

  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      switch(map[y][x]) {
        case WALL:
          ctx.fillStyle = "#555";
          break;
        case SOFT1:
          ctx.fillStyle = "#aa6666";
          break;
        case SOFT2:
          ctx.fillStyle = "#664400";
          break;
        default:
          continue;
      }
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
