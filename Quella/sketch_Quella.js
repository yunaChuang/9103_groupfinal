let doveImg;
let dots = [];
let song;

function preload() {
  doveImg = loadImage("assets/dovefinal.png");
  song = loadSound('assets/piano-loops-093-effect-120-bpm.wav');
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

  if (song) song.loop(); // 背景音乐循环播放
}

function draw() {
  background(255);
  let mouse = createVector(mouseX, mouseY);

  for (let dot of dots) {
    dot.update(mouse);
    dot.display();
  }

  fill(100);
  textSize(14);
  text("Drag the mouse to animate the dove lines!", 20, height - 20);
}

class Dot {
  constructor(x, y) {
    this.origin = createVector(x, y);
    this.pos = this.origin.copy();
    this.vel = createVector(0, 0);
    this.noiseOffsetX = random(1000);
    this.noiseOffsetY = random(1000);
  }

  update(mouseVec) {
    let dir = p5.Vector.sub(this.pos, mouseVec);
    let d = dir.mag();

    if (d < 80 && mouseIsPressed) {
      dir.setMag(1.2);
      this.vel.add(dir);
    }

    // Perlin 噪声轻扰动，即使没有鼠标交互也能动态变化
    let nX = noise(this.noiseOffsetX + frameCount * 0.005);
    let nY = noise(this.noiseOffsetY + frameCount * 0.005);
    let jitter = createVector(nX - 0.5, nY - 0.5).mult(0.6);
    this.vel.add(jitter);

    this.vel.mult(0.9); 
    this.pos.add(this.vel);

    let back = p5.Vector.sub(this.origin, this.pos).mult(0.03);
    this.pos.add(back);
  }

  display() {
    ellipse(this.pos.x, this.pos.y, 2.8, 2.8);
  }
}
