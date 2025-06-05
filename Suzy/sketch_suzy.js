let doveImg;
let chars = ['π', 'Σ', '∞', '@', '#', '*', '%', '&','^',"$",'¥','=','!','?'];
let points = [];
let ripples = [];
let xOffsetGlobal = 0;

function preload() {
  doveImg = loadImage("assets/dovefinal.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont('monospace');
  textAlign(CENTER, CENTER);
  doveImg.resize(1000, 0);
  doveImg.loadPixels();

  let xOffset = (width - doveImg.width) / 2;
  let yOffset = (height - doveImg.height) / 2;

  for (let y = 0; y < doveImg.height; y += 6) {
    for (let x = 0; x < doveImg.width; x += 6) {
      let i = (x + y * doveImg.width) * 4;
      let brightness = (doveImg.pixels[i] + doveImg.pixels[i + 1] + doveImg.pixels[i + 2]) / 3;
      if (brightness < 50) {
        points.push(new CyberChar(x + xOffset, y + yOffset));
      }
    }
  }
}

function draw() {
  background(10, 10, 20); // 深色背景

  // 鼠标 X 控制整体偏移
  let dx = map(mouseX, 0, width, -40, 40);
  xOffsetGlobal = lerp(xOffsetGlobal, dx, 0.05);

  for (let p of points) {
    p.update(xOffsetGlobal);
    p.display();
  }

  for (let i = ripples.length - 1; i >= 0; i--) {
    ripples[i].update();
    ripples[i].display();
    if (ripples[i].isFinished()) {
      ripples.splice(i, 1);
    }
  }

  fill(80, 255, 80);
  textSize(14);
  text("Click = ripple + scatter | Move mouse = dove sways", width / 2, height - 20);
}

function mousePressed() {
  for (let p of points) {
    let angle = random(TWO_PI);
    let force = p5.Vector.fromAngle(angle).mult(random(3, 5));
    p.vel.add(force);
  }
  ripples.push(new Ripple(mouseX, mouseY));
}

class CyberChar {
  constructor(x, y) {
    this.base = createVector(x, y);
    this.pos = this.base.copy();
    this.vel = createVector(0, 0);
    this.char = random(chars);
    this.brightnessOffset = random(1000);
  }

  update(globalOffsetX) {
    this.vel.mult(0.9);
    this.pos.add(this.vel);
    let target = createVector(this.base.x + globalOffsetX, this.base.y);
    let restoring = p5.Vector.sub(target, this.pos).mult(0.08); // 回弹速度加快
    this.pos.add(restoring);
  }

  display() {
    let alpha = map(sin(frameCount * 0.05 + this.brightnessOffset), -1, 1, 100, 255);
    stroke(0, 255, 0, alpha * 0.4); // 荧光绿发光
    strokeWeight(2);
    fill(0, 255, 0, alpha);
    textSize(12);
    text(this.char, this.pos.x, this.pos.y);
  }
}

class Ripple {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 0;
    this.opacity = 180;
  }

  update() {
    this.radius += 6;
    this.opacity -= 4;
  }

  display() {
    noFill();
    stroke(0, 255, 0, this.opacity);
    strokeWeight(1.8);
    ellipse(this.x, this.y, this.radius * 2);
  }

  isFinished() {
    return this.opacity <= 0;
  }
}
