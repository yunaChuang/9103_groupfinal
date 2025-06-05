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

  for (let y = 0; y < doveImg.height; y += 4) {
    for (let x = 0; x < doveImg.width; x += 4) {
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
}

function draw() {
  background(255);
  let t = millis() * 0.001;

  for (let dot of dots) {
    dot.update(t);
    dot.display();
  }

  fill(100);
  textSize(14);
  text("Perlin Noise Driven Flow (clear outline)", 20, height - 20);
}

class Dot {
  constructor(x, y) {
    this.origin = createVector(x, y);
    this.pos = this.origin.copy();
    this.seed = random(1000);  // 每个点独立的随机种子
  }

  update(time) {
    // 使用 Perlin 噪声生成扰动角度
    let noiseVal = noise(this.origin.x * 0.002, this.origin.y * 0.002, time * 0.5 + this.seed);
    let angle = noiseVal * TWO_PI * 2; // 两圈以内
    let radius = 5; // 扰动范围不大，保持轮廓清晰
    this.pos.x = this.origin.x + cos(angle) * radius;
    this.pos.y = this.origin.y + sin(angle) * radius;
  }

  display() {
    // 渐变颜色：从上方蓝色 (#3b82f6) 到下方紫色 (#a855f7)
    let gradientRatio = constrain(this.pos.y / height, 0, 1);
    let r = lerp(59, 168, gradientRatio);
    let g = lerp(130, 85, gradientRatio);
    let b = lerp(246, 247, gradientRatio);
    fill(r, g, b);
    ellipse(this.pos.x, this.pos.y, 2.2, 2.2);
  }
}


