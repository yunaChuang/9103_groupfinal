// === Cyber Dove – Discrete Click + Direct Point Disruption ===
let doveImg;
let cyberDots = [];
let isCyber = false;
let lastClick = 0;
let clickFlash = 0;

function preload() {
  doveImg = loadImage("assets/dovefinal.png");
  song = loadSound('assets/piano-loops-093-effect-120-bpm.wav');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  textFont("monospace");
  textAlign(CENTER, CENTER);

  doveImg.resize(1000, 0);
  doveImg.loadPixels();
  let xOffset = (width - doveImg.width) / 2;
  let yOffset = (height - doveImg.height) / 2;

  for (let y = 0; y < doveImg.height; y += 3) {
    for (let x = 0; x < doveImg.width; x += 3) {
      let idx = (x + y * doveImg.width) * 4;
      let r = doveImg.pixels[idx];
      let g = doveImg.pixels[idx + 1];
      let b = doveImg.pixels[idx + 2];
      let brightness = (r + g + b) / 3;
      if (brightness < 50) {
        cyberDots.push(new CyberDot(x + xOffset, y + yOffset));
      }
    }
  }
}

function draw() {
  if (isCyber) {
    background(10, 10, 20);
    for (let d of cyberDots) {
      d.update();
      d.display();
    }
    fill(180);
    textSize(14);
    text("Drag or click on the dove to disrupt it. Double-click to reset.", width / 2, height - 20);
  } else {
    background(255);
    for (let d of cyberDots) {
      d.displayDot();
    }
    if (clickFlash > 0) {
      fill(0, 0, 0, clickFlash);
      rect(0, 0, width, height);
      clickFlash -= 8;
    }
    fill(0);
    textSize(14);
    text("Click to enter cyber mode.", width / 2, height - 20);
  }
}

function mousePressed() {
  let now = millis();
  if (now - lastClick < 300) {
    isCyber = false;
    for (let d of cyberDots) {
      d.broken = false;
      d.vel.mult(0);
      d.pos = d.origin.copy();
    }
  } else {
    isCyber = true;
    clickFlash = 100;
  }
  lastClick = now;

  if (isCyber) {
    // Click-based disruption of nearby points (direct blast)
    for (let d of cyberDots) {
      let distToMouse = dist(mouseX, mouseY, d.pos.x, d.pos.y);
      if (distToMouse < 60) {
        d.broken = true;
        let angle = random(TWO_PI);
        let mag = random(1.5, 2.5);
        d.vel.add(p5.Vector.fromAngle(angle).mult(mag));
      }
    }
  }
}

function mouseDragged() {
  if (isCyber) {
    for (let d of cyberDots) {
      let randOffset = random(0.5, 1.5);
      let distToMouse = dist(mouseX + random(-30, 30), mouseY + random(-30, 30), d.pos.x, d.pos.y);
      if (distToMouse < 40 * randOffset) {
        d.broken = true;
        let angle = random(TWO_PI);
        let mag = random(0.5, 1.5);
        d.vel.add(p5.Vector.fromAngle(angle).mult(mag));
      }
    }
  }
}

class CyberDot {
  constructor(x, y) {
    this.origin = createVector(x, y);
    this.pos = this.origin.copy();
    this.vel = createVector(0, 0);
    this.broken = false;
    this.char = random(['π', '∞', 'Σ', '#', '*', '%', '&']);
    this.brightnessOffset = random(1000);
  }

  update() {
    this.vel.mult(0.88);
    this.pos.add(this.vel);
    let back = p5.Vector.sub(this.origin, this.pos).mult(0.07);
    this.pos.add(back);
  }

  display() {
    if (this.broken && isCyber) {
      let flicker = map(sin(frameCount * 0.1 + this.brightnessOffset), -1, 1, 100, 180);
      fill(128, 255, 128, flicker);
      noStroke();
      textSize(11);
      text(this.char, this.pos.x, this.pos.y);
    } else if (isCyber) {
      fill(40);
      noStroke();
      ellipse(this.pos.x, this.pos.y, 2.8);
    }
  }

  displayDot() {
    fill(0);
    noStroke();
    ellipse(this.pos.x, this.pos.y, 2.8, 2.8);
  }
}
