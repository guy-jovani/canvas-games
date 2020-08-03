


let canvas, ctx, ballX, ballY;
let ballSpeedX = 5, ballSpeedY = 10;
let paddleWidth = 10, paddleHeight = 90, paddleMarginX = 10, paddleMarginY = 20;
let paddleLeftY, paddleRightY;
let scoreP = 0, scoreC = 0;
const ballRadius = 5;
const rightPaddleSpeed = 10 ;

const drawBoard = () => {
  canvas.width = window.innerWidth * 0.9;
  canvas.height = window.innerHeight * 0.7;
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  ctx.font = '20px serif';
  ctx.fillStyle = 'white';
  ctx.fillText(scoreP, 75, 50);
  ctx.fillText(scoreC, canvas.width - 75, 50);
};

const drawBall = () => {
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2, false)
  ctx.fill();

  Array(Math.ceil(canvas.height / 55)).fill().forEach((val, i)=> {
    ctx.fillRect(canvas.width / 2, i * 55 + 5, 3, 40);
  });
}; 

const drawPaddleLeft = () => {
  ctx.fillStyle = 'white';
  ctx.fillRect(paddleMarginX, paddleLeftY, paddleWidth, paddleHeight);
};  

const drawPaddleRight = () => {
  ctx.fillStyle = 'white';
  ctx.fillRect(canvas.width - paddleMarginX - paddleWidth, paddleRightY, paddleWidth, paddleHeight);
};  

const resetBall = () => {
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  ballSpeedX *= -1;
  ballSpeedX = 5;
  ballSpeedY = 10; 
};


const getMousePos = event => {
  const rect = canvas.getBoundingClientRect();
  const root = document.documentElement;
  const mouseX = event.clientX - rect.left - root.scrollLeft;
  const mouseY = event.clientY - rect.top - root.scrollTop;
  
  return {
    x: mouseX,
    y: mouseY
  }
};

const computerPaddleMovements = () => {
  let paddleRightCenter = paddleRightY + paddleHeight / 2;
  if (paddleRightCenter < ballY - paddleHeight / 3) paddleRightY += rightPaddleSpeed;
  if (paddleRightCenter > ballY + paddleHeight / 3) paddleRightY -= rightPaddleSpeed;
};

const moveBall = () => {
  computerPaddleMovements();
  if (ballX >= canvas.width - paddleMarginX - paddleWidth) { 
    if (paddleRightY > ballY || paddleRightY + paddleHeight < ballY) { // player scored
      scoreP++;
      resetBall();
    } else {
      ballSpeedX *= -1; 
      ballSpeedY = (ballY - (paddleRightY + paddleHeight / 2)) * 0.45;
    }
  }

  if (ballX <= paddleMarginX + paddleWidth) {
    if (paddleLeftY > ballY || paddleLeftY + paddleHeight < ballY) { // computer scored
      scoreC++;
      resetBall();
    } else {
      ballSpeedY = (ballY - (paddleLeftY + paddleHeight / 2)) * 0.45;
      ballSpeedX *= -1;
    }
  }

  if (ballY >= canvas.height - paddleMarginY) {
    ballSpeedY *= -1;
  }
  
  if (ballY <= paddleMarginY) {
    ballSpeedY *= -1;
  }

  ballX += ballSpeedX;
  ballY += ballSpeedY;
};

const moveParts = () => {
  moveBall();
};

const drawGame = () => {
  drawBoard();
  drawBall();
  drawPaddleLeft();
  drawPaddleRight();
};


const playGame = () => {
  drawGame();
  moveBall();
};


window.onload = () => {
  canvas = document.getElementById('gameCanvas');
  ctx = canvas.getContext('2d');
  paddleLeftY = canvas.height / 2 - paddleHeight / 2;
  paddleRightY = canvas.height / 2 - paddleHeight / 2;
  resetBall();

  document.addEventListener('mousemove', (event) => {
    const mousePos = getMousePos(event);
    paddleLeftY = mousePos.y - paddleHeight / 2;
  });
  
  const framePerSec = 30;
  setInterval(playGame, 1000 / framePerSec);
}