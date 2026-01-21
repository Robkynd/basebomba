// =======================
// CONFIG MAP
// =======================
const COLS = 24;
const ROWS = 14;

const EMPTY = 0;
const WALL = 1;
const WOOD = 2;   // tembok kayu
const BRICK = 3;  // tembok bata

let map = [];

// Generate map
for(let y=0; y<ROWS; y++){
  map[y]=[];
  for(let x=0; x<COLS; x++){
    // Border
    if(x===0 || x===COLS-1 || y===0 || y===ROWS-1){
      map[y][x] = EMPTY;
    }
    // Inner pattern
    else if(y%2===0 && x%2===0){
      map[y][x] = WALL;
    }
    else{
      let r = Math.random();
      if(r<0.3) map[y][x] = WOOD;
      else if(r<0.5) map[y][x] = BRICK;
      else map[y][x] = EMPTY;
    }
  }
}

// Spawn area safe (top-left)
map[1][1]=map[1][2]=map[2][1]=EMPTY;

// =======================
// PLAYER
// =======================
let player = {x:1, y:1, color:'#00f'};

// =======================
// CANVAS SETUP
// =======================
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const TILE = 32;

canvas.width = COLS*TILE;
canvas.height = ROWS*TILE;

// =======================
// DRAW FUNCTION
// =======================
function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  for(let y=0; y<ROWS; y++){
    for(let x=0; x<COLS; x++){
      switch(map[y][x]){
        case WALL: ctx.fillStyle="#555"; break;
        case WOOD: ctx.fillStyle="#aa7733"; break;
        case BRICK: ctx.fillStyle="#cc4444"; break;
        default: ctx.fillStyle="#222";
      }
      ctx.fillRect(x*TILE, y*TILE, TILE, TILE);
      ctx.strokeStyle="#000";
      ctx.strokeRect(x*TILE, y*TILE, TILE, TILE);
    }
  }
  // Draw player
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x*TILE+4, player.y*TILE+4, TILE-8, TILE-8);
}

// =======================
// ANALOG STICK
// =======================
const joystick = document.getElementById('joystick');
const thumb = document.getElementById('thumb');

let dragging = false;

joystick.addEventListener('touchstart', e=>{
  e.preventDefault();
  dragging=true;
});

joystick.addEventListener('touchmove', e=>{
  e.preventDefault();
  if(!dragging) return;
  const touch = e.touches[0];
  const rect = joystick.getBoundingClientRect();

  let dx = touch.clientX - rect.left - rect.width/2;
  let dy = touch.clientY - rect.top - rect.height/2;

  const dist = Math.sqrt(dx*dx+dy*dy);
  const maxDist = rect.width/2;

  if(dist>maxDist){
    dx=dx/dist*maxDist;
    dy=dy/dist*maxDist;
  }

  thumb.style.transform = `translate(${dx}px, ${dy}px)`;

  // move player tile-based
  const nx = player.x + Math.sign(dx);
  const ny = player.y + Math.sign(dy);
  if(nx>=0 && nx<COLS && ny>=0 && ny<ROWS && map[ny][nx]===EMPTY){
    player.x=nx;
    player.y=ny;
  }
});

joystick.addEventListener('touchend', e=>{
  dragging=false;
  thumb.style.transform = `translate(0px,0px)`;
});

// =======================
// MOUSE SUPPORT
// =======================
joystick.addEventListener('mousedown', e=>{
  dragging=true;
});

document.addEventListener('mousemove', e=>{
  if(!dragging) return;
  const rect = joystick.getBoundingClientRect();
  let dx = e.clientX - rect.left - rect.width/2;
  let dy = e.clientY - rect.top - rect.height/2;

  const dist = Math.sqrt(dx*dx+dy*dy);
  const maxDist = rect.width/2;

  if(dist>maxDist){
    dx=dx/dist*maxDist;
    dy=dy/dist*maxDist;
  }

  thumb.style.transform = `translate(${dx}px, ${dy}px)`;

  const nx = player.x + Math.sign(dx);
  const ny = player.y + Math.sign(dy);
  if(nx>=0 && nx<COLS && ny>=0 && ny<ROWS && map[ny][nx]===EMPTY){
    player.x=nx;
    player.y=ny;
  }
});

document.addEventListener('mouseup', e=>{
  dragging=false;
  thumb.style.transform = `translate(0px,0px)`;
});

// =======================
// BOMB (placeholder)
// =======================
const bombBtn = document.querySelector('#bomb-btn button');
bombBtn.addEventListener('click', ()=>{
  alert("Bomb placed! (coming soon full mechanics)");
});

// =======================
// GAME LOOP
// =======================
function loop(){
  draw();
  requestAnimationFrame(loop);
}

loop();
