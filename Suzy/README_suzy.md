# 🕊️ Peace Dove – User Input Interaction (Personal Version)

## 🎮 Animation Type: **User Input – Enhanced Interactive Control**

This personal version builds on the group's pixel-based dove artwork and introduces **unique user-driven interactions** to create an expressive and responsive experience. The animation reacts to mouse input in multiple ways and is designed to simulate a **peaceful ink-style visual** with symbolic responses.

---

## 🧠 My Individual Approach

I chose **User Input** as my animation method. To make my version distinct and engaging, I added three key interactive elements:

1. **Mouse Hold = Dynamic Shaking**  
   The longer the user presses the mouse, the more violently the dove’s particles shake — symbolizing emotional tension or unrest under pressure.

2. **Mouse Double Click = Dove Scatter**  
   A double click triggers a burst of movement, with particles exploding outward — representing sudden disruption or a call to action.

3. **Ink Trail from Cursor**  
   As the mouse moves, it leaves behind a subtle black trail that mimics a brushstroke — reinforcing the eastern ink painting aesthetic and encouraging user movement.

These combine to form a poetic, reactive system where the dove appears to "feel" the user’s actions.

---

## ✨ Unique Features Compared to Group Version

| Feature | Group Version | My Version |
|--------|---------------|-------------|
| Interaction Style | Mouse push and return | Multi-mode (click, hold, double-click) |
| Visual Feedback | Dots only | Ink trail + color + motion intensity |
| Emotional Expression | Subtle displacement | Expressive response to pressure & clicks |
| Symbolic Layer | Dove pixels move | Dove appears alive & reactive |

---

## 🎨 Inspiration

- **Eastern ink painting** aesthetics (水墨画)
- Interactive poetry concepts (art reacts to viewer behavior)
- Emotional symbolism in interactive generative art
- Generative ink sketches from [OpenProcessing](https://openprocessing.org/)

---

## 🧪 Technical Overview

- `Dot` class responds to `mouseVec` with vector force
- Holding mouse increases shaking power via `shakingMultiplier`
- `doubleClicked()` adds random outward velocity to all dots
- Ink trail is drawn using `vertex()` and a capped position array

```js
if (d < 80 && mouseIsPressed) {
  dir.setMag(0.7 * shakingMultiplier); // stronger push when pressed longer
  this.vel.add(dir);
}

function doubleClicked() {
  for (let dot of dots) {
    let angle = random(TWO_PI);
    let force = p5.Vector.fromAngle(angle).mult(random(3, 8));
    dot.vel.add(force);
  }
}
