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
    this.x = (cols / 2 - 1).truncate();
    this.y = 0;
    this.shape = shape;
  }
}

const Tetrominoes = [
  Tetromino([
    [0, 0, 1, 0],
    [0, 0, 1, 0],
    [0, 0, 1, 0],
    [0, 0, 1, 0],
  ]),
  Tetromino([
    [0, 0, 0, 0],
    [0, 1, 1, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0],
  ]),
  Tetromino([
    [0, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 1, 1],
    [0, 0, 0, 0],
  ]),
  Tetromino([
    [0, 0, 0, 0],
    [0, 0, 0, 1],
    [0, 1, 1, 1],
    [0, 0, 0, 0],
  ]),
  Tetromino([
    [0, 0, 0, 0],
    [0, 1, 1, 0],
    [0, 0, 1, 1],
    [0, 0, 0, 0],
  ]),
  Tetromino([
    [0, 0, 0, 0],
    [0, 0, 1, 1],
    [0, 1, 1, 0],
    [0, 0, 0, 0],
  ]),
  Tetromino([
    [0, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 1, 0],
    [0, 1, 0, 0],
  ]),
];
