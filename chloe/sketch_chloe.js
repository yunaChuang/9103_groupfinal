let doveImg;
let dots = [];

let state = "expanding";
let stateTimer = 0;
let explosionStrength = 0;

function preload() {
  doveImg = loadImage("assets/dovefinal.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);

  doveImg.resize(1000, 0);
  doveImg.loadPixels();

  let xOffset = (width - doveImg.width) / 2;
  let yOffset = (height - doveImg.height) / 2;

  for (let y = 0; y < doveImg.height; y += 3) {
    for (let x = 0; x < doveImg.width; x += 3) {
      let index = (x + y * doveImg.width) * 4;
      let r = doveImg.pixels[index];
      let g = doveImg.pixels[index + 1];
      let b = doveImg.pixels[index + 2];
      let brightness = (r + g + b) / 3;
      if (brightness < 50) {
        // 在 origin 上加一點微擾動，避免收縮時過度平整
        let jitterX = random(-1.5, 1.5);
        let jitterY = random(-1.5, 1.5);
        dots.push(new Dot(x + xOffset + jitterX, y + yOffset + jitterY));
      }
    }
  }

  noStroke();
  fill(0);
}

function draw() {
  background(255);
  let mouse = createVector(mouseX, mouseY);

  updateState();

  for (let dot of dots) {
    dot.update(mouse, explosionStrength);
    dot.display();
  }

  fill(100);
  textSize(14);
  text("自然收縮呼吸版", 20, height - 20);
}

function updateState() {
  stateTimer++;

  if (state === "expanding") {
    explosionStrength += 0.08;  // 擴散速度
    if (explosionStrength >= 5) {
      explosionStrength = 5;
      state = "contracting";
    }
  } 
  else if (state === "contracting") {
    explosionStrength -= 0.12;  // 收縮稍微快一點
    if (explosionStrength <= 1) {  // 收縮不要到 0，避免完全擠疊
      explosionStrength = 1;
      state = "waiting";
      stateTimer = 0;
    }
  } 
  else if (state === "waiting") {
    if (stateTimer >60) {  // 約停留 3 秒
      state = "expanding";
    }
  }
}

class Dot {
  constructor(x, y) {
    this.origin = createVector(x, y);
    this.pos = this.origin.copy();
    this.vel = p5.Vector.random2D().mult(random(3));
  }

  update(mouseVec, explosionStrength) {
    let dir = p5.Vector.sub(this.pos, mouseVec);
    let d = dir.mag();

    if (d < 80 && mouseIsPressed) {
      dir.setMag(1.2);
      this.vel.add(dir);
    }

    let explosion = p5.Vector.sub(this.pos, this.origin);
    explosion.normalize().mult(explosionStrength);
    this.vel.add(explosion);

    let attraction = p5.Vector.sub(this.origin, this.pos);
    attraction.mult(0.05);
    this.vel.add(attraction);

    // 停留時增加微擾動
    if (state === "waiting") {
      this.pos.add(p5.Vector.random2D().mult(0.3));
    }

    this.vel.mult(0.9);
    this.pos.add(this.vel);
  }

  display() {
    let t = frameCount * 0.02 + this.pos.y * 0.005;
    let gray = 125 + 75 * sin(t);
    fill(gray);
    ellipse(this.pos.x, this.pos.y, 2.8, 2.8);
  }
}
