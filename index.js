const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const blockSize = 40;
const horizontalBlockCount = canvas.width / blockSize;
const verticalBlockCount = canvas.height / blockSize;

let currentRow = 0;
let grid = [];
while (currentRow < verticalBlockCount) {
  let rowArr = [];
  let currentCol = 0;
  while (currentCol < horizontalBlockCount) {
    rowArr.push(0);
    currentCol++;
  }
  grid.push(rowArr);
  currentRow++;
}

let x = 5;
let y = 0;
grid[y][x] = 1;
drawBoard();

setInterval(() => {
  if (y < verticalBlockCount - 1) {
    grid[y][x] = 0;
    y++;
    grid[y][x] = 1;
    drawBoard();
  }
}, 1000);

function drawBoard() {
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      const x = col * blockSize;
      const y = row * blockSize;
      if (grid[row][col] === 1) {
        ctx.fillStyle = "red";
        ctx.fillRect(x, y, blockSize, blockSize);
      } else {
        ctx.fillStyle = "white";
        ctx.fillRect(x, y, blockSize, blockSize);
      }
      ctx.strokeRect(x, y, blockSize, blockSize);
    }
  }
}
