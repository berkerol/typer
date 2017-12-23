/* global alert */
/* global requestAnimationFrame */
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let score = 0;
let lives = 10;

let center = {
  x: canvas.width / 2 - 20,
  y: canvas.height / 2 - 20,
  radius: 20,
  color: '#FF0000'
};

let letter = {
  font: '20px Arial',
  color: '#0095DD',
  size: 30,
  highestSpeed: 1.6,
  lowestSpeed: 0.6,
  probability: 0.02
};

let particle = {
  alpha: 0.5,
  decrease: 0.05,
  highestRadius: 5,
  highestSpeedX: 5,
  highestSpeedY: 5,
  lowestRadius: 2,
  lowestSpeedX: -5,
  lowestSpeedY: -5,
  total: 50
};

let label = {
  font: '24px Arial',
  color: '#0095DD',
  margin: 20
};

let letters = [];
let particles = [];

draw();
document.addEventListener('keydown', keyDownHandler);
window.addEventListener('resize', resizeHandler);

function draw () {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawCircle(center);
  for (let l of letters) {
    drawLabel(letter.font, letter.color, String.fromCharCode(l.code), l.x, l.y);
  }
  for (let p of particles) {
    drawCircle(p);
  }
  drawLabel(label.font, label.color, 'Score: ' + score, 10, label.margin);
  drawLabel(label.font, label.color, 'Lives: ' + lives, canvas.width - 110, label.margin);
  processParticles();
  createLetters();
  removeLetters();
  requestAnimationFrame(draw);
}

function drawCircle (c) {
  ctx.beginPath();
  ctx.arc(c.x, c.y, c.radius, 0, 2 * Math.PI);
  ctx.fillStyle = c.color;
  ctx.fill();
  ctx.closePath();
}

function drawLabel (font, color, text, x, y) {
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
}

function processParticles () {
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.x += p.speedX;
    p.y += p.speedY;
    p.radius -= particle.decrease;
    if (p.radius <= 0 || p.x < 0 || p.x > canvas.width || p.y < 0 || p.y > canvas.height) {
      particles.splice(i, 1);
    }
  }
}

function createLetters () {
  if (Math.random() < letter.probability) {
    let x = Math.random() < 0.5 ? 0 : canvas.width;
    let y = Math.random() * canvas.height;
    let dX = center.x - x;
    let dY = center.y - y;
    let norm = Math.sqrt(Math.pow(dX, 2) + Math.pow(dY, 2));
    let speed = letter.lowestSpeed + Math.random() * (letter.highestSpeed - letter.lowestSpeed);
    letters.push({
      x,
      y,
      code: Math.random() < 0.5 ? Math.floor(Math.random() * 25 + 65) : Math.floor(Math.random() * 25 + 97),
      speedX: dX / norm * speed,
      speedY: dY / norm * speed
    });
  }
}

function removeLetters () {
  for (let l of letters) {
    if (intersects(l.x, l.y, letter.size, letter.size, center.x, center.y, center.radius, center.radius)) {
      if (--lives === 0) {
        alert('GAME OVER!');
        document.location.reload();
      } else {
        alert('START AGAIN!');
        letters = [];
        particles = [];
      }
      break;
    } else {
      l.x += l.speedX;
      l.y += l.speedY;
    }
  }
}

function generateRandomRgbColor () {
  return [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)];
}

function intersects (x1, y1, w1, h1, x2, y2, w2, h2) {
  return x2 < x1 + w1 && x2 + w2 > x1 && y2 < y1 + h1 && y2 + h2 > y1;
}

function type (i, l) {
  letters.splice(i, 1);
  score++;
  for (let j = 0; j < particle.total; j++) {
    let c = generateRandomRgbColor();
    particles.push({
      x: l.x,
      y: l.y,
      radius: particle.lowestRadius + Math.random() * (particle.highestRadius - particle.lowestRadius),
      color: 'rgba(' + c[0] + ', ' + c[1] + ', ' + c[2] + ', ' + particle.alpha + ')',
      speedX: particle.lowestSpeedX + Math.random() * (particle.highestSpeedX - particle.lowestSpeedX),
      speedY: particle.lowestSpeedY + Math.random() * (particle.highestSpeedY - particle.lowestSpeedY)
    });
  }
}

function keyDownHandler (e) {
  for (let i = letters.length - 1; i >= 0; i--) {
    let l = letters[i];
    if (e.shiftKey) {
      if (e.keyCode === l.code) {
        type(i, l);
        return;
      }
    } else {
      if (e.keyCode + 32 === l.code) {
        type(i, l);
        return;
      }
    }
  }
  if (!e.shiftKey) {
    score--;
  }
}

function resizeHandler () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  center.x = canvas.width / 2 - center.radius;
  center.y = canvas.height / 2 - center.radius;
}
