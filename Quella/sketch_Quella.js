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

  let xOff = (width - doveImg.width) / 2;
  let yOff = (height - doveImg.height) / 2;

  for (let l = 0; l < 3; l++) {
    for (let y = 0; y < doveImg.height; y += 4) {
      for (let x = 0; x < doveImg.width; x += 4) {
        let i = (x + y * doveImg.width) * 4;
        let r = doveImg.pixels[i];
        let g = doveImg.pixels[i + 1];
        let b = doveImg.pixels[i + 2];
        let bright = (r + g + b) / 3;

        if (bright > 50 && random() > 0.7) {
          let c = color(
            constrain(r + random(-20, 20), 0, 255),
            constrain(g + random(-15, 15), 0, 255),
            constrain(b + random(-20, 20), 0, 255)
          );
          strokes.push(new BrushStroke(
            x + xOff + random(-3, 3),
            y + yOff + random(-3, 3),
            c,
            l
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
    s.show();
  }

  fill(255);
  textSize(14);
  text("Perlin + Random Ink Motion", 20, height - 20);
}

class BrushStroke {
  constructor(x, y, c, l) {
    this.origin = createVector(x, y);
    this.pos = this.origin.copy();
    this.col = c;
    this.lay = l;
    this.seed = random(1000);
    this.len = random(5, 13 + l * 2);
    this.wid = random(3, 10 + l);
    this.a = random(TWO_PI);
    this.alpha = random(120, 230);
    this.back = this.origin.copy();
    this.backSpeed = random(0.02, 0.05);
    this.hit = false;
    this.ink = false;
    this.jitter = random(0.5, 1.5);
  }

  update(t) {
    let d = dist(mouseX, mouseY, this.origin.x, this.origin.y);

    if (d < 60) {
      this.hit = true;
      this.ink = true;
      let diff = createVector(mouseX - this.origin.x, mouseY - this.origin.y);
      this.pos.x = mouseX + cos(t * 2 + this.seed) * diff.mag();
      this.pos.y = mouseY + sin(t * 2 + this.seed) * diff.mag();
      this.a = atan2(mouseY - this.pos.y, mouseX - this.pos.x) + HALF_PI;
    } else if (this.hit) {
      this.pos.lerp(this.back, this.backSpeed);
      if (dist(this.pos.x, this.pos.y, this.back.x, this.back.y) < 1) {
        this.hit = false;
        this.ink = false;
      }
      this.a = lerp(this.a, noise(t * 0.3 + this.seed) * TWO_PI, 0.05);
    } else {
      let n = noise(this.origin.x * 0.005, this.origin.y * 0.005, t * 0.3 + this.seed);
      this.a = n * TWO_PI * 2 + random(-0.05, 0.05);
      let r = 3 + this.lay * 2;
      this.pos.x = this.origin.x + cos(this.a) * r + random(-this.jitter, this.jitter);
      this.pos.y = this.origin.y + sin(this.a) * r + random(-this.jitter, this.jitter);
    }
  }

  show() {
    let r, g, b;
    if (this.ink) {
      let n = noise(this.pos.x * 0.01, this.pos.y * 0.01, frameCount * 0.01);
      let gray = n * 255;
      if (random() > 0.5) {
        r = g = b = gray * 0.2 + random(10, 30);
      } else {
        r = g = b = gray * 0.9 + random(20, 40);
      }
    } else {
      r = constrain(red(this.col) + random(-5, 5), 0, 255);
      g = constrain(green(this.col) + random(-4, 4), 0, 255);
      b = constrain(blue(this.col) + random(-5, 5), 0, 255);
    }

    let a = constrain(this.alpha + random(-10, 10), 80, 255);

    noStroke();
    fill(r, g, b, a);
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.a);
    ellipse(0, 0, this.len, this.wid);
    pop();
  }
}





