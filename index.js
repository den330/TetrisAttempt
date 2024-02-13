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

const BoardArray = List.generate(rows, (_) => List.generate(cols, (_) => 0));
let currentTetromino;
let nextTeromino = Tetrominoes[Random().nextInt(0, Tetrominoes.length)];
function updateGame() {
  if (currentTetromino == null) {
    currentTetromino = nextTeromino;
    nextTeromino = Object.assign(
      {},
      Tetrominoes[Random().nextInt(0, Tetrominoes.length)]
    );
  }
  if (currentTetromino != null) {
    currentTetromino.y++;
  }
  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < cols; j++) {
      const realY = i + currentTetromino.y;
      if (BoardArray[realY][j] == 1 || realY + 1 >= rows) {
        currentTetromino = null;

        break;
      }
    }
  }
}

settimeinterval(() => {
  updateGame();
}, 1000);
