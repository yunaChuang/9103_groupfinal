# 🕊️ Perlin Noise & Randomness Animation – Individual Submission (Quella He)

## 🎮 How to Interact with the Work
Move your mouse across the canvas.  
When the mouse approaches any brush stroke, the particles react and flow around the cursor.  
When the mouse leaves, the strokes gradually return to their original positions using Perlin noise and vector interpolation.

---

## 🔧 Individual Animation Details

### 🎨 Technique Used
I selected **Perlin noise and randomness** as the main drivers for this animation.  
Each stroke moves based on time-evolving Perlin noise values, producing organic and fluid motion. Randomness is added to control:
- slight color shifts
- particle angles
- transparency (alpha)
- return speed

### ✨ What Makes My Version Unique
- Introduced **three layered brush strokes**, each with its own scale and motion radius.
- Used **mouse distance** to trigger dynamic interaction – closer strokes are pulled into orbit by the mouse.
- Created a **shimmering ink-painting feel** through frame-by-frame color jitter.
- Combined **Perlin-based flow** with **random seed individuality** for rich visual texture.

---

## 🌱 Inspiration
This work is inspired by traditional **Chinese ink painting**, where brush strokes suggest motion and energy.  
I also drew from generative artworks by **Zach Lieberman**, whose use of Perlin noise fields deeply influenced the flow dynamics in my code.

---

## 📘 Explanation of Key Decisions
- **Perlin Noise** is used to generate consistent but evolving motion paths.
- **Random offsets** avoid visual repetition and keep each stroke unique.
- Used `lerp()` for smooth return transitions after interaction.
- Each particle has a unique `seed` to prevent synchronized movement.

---

## 📚 References and Tools
- Tools used: `p5.js`, native functions like `noise()`, `p5.Vector`, `lerp()`
- No third-party libraries or AI-generated code were used.
- The group code provided the base structure for parsing the image and rendering layered particles. I extended it by adding interaction logic and flow behavior.

---

## 🖼️ Group Artwork Reference
Based on the image **"Dove of Peace" by Pablo Picasso** (not part of the official artwork list but used for code development).


---

## 🔧 Technical Overview

- `InkParticle` class governs each floating “ink drop”
- `noise()` used to create smooth wandering behavior
- `random()` used to vary opacity, size, initial location

```js
this.x += map(noise(this.noiseSeedX), 0, 1, -1, 1);