# 🕊️ Cyber Dove – Interactive Glitch Dove with Perlin-Style Character Breaking

## 🎮 Interaction Mode: User Input – Click, Drag, and Double-Click

## 🧠 Concept
This sketch visualizes a dove composed of dark dots, which under user interaction transforms into a cybernetic creature constructed from glowing symbolic characters (`π`, `∞`, `Σ`, etc.). Inspired by glitch aesthetics, the animation emulates destruction and return-to-form dynamics.

---

## 🔄 Features

| Interaction        | Behavior                                                                 |
|--------------------|--------------------------------------------------------------------------|
| Click              | Enter cyber mode                                                        |
| Drag (in cyber)    | Break nearby points into floating characters                             |
| Character Flicker  | Each broken character glows softly using sine flickering                 |
| Rebound            | Broken characters slowly return to their original positions              |
| Double-click       | Restore original dot-only dove mode                                      |

---

## ✨ Visual Style

- **Cyber Mode Background**: Dark navy blue (`rgb(10,10,20)`)
- **Dots**: Deep gray when intact, neon greenish character when broken
- **Characters**: π, ∞, Σ, #, *, %, & chosen randomly
- **Flicker**: Animated alpha flicker using `sin(frameCount + offset)`

---

## 🧩 Technical Breakdown

### Class: `CyberDot`

```js
if (this.broken) {
  let flicker = map(sin(frameCount * 0.1 + this.brightnessOffset), -1, 1, 100, 180);
  fill(128, 255, 128, flicker);
  text(this.char, this.pos.x, this.pos.y);
}
