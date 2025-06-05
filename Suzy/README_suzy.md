# 🕊️ Cyber Dove – Neon Symbol Animation (User Input Version)

## 🧪 Interaction Type: User Input

This interactive animation builds upon the group’s dove silhouette and reinterprets it with **cyber-symbolic characters**, **neon glow effects**, and **click-triggered ripple explosions**.

---

## 💡 Individual Approach

I selected **User Input** as the driver of my animation. Compared with the group version, which uses elastic point displacement, my individual version introduces:

### ✅ 1. Cyberpunk Aesthetic
- The dove is composed entirely of glowing Greek and symbolic characters like `π`, `∞`, and `Σ`.
- Characters flicker and glow over time, mimicking the **breathing rhythm** of digital entities.

### ✅ 2. Click-Triggered Ripple + Particle Explosion
- A **fluorescent ripple effect** appears on each click.
- Simultaneously, the character particles explode outward and slowly return to their base locations.

### ✅ 3. Mouse X Sway
- Horizontal mouse motion causes a full-body sway of the dove.
- This reinforces the sensation of "airflow" or floating.

---

## 🖼️ Visual Style

| Element           | Description                                                     |
|------------------|-----------------------------------------------------------------|
| Background        | Deep blue/black (digital void)                                 |
| Dove Composition  | Symbolic text (e.g. `π`, `Σ`, `∞`, `@`, `#`)                   |
| Glow Effect       | Neon cyan with stroke and alpha pulse                          |
| Animation         | Click → ripple + explosion → elastic recovery + flicker        |
| Aesthetic         | **Matrix / Tron / Digital Zen**                                |

---

## 📐 Technical Implementation

### ✨ Characters as Particles
Each dot is replaced by a glowing character.

```js
let chars = ['π', 'Σ', '∞', '@', '#', '*', '%', '&'];

class CyberChar {
  constructor(x, y) {
    this.base = createVector(x, y);
    this.pos = this.base.copy();
    this.vel = createVector(0, 0);
    this.char = random(chars);
    this.brightnessOffset = random(1000);
  }

  update(globalOffsetX) {
    this.vel.mult(0.9);
    this.pos.add(this.vel);
    let target = createVector(this.base.x + globalOffsetX, this.base.y);
    let restoring = p5.Vector.sub(target, this.pos).mult(0.04);
    this.pos.add(restoring);
  }

  display() {
    let alpha = map(sin(frameCount * 0.05 + this.brightnessOffset), -1, 1, 100, 255);
    stroke(0, 255, 255, alpha * 0.4);
    strokeWeight(2);
    fill(0, 255, 255, alpha);
    text(this.char, this.pos.x, this.pos.y);
  }
}
