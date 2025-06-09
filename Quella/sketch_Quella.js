let doveImg;
let strokes = [];

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

  for (let layer = 0; layer < 3; layer++) {
    for (let y = 0; y < doveImg.height; y += 4) {
      for (let x = 0; x < doveImg.width; x += 4) {
        let i = (x + y * doveImg.width) * 4;
        let r = doveImg.pixels[i];
        let g = doveImg.pixels[i + 1];
        let b = doveImg.pixels[i + 2];
        let bright = (r + g + b) / 3;
        if (bright > 50 && random() > 0.7) {
          strokes.push(new BrushStroke(
            x + xOffset + random(-2, 2),
            y + yOffset + random(-2, 2),
            color(r, g, b),
            layer
          ));
        }
      }
    }
  }
}

function draw() {
  background(0);
  let t = millis() * 0.001;
  for (let s of strokes) {
    s.update(t);
    s.display();
  }

  fill(255);
  textSize(14);
  text("Perlin Noise Driven Flow + Ink Effect", 20, height - 20);
}

class BrushStroke {
  constructor(x, y, c, layer) {
    this.origin = createVector(x, y);
    this.pos = this.origin.copy();
    this.color = c;
    this.layer = layer;
    this.seed = random(1000);
    this.length = random(3, 10 + layer * 2);
    this.width = random(3, 8 + layer);
    this.angle = random(PI);
    this.alpha = random(150, 220);
    this.target = this.origin.copy();
    this.recoverSpeed = random(0.02, 0.05);
    this.affected = false;
    this.inInkMode = false;
  }

  update(t) {
    let d = dist(mouseX, mouseY, this.origin.x, this.origin.y);
    if (d < 60) {
      this.affected = true;
      this.inInkMode = true;

      let offset = p5.Vector.sub(createVector(mouseX, mouseY), this.origin);
      this.pos.x = mouseX + cos(t * 2 + this.seed) * offset.mag();
      this.pos.y = mouseY + sin(t * 2 + this.seed) * offset.mag();
      this.angle = atan2(mouseY - this.pos.y, mouseX - this.pos.x) + HALF_PI;
    } else if (this.affected) {
      this.pos.lerp(this.target, this.recoverSpeed);
      if (p5.Vector.dist(this.pos, this.target) < 1) {
        this.affected = false;
        this.inInkMode = false;
      }
      this.angle = lerp(this.angle, noise(t * 0.3 + this.seed) * TWO_PI, 0.05);
    } else {
      let n = noise(this.origin.x * 0.005, this.origin.y * 0.005, t * 0.3 + this.seed);
      this.angle = n * TWO_PI * 2;
      let r = 3 + this.layer * 2;
      this.pos.x = this.origin.x + cos(this.angle) * r;
      this.pos.y = this.origin.y + sin(this.angle) * r;
    }
  }

  display() {
    let r, g, b;

    if (this.inInkMode) {
      let n = noise(this.pos.x * 0.01, this.pos.y * 0.01, frameCount * 0.01);
      let randomBlack = random() > 0.5;
      let gray = n * 255;

      if (randomBlack) {
        r = g = b = gray * 0.2 + random(10, 30); // 偏黑墨迹
      } else {
        r = g = b = gray * 0.9 + random(20, 40); // 偏白墨迹
      }
    } else {
      r = constrain(red(this.color) + random(-20, 20), 0, 255);
      g = green(this.color);
      b = constrain(blue(this.color) + random(-20, 20), 0, 255);
    }

    noStroke();
    fill(r, g, b, this.alpha);
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.angle);
    ellipse(0, 0, this.length, this.width);
    pop();
  }
}


