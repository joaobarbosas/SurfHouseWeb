# Crystal Point Surf Ranch

A luxury surf ranch landing page with a cinematic scroll-scrub canvas hero — the Apple product-page effect, built from 193 pre-extracted video frames drawn to a `<canvas>` on scroll.

## Stack

- **Next.js** (App Router) + TypeScript
- **Tailwind CSS v4**
- **Framer Motion** for scroll reveals and micro-interactions
- **Fonts:** Bodoni Moda (headings) + Jost (body/UI)

## Sections

- Floating pill navbar (transparent → frosted glass on scroll)
- Scroll-scrub hero: 193 JPEG frames (1080p) preloaded and blitted to canvas via `requestAnimationFrame` — no `video.currentTime` seeking
- Stats band, manifesto pull quote
- Alternating feature sections with scroll reveals
- Editorial testimonial carousel
- Footer with email capture

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and scroll the hero.

## Regenerating hero frames

Frames in `public/frames/` were extracted from the source drone footage with:

```bash
ffmpeg -y -i "drone sunset.mp4" -vf "scale=1920:1080" -q:v 3 -f image2 "public/frames/frame_%04d.jpg"
```

If the frame count changes, update `FRAME_COUNT` in `components/scroll-hero.tsx`.
