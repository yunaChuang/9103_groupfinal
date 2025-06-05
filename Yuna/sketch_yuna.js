let doveImg;
let dots = [];
let song;
let speedSound;
let analyser;
let fft;
let numBins = 256;
let smoothSound = 0.8;
let speedPlayed = false;

function preload() {
  doveImg = loadImage("assets/dovefinal.png");
  song = loadSound("assets/piano-loops-093-effect-120-bpm.wav");
  speedSound = loadSound("assets/alien.wav");
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

  analyser = new p5.Amplitude();
  analyser.setInput(song);

  fft = new p5.FFT(smoothSound, numBins);
  song.connect(fft);
  song.loop();

  noStroke();
}

function draw() {
  background(255);

  // Draw dove dots
  fill(0);
  for (let dot of dots) {
    dot.update(0);
    dot.display();
  }

  // Instruction text
  fill(100);
  textSize(14);
  text("Click once to trigger speed sound.", 20, height - 20);

  // Audio analysis
  let amplitude = fft.getEnergy(20, 20000);
  let spectrum = fft.analyze();

  let minDimension = min(width, height);
  let circleRadius = minDimension / 5;
  let maxRectLength = (minDimension * 2) / 5;

  // Move origin to center for circular spectrum
  push();
  translate(width / 2, height / 2);

  for (let i = 0; i < spectrum.length; i++) {
    let angle = map(i, 0, spectrum.length, 0, TWO_PI);
    let rectHeight = map(spectrum[i], 0, 255, 0, maxRectLength);

    push();
    rotate(angle);
    fill(map(i, 0, spectrum.length, 0, 255), 200, 0);
    rect(0, circleRadius, width / spectrum.length, rectHeight);
    pop();
  }

  // Central yellow ellipse pulsing with amplitude
  let innerCircleSize = map(amplitude, 0, 255, circleRadius / 5, circleRadius);
  fill(255, 200, 0);
  ellipse(0, 0, innerCircleSize * 3);

  pop(); // restore origin
}

function mousePressed() {
  if (!speedPlayed) {
    speedSound.play();
    speedPlayed = true;
  }
}

class Dot {
  constructor(x, y) {
    this.base = createVector(x, y);
    this.pos = this.base.copy();
    this.vel = createVector(0, 0);
  }

  update(globalOffsetX) {
    this.vel.mult(0.9);
    this.pos.add(this.vel);

    let target = createVector(this.base.x + globalOffsetX, this.base.y);
    let restoringForce = p5.Vector.sub(target, this.pos).mult(0.04);
    this.pos.add(restoringForce);
  }

  display() {
    ellipse(this.pos.x, this.pos.y, 2.8, 2.8);
  }
}