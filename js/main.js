  // =====================
// BASEBOMBA JS
// =====================

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const TILE = 40;
const ROWS = 14;
const COLS = 24;

canvas.width = COLS * TILE;
canvas.height = ROWS * TILE;

// Tile types
const EMPTY = 0;
const WALL  = 1;
const SOFT1 = 2;
const SOFT2 = 3;

let map = [];
let player = { x:1, y:1 };
let explosions = [];

// =====================
// MAP GENERATOR
// =====================
function generateMap(){
  map = [];
  for(let y=0;y<ROWS;y++){
    let row=[];
    for(let x=0;x<COLS;x++){
      if(x%2===0 && y%2===0) row.push(WALL);
      else row.push(EMPTY);
    }
    map.push(row);
  }

  let emptyTiles=[];
  for(let y=0;y<ROWS;y++){
    for(let x=0;x<COLS;x++){
      if(map[y][x]===EMPTY) emptyTiles.push({x,y});
    }
  }

  emptyTiles.sort(()=>Math.random()-0.5);

  const soft1Count = Math.floor(emptyTiles.length*0.4);
  const soft2Count = Math.floor(emptyTiles.length*0.3);

  for(let i=0;i<soft1Count;i++){
    const t = emptyTiles[i];
    map[t.y][t.x] = SOFT1;
  }
  for(let i=soft1Count;i<soft1Count+soft2Count;i++){
    const t = emptyTiles[i];
    map[t.y][t.x] = SOFT2;
  }

  // Spawn area clear
  [[1,1],[1,2],[2,1]].forEach(([x,y])=>map[y][x]=EMPTY);
}

generateMap();

// =====================
// DRAW
// =====================
function drawTile(x,y,color){
  ctx.fillStyle=color;
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

  drawTile(player.x,player.y,"#00f");

  // explosion
  explosions.forEach(e=>{
    ctx.fillStyle=`rgba(255,200,0,${e.timer/20})`;
    ctx.fillRect(e.x*TILE,e.y*TILE,TILE,TILE);
    e.timer--;
  });

  explosions = explosions.filter(e=>e.timer>0);
}

setInterval(draw,50);

// =====================
// BOMB LOGIC
// =====================
function bomb(){
  const px=player.x, py=player.y;
  const dirs=[[0,0],[0,-1],[0,1],[-1,0],[1,0]];
  dirs.forEach(([dx,dy])=>{
    const nx=px+dx, ny=py+dy;
    if(nx<0||nx>=COLS||ny<0||ny>=ROWS) return;
    if(map[ny][nx]===SOFT1) map[ny][nx]=EMPTY;
    else if(map[ny][nx]===SOFT2) map[ny][nx]=SOFT1;
    explosions.push({x:nx,y:ny,timer:20});
  });
}

// =====================
// ANALOG JOYSTICK
// =====================
const joystick = document.getElementById('joystick');
const thumb = document.getElementById('thumb');
let dragging=false;
let center = {x: joystick.offsetWidth/2, y: joystick.offsetHeight/2};

joystick.addEventListener('touchstart',e=>dragging=true);
joystick.addEventListener('touchmove',e=>{
  if(!dragging) return;
  const rect = joystick.getBoundingClientRect();
  const touch = e.touches[0];
  let dx = touch.clientX - rect.left - center.x;
  let dy = touch.clientY - rect.top - center.y;
  const dist = Math.sqrt(dx*dx+dy*dy);
  const maxDist = center.x;

  if(dist>maxDist){
    dx=dx/dist*maxDist;
    dy=dy/dist*maxDist;
  }

  thumb.style.transform=`translate(${dx}px,${dy}px)`;

  // player move tile-based
  const nx = player.x + Math.sign(dx);
  const ny = player.y + Math.sign(dy);
  if(nx>=0 && nx<COLS && ny>=0 && ny<ROWS && map[ny][nx]===EMPTY){
    player.x=nx;
    player.y=ny;
  }
});

joystick.addEventListener('touchend',e=>{
  dragging=false;
  thumb.style.transform=`translate(0px,0px)`;
});
