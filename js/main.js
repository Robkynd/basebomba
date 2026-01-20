const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const TILE = 32;
const COLS = 13;
const ROWS = 13;

canvas.width = COLS * TILE;
canvas.height = ROWS * TILE;

// TEST PLAYER
ctx.fillStyle = "#00ffcc";
ctx.fillRect(1 * TILE + 4, 1 * TILE + 4, TILE - 8, TILE - 8);
