let doveImg; //image
let dots = []; //background dot
let isCyber = false; //dark mode
let song, speedSound; //sound
let fft, analyser; //sound analysis
let speedPlayed = false; //play in dark mode
let spectrumHistory = []; //spectrum as array
const delayFrames = 60; // i want sound delay to make divesity
let topRowColors = []; // the top row small decorations

function preload() {
  doveImg = loadImage("assets/dovefinal.png");
  speedSound = loadSound("assets/alien.wav");
  song = loadSound("assets/piano-loops-093-effect-120-bpm.wav");
}

function setup() {
  //from group work
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  doveImg.resize(1000, 0);
  doveImg.loadPixels();

  let xOffset = (width - doveImg.width) / 2;
  let yOffset = (height - doveImg.height) / 2;

  //small adjust for the density in y and x to create a diff dot background
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

  //generates 20 random colours for the top row circles
  let circleCount = 20;
  for (let i = 0; i < circleCount; i++) {
    topRowColors.push(
      color(random([255, 200, 250]), random([200, 255]), random([230, 255]), 200)
    );
  }
  //set the amplitude trigger
  analyser = new p5.Amplitude();
  analyser.setInput(song);
  //frequency trigger
  fft = new p5.FFT(0.8, 64);
  song.connect(fft);

  noStroke();
}

function draw() {
  background(isCyber ? 0 : 255); //if isCyber is true -> use 0 (black)

  let amp = analyser.getLevel(); //get amp from the sound (music)
  let ellipseSize = map(amp, 0.3, 0.4, 80, 200); //map the amplitude to ellipse size

  drawTopRowCircles(amp);
  drawAmplitudeEllipses(ellipseSize);
  drawSpectrumCircles(fft.analyze(), ellipseSize, 1, 60, 100); //decide the circle size and position
  drawSpectrumCircles(spectrumHistory[0] || fft.analyze(), ellipseSize, 2, 20, 250); //decide the circle size and position

  //if spectrum history is longer than delay frames, remove old one (shift:removes from beginning)
  if (spectrumHistory.length > delayFrames) spectrumHistory.shift();
  //add current spectrum data to history for future delayed effects
  spectrumHistory.push(fft.analyze());

   //update and display all dots in the array
  for (let d of dots) {
    d.update(createVector(mouseX, mouseY));
    d.display();
  }

  fill(isCyber ? 200 : 50);
  textSize(14);
  textAlign(CENTER, CENTER);
  text(
    isCyber
      ? "Dark Mode: Hold mouse"  //dark mode
      : "Click to play music. Hold mouse for dark mode", //bright mode
    width / 2,
    height - 20
  );
  //update the song volume based on mouse Y position
  setVolumeWithMouse();
  //draw visual feedback circle showing current volume at mouse position
  drawMouseVolumeCircle();
}

//draw two ellipse (circle) aside and interate with the sound
function drawAmplitudeEllipses(ellipseSize) {
  fill(isCyber ? color(0, 255, 240, 120) : color(255, 50, 50, 100));
  circle(width, (height - ellipseSize) / 2, ellipseSize * 2);

  fill(isCyber ? color(100, 250, 205, 100) : color(255, 50, 200, 100));
  ellipse(0, (height - ellipseSize) / 2, 200 - ellipseSize);

}

//Draw the eyes part with the sound spectrum
function drawSpectrumCircles(spectrum, ellipseSize, radiusScale, baseSize, alphaVal) {
  let circleCount = 20;
  //calculate step size to sample frequency spectrum evenly (make the circles in order)
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
  //map mouse Y position to volume (top:quiet, bottom:loud)
  let vol = map(mouseY, height, 0, 0, 1);
  song.setVolume(constrain(vol, 0, 1));
}

//A ellipse followed by the mouse also changing the loudness of the sound w/ its position
function drawMouseVolumeCircle() {
  let vol = constrain(map(mouseY, height, 0, 0, 1), 0, 1);
  let circleSize = map(vol, 0, 1, 10, 100);

  fill(250, 10, 10,80);
  noStroke();
  ellipse(mouseX, mouseY, circleSize * 1.2, circleSize );
}

//draw the decoration in the top which interate with the sound
function drawTopRowCircles(amp) {
  let circleCount = 20;
  let spacing = width / (circleCount + 1);
  let baseY = 80;

  for (let i = 0; i < circleCount; i++) {
    let x = spacing * (i + 1);
    let bounce = map(amp, 0, 0.5, 0, 30); // louder:higher movement

    // pulse higher if dark sound is playing
    if (speedSound.isPlaying()) {
      bounce *= 1.5;
    }

    let y = baseY + sin(frameCount * 0.1 + i) * 5 - bounce;
    let size = 8 + bounce;

  if (isCyber) {
    //fill the shapes with cyber colour when dark mode on
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

//When mouse pressed dark mode on and play dark music 
function mousePressed() {
  if (!song.isPlaying()) {
    //always play the music in a loop nonstop
    song.loop();
  }

  isCyber = true;

  if (!speedPlayed) {
    speedSound.play();
    speedPlayed = true;
  }
}

//When mouse released dark mode end and stop dark music 
function mouseReleased() {
  //initial is bright mode and no dark sound
  isCyber = false;
  speedPlayed = false;

  if (speedSound.isPlaying()) {
    speedSound.stop();
  }
}


//From group work
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
    //change the background colour
    fill(128, 70, 240, 150);
    //enlarge the background dot
    ellipse(this.pos.x, this.pos.y, 5, 5);
  }
}