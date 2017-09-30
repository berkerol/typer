let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let center = {
  x: canvas.width / 2 - 20,
  y: canvas.height / 2 - 20,
  radius: 20,
  color: "#FF0000"
};

let char = {
  probability: 0.02,
  speed: 400,
  speedVariance: 200,
  font: "20px Arial",
  color: "#0095DD",
  size: 30
};

let label = {
  font: "16px Arial",
  color: "#0095DD",
  size: 20
};

let score = 0;
let health = 10;

let chars = [];

draw();
document.addEventListener("keydown", keyDownHandler);

function drawCenter() {
  ctx.beginPath();
  ctx.arc(center.x, center.y, center.radius, 0, 2 * Math.PI);
  ctx.fillStyle = center.color;
  ctx.fill();
  ctx.closePath();
}

function drawChar(c) {
  ctx.font = char.font;
  ctx.fillStyle = char.color;
  ctx.fillText(c.char, c.x, c.y, char.size);
}

function drawLabel(message, number, position) {
  ctx.font = label.font;
  ctx.fillStyle = label.color;
  ctx.fillText(message + number, position, label.size);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawCenter();
  drawLabel("Score: ", score, 10);
  drawLabel("Lives: ", health, canvas.width - 80);
  createChars();
  removeChars();
  drawChars();
  requestAnimationFrame(draw);
}

function createChars() {
  if (Math.random() < char.probability) {
    let x = Math.random() < 0.5 ? 0 : canvas.width;
    let y = Math.random() * canvas.height;
    let code = Math.random() < 0.5 ? Math.floor(Math.random() * 25 + 65) : Math.floor(Math.random() * 25 + 97);
    let s = Math.floor(Math.random() * char.speedVariance + char.speed);
    chars.push({
      x,
      y,
      code,
      char: String.fromCharCode(code),
      dx: (center.x - x) / s,
      dy: (center.y - y) / s
    });
  }
}

function removeChars() {
  for (let i = chars.length - 1; i >= 0; i--) {
    let c = chars[i];
    if (intersects(c.x, c.y, char.size, char.size, center.x, center.y, center.radius, center.radius)) {
      chars.splice(i, 1);
      die(true);
      break;
    }
  }
}

function drawChars() {
  for (let char of chars) {
    char.x += char.dx;
    char.y += char.dy;
    drawChar(char);
  }
}

function intersects(x1, y1, w1, h1, x2, y2, w2, h2) {
  return x2 < x1 + w1 && x2 + w2 > x1 && y2 < y1 + h1 && y2 + h2 > y1;
}

function die(start) {
  health--;
  if (health === 0) {
    alert("GAME OVER");
    document.location.reload();
  } else {
    if (start) {
      alert("START AGAIN!");
      chars = [];
    }
  }
}

function keyDownHandler(e) {
  for (let i = chars.length - 1; i >= 0; i--) {
    let char = chars[i];
    if (e.shiftKey) {
      if (e.keyCode === char.code) {
        chars.splice(i, 1);
        score++;
        return;
      }
    } else {
      if (e.keyCode + 32 === char.code) {
        chars.splice(i, 1);
        score++;
        return;
      }
    }
  }
  if (!e.shiftKey) {
    die(false);
  }
}
