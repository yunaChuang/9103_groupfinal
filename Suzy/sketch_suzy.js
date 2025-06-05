let doveImg;
let dots = [];
let xOffsetGlobal = 0;

function preload() {
  doveImg = loadImage("assets/dovefinal.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  doveImg.resize(1000, 0);
  doveImg.loadPixels();

  let xOffset = (width - doveImg.width) / 2;
  let yOffset = (height - doveImg.height) / 2;

  for (let y = 0; y < doveImg.height; y += 3) {
    for (let x = 0; x < doveImg.width; x += 3) {
      let i = (x + y * doveImg.width) * 4;
      let brightness = (doveImg.pixels[i] + doveImg.pixels[i + 1] + doveImg.pixels[i + 2]) / 3;
      if (brightness < 50) {
        dots.push(new Dot(x + xOffset, y + yOffset));
      }
    }
  }
}

function draw() {
  background(255);

  // 根据鼠标 X 的相对位置控制整个点阵左右偏移
  let dx = map(mouseX, 0, width, -40, 40);
  xOffsetGlobal = lerp(xOffsetGlobal, dx, 0.05); // 平滑过渡

  fill(0);
  noStroke();

  for (let dot of dots) {
    dot.update(xOffsetGlobal);
    dot.display();
  }

  fill(100);
  textSize(14);
  text("Move mouse left/right to sway. Click to scatter.", 20, height - 20);
}

function mousePressed() {
  // 单击触发“爆炸”：所有粒子获得随机速度
  for (let dot of dots) {
    let angle = random(TWO_PI);
    let force = p5.Vector.fromAngle(angle).mult(random(3, 6));
    dot.vel.add(force);
  }
}

class Dot {
  constructor(x, y) {
    this.base = createVector(x, y);
    this.pos = this.base.copy();
    this.vel = createVector(0, 0);
  }

  update(globalOffsetX) {
    this.vel.mult(0.9); // 摩擦
    this.pos.add(this.vel);

    // 返回原位置 + 左右全局偏移
    let target = createVector(this.base.x + globalOffsetX, this.base.y);
    let restoringForce = p5.Vector.sub(target, this.pos).mult(0.04);
    this.pos.add(restoringForce);
  }

  display() {
    ellipse(this.pos.x, this.pos.y, 2.5);
  }
}
