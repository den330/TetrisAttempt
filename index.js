const canvasHeight = 600;
const canvasWidth = 300;
const cellSize = 30;
const rows = canvasHeight / cellSize;
const cols = canvasWidth / cellSize;

class Tetromino {
  x;
  y;
  shape;
  constructor(shape) {
    this.x = Math.floor(cols / 2) - 1;
    this.y = 0;
    this.shape = shape;
  }
}

const Tetrominoes = [
  new Tetromino([
    [0, 0, 1, 0],
    [0, 0, 1, 0],
    [0, 0, 1, 0],
    [0, 0, 1, 0],
  ]),
  new Tetromino([
    [0, 0, 0, 0],
    [0, 1, 1, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0],
  ]),
  new Tetromino([
    [0, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 1, 1],
    [0, 0, 0, 0],
  ]),
  new Tetromino([
    [0, 0, 0, 0],
    [0, 0, 0, 1],
    [0, 1, 1, 1],
    [0, 0, 0, 0],
  ]),
  new Tetromino([
    [0, 0, 0, 0],
    [0, 1, 1, 0],
    [0, 0, 1, 1],
    [0, 0, 0, 0],
  ]),
  new Tetromino([
    [0, 0, 0, 0],
    [0, 0, 1, 1],
    [0, 1, 1, 0],
    [0, 0, 0, 0],
  ]),
  new Tetromino([
    [0, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 1, 0],
    [0, 1, 0, 0],
  ]),
];

const boardArray = Array.from({ length: rows }, () => Array(cols).fill(0));
let currentTetromino;
let nextTeromino = Tetrominoes[Math.floor(Math.random() * Tetrominoes.length)];
function updateGame() {
  if (currentTetromino == null) {
    currentTetromino = nextTeromino;
    const shapeIndex = Math.floor(Math.random() * Tetrominoes.length);
    const shape = Tetrominoes[shapeIndex].shape;
    nextTeromino = new Tetromino(JSON.parse(JSON.stringify(shape)));
  }
  let canMoveDown = true;
  for (var i = 0; i < currentTetromino.shape.length; i++) {
    for (var j = 0; j < currentTetromino.shape[i].length; j++) {
      if (currentTetromino.shape[i][j] == 0) continue;
      const realY = i + currentTetromino.y;
      const realX = j + currentTetromino.x;
      if (realY + 1 >= rows || boardArray[realY + 1][realX] == 1) {
        currentTetromino = null;
        canMoveDown = false;
        break;
      }
    }
  }
  if (canMoveDown) {
    currentTetromino.y++;
  } else {
    for (var i = 0; i < currentTetromino.shape.length; i++) {
      for (var j = 0; j < currentTetromino.shape[i].length; j++) {
        if (currentTetromino.shape[i][j] == 0) continue;
        const realY = i + currentTetromino.y;
        const realX = j + currentTetromino.x;
        boardArray[realY][realX] = 1;
      }
    }
  }
}

function draw() {}

function startGame() {
  settimeinterval(() => {
    updateGame();
  }, 1000);
  settimeinterval(() => {
    draw();
  }, 100);
}
