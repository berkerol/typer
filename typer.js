/* global canvas ctx animation:writable gameLoop label loop paintCircle isIntersectingRectangleWithRectangle generateRandomNumber generateRandomInteger paintParticles createParticles processParticles */
let score = 0;
let lives = 5;
let caseSensitive = false;

const center = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 20,
  color: '#FF0000'
};

const letter = {
  font: '20px Arial',
  color: '#0095DD',
  size: 30,
  highestSpeed: 1.6,
  lowestSpeed: 0.6,
  probability: 0.02
};

let letters = [];

document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);
window.addEventListener('resize', resizeHandler);

loop(function (frames) {
  paintCircle(center.x, center.y, center.radius, center.color);
  ctx.font = letter.font;
  ctx.fillStyle = letter.color;
  for (const l of letters) {
    ctx.fillText(String.fromCharCode(l.code), l.x, l.y);
  }
  paintParticles();
  ctx.font = label.font;
  ctx.fillStyle = label.color;
  ctx.fillText('Score: ' + score, label.left, label.margin);
  ctx.fillText('Lives: ' + lives, label.right, label.margin);
  processParticles(frames);
  createLetters();
  removeLetters(frames);
});

function createLetters () {
  if (Math.random() < letter.probability) {
    const x = Math.random() < 0.5 ? 0 : canvas.width;
    const y = Math.random() * canvas.height;
    const dX = center.x - x;
    const dY = center.y - y;
    const norm = Math.sqrt(dX ** 2 + dY ** 2);
    const speed = generateRandomNumber(letter.lowestSpeed, letter.highestSpeed);
    if (caseSensitive) {
      newCode = Math.random() < 0.5 ? generateRandomInteger(25) + 65 : generateRandomInteger(25) + 97;
    } else {
      newCode = generateRandomInteger(25) + 97;
    }
    letters.push({
      x,
      y,
      code: newCode,
      speedX: dX / norm * speed,
      speedY: dY / norm * speed
    });
  }
}

function removeLetters (frames) {
  for (const l of letters) {
    if (isIntersectingRectangleWithRectangle(l, letter.size, letter.size, center, center.radius, center.radius)) {
      if (--lives === 0) {
        ExplodeAllLetters();
        setTimeout(function() {
          window.alert('GAME OVER!');
          window.location.reload(false);
          }, 1500)
      } else if (lives > 0) {
        ExplodeAllLetters();
      }
      break;
    } else {
      l.x += l.speedX * frames;
      l.y += l.speedY * frames;
    }
  }
}

function ExplodeAllLetters() {
  for (let i = letters.length - 1; i >= 0; i--) {
    const l = letters[i];
    letters.splice(i, 1);
    createParticles(l.x, l.y);
  }
  letters = [];
}

function type (i, l) {
  letters.splice(i, 1);
  score++;
  createParticles(l.x, l.y);
}

window.changeCase = function () {
  caseSensitive = !caseSensitive;
  if (caseSensitive) {
    document.getElementById('change-case-text').innerHTML = '';
  } else {
    document.getElementById('change-case-text').innerHTML = 'in';
  }
};

function keyDownHandler (e) {
  if (animation !== undefined && e.keyCode >= 65 && e.keyCode <= 90) {
    for (let i = letters.length - 1; i >= 0; i--) {
      const l = letters[i];
      if (caseSensitive) {
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
      } else {
        if (e.keyCode === l.code || e.keyCode + 32 === l.code) {
          type(i, l);
          return;
        }
      }
    }
    score--;
  }
}

function keyUpHandler (e) {
  if (e.keyCode === 27) {
    if (animation === undefined) {
      animation = window.requestAnimationFrame(gameLoop);
    } else {
      window.cancelAnimationFrame(animation);
      animation = undefined;
    }
  }
}

function resizeHandler () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  center.x = canvas.width / 2;
  center.y = canvas.height / 2;
}
