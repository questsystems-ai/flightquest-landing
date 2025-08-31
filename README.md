
# FlightQuest Homepage

A minimal Next.js + Tailwind site that:
- Plays a full-screen intro video (desktop & mobile versions).
- Reveals a menu overlay with buttons to Landing Lab and Collision Avoidance Lab.
- Offers an email signup box (Formspree-ready, with mailto fallback).
- Starts looping menu music after the intro (or after the user clicks Skip).

## Quickstart

npm install
npm run dev
# open http://localhost:3000

## Project structure

app/
  page.tsx                     # Intro -> Menu overlay
  layout.tsx
  globals.css
  landing-lab/page.tsx         # Placeholder
  collision-avoidance-lab/page.tsx  # Placeholder
components/
  BackgroundVideo.tsx
  MenuOverlay.tsx
  EmailSignup.tsx
public/
  videos/flightquest_intro_desktop.mp4   # add your file
  videos/flightquest_intro_mobile.mp4    # add your file
  audio/menu-music.mp3                   # add your loop

## Assets to provide

- Desktop intro video: public/videos/flightquest_intro_desktop.mp4 (16:9 or wider)
- Mobile intro video: public/videos/flightquest_intro_mobile.mp4 (9:16 vertical)
- Menu music: public/audio/menu-music.mp3

Videos must be muted for autoplay to work on mobile.

## Email signup

- If you have a Formspree project, add your form ID in .env.local:
  NEXT_PUBLIC_FORMSPREE_ID=your_form_id_here
- If not set, the signup falls back to a mailto link.

## Linking the lab pages

- Replace the placeholder pages with either internal content or an external redirect.
