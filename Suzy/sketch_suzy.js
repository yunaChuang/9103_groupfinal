let doveImg;          // Dove image
let strokes = [];     // Array to store individual brush strokes (particles) that form the dove
let paintingLayer;    // p5.Graphics layer for user's interactive 'painting' marks
let peaceLayer;       // p5.Graphics layer for the text
let isPainting = false; // Track if the mouse is currently pressed for painting
let bgColor = "grey"; // Background color

function preload() {
  doveImg = loadImage("assets/dovefinal.png");
}

function setup() {
  // from our group work inspration
  createCanvas(windowWidth, windowHeight);
  // Set pixel density to 1
  pixelDensity(1);

  // Initialize and configure the painting layer where users draw
  setupPaintingLayer();
  // Initialize and configure the text layer with "DOVE OF PEACE"
  setupPeaceLayer();
  // Process the dove image and create the initial brush strokes
  setupDoveImage();
}

function setupPaintingLayer() {
  paintingLayer = createGraphics(width, height); // Create a new graphics buffer
  paintingLayer.pixelDensity(1);                 // Set its pixel density
  paintingLayer.background(0, 0, 0, 0);          // Set a transparent background
  paintingLayer.noStroke();                      // Disable strokes for drawing on this layer
}

function setupPeaceLayer() {
  peaceLayer = createGraphics(width, height); // Create a new graphics buffer for text
  peaceLayer.push();                          // Isolate styling changes to this layer
  peaceLayer.textFont("Courier New");         // Set the font for the text
  peaceLayer.textSize(200);                   // Set the text size
  peaceLayer.textAlign(CENTER, CENTER);       // Align text to the center
  peaceLayer.fill(20, 20, 20, 80);            // Set a dark, semi-transparent fill color for the text
  // Draw the text "DOVE OF PEACE" in the center of the layer
  peaceLayer.text("DREAM OF DOVE", width / 2, height / 2);
  peaceLayer.pop();                           // Restore previous styling settings
}

function setupDoveImage() {
  doveImg.resize(1000, 0); // Resize the dove image to a width of 1000px, maintaining aspect ratio
  doveImg.loadPixels();    // Load pixel data for direct access (required for pixel manipulation)

  // Calculate offsets to center the dove image on the canvas
  let xOffset = (width - doveImg.width) / 2;
  let yOffset = (height - doveImg.height) / 2;

  // Create brush strokes in 3 distinct layers to give a sense of depth or complexity
  for (let layer = 0; layer < 3; layer++) {
    createBrushStrokesForLayer(layer, xOffset, yOffset);
  }
}


function createBrushStrokesForLayer(layer, xOffset, yOffset) {
  // Iterate through image pixels, skipping some to create a sparse effect
  for (let y = 0; y < doveImg.height; y += 4) {
    for (let x = 0; x < doveImg.width; x += 4) {
      // Calculate the index for RGBA pixel data
      let index = (x + y * doveImg.width) * 4;
      // Get RGB color components
      let r = doveImg.pixels[index];
      let g = doveImg.pixels[index + 1];
      let b = doveImg.pixels[index + 2];
      // Calculate brightness (average of RGB)
      let brightness = (r + g + b) / 3;

      // Only create a stroke if the pixel is bright enough and a random chance is met
      if (brightness > 50 && random() > 0.7) {
        strokes.push(new BrushStroke(
          x + xOffset + random(-2, 2),    // X position with slight random offset
          y + yOffset + random(-2, 2),    // Y position with slight random offset
          color(r, g, b),                 // Original color of the pixel
          layer                           // The layer this stroke belongs to
        ));
      }
    }
  }
}

function draw() {
  background(bgColor);      // Set the background color
  image(paintingLayer, 0, 0); // Display the user's painting layer
  image(peaceLayer, 0, 0);    // Display the text
  updateAndDisplayStrokes(); // Update and draw all individual brush strokes
  displayInfoText();        // Display instructional text at the bottom
}

function updateAndDisplayStrokes() {
  let t = millis() * 0.001; // Get current time in seconds for potential animation use
  for (let stroke of strokes) {
    stroke.update(t);  // Call the update method for each stroke
    stroke.display();  // Call the display method for each stroke
  }
}

function displayInfoText() {
  fill("white");     // Set text color to white
  textSize(14);      // Set text size
  // Display the instruction string
  text("R - retry; S - save; Q - change background", 20, height - 20);
}

function mousePressed() {
  isPainting = true; // Set flag to true as painting has started
  addPaintMark();    // Add a paint mark at the current mouse position
}

function mouseDragged() {
  addPaintMark(); // Add paint marks continuously while dragging
}

function mouseReleased() {
  isPainting = false; // Set flag to false as painting has stopped
}

function addPaintMark() {
  // Array of predefined cyberpunk-themed colors
  const cyberpunkColors = [
    color(255, 0, 128, 150), // Pink
    color(0, 255, 255, 150), // Cyan
    color(255, 0, 255, 150), // Magenta
    color(0, 255, 128, 150), // Green-Cyan
    color(255, 128, 0, 150), // Orange
    color(128, 0, 255, 150)  // Purple
  ];

  // Array of characters to be used for the paint marks
  const chars = ['0', '1', '*', '#', '@', '&', '>', '<', '|', '/'];
  let paintColor = random(cyberpunkColors); // Pick a random cyberpunk color for this set of marks

  // Create multiple small marks for each mouse event
  for (let i = 0; i < 8; i++) {
    let offsetX = random(-15, 15);  // Random horizontal offset
    let offsetY = random(-15, 15);  // Random vertical offset
    let size = random(8, 12);       // Random text size
    let angle = random(-PI / 4, PI / 4); // Random rotation angle
    let char = random(chars);       // Random character from the array

    paintingLayer.push();                         // Isolate transformations for each mark
    paintingLayer.translate(mouseX + offsetX, mouseY + offsetY); // Move to the mark's position
    paintingLayer.rotate(angle);                  // Apply rotation

    paintingLayer.fill(paintColor);               // Set the main color for the character
    paintingLayer.textSize(size);                 // Set the text size
    paintingLayer.textAlign(CENTER, CENTER);      // Align text for rotation
    paintingLayer.text(char, 0, 0);               // Draw the character

    // Create a glow effect by drawing a larger, more transparent version of the same character
    let glowColor = color(red(paintColor), green(paintColor), blue(paintColor), 30);
    paintingLayer.fill(glowColor);                // Set the glow color (more transparent)
    paintingLayer.textSize(size * 1.5);           // Make the glow character larger
    paintingLayer.text(char, 0, 0);               // Draw the glow character

    paintingLayer.pop();                          // Restore previous transformation settings
  }
}

class BrushStroke {
  constructor(x, y, col, layer) {
    this.origin = createVector(x, y);      // The fixed original position (where it wants to return)
    this.pos = createVector(x, y);         // Current position of the stroke
    this.color = col;                      // Current color (can change during explosion)
    this.originalColor = col;              // The color from the original image
    this.layer = layer;                    // Layer property (0, 1, or 2)
    this.seed = random(1000);              // Random seed for potential Perlin noise or other effects
    this.length = random(3, 10 + layer * 2); // Length of the ellipse, influenced by layer
    this.width = random(3, 8 + layer);     // Width of the ellipse, influenced by layer
    this.angle = random(PI);               // Initial rotation angle (not used in current display but can be)
    this.alpha = random(150, 220);         // Transparency of the stroke
    this.targetPos = createVector(x, y);   // The position the stroke tries to return to
    this.recoverySpeed = random(0.02, 0.05); // Speed at which it returns to `targetPos`
    this.isAffected = false;               // Flag to check if it's currently affected (not actively used but good for state)
    this.isExploding = false;              // Flag to track if the stroke is in an 'exploding' state
    this.velocity = createVector(0, 0);    // Current velocity when exploding
    this.cyberpunkColor = null;            // Stores a random cyberpunk color when exploding
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
    // Check if mouse is pressed and the stroke is not already exploding
    if (mouseIsPressed && !this.isExploding) {
      // Calculate distance from the mouse to the stroke's original position
      let mouseDist = dist(mouseX, mouseY, this.origin.x, this.origin.y);
      // If close enough to the mouse, trigger an explosion
      if (mouseDist < 25) {
        this.isExploding = true;
        this.cyberpunkColor = this.generateCyberpunkColor(); // Assign a cyberpunk color
        // Calculate a vector from the stroke's origin to the mouse
        let toMouse = createVector(mouseX - this.origin.x, mouseY - this.origin.y);
        // Calculate a tangent vector perpendicular to `toMouse`
        let tangent = createVector(-toMouse.y, toMouse.x).normalize();
        // Set an initial velocity for the explosion, tangential to the mouse direction
        this.velocity = tangent.mult(random(3, 8));
      }
    }

    // If the stroke is currently exploding
    if (this.isExploding) {
      this.pos.add(this.velocity); // Move the stroke by its velocity
      this.velocity.mult(0.95);    // Gradually reduce the velocity (slow it down)

      // If velocity becomes very small, start recovery
      if (this.velocity.mag() < 0.1) {
        // Linearly interpolate the position back towards the target (origin)
        this.pos.lerp(this.targetPos, this.recoverySpeed);
        // If very close to the target, reset explosion state
        if (p5.Vector.dist(this.pos, this.targetPos) < 1) {
          this.isExploding = false;     // Explosion finished
          this.isAffected = false;      // Not affected anymore
          this.cyberpunkColor = null;   // Clear cyberpunk color
        }
      }
    } else {
      // If not exploding, continuously lerp back to the target position
      this.pos.lerp(this.targetPos, this.recoverySpeed);
    }
  }

  display() {
    noStroke(); // Ensure no outline for the ellipse
    // Set fill color: cyberpunk if exploding, otherwise white with alpha
    if (this.isExploding && this.cyberpunkColor) {
      fill(this.cyberpunkColor);
    } else {
      fill(255, 255, 255, this.alpha);
    }
    push();                       // Isolate transformations for this stroke
    translate(this.pos.x, this.pos.y); // Move to the stroke's current position
    ellipse(0, 0, this.length, this.width); // Draw the stroke as an ellipse
    pop();                        // Restore previous transformation settings
  }
}

function keyPressed() {
  // If 'R' key is pressed (case-insensitive)
  if (key === 'r' || key === 'R') {
    clearPaintingLayer(); // Clear the user's painting
    bgColor = "grey";    // Reset background
  }
  // If 'S' key is pressed (case-insensitive)
  if (key === 's' || key === 'S') {
    saveCanvas('dream of dove_artwork', 'png'); // Save the current canvas as a PNG image
    return false; // Prevent default browser action (e.g., saving page source)
  }
  // If 'Q' key is pressed (case-insensitive)
  if (key === 'q' || key === 'Q') {
    // Array of predefined dark background colors
    const colors = [
      color(20, 20, 40), // Dark blue/purple
      color(40, 20, 40), // Dark purple
      color(20, 40, 40), // Dark teal
      color(40, 20, 20), // Dark red
      color(20, 40, 20), // Dark green
      color(30, 30, 30)  // Dark grey
    ];
    bgColor = random(colors); // Random background color from the list
  }
}

function clearPaintingLayer() {
  paintingLayer.clear();                // Clear all pixels on the graphics
  paintingLayer.background(0, 0, 0, 0); // Ensure it's fully transparent
}