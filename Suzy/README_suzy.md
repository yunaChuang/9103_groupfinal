## 🕊️ Interaction Type: Single Click & Mouse Movement

This individual version simplifies interaction to highlight two powerful gestures:

1. **Single Click Explosion**  
   On each click, the dove bursts outward — a metaphor for sudden disruption or emotional release. All particles scatter with velocity, then slowly return to form.

2. **Horizontal Mouse Drift**  
   Moving the mouse left/right gently shifts the dove’s structure in that direction. It simulates wind or flight-like sway — giving the visual more presence and calmness.

---

## 🧠 Why This Is Different

By stripping back to only **two expressive gestures**, my animation focuses on **intentional movement** and symbolic reaction. Compared to other team members who use audio, Perlin noise, or time, mine uses **minimal interaction** for **maximal impact**.

---

## 🎨 Inspiration

- The feeling of wind and tension in peace-themed artwork  
- Minimal, poetic visual interaction (inspired by kinetic sculpture & ink brush flow)

---

## 🧪 Technical Summary

- MouseX → offset all dot targets horizontally (`globalOffsetX`)
- `mousePressed()` → apply random `vel.add()` to all dots
- `lerp()` ensures smooth easing for lateral movement

---
