# 🕊️ Peace Dove – Perlin Noise Ink Animation

## 🌫️ Animation Type: Perlin Noise + Randomness

This version of the peace dove animation uses **Perlin noise and randomness** to simulate **flowing ink patterns**, resembling traditional East Asian **shui-mo (水墨)** aesthetics.

---

## 🎨 Visual Concept

- 🐦 A dove image remains still in the center of the canvas
- 🖌️ Random ink dots drift and expand slowly based on Perlin noise
- 🧘‍♂️ No interaction required — a slow meditative motion

---

## 🧠 My Individual Approach

I chose **Perlin noise and randomness** as my animation method. This sets my work apart from teammates who use audio or input-driven animation.

### What’s unique:
- Noise-based, continuous motion
- Watercolor/ink-inspired look
- Uses `noise()` to control subtle, naturalistic drifting behavior

---

## 💡 Inspiration

Inspired by:
- Chinese ink painting (水墨画)
- Generative “ink blot” aesthetics seen on [OpenProcessing](https://openprocessing.org/)
- p5.js creative coding examples using `noise()` for natural motion

---

## 🔧 Technical Overview

- `InkParticle` class governs each floating “ink drop”
- `noise()` used to create smooth wandering behavior
- `random()` used to vary opacity, size, initial location

```js
this.x += map(noise(this.noiseSeedX), 0, 1, -1, 1);