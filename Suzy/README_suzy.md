# Dove in the Dream
##### Meditation
### User Input
### Group D

| Name              | Unikey     |  
|-------------------|------------|  
| Su Lyu            | slyu0503   |

## Project Overview

This project is an individual extension of the group-coded pigeon dot-matrix base. It transforms a static pixel image into an interactive neon-infused drawing and particle experience. The work is inspired by cyberpunk aesthetics and designed to explore **user interaction as a primary driver of animation**.

## How to Interact

- **Click** near the dove to trigger an **explosive burst** of glowing particles
- **Drag** the mouse to draw **cyberpunk-style glowing characters**
- **Press `R`** to reset the page
- **Press `S`** to save PNG image
- **Press `Q`** to change background color

## My Individual Animation Approach

While the original group code visualized a dove with elastic particle dots, my version expands it by:
- **Adding stylized drawing interactions** using p5.js `createGraphics()`
- **Replacing grayscale dot visuals** with vibrant **cyberpunk color palettes** and characters (`*, #, |, >, 0, 1`)
- **Eliminating auto-rotation and mouse-orbit logic** to focus on user-driven effects only
- **Incorporating explosion physics** with damping and recovery for each particle

These changes result in a more **expressive, interactive, and aesthetic-focused experience**, highlighting the visual pleasure of user disruption and creation.

## Animation Driver: User Input

This version uses **mouse input** to animate and transform the artwork. Key behaviors include:
- Clicking near particles (brush strokes) triggers a **cyber-style explosion** effect
- Dragging the mouse leaves behind **layered glowing characters**, simulating a digital graffiti trail
- No automatic motion or external timing — all changes are **directly user-controlled**


## Technical Breakdown

- `BrushStroke` class handles particle position, explosion velocity, and recovery logic
- `addPaintMark()` uses `createGraphics()` to place glowing character layers on a transparent canvas
- Color palettes use RGBA values for **neon effects**
- `mousePressed` and `mouseDragged` are the only triggers — **no frame-based automation**
- `keyPressed` supports utility shortcuts (`R`, `S`, `Q`) for interactivity

## Inspiration

This piece is visually inspired by:
- **Cyberpunk digital art** (e.g., _Blade Runner_)
- **Interactive graffiti art** and **digital calligraphy**
- The idea of “disruption and restoration” in modern visual coding

## Repository Contents

- `sketch.js`: Main p5.js animation code
- `assets/dovefinal.png`: Base image for dove outline
- `README.md`: This file
- `index.html`: HTML wrapper for browser launch

## Acknowledgments & Tools

- Built using [p5.js](https://p5js.org/)
- Image: Custom dove silhouette (group base)
- Character & color inspiration from [cyberpunk color palette](https://lospec.com/palette-list/cyberpunk-neon)
- Developed with VS Code

> This submission is my own work and follows the academic integrity requirements of the University of Sydney.
