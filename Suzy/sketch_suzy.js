let doveImg;
let isCyber = false;
let dots = [];
let cyberChars = [];
let chars = ['π', 'Σ', '∞', '@', '#', '*', '%', '&'];
let ripples = [];
let xOffset, yOffset;

function preload() {
  doveImg = loadImage("assets/dovefinal.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont('monospace');
  textAlign(CENTER, CENTER);
  doveImg.resize(1000, 0);
  doveImg.loadPixels();

  xOffset = (width - doveImg.width) / 2;
  yOffset = (height - doveImg.height) / 2;

  for (let y = 0; y < doveImg.height; y += 6) {
    for (let x = 0; x < doveImg.width; x += 6) {
      let index = (x + y * doveImg.width) * 4;
      let r = doveImg.pixels[index];
      let g = doveImg.pixels[index + 1];
      let b = doveImg.pixels[index + 2];
      let brightness = (r + g + b) / 3;
      if (brightness < 50) {
        let px = x + xOffset;
        let py = y + yOffset;
        dots.push(new Dot(px, py));
        cyberChars.push(new CyberChar(px, py));
      }
    }
  }
}

function draw() {
  if (!isCyber) {
    background(255);
    let mouse = createVector(mouseX, mouseY);
    for (let dot of dots) {
      dot.update(mouse);
      dot.display();
    }
    fill(100);
    textSize(14);
    text("Drag to interact | Click to enter CYBER mode", 20, height - 20);
  } else {
    background(10, 10, 20);
    let dx = map(mouseX, 0, width, -40, 40);

    for (let c of cyberChars) {
      c.update(dx);
      c.display();
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
    text("Click = ripple + explosion | Mouse X = sway", width / 2, height - 20);
  }
}

function mousePressed() {
  if (!isCyber) {
    isCyber = true;
    for (let c of cyberChars) {
      let angle = random(TWO_PI);
      let force = p5.Vector.fromAngle(angle).mult(random(3, 5));
      c.vel.add(force);
    }
    ripples.push(new Ripple(mouseX, mouseY));
  } else {
    for (let c of cyberChars) {
      let angle = random(TWO_PI);
      let force = p5.Vector.fromAngle(angle).mult(random(3, 5));
      c.vel.add(force);
    }
    ripples.push(new Ripple(mouseX, mouseY));
  }
}

// ------- Dot class (original) -------
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
      dir.setMag(1.2);
      this.vel.add(dir);
    }
    this.vel.mult(0.9);
    this.pos.add(this.vel);
    let back = p5.Vector.sub(this.origin, this.pos);
    back.mult(0.03);
    this.pos.add(back);
  }

  display() {
    fill(0);
    ellipse(this.pos.x, this.pos.y, 2.8, 2.8);
  }
}

// ------- CyberChar class -------
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
    let restoring = p5.Vector.sub(target, this.pos).mult(0.08); // 更快回弹
    this.pos.add(restoring);
  }

  display() {
    let alpha = map(sin(frameCount * 0.05 + this.brightnessOffset), -1, 1, 100, 255);
    stroke(0, 255, 0, alpha * 0.4);
    strokeWeight(2);
    fill(0, 255, 0, alpha);
    textSize(12);
    text(this.char, this.pos.x, this.pos.y);
  }
}

// ------- Ripple class -------
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
