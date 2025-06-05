# 🕊️ Cyber Dove – Neon Green Symbolic Animation (User Input Version)

## 🔧 Interaction Type: User Input

This individual animation reimagines our group’s dove artwork as a **cyber-symbolic neon creature**, constructed entirely of glowing green symbols and driven by expressive mouse-based interactions.

---

## 🌟 What’s Unique in My Version

### ✅ 1. **Neon Green Glow Aesthetic**
- All particles are not dots but characters: `π`, `∞`, `Σ`, `@`, `#`, etc.
- Characters **flicker gently**, producing a pulsing “breathing” light effect.
- Color is set to **glowing green** (`#00FF00`) for a sci-fi hacker feel.

### ✅ 2. **Mouse-Click Ripple + Explosion**
- On click:
  - A **ripple expands** from the click point in green light.
  - Characters **scatter outward** with random force.
  - Particles **return to position quickly**, creating a sense of elastic tension.

### ✅ 3. **Horizontal Sway with Mouse**
- As mouse moves left/right, the entire dove matrix sways horizontally.
- This motion gives a floating, airy sensation—like data hovering in a void.

---

## 🎨 Visual Style Summary

| Element             | Style Description                                      |
|---------------------|--------------------------------------------------------|
| **Background**      | Deep black-blue                                        |
| **Particles**       | Random cyber-symbols, neon green glow                  |
| **Ripple Effect**   | Green circles, smooth expanding rings                  |
| **Animation Speed** | Faster rebound after click, subtle flicker at rest     |
| **Aesthetic**       | Matrix x Zen x Minimal Hacker                          |

---

## 📐 Technical Highlights

### Character Particles

```js
stroke(0, 255, 0, alpha * 0.4); // Neon green stroke
fill(0, 255, 0, alpha);         // Glowing green fill
restoring.mult(0.08);           // Fast elastic return
