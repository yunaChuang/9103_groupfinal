let doveImg;
let dots = [];
let dotColor;
let trail = [];

function preload() {
  doveImg = loadImage("assets/dovefinal.png");
  song = loadSound('assets/piano-loops-093-effect-120-bpm.wav');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  doveImg.resize(1000, 0);
  doveImg.loadPixels();

  // 初始化点阵
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

  dotColor = color(0); // 初始颜色为黑色
  noStroke();
}

function draw() {
  background(255);

  let mouse = createVector(mouseX, mouseY);

  // 更新并绘制点
  fill(dotColor);
  for (let dot of dots) {
    dot.update(mouse);
    dot.display();
  }

  // 显示鼠标轨迹（墨迹线）
  noFill();
  stroke(0, 30);
  beginShape();
  for (let v of trail) {
    vertex(v.x, v.y);
  }
  endShape();

  // 限制轨迹长度
  if (mouseIsPressed) {
    trail.push(createVector(mouseX, mouseY));
    if (trail.length > 80) {
      trail.shift();
    }
  }

  // 提示文字
  noStroke();
  fill(80);
  textSize(14);
  text("Move the mouse to interact with the dove.\nClick to change dot color.", 20, height - 40);
}

// 鼠标点击时更换颜色
function mousePressed() {
  dotColor = color(random(50, 100), random(50, 100), random(150, 255));
}

// Dot 类
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
      dir.setMag(1.4);
      this.vel.add(dir);
    }

    this.vel.mult(0.9);
    this.pos.add(this.vel);

    let back = p5.Vector.sub(this.origin, this.pos);
    back.mult(0.03);
    this.pos.add(back);
  }

  display() {
    ellipse(this.pos.x, this.pos.y, 2.8, 2.8);
  }
}
