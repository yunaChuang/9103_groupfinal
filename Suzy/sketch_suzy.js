// Global variables
let doveImg;
let strokes = [];     // Array to store brush strokes
let paintingLayer;    // Graphics layer for user painting
let peaceLayer;       // Graphics layer for text
let isPainting = false; // Flag to track painting state
let bgColor = "black"; // Background color

function preload() {
  doveImg = loadImage("assets/dovefinal.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);

  setupPaintingLayer();
  setupPeaceLayer();
  setupDoveImage();
}

function setupPaintingLayer() {
  paintingLayer = createGraphics(width, height);
  paintingLayer.pixelDensity(1);
  paintingLayer.background(0, 0, 0, 0);
  paintingLayer.noStroke();
}

function setupPeaceLayer() {
  peaceLayer = createGraphics(width, height);
  peaceLayer.push();
  peaceLayer.textFont("Courier New");
  peaceLayer.textSize(200);
  peaceLayer.textAlign(CENTER, CENTER);
  peaceLayer.fill(20, 20, 20, 80);
  peaceLayer.text("DOVE OF PEACE", width/2, height/2);
  peaceLayer.pop();
}

function setupDoveImage() {
  doveImg.resize(1000, 0);
  doveImg.loadPixels();

  // Center image
  let xOffset = (width - doveImg.width) / 2;
  let yOffset = (height - doveImg.height) / 2;

  // Create brush strokes in 3 layers
  for (let layer = 0; layer < 3; layer++) {
    createBrushStrokesForLayer(layer, xOffset, yOffset);
  }
}

// Create brush strokes for a specific layer
function createBrushStrokesForLayer(layer, xOffset, yOffset) {
  for (let y = 0; y < doveImg.height; y += 4) {
    for (let x = 0; x < doveImg.width; x += 4) {
      let index = (x + y * doveImg.width) * 4;
      let r = doveImg.pixels[index];
      let g = doveImg.pixels[index + 1];
      let b = doveImg.pixels[index + 2];
      let brightness = (r + g + b) / 3;

      if (brightness > 50 && random() > 0.7) {
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

function draw() {
  background(bgColor);
  image(paintingLayer, 0, 0);
  image(peaceLayer, 0, 0);
  updateAndDisplayStrokes();
  displayInfoText();
}

function updateAndDisplayStrokes() {
  let t = millis() * 0.001;
  for (let stroke of strokes) {
    stroke.update(t);
    stroke.display();
  }
}

function displayInfoText() {
  fill("white");
  textSize(14);
  text("R - retry; S - save; Q - change background", 20, height - 20);
}

function mousePressed() {
  isPainting = true;
  addPaintMark();
}

function mouseDragged() {
  addPaintMark();
}

function mouseReleased() {
  isPainting = false;
}

function addPaintMark() {
  const cyberpunkColors = [
    color(255, 0, 128, 150),
    color(0, 255, 255, 150),
    color(255, 0, 255, 150),
    color(0, 255, 128, 150),
    color(255, 128, 0, 150),
    color(128, 0, 255, 150)
  ];

  const chars = ['0', '1', '*', '#', '@', '&', '>', '<', '|', '/'];
  let paintColor = random(cyberpunkColors);

  for (let i = 0; i < 8; i++) {
    let offsetX = random(-15, 15);
    let offsetY = random(-15, 15);
    let size = random(8, 12);
    let angle = random(-PI/4, PI/4);
    let char = random(chars);

    paintingLayer.push();
    paintingLayer.translate(mouseX + offsetX, mouseY + offsetY);
    paintingLayer.rotate(angle);

    paintingLayer.fill(paintColor);
    paintingLayer.textSize(size);
    paintingLayer.textAlign(CENTER, CENTER);
    paintingLayer.text(char, 0, 0);

    let glowColor = color(red(paintColor), green(paintColor), blue(paintColor), 30);
    paintingLayer.fill(glowColor);
    paintingLayer.textSize(size * 1.5);
    paintingLayer.text(char, 0, 0);

    paintingLayer.pop();
  }
}

class BrushStroke {
  constructor(x, y, col, layer) {
    this.origin = createVector(x, y);
    this.pos = createVector(x, y);
    this.color = col;
    this.originalColor = col;
    this.layer = layer;
    this.seed = random(1000);
    this.length = random(3, 10 + layer * 2);
    this.width = random(3, 8 + layer);
    this.angle = random(PI);
    this.alpha = random(150, 220);
    this.targetPos = createVector(x, y);
    this.recoverySpeed = random(0.02, 0.05);
    this.isAffected = false;
    this.isExploding = false;
    this.velocity = createVector(0, 0);
    this.cyberpunkColor = null;
  }

  generateCyberpunkColor() {
    const colors = [
      color(255, 0, 128),
      color(0, 255, 255),
      color(255, 0, 255),
      color(0, 255, 128),
      color(255, 128, 0),
      color(128, 0, 255)
    ];
    return random(colors);
  }

  update(time) {
    if (mouseIsPressed && !this.isExploding) {
      let mouseDist = dist(mouseX, mouseY, this.origin.x, this.origin.y);
      if (mouseDist < 25) {
        this.isExploding = true;
        this.cyberpunkColor = this.generateCyberpunkColor();
        let toMouse = createVector(mouseX - this.origin.x, mouseY - this.origin.y);
        let tangent = createVector(-toMouse.y, toMouse.x).normalize();
        this.velocity = tangent.mult(random(3, 8));
      }
    }

    if (this.isExploding) {
      this.pos.add(this.velocity);
      this.velocity.mult(0.95);

      if (this.velocity.mag() < 0.1) {
        this.pos.lerp(this.targetPos, this.recoverySpeed);
        if (p5.Vector.dist(this.pos, this.targetPos) < 1) {
          this.isExploding = false;
          this.isAffected = false;
          this.cyberpunkColor = null;
        }
      }
    } else {
      this.pos.lerp(this.targetPos, this.recoverySpeed);
    }
  }

  display() {
    noStroke();
    if (this.isExploding && this.cyberpunkColor) {
      fill(this.cyberpunkColor);
    } else {
      fill(255, 255, 255, this.alpha);
    }
    push();
    translate(this.pos.x, this.pos.y);
    ellipse(0, 0, this.length, this.width);
    pop();
  }
}

function keyPressed() {
  if (key === 'r' || key === 'R') {
    clearPaintingLayer();
    bgColor = "black";
  }
  if (key === 's' || key === 'S') {
    saveCanvas('peace_artwork', 'png');
    return false;
  }
  if (key === 'q' || key === 'Q') {
    const colors = [
      color(20, 20, 40),
      color(40, 20, 40),
      color(20, 40, 40),
      color(40, 20, 20),
      color(20, 40, 20),
      color(30, 30, 30)
    ];
    bgColor = random(colors);
  }
}

function clearPaintingLayer() {
  paintingLayer.clear();
  paintingLayer.background(0, 0, 0, 0);
}
