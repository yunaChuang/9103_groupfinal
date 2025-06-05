let doveImg;
let dots = [];
let dotColor;
let trail = [];
let pressStartTime = 0;
let shakingMultiplier = 1;

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
      let b = (doveImg.pixels[i] + doveImg.pixels[i + 1] + doveImg.pixels[i + 2]) / 3;
      if (b < 50) {
        dots.push(new Dot(x + xOffset, y + yOffset));
      }
    }
  }

  dotColor = color(0);
}

function draw() {
  background(255);
  let mouse = createVector(mouseX, mouseY);

  // 鼠标长按抖动增强
  if (mouseIsPressed) {
    shakingMultiplier = map(millis() - pressStartTime, 0, 2000, 1, 6, true);
  } else {
    shakingMultiplier = 1;
  }

  fill(dotColor);
  for (let dot of dots) {
    dot.update(mouse);
    dot.display();
  }

  // 水墨轨迹
  noFill();
  stroke(0, 30);
  beginShape();
  for (let v of trail) {
    vertex(v.x, v.y);
  }
  endShape();

  if (mouseIsPressed) {
    trail.push(createVector(mouseX, mouseY));
    if (trail.length > 100) trail.shift();
  }

  fill(80);
  noStroke();
  text("⬅️ Move the mouse\n🖱️ Hold to increase shaking\n🖱️ Double click to scatter", 20, height - 60);
}

function mousePressed() {
  pressStartTime = millis();
}

function doubleClicked() {
  for (let dot of dots) {
    let angle = random(TWO_PI);
    let force = p5.Vector.fromAngle(angle).mult(random(3, 8));
    dot.vel.add(force);
  }
}

class Dot {
  constructor(x, y) {
    this.origin = createVector(x, y);
    this.pos = this.origin.copy();
    this.vel = createVector(0, 0);
  }

  update(mouseVec) {
    let dir = p5.Vector.sub(this.pos, mouseVec);
    let d = dir.mag();

    if (d < 80 && mouseIsPressed) {
      dir.setMag(0.7 * shakingMultiplier);
      this.vel.add(dir);
    }

    this.vel.mult(0.88);
    this.pos.add(this.vel);

    let back = p5.Vector.sub(this.origin, this.pos);
    back.mult(0.03);
    this.pos.add(back);
  }

  display() {
    ellipse(this.pos.x, this.pos.y, 2.5);
  }
}
