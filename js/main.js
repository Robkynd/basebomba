const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const TILE = 40; // ukuran tile pixel
const ROWS = 14;
const COLS = 24;

canvas.width = COLS * TILE;
canvas.height = ROWS * TILE;

// tile types
const EMPTY = 0;
const WALL  = 1; // tembok keras
const SOFT1 = 2; // tembok 1 bom
const SOFT2 = 3; // tembok 2 bom

let map = [];
let player = { x: 1, y: 1 };

// =====================
// MAP GENERATOR
// =====================
function isNearSpawn(x,y){
  return (
    (x===1 && y===1) || 
    (x===1 && y===2) || 
    (x===2 && y===1)
  );
}

function generateMap(){
  map = [];

  // 1️⃣ Base map: WALL silang + EMPTY
  for(let y=0; y<ROWS; y++){
    let row = [];
    for(let x=0; x<COLS; x++){
      if(x%2===0 && y%2===0){
        row.push(WALL);
      } else {
        row.push(EMPTY);
      }
    }
    map.push(row);
  }

  // 2️⃣ Kumpulkan semua tile EMPTY
  let emptyTiles = [];
  for(let y=0; y<ROWS; y++){
    for(let x=0; x<COLS; x++){
      if(map[y][x] === EMPTY){
        emptyTiles.push({x,y});
      }
    }
  }

  emptyTiles.sort(()=>Math.random()-0.5);

  const total = emptyTiles.length;
  const soft1Count = Math.floor(total * 0.40);
  const soft2Count = Math.floor(total * 0.30);

  // 3️⃣ Pasang SOFT1
  for(let i=0; i<soft1Count; i++){
    const t = emptyTiles[i];
    map[t.y][t.x] = SOFT1;
  }

  // 4️⃣ Pasang SOFT2
  for(let i=soft1Count; i<soft1Count+soft2Count; i++){
    const t = emptyTiles[i];
    map[t.y][t.x] = SOFT2;
  }

  // 5️⃣ Bersihkan spawn
  const spawnClear = [[1,1],[1,2],[2,1]];
  spawnClear.forEach(([x,y])=>{
    map[y][x] = EMPTY;
  });
}

generateMap();

// =====================
// DRAW MAP & PLAYER
// =====================
function drawTile(x,y,color){
  ctx.fillStyle = color;
  ctx.fillRect(x*TILE,y*TILE,TILE,TILE);
  ctx.strokeStyle="#000";
  ctx.lineWidth=2;
  ctx.strokeRect(x*TILE,y*TILE,TILE,TILE);
}

function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);

  for(let y=0;y<ROWS;y++){
    for(let x=0;x<COLS;x++){
      switch(map[y][x]){
        case WALL: drawTile(x,y,"#555"); break;
        case SOFT1: drawTile(x,y,"#aa6666"); break;
        case SOFT2: drawTile(x,y,"#663300"); break;
      }
    }
  }

  // player
  drawTile(player.x, player.y, "#00f");
}

draw();

// =====================
// MOVE PLAYER
// =====================
function move(dx,dy){
  const nx = player.x + dx;
  const ny = player.y + dy;
  if(nx<0 || nx>=COLS || ny<0 || ny>=ROWS) return;
  if(map[ny][nx] === EMPTY){
    player.x = nx;
    player.y = ny;
    draw();
  }
}

// =====================
// BOM LOGIC (SIMPLE)
// =====================
function bomb(){
  const px = player.x;
  const py = player.y;

  const dirs = [
    [0,0],[0,-1],[0,1],[-1,0],[1,0]
  ];

  dirs.forEach(([dx,dy])=>{
    const nx = px+dx;
    const ny = py+dy;
    if(nx<0 || nx>=COLS || ny<0 || ny>=ROWS) return;

    if(map[ny][nx] === SOFT1){
      map[ny][nx] = EMPTY;
    } else if(map[ny][nx] === SOFT2){
      map[ny][nx] = SOFT1; // butuh 2 bom
    }
  });

  draw();
}

// =====================
// TOUCH CONTROL
// =====================
let touchStartX=0, touchStartY=0;
canvas.addEventListener('touchstart', e=>{
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
});

canvas.addEventListener('touchend', e=>{
  const dx = e.changedTouches[0].clientX - touchStartX;
  const dy = e.changedTouches[0].clientY - touchStartY;

  if(Math.abs(dx)>Math.abs(dy)){
    if(dx>20) move(1,0);
    else if(dx<-20) move(-1,0);
  } else {
    if(dy>20) move(0,1);
    else if(dy<-20) move(0,-1);
  }
});
