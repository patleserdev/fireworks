const sounds = {
  launch: [new Audio("assets/launch1.mp3"), new Audio("assets/launch2.mp3")],
  explosion: [
    new Audio("assets/explosion1.mp3"),
    new Audio("assets/explosion2.mp3"),
    new Audio("assets/explosion3.mp3"),
    new Audio("assets/explosion4.mp3"),
  ],
};

const title = document.getElementById("title");

setTimeout(() => {
  title.remove();
}, 5000);
const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let fireworks = [];
let stars = [];
let isSuperShowed = false;
let maxStars = 20;

createStars();

class Firework {
  constructor(x, y, type, vx) {
    this.x = x;
    this.y = canvas.height;
    this.vx = vx;
    this.targetY = y;
    this.type = type;
    this.exploded = false;
    this.particles = [];

    // Joue le son de lancement
    playRandomSound("launch");
  }

  update() {
    if (!this.exploded) {
      this.x += this.vx;
      this.y -= 5;
      if (this.y <= this.targetY) this.explode();
    } else {
      this.particles.forEach((p) => p.update());
      this.particles = this.particles.filter((p) => p.alpha > 0);
    }
  }

  draw() {
    if (!this.exploded) {
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      this.particles.forEach((p) => p.draw());
    }
  }

  explode() {
    this.exploded = true;

    // Joue le son d’explosion
    playRandomSound("explosion");
    this.type === "willow";

    const count = 100;
    for (let i = 0; i < count; i++) {
      let angle = (Math.PI * 2 * i) / count;
      let speed =
        this.type === "willow" ? Math.random() * 3 + 2 : Math.random() * 5 + 2;
      let color =
        this.type === "multi"
          ? `hsl(${Math.random() * 360},100%,60%)`
          : this.type === "willow"
          ? "gold"
          : this.type === "ring"
          ? "cyan"
          : this.type === "heart"
          ? "pink"
          : "orange";

      if (this.type === "heart") {
        const t = (i / count) * Math.PI * 2;
        const hx = 16 * Math.pow(Math.sin(t), 3);
        const hy = -(
          13 * Math.cos(t) -
          5 * Math.cos(2 * t) -
          2 * Math.cos(3 * t) -
          Math.cos(4 * t)
        );
        this.particles.push(
          new Particle(this.x, this.y, hx * 0.3, hy * 0.3, color)
        );
      } else {
        this.particles.push(
          new Particle(
            this.x,
            this.y,
            Math.cos(angle) * speed,
            Math.sin(angle) * speed,
            color
          )
        );
      }
    }
  }
}

class Particle {
  constructor(x, y, vx, vy, color) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.color = color;
    this.alpha = 1;
    this.gravity = 0.05;
    this.friction = 0.98;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += this.gravity;
    this.vx *= this.friction;
    this.vy *= this.friction;
    this.alpha -= 0.01;
  }

  draw() {
    const gradient = ctx.createRadialGradient(
      this.x,
      this.y,
      0,
      this.x,
      this.y,
      4
    );
    gradient.addColorStop(0, this.color);
    gradient.addColorStop(1, "transparent");
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

// Fonction utilitaire pour jouer un son aléatoire d'une catégorie
function playRandomSound(type) {
  const choices = sounds[type];
  const sound = choices[Math.floor(Math.random() * choices.length)];
  sound.currentTime = 0; // recommence le son depuis le début
  sound.play();
}

// --- Étoiles du ciel ---
function createStars() {
  stars = [];
  for (let i = 0; i < maxStars; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: (Math.random() * canvas.height) / 2,
      alpha: Math.random(),
    });
  }
}

function launchFirework(type) {
  const startX = canvas.width * (0.2 + Math.random() * 0.6);
  const targetY = canvas.height * Math.random() * 0.5;
  const angle = (Math.random() - 0.5) * (Math.PI / 2);
  const vx = Math.sin(angle) * 2;
  fireworks.push(new Firework(startX, targetY, type, vx));
}

function launchGiantFirework(type) {
  const startX = canvas.width * (0.1 + Math.random() * 0.8);
  const targetY = canvas.height * Math.random() * 0.33;
  const angle = (Math.random() - 0.5) * (Math.PI / 2);
  const vx = Math.sin(angle) * 2;
  const giant = new Firework(startX, targetY, type, vx);
  giant.explode = function () {
    this.exploded = true;
    playRandomSound("explosion");

    const count = 200;
    for (let i = 0; i < count; i++) {
      let angle = (Math.PI * 2 * i) / count;
      let speed =
        this.type === "willow" ? Math.random() * 5 + 3 : Math.random() * 7 + 3;
      let color =
        this.type === "multi"
          ? `hsl(${Math.random() * 360},100%,60%)`
          : this.type === "willow"
          ? "gold"
          : this.type === "ring"
          ? "cyan"
          : this.type === "heart"
          ? "pink"
          : "orange";
      if (this.type === "heart") {
        const t = (i / count) * Math.PI * 2;
        const hx = 16 * Math.pow(Math.sin(t), 3);
        const hy = -(
          13 * Math.cos(t) -
          5 * Math.cos(2 * t) -
          2 * Math.cos(3 * t) -
          Math.cos(4 * t)
        );
        this.particles.push(
          new Particle(this.x, this.y, hx * 0.5, hy * 0.5, color)
        );
      } else {
        this.particles.push(
          new Particle(
            this.x,
            this.y,
            Math.cos(angle) * speed,
            Math.sin(angle) * speed,
            color
          )
        );
      }
    }
  };
  fireworks.push(giant);
}

// --- Shows avec décompte ---
function startShow() {
  const btn = document.querySelector('button[onclick="startShow()"]');
  if (isSuperShowed) return;
  isSuperShowed = true;

  let remaining = 15;
  const originalText = btn.textContent;
  btn.disabled = true;
  btn.textContent = `🎇 ${remaining}s`;

  const countdown = setInterval(() => {
    remaining--;
    btn.textContent = `🎇 ${remaining}s`;
  }, 1000);

  const types = ["classic", "multi", "willow", "ring", "heart"];
  let showInterval = setInterval(() => {
    const type = types[Math.floor(Math.random() * types.length)];
    launchFirework(type);
    if (Math.random() > 0.6) {
      setTimeout(
        () => launchFirework(types[Math.floor(Math.random() * types.length)]),
        500
      );
    }
  }, 800);

  setTimeout(() => {
    clearInterval(showInterval);
    clearInterval(countdown);
    btn.textContent = originalText;
    btn.disabled = false;
    isSuperShowed = false;
  }, 15000);
}

function startSuperShow() {
  const btn = document.querySelector('button[onclick="startSuperShow()"]');
  if (isSuperShowed) return;
  isSuperShowed = true;

  let remaining = 15;
  const originalText = btn.textContent;
  btn.disabled = true;
  btn.textContent = `🎇 ${remaining}s`;

  const countdown = setInterval(() => {
    remaining--;
    btn.textContent = `🎇 ${remaining}s`;
  }, 1000);

  const types = ["classic", "multi", "willow", "ring", "heart"];
  let showInterval = setInterval(() => {
    const launches = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < launches; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      launchFirework(type);
    }
    if (Math.random() > 0.7) {
      const giantType = types[Math.floor(Math.random() * types.length)];
      launchGiantFirework(giantType);
    }
  }, 600);

  setTimeout(() => {
    clearInterval(showInterval);
    clearInterval(countdown);
    btn.textContent = originalText;
    btn.disabled = false;
    isSuperShowed = false;
  }, 15000);
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  stars.forEach((star) => {
    ctx.globalAlpha = star.alpha;
    ctx.fillStyle = "white";
    ctx.fillRect(star.x, star.y, 2, 2);
    star.alpha = Math.random();
  });
  ctx.globalAlpha = 1;

  fireworks.forEach((fw, index) => {
    fw.update();
    fw.draw();
    if (fw.exploded && fw.particles.length === 0) {
      fireworks.splice(index, 1);
    }
  });

  requestAnimationFrame(animate);
}
animate();

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  createStars();
});

canvas.addEventListener("click", () => launchFirework("multi"));
