"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import EmailSignup from "./EmailSignup";

type Props = { visible: boolean };

export default function MenuOverlay({ visible }: Props) {
  const [musicEnabled, setMusicEnabled] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!visible) return;
    const audio = new Audio("/audio/menu-music.mp3");
    audio.loop = true;
    audio.volume = 0.6;
    audioRef.current = audio;
    audio.play().then(() => setMusicEnabled(true)).catch(() => setMusicEnabled(false));
    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, [visible]);

  const handleToggleMusic = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      a.play().then(() => setMusicEnabled(true)).catch(() => setMusicEnabled(false));
    } else {
      a.pause();
      setMusicEnabled(false);
    }
  };

  return (
    <div
      className={`pointer-events-none fixed inset-0 flex items-center justify-center transition-opacity duration-700 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      aria-hidden={!visible}
    >
      <div className="pointer-events-auto w-full max-w-3xl mx-auto px-6">
        <div className="backdrop-blur-md bg-black/40 rounded-2xl shadow-glow p-6 md:p-10 border border-white/10">
          <h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight">
            FlightQuest
          </h1>
          <p className="mt-2 text-white/80 md:text-lg">
            Explore AI-powered flight labs — learn, test, and play.
          </p>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/landing-lab"
              className="rounded-xl border border-white/20 bg-white/10 hover:bg-white/15 transition p-4 text-center"
            >
              Landing Lab
            </Link>
            <Link
              href="/collision-avoidance-lab"
              className="rounded-xl border border-white/20 bg-white/10 hover:bg-white/15 transition p-4 text-center"
            >
              Collision Avoidance Lab
            </Link>
          </div>

          <div className="mt-8">
            <EmailSignup />
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button
              onClick={handleToggleMusic}
              className="rounded-lg border border-white/20 bg-white/10 hover:bg-white/15 px-3 py-1 text-sm"
            >
              {musicEnabled ? "Pause Menu Music" : "Play Menu Music"}
            </button>
            <span className="text-xs text-white/60">
              Tip: Some browsers require a click to start audio.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
