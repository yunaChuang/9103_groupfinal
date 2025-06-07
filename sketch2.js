let doveImg;
let dots = [];
let cyberDots = [];
let isCyber = false;
let lastClick = 0;
let clickFlash = 0;
let song;
let speedSound;
let speedPlayed = false;
let musicButton;
let analyser;
let fft;
let numBins = 512;
let smoothing = 0.8;
let explosionStrength = 1;
let state = "waiting"; 
let stateTimer = 0;
let ellipseSize;

function preload() {
  doveImg = loadImage("assets/dovefinal.png");
  speedSound = loadSound("assets/alien.wav");
  song = loadSound("assets/piano-loops-093-effect-120-bpm.wav");
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

  for (let y = 0; y < doveImg.height; y += 5) {
    for (let x = 0; x < doveImg.width; x += 5) {
      let idx = (x + y * doveImg.width) * 4;
      let r = doveImg.pixels[idx];
      let g = doveImg.pixels[idx + 1];
      let b = doveImg.pixels[idx + 2];
      let brightness = (r + g + b) / 3;
      if (brightness < 50) {
        dots.push(new Dot(x + xOffset, y + yOffset));
        cyberDots.push(new CyberDot(x + xOffset, y + yOffset));
      }
    }
  }

  analyser = new p5.Amplitude();
  analyser.setInput(song);

  fft = new p5.FFT(smoothing, numBins);
  speedSound.connect(fft);

  musicButton = createButton("Play");
  musicButton.style('background', 'transparent');
  musicButton.style('color', 'black'); 
  musicButton.style('border', 'green'); 
  musicButton.style('font-size', '14px');
  musicButton.mousePressed(toggleMusic);
  noStroke();
}

function draw() {
  updateState();
  let t = millis() * 0.001;

  if (isCyber) {
    background(0);
    for (let d of cyberDots) {
      d.update();
      d.display();
    }

    // === Frequency-Reactive Circles in Cyber Mode ===
    let spectrum = fft.analyze();
    let circleCount = 10;
    let step = Math.floor(spectrum.length / circleCount);

    for (let i = 0; i < circleCount; i++) {
      let index = i * step;
      let freqValue = spectrum[index];

      let angle = map(i, 0, circleCount, 0, TWO_PI);
      let radius = map(freqValue, 0, 255, 40, 180);
      let cx = width / 2 + cos(angle) * radius;
      let cy = height / 2 + sin(angle) * radius;
      let r = map(freqValue, 0, 240, 240, 0);   
      let g = map(freqValue, 0, 240, 0, 240);  
      let b = 0;                                

      fill(r, g, b, 180);
      noStroke();
      ellipse(ellipseX, ellipseY + freqValue *0.08, ellipseSize + freqValue * 0.8);
    }

    fill(180);
    textSize(14);
    text("Double-click to reset to normal mode.", width / 2, height - 20);
  } else {
    background(255);
    for (let d of dots) {
      d.update(t);
      d.display();
    }
  }

  let level = analyser.getLevel();
  ellipseSize = map(level, 0, 0.4, 80, 100);
  ellipseX = (width - 1000) / 2 + ellipseSize;
  ellipseY = (height - 650) / 2 + ellipseSize;
  fill(255, 70, 70, 220);
  ellipse(ellipseX, ellipseY, ellipseSize);
  musicButton.position(ellipseX - musicButton.width / 2, ellipseY - musicButton.height / 2);

  fill(0);
  textSize(14);
  if (!isCyber) {
    text("Click to enter cyber mode. Double-click to reset.", width / 2, height - 20);
  }
}

function updateState() {
  stateTimer++;

  if (state === "expanding") {
    explosionStrength += 0.08;
    if (explosionStrength >= 5) {
      explosionStrength = 5;
      state = "contracting";
    }
  } else if (state === "contracting") {
    explosionStrength -= 0.12;
    if (explosionStrength <= 1) {
      explosionStrength = 1;
      state = "waiting";
      stateTimer = 0;
    }
  } else if (state === "waiting") {
    if (stateTimer > 60) {
      state = "expanding";
    }
  }
}

function mousePressed() {
  let now = millis();

  if (now - lastClick < 300) {
    // === DOUBLE CLICK ===

    isCyber = false;

    for (let d of cyberDots) {
      d.broken = false;
      d.vel.mult(0);
      d.pos = d.origin.copy();
    }

    song.stop();
    musicButton.html("Play");
    speedPlayed = false;

    if (speedSound.isPlaying()) {
      speedSound.stop();
    }

    explosionStrength = 1;
    state = "waiting";
    stateTimer = 0;

  } else {
    // === SINGLE CLICK ===

    isCyber = true;
    clickFlash = 100;

    for (let d of cyberDots) {
      let distToMouse = dist(mouseX, mouseY, d.pos.x, d.pos.y);
      if (distToMouse < 200) {
        d.broken = true;
        let angle = random(TWO_PI);
        let mag = random(1.5, 2.5);
        d.vel.add(p5.Vector.fromAngle(angle).mult(mag));
      }
    }

    if (!speedPlayed) {
      speedSound.play();
      speedPlayed = true;
    }
  }

  lastClick = now;
}

function toggleMusic() {
  if (song.isPlaying()) {
    song.pause();
    musicButton.html("Play");
  } else {
    song.loop();
    musicButton.html("Pause");
  }
}

class Dot {
  constructor(x, y) {
    this.origin = createVector(x, y);
    this.pos = this.origin.copy();
    this.seed = random(1000);
  }

  update(time) {
    let noiseVal = noise(this.origin.x * 0.002, this.origin.y * 0.002, time * 0.5 + this.seed);
    let angle = noiseVal * TWO_PI * 2;
    let radius = 5;
    this.pos.x = this.origin.x + cos(angle) * radius;
    this.pos.y = this.origin.y + sin(angle) * radius;

    let explosion = p5.Vector.sub(this.pos, this.origin);
    explosion.normalize().mult(explosionStrength);
    this.pos.add(explosion);

    let pullBack = p5.Vector.sub(this.origin, this.pos).mult(0.02);
    this.pos.add(pullBack);

    if (state === "waiting") {
      this.pos.add(p5.Vector.random2D().mult(0.2));
    }
  }

  display() {
    let gradientRatio = constrain(this.pos.y / height, 0, 1);
    let r = lerp(59, 168, gradientRatio);
    let g = lerp(130, 85, gradientRatio);
    let b = lerp(246, 247, gradientRatio);
    fill(r, g, b);
    ellipse(this.pos.x, this.pos.y, 2.2, 2.2);
  }
}

class CyberDot {
  constructor(x, y) {
    this.origin = createVector(x, y);
    this.pos = this.origin.copy();
    this.vel = createVector(0, 0);
    this.broken = false;
    this.char = random(["π", "∞", "Σ", "%", "&"]);
    this.brightnessOffset = random(100);
  }

  update() {
    this.vel.mult(0.8);
    this.pos.add(this.vel);
    let back = p5.Vector.sub(this.origin, this.pos).mult(0.07);
    this.pos.add(back);
  }

  display() {
    if (this.broken && isCyber) {
      let flicker = map(sin(frameCount * 0.1 + this.brightnessOffset), -1, 1, 100, 180);
      fill(128, 255, 128, flicker);
      textSize(11);
      text(this.char, this.pos.x, this.pos.y);
    } else if (isCyber) {
      fill(0);
      ellipse(this.pos.x, this.pos.y, 2.8);
    }
  }
}