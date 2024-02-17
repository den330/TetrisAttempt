const canvas = document.getElementById("myCanvas");
const canvasHeight = canvas.height;
const canvasWidth = canvas.width;
const cellSize = 20;
const rows = canvasHeight / cellSize;
const cols = canvasWidth / cellSize;
let pauseBtn = document.getElementById("pauseBtn");
let gameSpeedLabel = document.getElementById("speedLabel");
const speedIncreaseInterval = 60000;

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

function getNext() {
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
  return nextTeromino;
}

function updateGame() {
  if (currentTetromino == null) {
    currentTetromino = nextTeromino;
    nextTeromino = getNext();
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
    currentScore = 10 * count * count * gameSpeed + currentScore;
    score.innerText = currentScore;
    currentHighScore = Math.max(currentHighScore, currentScore);
    highScore.innerText = currentHighScore;
    currentTetromino = nextTeromino;
    nextTeromino = getNext();
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

let speedInterval;

let handleKeyDown = function (event) {
  // if (currentTetromino == null) return;
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
const framePerSecond = 24;
let gameSpeed;
function startGame() {
  if (!isGameOver) return;
  isPaused = false;
  pauseBtn.innerText = "Pause";
  currentScore = 0;
  score.innerText = currentScore;
  gameSpeed = 1;
  gameSpeedLabel.innerText = gameSpeed;
  isGameOver = false;
  boardArray = Array.from({ length: rows }, () => Array(cols).fill(0));
  currentTetromino = null;
  updateGameInterval = setInterval(() => {
    updateGame();
  }, 1000 / gameSpeed);
  drawInterval = setInterval(() => {
    draw();
  }, 1000 / framePerSecond);
  speedInterval = setInterval(increaseGameSpeed, speedIncreaseInterval);
  document.addEventListener("keydown", handleKeyDown);
  title.innerText = "Tetris";
  startbutton.innerText = "Restart Game";
  pauseBtn.classList.remove("hidden"); // Show the pause button when the game starts
}

function endGame() {
  clearInterval(updateGameInterval);
  clearInterval(drawInterval);
  clearInterval(speedInterval);
  document.removeEventListener("keydown", handleKeyDown);
  isGameOver = true;
  title.innerText = "Game Over";
  startbutton.innerText = "Start Game";
  pauseBtn.classList.add("hidden"); // Show the pause button when the game starts
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

let isPaused = false; // Flag to track pause state

// Function to toggle pause state
function togglePause() {
  if (isGameOver) return; // Don't pause if the game is over

  isPaused = !isPaused; // Toggle pause state
  pauseBtn.innerText = isPaused ? "Resume" : "Pause"; // Update button text

  if (isPaused) {
    // If pausing, stop the game logic and drawing updates
    clearInterval(updateGameInterval);
    clearInterval(drawInterval);
    document.removeEventListener("keydown", handleKeyDown); // Prevent moving pieces while paused
    title.innerText = "Game Paused"; // Optional: Update title or show a pause message
  } else {
    // If resuming, restart the game logic and drawing updates
    updateGameInterval = setInterval(() => {
      updateGame();
    }, 1000 / gameSpeed);
    drawInterval = setInterval(() => {
      draw();
    }, 1000 / framePerSecond);
    document.addEventListener("keydown", handleKeyDown); // Re-enable key controls
    title.innerText = "Tetris"; // Optional: Reset title or hide pause message
  }
}

function increaseGameSpeed() {
  if (isGameOver || isPaused || gameSpeed >= 12) return; // Do not increase speed if the game is over or paused

  gameSpeed += 1; // Increase game speed by 1
  gameSpeedLabel.innerText = gameSpeed; // Update the game speed label

  // Restart the game loop intervals with the new speed
  clearInterval(updateGameInterval);
  updateGameInterval = setInterval(updateGame, 1000 / gameSpeed);
}

// Add event listener to the pause button
pauseBtn.addEventListener("click", togglePause);
document.addEventListener("DOMContentLoaded", function () {
  pauseBtn.classList.add("hidden");
});
