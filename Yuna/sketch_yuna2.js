let doveImg;
let dots = [];
let cyberDots = [];
let isCyber = false;

let song;
let fft, analyser;
let speedSound;
let speedPlayed = false;
let spectrumHistory = [];
const delayFrames = 60;

function preload() {
  doveImg = loadImage("assets/dovefinal.png");
  speedSound = loadSound("assets/alien.wav");
  song = loadSound("assets/piano-loops-093-effect-120-bpm.wav");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  doveImg.resize(1000, 0);
  doveImg.loadPixels();

  let xOffset = (width - doveImg.width) / 2;
  let yOffset = (height - doveImg.height) / 2;

  for (let y = 0; y < doveImg.height; y += 7) {
    for (let x = 0; x < doveImg.width; x += 7) {
      let idx = (x + y * doveImg.width) * 4;
      let r = doveImg.pixels[idx];
      let g = doveImg.pixels[idx + 1];
      let b = doveImg.pixels[idx + 2];
      let brightness = (r + g + b) / 3;

      if (brightness < 50) {
        let px = x + xOffset;
        let py = y + yOffset;
        dots.push(new Dot(px, py));
        cyberDots.push(new CyberDot(px, py));
      }
    }
  }

  analyser = new p5.Amplitude();
  analyser.setInput(song);

  fft = new p5.FFT(0.8, 64);
  song.connect(fft);

  noStroke();
}

function draw() {
  background(isCyber ? 0 : 255);
  let mouse = createVector(mouseX, mouseY);

  if (isCyber) {
    for (let d of cyberDots) {
      d.update();
      d.display();
    }
  } else {
    for (let d of dots) {
      d.update(mouse);
      d.display();
    }
  }

  // === AMPLITUDE-BASED MACHINES ===
  let amp = analyser.getLevel();
  let ellipseSize = map(amp, 0.3, 0.4, 80, 200);

  if (isCyber) {
    fill(0, 255, 240, 120);
  } else {
    fill(255, 50, 50, 100);
  }

  circle(width, (height - ellipseSize) / 2, ellipseSize*2);
  ellipse(width / 2, (height - ellipseSize) / 2, ellipseSize / 2);
  ellipse(width / 4, height, ellipseSize / 2);

  if (isCyber) {
    fill(100, 250, 205, 100);
  } else {
    fill(255, 50, 200, 100);
  }

  ellipse(0, (height - ellipseSize) / 2, 200 - ellipseSize);
  ellipse((width * 3) / 4, height + 10, ellipseSize / 2);

  // === FREQUENCY-BASED CIRCLES ===
  let currentSpectrum = fft.analyze();
  let spectrum = currentSpectrum;
  let circleCount = 20;
  let step = Math.floor(spectrum.length / circleCount);

  for (let i = 0; i < circleCount; i++) {
    let index = i * step;
    let freqValue = spectrum[index];

    let angle = map(i, 0, circleCount, 0, TWO_PI);
    let radius = map(freqValue, 0, 255, ellipseSize, ellipseSize + 80);
    let cx = width / 2 + cos(angle) * radius;
    let cy = height / 2 + sin(angle) * radius;

    let r = map(freqValue, 0, 255, 255, 70);
    let g = 0;
    let b = map(freqValue, 0, 255, 100, 200);

    fill(r, g, b, 100);
    ellipse(cx, cy, 50 + freqValue * 0.15);
  }

  // === DELAYED FREQUENCY-BASED CIRCLES ===
  spectrumHistory.push(currentSpectrum);
  if (spectrumHistory.length > delayFrames) {
    spectrumHistory.shift();
  }

  let spectrumDelay = spectrumHistory.length >= delayFrames ? spectrumHistory[0] : currentSpectrum;
  for (let i = 0; i < circleCount; i++) {
    let index = i * step;
    let freqValue = spectrumDelay[index];

    let angle = map(i, 0, circleCount, 0, TWO_PI);
    let radius = map(freqValue, 0, 255, ellipseSize, ellipseSize + 80);
    let cx = width / 2 + cos(angle) * radius * 2;
    let cy = height / 2 + sin(angle) * radius;

    let r = map(freqValue, 0, 255, 255, 70);
    let g = 0;
    let b = map(freqValue, 0, 255, 100, 200);

    fill(r, g, b, 250);
    ellipse(cx, cy, 10 + freqValue * 0.15);
  }

  fill(isCyber ? 200 : 50);
  textSize(14);
  text(
    isCyber
      ? "Cyber Mode: Hold mouse for green particles + speed sound"
      : "Click to play music. Hold mouse for cyber mode",
    width / 2,
    height - 20
  );
}

function mousePressed() {
  if (!song.isPlaying()) {
    song.loop();
  }

  isCyber = true;

  for (let d of cyberDots) {
    let angle = random(TWO_PI);
    let mag = random(2, 4);
    d.vel = p5.Vector.fromAngle(angle).mult(mag);
  }

  if (!speedPlayed) {
    speedSound.play();
    speedPlayed = true;
  }
}

function mouseReleased() {
  isCyber = false;
  speedPlayed = false;

  if (speedSound.isPlaying()) {
    speedSound.stop();
  }

  for (let d of cyberDots) {
    d.pos = d.origin.copy();
    d.vel.set(0, 0);
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
      dir.setMag(1.2);
      this.vel.add(dir);
    }

    this.vel.mult(0.9);
    this.pos.add(this.vel);

    let back = p5.Vector.sub(this.origin, this.pos).mult(0.03);
    this.pos.add(back);
  }

  display() {
    fill(128, 70, 240);
    ellipse(this.pos.x, this.pos.y, 2.8, 2.8);
  }
}

class CyberDot {
  constructor(x, y) {
    this.origin = createVector(x, y);
    this.pos = this.origin.copy();
    this.vel = createVector(0, 0);
  }

  update() {
    this.vel.mult(0.8);
    this.pos.add(this.vel);
    let back = p5.Vector.sub(this.origin, this.pos).mult(0.07);
    this.pos.add(back);
  }

  display() {
    if (isCyber) {
      fill(158, 255, 128);
      ellipse(this.pos.x, this.pos.y, 2.8);
    }
  }
}