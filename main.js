"use strict";

/** @type {HTMLCanvasElement} */
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;

let particlesArr;

const mouse = {
  x: null,
  y: null,
  // Scales the area around the mouse position with canvas size
  radius: (canvas.height / 100) * (canvas.width / 100)
};

window.addEventListener("mousemove", (event) => {
  mouse.x = event.x;
  mouse.y = event.y;
});

class Particle {
  constructor(x, y, directionX, directionY, size) {
    this.x = x;
    this.y = y;
    this.directionX = directionX;
    this.directionY = directionY;
    this.size = size;
  }

  // Draw individual particle
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
    ctx.fill();
  }

  // Check particle pos and mouse pos, then move the particle, and finally draw
  update() {
    // Reverse direction on hitting the opposite edges
    if (this.x > canvas.width || this.x < 0) {
      this.directionX = - this.directionX;
    }

    if (this.y > canvas.height || this.y < 0) {
      this.directionY = - this.directionY;
    }

    // Check collistion detection for mouse pos
    let dx = mouse.x - this.x;
    let dy = mouse.y - this.y;
    let distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < mouse.radius + this.size) {
      // Collision
      if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
        this.x += 3;
      }

      if (mouse.x > this.x && this.x > this.size * 10) {
        this.x -= 3;
      }

      if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
        this.y += 3;
      }

      if (mouse.y > this.y && this.y > this.size * 10) {
        this.y -= 3;
      }
    }

    // Move particle
    this.x += this.directionX;
    this.y += this.directionY;
    // Draw particle
    this.draw();
  }
}

// Create particle array
function init() {
  // Initial ctx state
  ctx.fillStyle = "#ebf8ff";

  particlesArr = [];
  let numOfParticles = Math.floor((canvas.height * canvas.width) / 9000);

  for (let i = 0; i < numOfParticles; i++) {
    let size = Math.floor((Math.random() * 5) + 1);
    let x = Math.floor((Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2));
    let y = Math.floor((Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2));
    let directionX = Math.floor((Math.random() * 2) - 1.5);
    let directionY = Math.floor((Math.random() * 2) - 1.5);

    particlesArr.push(new Particle(x, y, directionX, directionY, size));
  }
}

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, innerWidth, innerHeight);

  for (let i = 0; i < particlesArr.length; i++) {
    particlesArr[i].update();
  }

  connect();
}

function connect() {
  let opacityValue = 1;

  for (let a = 0; a < particlesArr.length; a++) {
    for (let b = a; b < particlesArr.length; b++) {
      let distance = ((particlesArr[a].x - particlesArr[b].x) * (particlesArr[a].x - particlesArr[b].x)) + ((particlesArr[a].y - particlesArr[b].y) * (particlesArr[a].y - particlesArr[b].y));

      if (distance < (canvas.width / 7) * (canvas.height / 7)) {
        opacityValue = 1 - (distance / 20000);

        ctx.strokeStyle = `rgba(235, 248, 255, ${opacityValue})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particlesArr[a].x, particlesArr[a].y);
        ctx.lineTo(particlesArr[b].x, particlesArr[b].y);
        ctx.stroke();
      }
    }
  }
}

window.addEventListener("resize", () => {
  canvas.width = document.documentElement.clientWidth;
  canvas.height = document.documentElement.clientHeight;

  mouse.radius = Math.floor(((canvas.height / 100) * (canvas.height / 100)));

  init();
});

window.addEventListener("mouseout", () => {
  mouse.x = undefined;
  mouse.y = undefined;
})

init();
animate();