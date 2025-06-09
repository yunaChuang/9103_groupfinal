# Dove in the Dream – Meditation  
### Sound  
### Group D  

| Name              | Unikey     |  
|-------------------|------------|  
| Yuan-Yuan Chuang  | ychu0126   |

## How to Interact

1. **Click** anywhere on the canvas to start the music.  
2. **Hold the mouse down** on the dove to enter **Dark Mode** (I called it Cyber Mode in the code sometimes).  
3. **Move your mouse** close to the dots which shape the background of the dove to scatter them. This is the key part to interact with the dove.  
4. **Move your mouse vertically** to control the music's volume with the red ellipse.  
5. **Observe how visual elements shift** between Normal and Dark Mode — colour schemes, particle behaviour, and shapes all transform dynamically.

## My Individual Animation Approach

I focused on adding layers of **audio-driven** and **interactive animation** to enhance the shared group work. My goals were:

- Add **top-row bouncing balls** for audio amplitude visualization.  
- Introduce **mouse position volume control** for an intuitive sound experience.  
- Make a **Dark Mode** that changes both the aesthetic and audio responsiveness of the scene.

## Animation Driver

- **Main Driver:** Sound (Amplitude & FFT analysis)  
- **Secondary Driver:** Interaction (mouse position and clicks)

## Animated Properties

| Property               | Behaviour                                             | Unique Compared to Group         |
|------------------------|------------------------------------------------------|----------------------------------|
| Dot motion             | Dots scatter when the mouse is nearby                | Others use click or static image |
| Colour switching       | Smooth pastel ↔ red/green                            | Others focus on scaling          |
| Sound-reactive circles | Bouncing top-row circles tied to music amplitude     | Unique layer of rhythmic motion  |
| Audio-controlled glow  | Dots pulse and jitter based on amplitude             | Subtle, not present in other code|
| Volume control         | Vertical mouse position maps to audio volume         | Interactive audio not universal  |

## Inspiration

I was inspired by:  
- [Example](https://www.auntyflo.com/dream-dictionary/dreams-about-eyes#google_vignette): Dreams and eyes are highly connected.  
- [Example](https://www.istockphoto.com/photo/close-up-image-of-racing-pigeon-eye-gm1186176382-334586206): Birds and their eyes (sorry for being scary)

## Technical Explanation

- **Dots (dove shape)** are sampled from the image’s dark pixels and scattered via vector math. When the mouse comes close, a repulsion force is applied. This is the main group work.  
- **Amplitude** controls:  
  - Side ellipses  
  - Vertical bounce of top-row circles  
  - The eye blinking  
- **FFT spectrum** is visualized through radial circular bars.  
- **Dark Mode** toggles alternate colour palettes and audio-triggered enhancements.  
- **Mouse position** is mapped to control song volume.

## Changes to Group Code

- The colour of the background dots  
- The density of the background dots  
- A slight change in the way the dots scatter  

## Tools & External Techniques

- ChatGPT helped a lot in explaining the code and improving my understanding of p5.js  
- [p5.js](https://p5js.org)