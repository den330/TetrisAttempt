const canvasHeight = 600;
const canvasWidth = 400;
const cellSize = 40;
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
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
  ]),
  new Tetromino([
    [1, 1, 0, 0],
    [1, 1, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]),
  new Tetromino([
    [1, 0, 0, 0],
    [1, 1, 1, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]),
  new Tetromino([
    [1, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
  ]),
  new Tetromino([
    [1, 1, 0, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]),
  new Tetromino([
    [1, 0, 0, 0],
    [1, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 0, 0],
  ]),
  new Tetromino([
    [1, 1, 1, 0],
    [0, 1, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]),
];

const boardArray = Array.from({ length: rows }, () => Array(cols).fill(0));
const canvas = document.getElementById("myCanvas");
const nextShapeCanvas = document.getElementById("nextShapeCanvas");
const nextShapeCanvasCtx = nextShapeCanvas.getContext("2d");
const ctx = canvas.getContext("2d");
let currentTetromino;
let nextTeromino = Tetrominoes[Math.floor(Math.random() * Tetrominoes.length)];
function updateGame() {
  if (currentTetromino == null) {
    currentTetromino = nextTeromino;

    const shapeIndex = Math.floor(Math.random() * Tetrominoes.length);
    const shape = Tetrominoes[shapeIndex].shape;
    nextTeromino = new Tetromino(JSON.parse(JSON.stringify(shape)));
    nextShapeCanvasCtx.clearRect(
      0,
      0,
      nextShapeCanvas.width,
      nextShapeCanvas.height
    );
    nextShapeCanvasCtx.fillStyle = "blue";
    for (var i = 0; i < shape.length; i++) {
      for (var j = 0; j < shape[i].length; j++) {
        if (shape[i][j] == 0) continue;
        nextShapeCanvasCtx.fillRect(
          j * cellSize,
          i * cellSize,
          cellSize,
          cellSize
        );
      }
    }
  }
  let canMoveDown = true;
  for (var i = 0; i < currentTetromino.shape.length; i++) {
    for (var j = 0; j < currentTetromino.shape[i].length; j++) {
      if (currentTetromino.shape[i][j] == 0) continue;
      const realY = i + currentTetromino.y;
      const realX = j + currentTetromino.x;
      if (boardArray[realY][realX] == 1) {
        endGame();
        return;
      }
      if (realY + 1 >= rows || boardArray[realY + 1][realX] == 1) {
        canMoveDown = false;
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
    currentTetromino = null;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < cols; j++) {
      if (boardArray[i][j] == 1) {
        ctx.fillStyle = "red";
        ctx.border = "1px solid black";
        ctx.strokeRect(j * cellSize, i * cellSize, cellSize, cellSize);
        ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
      }
    }
  }
  if (currentTetromino != null) {
    for (var i = 0; i < currentTetromino.shape.length; i++) {
      for (var j = 0; j < currentTetromino.shape[i].length; j++) {
        if (currentTetromino.shape[i][j] == 0) continue;
        ctx.fillStyle = "blue";
        ctx.fillRect(
          (j + currentTetromino.x) * cellSize,
          (i + currentTetromino.y) * cellSize,
          cellSize,
          cellSize
        );
      }
    }
  }
}

let updateGameInterval;

let drawInterval;

let handleKeyDown = function (event) {
  if (event.key === "ArrowRight") {
    currentTetromino.x++;
  }
  if (event.key === "ArrowLeft") {
    currentTetromino.x--;
  }
  if (event.key == "ArrowDown") {
    updateGame();
  }
};

function startGame() {
  isGameOver = false;
  updateGameInterval = setInterval(() => {
    updateGame();
  }, 1000);
  drawInterval = setInterval(() => {
    draw();
  }, 100);
  document.addEventListener("keydown", handleKeyDown);
}

function endGame() {
  clearInterval(updateGameInterval);
  clearInterval(drawInterval);
  document.removeEventListener("keydown", handleKeyDown);
  alert("Game Over");
}

startGame();
