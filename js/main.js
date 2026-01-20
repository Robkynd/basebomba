const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const TILE = 32;
const COLS = 24;
const ROWS = 14;

canvas.width = COLS * TILE;
canvas.height = ROWS * TILE;

// ================= MAP =================
// 0 kosong | 1 wall | 2 block
const map = [];

for (let y = 0; y < ROWS; y++) {
  map[y] = [];
  for (let x = 0; x < COLS; x++) {
    if (
      y === 0 || y === ROWS - 1 ||
      x === 0 || x === COLS - 1 ||
      (x % 2 === 0 && y % 2 === 0)
    ) {
      map[y][x] = 1;
    } else if (Math.random() < 0.3) {
      map[y][x] = 2;
    } else {
      map[y][x] = 0;
    }
  }
}

// spawn aman
map[1][1] = 0;
map[1][2] = 0;
map[2][1] = 0;

// ================= PLAYER =================
const player = {
  x: 1,
  y: 1,
  color: "#00ffcc"
};

// ================= BOMB =================
let bombs = [];

// ================= DRAW =================
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // map
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      if (map[y][x] === 1) ctx.fillStyle = "#444";
      else if (map[y][x] === 2) ctx.fillStyle = "#b5651d";
      else ctx.fillStyle = "#222";

      ctx.fillRect(x * TILE, y * TILE, TILE, TILE);
    }
  }

  // bombs
  bombs.forEach(b => {
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(
      b.x * TILE + TILE / 2,
      b.y * TILE + TILE / 2,
      TILE / 4,
      0,
      Math.PI * 2
    );
    ctx.fill();
  });

  // player
  ctx.fillStyle = player.color;
  ctx.fillRect(
    player.x * TILE + 4,
    player.y * TILE + 4,
    TILE - 8,
    TILE - 8
  );
}

// ================= MOVE =================
function movePlayer(dir) {
  let nx = player.x;
  let ny = player.y;

  if (dir === "up") ny--;
  if (dir === "down") ny++;
  if (dir === "left") nx--;
  if (dir === "right") nx++;

  if (map[ny][nx] === 0) {
    player.x = nx;
    player.y = ny;
    draw();
  }
}

// ================= BOMB LOGIC =================
function placeBomb() {
  // cegah dobel bom di tile sama
  if (bombs.some(b => b.x === player.x && b.y === player.y)) return;

  bombs.push({
    x: player.x,
    y: player.y
  });

  setTimeout(() => explodeBomb(player.x, player.y), 2000);
}

function explodeBomb(x, y) {
  const blast = [
    { x, y },
    { x: x + 1, y },
    { x: x - 1, y },
    { x, y + 1 },
    { x, y - 1 }
  ];

  blast.forEach(p => {
    if (map[p.y] && map[p.y][p.x] === 2) {
      map[p.y][p.x] = 0;
    }
  });

  bombs = bombs.filter(b => !(b.x === x && b.y === y));
  draw();
}

// ================= INPUT =================

// keyboard
document.addEventListener("keydown", e => {
  if (e.key === "ArrowUp") movePlayer("up");
  if (e.key === "ArrowDown") movePlayer("down");
  if (e.key === "ArrowLeft") movePlayer("left");
  if (e.key === "ArrowRight") movePlayer("right");
  if (e.key === " ") placeBomb(); // spasi = bom
});

// buttons (touch + click)
document.querySelectorAll("#controls button[data-dir]").forEach(btn => {
  btn.addEventListener("click", () => movePlayer(btn.dataset.dir));
  btn.addEventListener("touchstart", e => {
    e.preventDefault();
    movePlayer(btn.dataset.dir);
  });
});

// bomb button
document.getElementById("bombBtn").addEventListener("click", placeBomb);
document.getElementById("bombBtn").addEventListener("touchstart", e => {
  e.preventDefault();
  placeBomb();
});

// first render
draw();
