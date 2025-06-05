let doveImg;
let dots = [];

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
        dots.push(new Dot(x + xOffset, y + yOffset));
      }
    }
  }

  noStroke();
  fill(0);
}

function draw() {
  background(255);
  let mouse = createVector(mouseX, mouseY);

  // 自動擴散/集結循環
  let phase = sin(frameCount * 0.01); 
  let explosionStrength = map(phase, -1, 1, 0, 10);  // 散開程度隨 phase 變化

  for (let dot of dots) {
    dot.update(mouse, explosionStrength);
    dot.display();
  }

  fill(100);
  textSize(14);
  text("鴿子散開 / 集結效果", 20, height - 20);
}

class Dot {
  constructor(x, y) {
    this.origin = createVector(x, y);
    this.pos = this.origin.copy();
    this.vel = p5.Vector.random2D().mult(random(5)); // 起始可有小擾動
  }

  update(mouseVec, explosionStrength) {
    let dir = p5.Vector.sub(this.pos, mouseVec);
    let d = dir.mag();

    if (d < 80 && mouseIsPressed) {
      dir.setMag(1.2);
      this.vel.add(dir);
    }

    // 散開力（擴散）
    let explosion = p5.Vector.sub(this.pos, this.origin);
    explosion.normalize().mult(explosionStrength);
    this.vel.add(explosion);

    // 回歸吸引力
    let attraction = p5.Vector.sub(this.origin, this.pos);
    attraction.mult(0.02);
    this.vel.add(attraction);

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