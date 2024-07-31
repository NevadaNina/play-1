const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const shipImage = new Image();
shipImage.src = "assets/ship.png";

const enemyImage = new Image();
enemyImage.src = "assets/enemy.png";

const bulletSound = new Audio("assets/laser.mp3");

const ship = {
  x: canvas.width / 2 - 25,
  y: canvas.height - 60,
  width: 50,
  height: 50,
  speed: 5,
  bullets: []
};

const enemies = [];
const keys = {};

document.addEventListener("keydown", (e) => {
  keys[e.key] = true;
});

document.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

function drawShip() {
  ctx.drawImage(shipImage, ship.x, ship.y, ship.width, ship.height);
}

function drawBullets() {
  ship.bullets.forEach((bullet, index) => {
    bullet.y -= bullet.speed;
    ctx.fillStyle = "#f00";
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);

    if (bullet.y + bullet.height < 0) {
      ship.bullets.splice(index, 1);
    }
  });
}

function drawEnemies() {
  enemies.forEach((enemy, index) => {
    enemy.y += enemy.speed;
    ctx.drawImage(enemyImage, enemy.x, enemy.y, enemy.width, enemy.height);

    if (enemy.y + enemy.height > canvas.height) {
      enemies.splice(index, 1);
    }
  });
}

function update() {
  if (keys["ArrowLeft"] && ship.x > 0) {
    ship.x -= ship.speed;
  }
  if (keys["ArrowRight"] && ship.x + ship.width < canvas.width) {
    ship.x += ship.speed;
  }
  if (keys[" "] && ship.bullets.length < 5) {
    ship.bullets.push({ x: ship.x + ship.width / 2 - 2.5, y: ship.y, width: 5, height: 10, speed: 7 });
    bulletSound.play();
  }

  ship.bullets.forEach((bullet, bIndex) => {
    enemies.forEach((enemy, eIndex) => {
      if (
        bullet.x < enemy.x + enemy.width &&
        bullet.x + bullet.width > enemy.x &&
        bullet.y < enemy.y + enemy.height &&
        bullet.y + bullet.height > enemy.y
      ) {
        ship.bullets.splice(bIndex, 1);
        enemies.splice(eIndex, 1);
      }
    });
  });
}

function spawnEnemies() {
  setInterval(() => {
    const x = Math.random() * (canvas.width - 50);
    enemies.push({ x, y: -50, width: 50, height: 50, speed: 2 });
  }, 1000);
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawShip();
  drawBullets();
  drawEnemies();
  update();
  requestAnimationFrame(gameLoop);
}

shipImage.onload = () => {
  spawnEnemies();
  gameLoop();
};
