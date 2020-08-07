



let canvas, ctx, ballX, ballY, ballRadius = 7.5;
let paddleX = 0, paddleHeight = 10, paddleWidth = 120, paddleMarginY = 40;
let ballSpeedYDefault = -8, ballSpeedXDefault = 8, ballSpeedX = 8, ballSpeedY = -8, playerStart = false;
let globalMouseX, globalMouseY;
let currLvl = 1;
const brickGap = 2;

let levels;

const setLevels = () => {
  levels = {
    1: {
      brickH: Math.floor(canvas.height / 20),
      brickW: Math.floor(canvas.width / 10),
      bricks: Array(100).fill(true)
    }
  }
};

const drawRect = (x, y, w, h, color) => {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

const drawPaddle = () => {
  drawRect(paddleX, canvas.height - paddleMarginY, paddleWidth, paddleHeight, 'white');
};

const drawBall = () => {
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2, false)
  ctx.fill();
}; 

const getMousePos = event => {
  const rect = canvas.getBoundingClientRect();
  const root = document.documentElement;
  const mouseX = event.clientX - rect.left - root.scrollLeft;
  const mouseY = event.clientY - rect.top - root.scrollTop;
  globalMouseX = mouseX;
  globalMouseY = mouseY;
  return {
    x: mouseX,
    y: mouseY
  }
};


const resetGame = () => {
  ballX = paddleX + paddleWidth / 2
  ballY = canvas.height - paddleMarginY - ballRadius;
  ballSpeedX = ballSpeedXDefault;
  ballSpeedY = ballSpeedYDefault;
  playerStart = false;
};

/**
 * 
 * @param {(int, int)} point1 - {x: int, y: int}
 * @param {(int, int)} point2 - {x: int, y: int}
 */
const getDistanceBetweenPoints = (point1, point2) => {
  const a = point1.x - point2.x;
  const b = point1.y - point2.y;

  return Math.sqrt(a*a + b*b);
};

const moveBall = () => {
  if (!playerStart) {
    return;
  }

  ballY += ballSpeedY;
  ballX += ballSpeedX;

  if (ballY <= ballRadius && ballSpeedY < 0) {
    ballSpeedY *= -1;
  }

  if (ballY >= canvas.height - paddleMarginY) {
    if (ballX < paddleX + paddleWidth &&
        ballX > paddleX && 
        ballY <= canvas.height - paddleMarginY + paddleHeight) { // hit the paddle
      ballSpeedY *= -1;
      ballSpeedX = (ballX - (paddleX + paddleWidth / 2)) * 0.38;
      if (Math.abs(ballSpeedX) < 3) ballSpeedX *= 3.5;
    } else if (ballY >= canvas.height) {
      resetGame();
    }
  }

  if (ballX > canvas.width && ballSpeedXDefault > 0) {
    ballSpeedX *= -1;
  }
  
  if (ballX <= ballRadius && ballSpeedX < 0) {
    ballSpeedX *= -1;
  }

  hitBrick();  
};

const drawBoard = () => {
  drawRect(0, 0, canvas.width, canvas.height, 'black');
};

const brickGridPlaceInArray = (numCols, col, row) => {
  return numCols * row + col;
};

const hitBrick = () => {
  const lvl = levels[currLvl];
  const numCols = Math.floor(canvas.width / lvl.brickW);
  const numRows = Math.ceil(lvl.bricks.length / numCols);
  const col = Math.floor((ballX + ballRadius * Math.sign(ballSpeedX)) / levels[currLvl].brickW);
  const row = Math.floor((ballY + ballRadius * Math.sign(ballSpeedY)) / levels[currLvl].brickH);
  const brickInArray = brickGridPlaceInArray(numCols, col, row);
  if (col >= 0 && col < numCols && row >= 0 && row < numRows && lvl.bricks[brickInArray]) {
    lvl.bricks[brickInArray] = false;
    const prevBallX = ballX + ballRadius * Math.sign(ballSpeedX) - ballSpeedX;
    const prevBallY = ballY + ballRadius * Math.sign(ballSpeedY) - ballSpeedY;
    const prevCol = Math.floor(prevBallX / levels[currLvl].brickW);
    const prevRow = Math.floor(prevBallY / levels[currLvl].brickH);

    let bothTestFail = true;
    if (prevCol !== col) { // hit the brick from the side
      const adjBrickSide = brickGridPlaceInArray(numCols, prevCol, row);
      if (!lvl.bricks[adjBrickSide] || prevCol >= numCols) {
        ballSpeedX *= -1;
        bothTestFail = false;
      }
    } 

    if (prevRow !== row) { // hit the brick from top/bottom
      const adjBrickTopBot = brickGridPlaceInArray(numCols, col, prevRow);
      if (!lvl.bricks[adjBrickTopBot] || prevRow >= numRows) {
        ballSpeedY *= -1;
        bothTestFail = false;
      }
    }
    if (bothTestFail) {
      ballSpeedY *= -1;
      ballSpeedX *= -1;
    }
  }
};

const displayMousePos = () => {
  ctx.fillStyle = 'green';
  ctx.font = '20px serif';
  ctx.fillText(Math.floor(globalMouseX / levels[currLvl].brickW) + ',' + Math.floor(globalMouseY / levels[currLvl].brickH), globalMouseX, globalMouseY);
};

const drawBricks = () => {
  const lvl = levels[currLvl];
  const numCols = Math.floor(canvas.width / lvl.brickW);
  const numRows = Math.ceil(lvl.bricks.length / numCols);
  for (let col = 0; col < numCols; col++) {
    for (let row = 0; row < numRows; row++) {
      if (lvl.bricks[brickGridPlaceInArray(numCols, col, row)]) {
        drawRect( col * lvl.brickW + brickGap, 
                  row * lvl.brickH, 
                  lvl.brickW - brickGap, 
                  lvl.brickH - brickGap, 
                  'yellow');
      }
    }
  }
};

const drawGame = () => {
  drawBoard();
  drawPaddle();
  drawBall();
  drawBricks();
  displayMousePos();
}; 


const playGame = () => {
  drawGame();
  moveBall();
};

const resizeBoard = () => {
  canvas.width = window.innerWidth * 0.9;
  canvas.height = window.innerHeight * 0.7;
  setLevels();
  resetGame();
};

window.onload = () => {
  canvas = document.getElementById('gameCanvas');
  ctx = canvas.getContext('2d');
  resizeBoard();

  document.addEventListener('mousemove', (event) => {
    const mousePos = getMousePos(event);
    if (mousePos.x > canvas.width) {
      mousePos.x = canvas.width;
    }
    if (mousePos.x < 0) {
      mousePos.x = 0;
    }
    paddleX = mousePos.x - paddleWidth / 2;
    if (!playerStart) {
      ballX = paddleX + paddleWidth / 2;
    }
  });

  document.addEventListener('mousedown', (event) => {
    playerStart = true;
  });

  ballX = paddleX + paddleWidth / 2;
  ballY = canvas.height - paddleMarginY - ballRadius;
  
  const framePerSec = 30;
  setInterval(playGame, 1000 / framePerSec);
}

window.onresize = resizeBoard;