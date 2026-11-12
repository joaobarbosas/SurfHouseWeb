<div align="center">

# 🏄 Crystal Point Surf Ranch

### Cinematic, scroll-driven landing page

![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-Frontend-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

A front-end portfolio project featuring a scroll-controlled canvas hero, motion-driven sections, and a premium editorial layout.

</div>

## Overview

Crystal Point Surf Ranch is a **demonstration landing page**, not a verified commercial client project. Its central interaction renders a sequence of **193 JPEG frames** on an HTML canvas as the user scrolls, creating a cinematic transition without seeking through a video element.

## Stack

- **Next.js 16** with App Router and **React 19**
- **TypeScript**
- **Tailwind CSS v4**
- **Framer Motion**
- **Lucide React** icons
- **Bodoni Moda** and **Jost** typography

## Highlights

- Scroll-linked canvas animation powered by `requestAnimationFrame`
- Responsive full-screen hero with a cover-fit drawing strategy
- Floating navigation, editorial sections and motion transitions
- Testimonial carousel and footer email-capture interface
- Reduced-motion preference detection in the hero component

## Getting started

**Prerequisites:** a Node.js version supported by Next.js 16 and npm.

```bash
git clone https://github.com/joaobarbosas/SurfHouseWeb.git
cd SurfHouseWeb
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Other available commands:

```bash
npm run lint
npm run build
npm run start
```

> These commands come from `package.json`. The build, lint and full browser experience have **not been independently verified** as passing here.

## How the scroll hero works

The component `components/scroll-hero.tsx`:

1. Loads JPEG images from `public/frames/`.
2. Converts scroll position into a frame index.
3. Draws the current frame to `canvas` using `requestAnimationFrame`.
4. Resizes the canvas with the viewport and redraws the active frame.
5. Checks `prefers-reduced-motion` before enabling scroll-driven updates.

The frame count is defined by `FRAME_COUNT = 193`.

## Project structure

```text
app/              Next.js routes, layout and global styles
components/       UI components and scroll hero
public/           Static assets and animation frames
package.json      Dependencies and scripts
```

## Regenerating animation frames

If you have rights to use the source footage, frames can be generated with FFmpeg:

```bash
ffmpeg -y -i "drone sunset.mp4" -vf "scale=1920:1080" -q:v 3 -f image2 "public/frames/frame_%04d.jpg"
```

When changing the number of images, also update `FRAME_COUNT` in `components/scroll-hero.tsx`.

## Portfolio review notes

- No automated test script is currently declared in `package.json`.
- Check performance and memory usage on mobile devices: loading 193 full-size images can be expensive.
- Verify that image/video assets and fonts are licensed for public portfolio use.
- The email-capture UI should not be presented as a functioning subscription service unless its backend integration is verified.
- The repository currently uses a feature-style default branch name; this is a repository-setting cleanup task, not a requirement for running the app.

## Author

**João Pedro** — Software Developer

[GitHub](https://github.com/joaobarbosas) · [LinkedIn](https://linkedin.com/in/joaopedrosanchess)
