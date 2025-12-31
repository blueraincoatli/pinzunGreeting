# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A 2026 New Year greeting web app for "品尊国际" (Pinzun International). Built with React 19, Vite, TypeScript, and Framer Motion. The app features an interactive fireworks display with state-based navigation.

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production (TypeScript check + Vite build)
npm run build

# Preview production build
npm run preview
```

## Environment Setup

Create `.env.local` with:
```
GEMINI_API_KEY=your_api_key_here
```

Note: The app currently uses Cloudinary-hosted media (video/audio) and does not actively use the Gemini API key. The key may be reserved for future AI features.

## Architecture

### State Machine Flow

The app follows a linear state progression defined in `types.ts`:

```
LANDING → INTRO → INTERACTIVE → FINALE
   ↑                             ↓
   └────────── (reset) ←──────────┘
```

- **LANDING**: Initial landing page with "开启新篇章" (Enter New Journey) button
- **INTRO**: Introductory video plays (Cloudinary video hosted)
- **INTERACTIVE**: User can swipe up to launch fireworks
- **FINALE**: Shows "新年快乐 2026" greeting after 6 fireworks

### Core Components

| Component | Purpose |
|-----------|---------|
| `App.tsx` | Main state machine, audio management, gesture handling |
| `FireworksCanvas.tsx` | Canvas rendering layer using imperative ref pattern |
| `IntroVideo.tsx` | Intro video with skip functionality |
| `FireworkEngine` (class) | Pure canvas physics engine for fireworks simulation |

### Key Design Patterns

**Imperative Canvas Ref**: `FireworksCanvas` exposes a `launch(x?: number)` method via `useImperativeHandle` to allow the parent App component to trigger fireworks programmatically.

**Audio Management**: BGM (background music) is managed via a ref to `HTMLAudioElement` to ensure continuous playback across state transitions. SFX (explosion sounds) are created as one-shot instances that auto-cleanup after 4 seconds.

**Gesture Detection**: Swipe-up gesture is detected by tracking touch/mouse Y delta (>50px threshold). The gesture also triggers BGM playback if blocked by browser autoplay policies.

### Media Assets

All media is hosted on Cloudinary:
- BGM: `greeting_frpuny.mp3` (looping background music)
- SFX: `yanhua_01_hns9ig.mp3` (31s firework explosion soundscape)
- Intro Video: `pinzun_u4cf5t.mp4` (4:3 aspect ratio intro video)

### Styling Notes

- Primary accent color: `#d4af37` (gold)
- Typography uses `chinese-font` class (likely a custom font in index.html)
- Tailwind CSS utility classes used throughout
- Framer Motion for animations

### Tech Stack Details

- React 19 with TypeScript strict mode
- Vite 6 for bundling
- Framer Motion 12 for animations
- Canvas API for fireworks (no external libraries)

## Build Output

Build outputs to `dist/` directory with no sourcemaps.
