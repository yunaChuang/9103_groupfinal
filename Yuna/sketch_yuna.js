let doveImg;
let dots = [];
let isCyber = false;
let song, speedSound;
let fft, analyser;
let speedPlayed = false;
let spectrumHistory = [];
const delayFrames = 60;
let topRowColors = [];

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

  for (let y = 0; y < doveImg.height; y += 13) {
    for (let x = 0; x < doveImg.width; x += 5) {
      let idx = (x + y * doveImg.width) * 4;
      let r = doveImg.pixels[idx];
      let g = doveImg.pixels[idx + 1];
      let b = doveImg.pixels[idx + 2];
      let brightness = (r + g + b) / 3;

      if (brightness < 50) {
        dots.push(new Dot(x + xOffset, y + yOffset));
      }
    }
  }

  let circleCount = 20;
  for (let i = 0; i < circleCount; i++) {
    topRowColors.push(
      color(random([255, 200, 250]), random([200, 255]), random([230, 255]), 200)
    );
  }
  analyser = new p5.Amplitude();
  analyser.setInput(song);
  fft = new p5.FFT(0.8, 64);
  song.connect(fft);

  noStroke();
}

function draw() {
  background(isCyber ? 0 : 255);

  let amp = analyser.getLevel();
  let ellipseSize = map(amp, 0.3, 0.4, 80, 200);

  drawTopRowCircles(amp);

  drawAmplitudeEllipses(ellipseSize);
  drawSpectrumCircles(fft.analyze(), ellipseSize, 1, 60, 100);
  drawSpectrumCircles(spectrumHistory[0] || fft.analyze(), ellipseSize, 2, 20, 250);

  if (spectrumHistory.length > delayFrames) spectrumHistory.shift();
  spectrumHistory.push(fft.analyze());

  for (let d of dots) {
    d.update(createVector(mouseX, mouseY));
    d.display();
  }

  fill(isCyber ? 200 : 50);
  textSize(14);
  textAlign(CENTER, CENTER);
  text(
    isCyber
      ? "Dark Mode: Hold mouse"
      : "Click to play music. Hold mouse for dark mode",
    width / 2,
    height - 20
  );

  setVolumeWithMouse();
  drawMouseVolumeCircle();
}

function drawAmplitudeEllipses(ellipseSize) {
  fill(isCyber ? color(0, 255, 240, 120) : color(255, 50, 50, 100));
  circle(width, (height - ellipseSize) / 2, ellipseSize * 2);

  fill(isCyber ? color(100, 250, 205, 100) : color(255, 50, 200, 100));
  ellipse(0, (height - ellipseSize) / 2, 200 - ellipseSize);

}

function drawSpectrumCircles(spectrum, ellipseSize, radiusScale, baseSize, alphaVal) {
  let circleCount = 20;
  let step = Math.floor(spectrum.length / circleCount);

  for (let i = 0; i < circleCount; i++) {
    let index = i * step;
    let freqValue = spectrum[index];

    let angle = map(i, 0, circleCount, 0, TWO_PI);
    let radius = map(freqValue, 0, 255, ellipseSize, ellipseSize + 80);
    let cx = width / 2 + cos(angle) * radius * radiusScale;
    let cy = height / 2 + sin(angle) * radius;

    let r = map(freqValue, 0, 255, 255, 70);
    let g = 0;
    let b = map(freqValue, 0, 255, 100, 200);

    fill(r, g, b, alphaVal);
    ellipse(cx, cy, baseSize + freqValue * 0.15);
  }
}

function setVolumeWithMouse() {
  let vol = map(mouseY, height, 0, 0, 1);
  song.setVolume(constrain(vol, 0, 1));
}

function drawMouseVolumeCircle() {
  let vol = constrain(map(mouseY, height, 0, 0, 1), 0, 1);
  let circleSize = map(vol, 0, 1, 10, 50);

  fill(250, 10, 10);
  noStroke();
  ellipse(mouseX, mouseY, circleSize * 1.2, circleSize );
}

function drawTopRowCircles(amp) {
  let circleCount = 20;
  let spacing = width / (circleCount + 1);
  let baseY = 80;

  for (let i = 0; i < circleCount; i++) {
    let x = spacing * (i + 1);
    let bounce = map(amp, 0, 0.5, 0, 30); // louder = higher movement

    // Optional: pulse higher if speedSound is playing
    if (speedSound.isPlaying()) {
      bounce *= 1.5;
    }

    let y = baseY + sin(frameCount * 0.1 + i) * 5 - bounce;
    let size = 8 + bounce;

  if (isCyber) {
    if (i % 2 === 0) {
      fill(0, 200, 160, 220);
    } else {
      fill(0, 240, 120, 220); 
    }
  } else {
    fill(topRowColors[i]); // pastel for normal mode
  }
    noStroke();
    ellipse(x, y, size, size);
  }
}

function mousePressed() {
  if (!song.isPlaying()) {
    song.loop();
  }

  isCyber = true;

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
    if (d < 100) {
      let force = map(d, 0, 100, 2, 0.05);
      dir.setMag(force);
      this.vel.add(dir);
    }

    this.vel.mult(0.9);
    this.pos.add(this.vel);

    let back = p5.Vector.sub(this.origin, this.pos).mult(0.015);
    this.pos.add(back);
  }

  display() {
    fill(128, 70, 240, 150);
    ellipse(this.pos.x, this.pos.y, 5, 5);
  }
}