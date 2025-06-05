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


## ✨ My Variation: Enhanced User Input Animation

My individual submission builds on the group’s particle-based dove animation by adding enhanced **user interaction feedback**:

### 🔁 Key Differences
- Mouse clicks change the **dot color**, giving the animation a reactive and expressive quality
- Mouse movements leave behind a **faint ink trail**, enhancing the immersion and symbolism of motion
- Combined velocity variation and visual feedback differentiates this from other team members’ implementations

### 🧠 Why This Is Different
While our group shared the same core image logic, I extended the interaction style to make user participation visible and dynamic. This adds both **visual diversity** and **engagement** to the viewer’s experience.

---

## 💡 Inspiration
- Cursor ink-trails from interactive digital calligraphy
- Peace as an evolving and participatory act (represented by color & trace)

---
