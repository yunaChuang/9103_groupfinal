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

function preload() {
  doveImg = loadImage("assets/dovefinal.png");
  song = loadSound("assets/alien.wav");
  speedSound = loadSound("assets/piano-loops-093-effect-120-bpm.wav");
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
        dots.push(new Dot(x + xOffset, y + yOffset));
        cyberDots.push(new CyberDot(x + xOffset, y + yOffset));
      }
    }
  }

  song.loop();

  analyser = new p5.Amplitude();
  analyser.setInput(song);

  musicButton = createButton("Pause Music");
  musicButton.position(20, 20);
  musicButton.mousePressed(toggleMusic);

  noStroke();
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
    for (let d of dots) {
      d.update(createVector(mouseX, mouseY), getExplosionStrength());
      d.display();
    }
    if (clickFlash > 0) {
      fill(0, 0, 0, clickFlash);
      rect(0, 0, width, height);
      clickFlash -= 8;
    }
    fill(0);
    textSize(14);
    text("Click to enter cyber mode. Click once to trigger speed sound.", width / 2, height - 20);
  }

  // Draw ellipse based on audio amplitude
  let level = analyser.getLevel(); // 0.0 to 1.0
  let ellipseSize = map(level, 0, 0.4, 100, 150); // tweak as needed
  fill(255, 200, 0, 180);
  noStroke();
  ellipse(100, 100, ellipseSize);
}

function getExplosionStrength() {
  return map(sin(frameCount * 0.02), -1, 1, 1, 5);
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

  if (!speedPlayed) {
    speedSound.play();
    speedPlayed = true;
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

function toggleMusic() {
  if (song.isPlaying()) {
    song.pause();
    musicButton.html("Play Music");
  } else {
    song.loop();
    musicButton.html("Pause Music");
  }
}

class Dot {
  constructor(x, y) {
    this.origin = createVector(x, y);
    this.pos = this.origin.copy();
    this.vel = p5.Vector.random2D().mult(random(3));
  }

  update(mouseVec, explosionStrength) {
    let dir = p5.Vector.sub(this.pos, mouseVec);
    let d = dir.mag();

    if (d < 80 && mouseIsPressed) {
      dir.setMag(1.2);
      this.vel.add(dir);
    }

    let explosion = p5.Vector.sub(this.pos, this.origin);
    explosion.normalize().mult(explosionStrength);
    this.vel.add(explosion);

    let attraction = p5.Vector.sub(this.origin, this.pos);
    attraction.mult(0.05);
    this.vel.add(attraction);

    if (explosionStrength < 2) {
      this.pos.add(p5.Vector.random2D().mult(0.3));
    }

    this.vel.limit(5);
    this.vel.mult(0.9);
    this.pos.add(this.vel);
  }

  display() {
    let t = frameCount * 0.02 + this.pos.y * 0.005;
    let gray = 125 + 75 * sin(t);
    fill(gray);
    ellipse(this.pos.x, this.pos.y, 2.8, 2.8);
  }
}

class CyberDot {
  constructor(x, y) {
    this.origin = createVector(x, y);
    this.pos = this.origin.copy();
    this.vel = createVector(0, 0);
    this.broken = false;
    this.char = random(["π", "∞", "Σ", "#", "*", "%", "&"]);
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
}