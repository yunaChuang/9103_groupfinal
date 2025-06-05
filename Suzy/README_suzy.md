# 🕊️ Dual-Form Cyber Dove – Interactive Transformation (Click & Double Click)

## 🧪 Interaction Type: User Input (Click + Double Click + Mouse Move)

This p5.js project presents a **two-state interactive dove animation** that toggles between a peaceful, minimalist bird and a vibrant cyberpunk character matrix. The user controls the transformation through **click and double-click gestures**.

---

## 🔄 Two Modes of the Dove

### 🔹 1. Original Mode (Default)
- **Visual**: White background, dove made of solid black dots.
- **Interaction**: Mouse **drag** causes elastic distortion around the pointer.
- **Mood**: Calm, restrained, traditional.

### 🔹 2. Cyber Mode (On Click)
- **Visual**: Dark background, dove constructed with glowing **green Greek and symbolic characters** (`π`, `∞`, `Σ`, etc.).
- **Interaction**:
  - **Click** triggers ripple + character explosion.
  - Dove **sways** in response to mouse X-axis movement.
- **Mood**: Futuristic, energetic, electrified.

---

## 🎮 Interaction Summary

| Gesture               | Effect                                                        |
|------------------------|---------------------------------------------------------------|
| **Click**              | Transforms into **Cyber Mode**                                |
| **Click (in Cyber)**   | Triggers ripple + character scatter animation                 |
| **Double Click**       | Switches **back to Original Mode**                            |
| **Mouse Drag**         | (Only in Original Mode) Repels nearby dots with elastic force |
| **Mouse Move (Cyber)** | Horizontal cursor moves entire dove structure                |

---

## 🧠 Unique Technical Features

### Mode Switching Logic

```js
function mousePressed() {
  let now = millis();
  if (this.lastClick && now - this.lastClick < 300) {
    isCyber = false; // Double-click restores original
    this.lastClick = 0;
    return;
  }
  this.lastClick = now;
  isCyber = true;    // Single click triggers cyber mode
}
