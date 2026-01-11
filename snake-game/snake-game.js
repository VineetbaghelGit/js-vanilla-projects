// ===== CANVAS SETUP =====
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20; // size of one grid cell
const canvasSize = 20; // 20x20 grid

// ===== GAME STATE =====
let snake = [
  { x: 10, y: 10 },
  { x: 9, y: 10 },
  { x: 8, y: 10 },
];
console.log("🚀 ~ snake:", snake);

let dx = 1;
let dy = 0;

let food = generateFood();
let score = 0;

let isPaused = false;
let gameInterval = null;
let speed = 150;

// ===== UI =====
const scoreEl = document.getElementById("score");

// ===== START GAME =====
startGame();

// ===== FUNCTIONS =====

function startGame() {
  clearInterval(gameInterval);
  gameInterval = setInterval(gameLoop, speed);
}

function gameLoop() {
  if (isPaused) return;

  moveSnake();
  checkCollision();
  drawGame();
}

function moveSnake() {
  const head = snake[0];
  const newHead = { x: head.x + dx, y: head.y + dy };

  //   add head + remove tail = move forward

  // Eat food
  if (newHead.x === food.x && newHead.y === food.y) {
    // add head + DO NOT remove tail = grow
    score++;
    scoreEl.textContent = "Score: " + score;
    food = generateFood();
  } else {
    snake.pop(); // remove tail
  }

  snake.unshift(newHead); // add head
}

function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw snake
  snake.forEach((part, index) => {
    ctx.fillStyle = index === 0 ? "lime" : "green";
    ctx.fillRect(part.x * box, part.y * box, box, box);
  });

  // Draw food
  ctx.fillStyle = "red";
  ctx.fillRect(food.x * box, food.y * box, box, box);
}

function checkCollision() {
  const head = snake[0];

  // Wall collision
  if (
    head.x < 0 ||
    head.x >= canvasSize ||
    head.y < 0 ||
    head.y >= canvasSize
  ) {
    gameOver();
  }

  // Self collision
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      gameOver();
    }
  }
}

function gameOver() {
  clearInterval(gameInterval);
  alert("Game Over! Score: " + score);
  location.reload();
}

function generateFood() {
  return {
    x: Math.floor(Math.random() * canvasSize),
    y: Math.floor(Math.random() * canvasSize),
  };
}
document.addEventListener("keydown", (e) => {
    // dy === 0 → snake is currently moving left or right
  if (e.key === "ArrowUp" && dy === 0) {
    dx = 0;
    dy = -1;
  }
  if (e.key === "ArrowDown" && dy === 0) {
    dx = 0;
    dy = 1;
  }
  if (e.key === "ArrowLeft" && dx === 0) {
// dx === 0 → snake is moving up or down
    dx = -1;
    dy = 0;
  }
  if (e.key === "ArrowRight" && dx === 0) {
    dx = 1;
    dy = 0;
  }

  // Pause / Resume
  if (e.key === " ") {
    isPaused = !isPaused;
  }
});
