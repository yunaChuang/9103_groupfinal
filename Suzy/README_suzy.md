# 🕊️ Cyber Dove – Glitch-Inspired Interactive Animation

## 🎮 Mode: User Input (Mouse Interaction)

### 🧠 Concept
This project reimagines a peaceful dove composed of pixel dots. Through user interaction, the dove momentarily breaks into a chaotic array of glowing symbolic characters. Inspired by glitch and cyber aesthetics, the project captures the contrast between order and digital disruption.

---

## ✨ Interaction Features

| Action               | Behavior                                                                 |
|----------------------|--------------------------------------------------------------------------|
| 🖱️ Single Click       | Activates **Cyber Mode**                                                 |
| 🖱️ Click on Dove     | **Breaks character-forming dots** into glowing symbols                   |
| 🖱️ Drag in Cyber Mode| Continuously breaks more points along the path of the mouse              |
| 🔁 Rebound Effect     | Broken characters **gradually float back** to their original dot position |
| 🖱️ Double Click       | Resets everything to **original dot-based dove**                         |

---

## 🎨 Visual States

### 🕊️ Default (Dot Mode)

- Dove is formed entirely by **black dots** extracted from a reference image.
- No animation, no interaction – fully **static and peaceful**.
- Mouse input has **no effect** in this mode.

### 💥 Cyber Mode (Interactive Glitch)

- Background turns dark (deep blue).
- **Clicking or dragging on dove** disrupts its structure:
  - Dots become characters like `π`, `∞`, `Σ`, `*`, `#`, etc.
  - Each character flickers softly in green tones.
  - Broken regions slowly revert back to dot form with elastic movement.

---

## 🧩 Technical Overview

### Dot State Handling

```js
if (isCyber) {
  if (d < 60 && mouseIsPressed) {
    this.broken = true;
    this.vel.add(p5.Vector.random2D().mult(random(2, 5)));
  }
}
