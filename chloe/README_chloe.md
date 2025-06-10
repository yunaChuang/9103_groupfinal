# Dove in the Dream – Meditation  
### Sound  
### Group D  

| Name              | Unikey     |  
|-------------------|------------|  
| Chloe KU          | chku0036   |

## How to Interact

1. **Click** anywhere on the canvas to begin the rhythmic pulse.
2. The **entire image subtly expands and contracts over time**, evoking a breathing or meditative rhythm.
3. **Click** on any dot to colorize it temporarily.
4. **Double-click** on a dot to release a small firework animation from that location.
5. Observe how **dot behavior and display** follow a looping time-based pattern that changes the strength of their movements.


## My Individual Animation Approach

I chose **Time-Based Animation** as my method to animate the group artwork. My goal was to create a meditative, breathing-like movement that gives life to the dove image using expansion and contraction cycles over time. I also added an interactive coloring and firework feature as playful visual touches.

### Key Enhancements:
- A **state-based loop** (`expanding → contracting → waiting`) driven by time and a frame-based counter (`stateTimer`).
- A **pulse-like effect** that affects all dots’ movement intensity (`explosionStrength`), creating a unified wave of expansion and return.
- Optional **user interaction** that lets users click to trigger color changes or fireworks for momentary contrast.


## Animation Driver

- **Main Driver:** Time (via a cyclical timer controlling `explosionStrength`)
- **Secondary Driver:** User interaction (clicks and double-clicks)

## Animated Properties

## ✨ Animated Properties

| Property           | What It Does                                                       | How Mine Is Different                      |
|--------------------|---------------------------------------------------------------------|---------------------------------------------|
| **Breathing Motion** | Dots expand and contract over time in a slow, looped rhythm         | Only mine uses a timed loop (`stateTimer`)   |
| **Color Click**     | Click to color a dot temporarily; it fades back smoothly            | Others use random or constant color changes |
| **Fireworks**       | Double-click near a dot triggers a short firework burst             | Only mine includes timed visual explosions  |
| **Dot Movement**    | Dots are pushed and pulled based on `explosionStrength`             | My motion is clean and time-synced          |
| **Timing System**   | Uses `updateState()` to control expanding, contracting, and waiting | Others rely on Perlin noise or input        |
| **Overall Feel**    | Calm, meditative, and structured                                    | Less chaotic, more rhythmically balanced    |


## Inspiration

I was inspired by:
- The concept of **rhythmic meditation** — using animation to visually simulate breath or heartbeat.
- **Fireworks as emotional sparks** — short, bright bursts representing fleeting thoughts.
- The dove's symbolic calmness, which I wanted to match with soft, flowing animation patterns.

## Technical Explanation

- **Dots (dove shape):** Sampled from dark pixels in the dove image and scattered using vector math.
- **`explosionStrength`:** A time-based value controlling the force applied to move dots outward and inward.
- **`updateState()`:** Controls a looping state machine (`expanding`, `contracting`, `waiting`) with frame-based timing.
- **Interactive coloring:** Clicked dots turn colorful for a limited time using `lerpColor()` to fade back.
- **Firework particles:** `FireworkDot` instances are created on double-click with randomized velocities and alpha fade-out.


## Changes to Group Code

To implement my version, I modified the group code as follows:
- Added a **time-driven loop** that changes dot motion over time.
- Created a **new class for fireworks** with fading and velocity updates.
- Implemented **click-based color transitions** and a lifespan system for animated fades.


## Tools & External Techniques

- **ChatGPT:** Used for help structuring the time-based logic and learning how to express vector-based animation in code. I described ideas and asked for coding help when needed.
- **[p5.js](https://p5js.org/):** Used as the foundation for all canvas drawing, animation, and interaction. Official documentation helped with specific functions and vector behaviors.
