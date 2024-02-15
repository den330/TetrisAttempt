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
    [0, 0, 1, 0],
    [1, 1, 1, 0],
    [0, 0, 0, 0],
  ]),
  new Tetromino([
    [0, 0, 0, 0],
    [0, 1, 1, 0],
    [0, 0, 1, 1],
    [0, 0, 0, 0],
  ]),
  new Tetromino([
    [0, 1, 0, 0],
    [0, 1, 1, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 0],
  ]),
  new Tetromino([
    [0, 1, 0, 0],
    [0, 1, 1, 0],
    [0, 1, 0, 0],
    [0, 0, 0, 0],
  ]),
];

let boardArray;
const canvas = document.getElementById("myCanvas");
const nextShapeCanvas = document.getElementById("nextShapeCanvas");
const nextShapeCanvasCtx = nextShapeCanvas.getContext("2d");
const ctx = canvas.getContext("2d");
let currentHighScore = 0;
let currentScore = 0;
let isGameOver = true;
let currentTetromino;
let nextTeromino = Tetrominoes[Math.floor(Math.random() * Tetrominoes.length)];
const score = document.getElementById("score");
const highScore = document.getElementById("highScore");
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
    nextShapeCanvasCtx.fillStyle = "#FFA500";
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
    let count = 0;
    for (var i = 0; i < rows; i++) {
      let isFull = true; // Assume the row is full initially
      for (var j = 0; j < cols; j++) {
        if (boardArray[i][j] == 0) {
          isFull = false; // Found an empty cell, so the row is not full
          break;
        }
      }
      if (isFull) {
        boardArray.splice(i, 1); // Remove the full row
        boardArray.unshift(Array(cols).fill(0)); // Add a new empty row at the top
        count += 1;
      }
    }
    currentScore = 10 * count * count + currentScore;
    score.innerText = currentScore;
    currentHighScore = Math.max(currentHighScore, currentScore);
    highScore.innerText = currentHighScore;
    currentTetromino = null;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < cols; j++) {
      if (boardArray[i][j] == 1) {
        ctx.fillStyle = "#00FFFF";
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
        ctx.fillStyle = "#98FB98";
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

function checkRight() {
  for (var i = 0; i < currentTetromino.shape.length; i++) {
    for (var j = 0; j < currentTetromino.shape[i].length; j++) {
      if (currentTetromino.shape[i][j] == 0) continue;
      const realY = i + currentTetromino.y;
      const realX = j + currentTetromino.x;
      if (realX + 1 >= cols || boardArray[realY][realX + 1] == 1) {
        return false;
      }
    }
  }
  return true;
}

function checkLeft() {
  for (var i = 0; i < currentTetromino.shape.length; i++) {
    for (var j = 0; j < currentTetromino.shape[i].length; j++) {
      if (currentTetromino.shape[i][j] == 0) continue;
      const realY = i + currentTetromino.y;
      const realX = j + currentTetromino.x;
      if (realX - 1 < 0 || boardArray[realY][realX - 1] == 1) {
        return false;
      }
    }
  }
  return true;
}

function rotation() {
  const newShape = [];
  // Transpose and reverse the shape to rotate it
  for (let i = 0; i < currentTetromino.shape.length; i++) {
    newShape.push([]);
    for (let j = 0; j < currentTetromino.shape[i].length; j++) {
      newShape[i][j] = currentTetromino.shape[j][i];
    }
  }
  newShape.forEach((row) => row.reverse());

  // Try to find a valid position for the new shape
  const adjustments = [
    [0, 0],
    [-1, 0],
    [1, 0],
    [0, -1],
  ]; // Left, Right, Up
  for (const [dx, dy] of adjustments) {
    if (isValidPosition(newShape, dx, dy)) {
      currentTetromino.shape = newShape;
      currentTetromino.x += dx;
      currentTetromino.y += dy;
      return; // Valid position found, applied rotation and adjustments
    }
  }
}

function isValidPosition(newShape, dx, dy) {
  for (let i = 0; i < newShape.length; i++) {
    for (let j = 0; j < newShape[i].length; j++) {
      if (newShape[i][j] === 0) continue; // Skip empty cells
      const realX = currentTetromino.x + j + dx;
      const realY = currentTetromino.y + i + dy;
      if (
        realX < 0 ||
        realX >= cols ||
        realY < 0 ||
        realY >= rows ||
        boardArray[realY][realX] === 1
      ) {
        return false; // Position is not valid
      }
    }
  }
  return true; // Position is valid
}

let updateGameInterval;

let drawInterval;

let handleKeyDown = function (event) {
  if (event.key === "ArrowRight" && checkRight()) {
    currentTetromino.x++;
  }
  if (event.key === "ArrowLeft" && checkLeft()) {
    currentTetromino.x--;
  }
  if (event.key == "ArrowDown") {
    event.preventDefault();
    updateGame();
  }
  if (event.key == "ArrowUp") {
    event.preventDefault();
    rotation();
  }
};

const title = document.getElementById("title");
const startbutton = document.getElementById("startButton");

function startGame() {
  if (!isGameOver) return;
  currentScore = 0;
  score.innerText = currentScore;
  isGameOver = false;
  boardArray = Array.from({ length: rows }, () => Array(cols).fill(0));
  currentTetromino = null;
  updateGameInterval = setInterval(() => {
    updateGame();
  }, 1000);
  drawInterval = setInterval(() => {
    draw();
  }, 100);
  document.addEventListener("keydown", handleKeyDown);
  title.innerText = "Tetris";
  startbutton.innerText = "Restart Game";
}

function endGame() {
  clearInterval(updateGameInterval);
  clearInterval(drawInterval);
  document.removeEventListener("keydown", handleKeyDown);
  isGameOver = true;
  title.innerText = "Game Over";
  startbutton.innerText = "Start Game";
}

function restartGame() {
  endGame();
  startGame();
}

function handleGame() {
  if (isGameOver) {
    startGame();
  } else {
    restartGame();
  }
}

startbutton.addEventListener("click", handleGame);
