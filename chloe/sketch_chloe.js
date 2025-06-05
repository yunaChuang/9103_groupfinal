let doveImg;
let dots = [];

function preload() {
  // Load the dove image 
  doveImg = loadImage("assets/dovefinal.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1); // Use 1 display pixel per canvas pixel for accuracy

  // Resize image to width = 1000px, height auto-calculated
  doveImg.resize(1000, 0);
  doveImg.loadPixels();

  // Center the image on the canvas
  let xOffset = (width - doveImg.width) / 2;
  let yOffset = (height - doveImg.height) / 2;

  // Loop through image pixels and place a dot where it's dark
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
   let t = frameCount * 0.02 + this.pos.y * 0.005;

   // 讓灰階值在 50~200 之間擺動
   let gray = 125 + 75 * sin(t);

  fill(gray);
  ellipse(this.pos.x, this.pos.y, 2.8, 2.8);
  }
}
