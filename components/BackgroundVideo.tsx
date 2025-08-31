"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  onEnded: () => void;
  onSkip?: () => void;
  className?: string;
  /** set to true only if you actually want the gradient darkening */
  dimmed?: boolean;
};

export default function BackgroundVideo({ onEnded, onSkip, className, dimmed = false }: Props) {
  const vidRef = useRef<HTMLVideoElement | null>(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const v = vidRef.current;
    if (!v) return;
    const handleEnded = () => onEnded();
    v.addEventListener("ended", handleEnded);

    // ensure autoplay muted works on mobile
    v.muted = isMuted;
    v.play().catch(() => { /* ignored — mobile will wait for a user gesture */ });

    return () => v.removeEventListener("ended", handleEnded);
  }, [onEnded, isMuted]);

  const toggleAudio = async () => {
    const v = vidRef.current;
    if (!v) return;
    try {
      const next = !isMuted;
      v.muted = next;
      setIsMuted(next);
      // play() after user gesture ensures audio starts if unmuted
      await v.play();
    } catch {
      /* ignore */
    }
  };

  return (
    <div className={`fixed inset-0 z-10 ${className ?? ""}`}>
      <video
        ref={vidRef}
        className="w-full h-full"
        playsInline
        autoPlay
        muted={isMuted}
        preload="auto"
      >
        {/* Portrait = mobile */}
        <source src="/videos/flightquest_intro_mobile.mp4" type="video/mp4" media="(orientation: portrait)" />
        {/* Landscape = desktop */}
        <source src="/videos/flightquest_intro_desktop.mp4" type="video/mp4" media="(orientation: landscape)" />
        {/* Fallback */}
        <source src="/videos/flightquest_intro_desktop.mp4" type="video/mp4" />
      </video>

      {/* Top-right controls */}
      <div className="absolute top-4 right-4 z-20 flex gap-2">
        {onSkip && (
          <button
            onClick={onSkip}
            className="rounded-full bg-black/50 hover:bg-black/70 px-3 py-1 text-sm border border-white/20"
            aria-label="Skip intro"
          >
            Skip
          </button>
        )}
        <button
          onClick={toggleAudio}
          className="rounded-full bg-black/50 hover:bg-black/70 px-3 py-1 text-sm border border-white/20"
          aria-pressed={!isMuted}
        >
          {isMuted ? "Enable Audio" : "Mute"}
        </button>
      </div>

      {/* Optional dimming, off by default */}
      {dimmed && <div className="overlay-gradient absolute inset-0 pointer-events-none z-0" />}
    </div>
  );
}
