"use client";

import { useState } from "react";
import Link from "next/link";
import BackgroundVideo from "../components/BackgroundVideo";
import EmailSignup from "../components/EmailSignup";

export default function HomePage() {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <main className="relative min-h-screen">
      {/* Intro video (hidden after end/skip) */}
      {!showMenu && (
        <BackgroundVideo
          onEnded={() => setShowMenu(true)}
          onSkip={() => setShowMenu(true)}
          dimmed={false} // keep video bright
        />
      )}

      {/* Post-intro hero: logo as background + buttons + signup */}
      {showMenu && (
        <div
          className="fixed inset-0 -z-10"
          style={{
            backgroundColor: "#0a0d12",
            //backgroundImage: "url('/images/flightquest_logo.png')",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        />
      )}

      {/* Foreground overlay for legibility (only after intro) */}
      {showMenu && <div className="overlay-gradient fixed inset-0 pointer-events-none -z-10" />}

      {/* Content */}
      <section className="relative z-0 min-h-screen flex items-center justify-center p-6">
        {!showMenu ? (
          // Small branding watermark during intro (non-interactive so Skip remains clickable)
          <div className="fixed inset-x-0 bottom-0 p-6 md:p-10 pointer-events-none z-20">
            <div className="max-w-7xl mx-auto">
              <div className="inline-flex items-baseline gap-3 backdrop-blur-md bg-black/30 border border-white/10 rounded-xl px-4 py-2">
                <span className="text-lg md:text-2xl font-bold tracking-tight">FlightQuest</span>
                <span className="text-xs md:text-sm text-white/70">Wanna Fly?</span>
              </div>
            </div>
          </div>
        ) : (
          // Menu card after intro
          <div className="w-full max-w-3xl mx-auto">
            <div className="relative backdrop-blur-md bg-black/40 rounded-2xl shadow-[0_0_40px_rgba(64,199,255,0.25)] p-6 md:p-10 border border-white/10">
              {/* little logo in the upper-right */}
              <div className="absolute top-6 right-6 pointer-events-none">
                <img
                  src="/images/flightquest_mark.png"
                  alt="FlightQuest"
                  className="h-12 w-12 object-contain opacity-90"
                />
              </div>

              <h1 className="font-semibold text-3xl md:text-5xl tracking-tight">FlightQuest</h1>
              <p className="mt-2 text-white/80 md:text-lg">
                Explore our AI-powered flight labs — learn, test, and play.
              </p>

              {/* Buttons */}
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

              {/* Suggestion Box + Email */}
              <div className="mt-8">
                <EmailSignup />
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
