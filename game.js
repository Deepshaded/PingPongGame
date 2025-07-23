const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Game constants
const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const PADDLE_WIDTH = 14;
const PADDLE_HEIGHT = 100;
const BALL_RADIUS = 10;

// Paddle positions
let leftPaddleY = HEIGHT / 2 - PADDLE_HEIGHT / 2;
let rightPaddleY = HEIGHT / 2 - PADDLE_HEIGHT / 2;

// Ball position and velocity
let ballX = WIDTH / 2;
let ballY = HEIGHT / 2;
let ballSpeedX = 5 * (Math.random() > 0.5 ? 1 : -1);
let ballSpeedY = 3 * (Math.random() > 0.5 ? 1 : -1);

// Mouse control for left paddle
canvas.addEventListener('mousemove', e => {
  const rect = canvas.getBoundingClientRect();
  const mouseY = e.clientY - rect.top;
  leftPaddleY = mouseY - PADDLE_HEIGHT / 2;
  leftPaddleY = Math.max(0, Math.min(HEIGHT - PADDLE_HEIGHT, leftPaddleY));
});

// Basic AI for right paddle
function moveRightPaddle() {
  const paddleCenter = rightPaddleY + PADDLE_HEIGHT / 2;
  if (ballY < paddleCenter - 12) {
    rightPaddleY -= 4;
  } else if (ballY > paddleCenter + 12) {
    rightPaddleY += 4;
  }
  rightPaddleY = Math.max(0, Math.min(HEIGHT - PADDLE_HEIGHT, rightPaddleY));
}

// Draw everything
function draw() {
  // Clear
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  // Draw net
  ctx.fillStyle = '#888';
  for (let i = 0; i < HEIGHT; i += 30) {
    ctx.fillRect(WIDTH/2 - 2, i, 4, 18);
  }

  // Draw paddles
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, leftPaddleY, PADDLE_WIDTH, PADDLE_HEIGHT); // left
  ctx.fillRect(WIDTH - PADDLE_WIDTH, rightPaddleY, PADDLE_WIDTH, PADDLE_HEIGHT); // right

  // Draw ball
  ctx.beginPath();
  ctx.arc(ballX, ballY, BALL_RADIUS, 0, Math.PI * 2);
  ctx.fillStyle = '#fff';
  ctx.fill();
}

// Ball physics & collision
function update() {
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Top/bottom wall collision
  if (ballY - BALL_RADIUS < 0 || ballY + BALL_RADIUS > HEIGHT) {
    ballSpeedY = -ballSpeedY;
    ballY = Math.max(BALL_RADIUS, Math.min(HEIGHT - BALL_RADIUS, ballY));
  }

  // Left paddle collision
  if (
    ballX - BALL_RADIUS < PADDLE_WIDTH &&
    ballY > leftPaddleY &&
    ballY < leftPaddleY + PADDLE_HEIGHT
  ) {
    ballSpeedX = -ballSpeedX;
    // Add some randomness to ball angle
    ballSpeedY += (Math.random() - 0.5) * 2;
    ballX = PADDLE_WIDTH + BALL_RADIUS;
  }

  // Right paddle collision
  if (
    ballX + BALL_RADIUS > WIDTH - PADDLE_WIDTH &&
    ballY > rightPaddleY &&
    ballY < rightPaddleY + PADDLE_HEIGHT
  ) {
    ballSpeedX = -ballSpeedX;
    ballSpeedY += (Math.random() - 0.5) * 2;
    ballX = WIDTH - PADDLE_WIDTH - BALL_RADIUS;
  }

  // Ball out of bounds (reset)
  if (ballX < 0 || ballX > WIDTH) {
    ballX = WIDTH / 2;
    ballY = HEIGHT / 2;
    ballSpeedX = 5 * (Math.random() > 0.5 ? 1 : -1);
    ballSpeedY = 3 * (Math.random() > 0.5 ? 1 : -1);
  }
}

// Main loop
function gameLoop() {
  moveRightPaddle();
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();
