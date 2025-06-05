# 🕊️ Dual-Form Cyber Dove – Interactive Transformation (User Input Version)

## 🧪 Interaction Type: User Input (Click + Drag)

This project presents a **transformative dove artwork** using p5.js. It features a dual-mode animation system where an elegant minimalist bird made of black dots can **morph into a cyberpunk entity** made of glowing characters through **a single mouse click**.

---

## 🔄 Two Distinct Visual States

### 1. **Original Mode (Default)**
- **Visual**: White background, dove composed of black circles.
- **Interaction**: Mouse drag causes elastic reactions near cursor.
- **Style**: Clean, minimal, quiet.

### 2. **Cyber Mode (Triggered by Click)**
- **Visual**: Dark background, dove composed of neon green characters (e.g., `π`, `∞`, `Σ`, etc.).
- **Interaction**:
  - Click triggers **explosion** of particles.
  - **Fluorescent ripple** radiates from click point.
  - Dove sways horizontally with mouse movement.
- **Style**: Matrix-inspired, cyber-futuristic.

---

## 🎮 How to Interact

| Action              | Effect                                                  |
|---------------------|----------------------------------------------------------|
| Mouse Drag (Start)  | Gently repels nearby dots in original mode               |
| Click               | Transforms into **Cyber Mode**, triggers ripple + burst  |
| Mouse Move (Cyber)  | Dove sways left/right in sync with cursor                |
| Click (Cyber)       | Additional ripple + character explosion                  |

---

## 🧠 Unique Aspects of My Version

- Dual visual identities in **one sketch**
- Click-driven **mode-switching logic**
- Smooth **elastic animation** with fast return in cyber mode
- **Text-based characters** replacing visual points
- **Flickering "breathing" effect** for characters

---

## 📐 Technical Highlights

### 🔀 Mode Switching

```js
let isCyber = false;
function mousePressed() {
  isCyber = true;
}
