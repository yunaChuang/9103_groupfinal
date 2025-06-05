# 🕊️ Peace Dove Interaction (Image Edition)

## 🎮 Animation Type: User Input (Mouse Movement + Click)

This project uses **an image of a dove** (`dovefinal.png`) placed at the center of the canvas.  
User interaction makes the experience engaging and visually dynamic.

---

## 🖱️ Controls

- **Move Mouse**: A green olive branch follows the cursor
- **Click Mouse**: Background color changes randomly

---

## 🧠 My Individual Approach

I used **user input** as my animation method, with two interactive elements:
1. Olive branch follows the mouse
2. Background color reacts to clicks

This direct interaction invites users to move and play with the peaceful image in subtle ways.

---

## 🎨 Media Used

- Dove artwork file: `assets/dovefinal.png`
- Canvas and animation logic built using `p5.js`
- Image is displayed using `imageMode(CENTER)` and `image()` function

---

## 🔧 Technical Summary

```js
function preload() {
  doveImage = loadImage('assets/dovefinal.png');
}
function draw() {
  image(doveImage, width / 2, height / 2, 200, 150);
}
