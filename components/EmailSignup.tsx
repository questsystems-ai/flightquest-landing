"use client";

import { useId, useRef, useState } from "react";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!;

type Status = "idle" | "loading" | "success" | "error";

export default function EmailSignup() {
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const emailId = useId();
  const feedbackId = useId();
  const widgetRef = useRef<TurnstileInstance>(null);

  const resetWidget = () => {
    try {
      widgetRef.current?.reset();
    } catch {}
    setToken(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email) return;
    if (!token) {
      setErrorMsg("Please complete the human verification.");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, feedback, token }),
      });

      const json = await res.json();
      if (!res.ok || !json?.ok) throw new Error(json?.error || "Server error");

      setStatus("success");
      setEmail("");
      setFeedback("");
      resetWidget();
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err?.message ?? "Unknown error");
      resetWidget();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {/* Email row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <label htmlFor={emailId} className="sr-only">Email</label>
        <input
          id={emailId}
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email for progress updates"
          className="flex-1 rounded-lg bg-white/10 border border-white/20 px-4 py-3 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/60"
          autoComplete="email"
        />
        <button
          type="submit"
          className="rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-5 py-3 transition"
          disabled={status === "loading"}
        >
          {status === "loading" ? "Submitting..." : "Submit"}
        </button>
      </div>

      {/* Suggestion Box (optional) */}
      <div className="mt-1">
        <div className="flex items-center justify-between">
          <label htmlFor={feedbackId} className="text-sm text-white/80">
            Suggestion Box (optional)
          </label>
          <span className="text-xs text-white/50">{feedback.length}/1000</span>
        </div>
        <textarea
          id={feedbackId}
          value={feedback}
          onChange={(e) => {
            const v = e.target.value;
            if (v.length <= 1000) setFeedback(v);
          }}
          placeholder="Feedback, ideas, connections, collab requests — we want to hear it."
          className="mt-1 w-full min-h-[96px] rounded-lg bg-white/10 border border-white/20 px-4 py-3 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/60 resize-y"
        />
      </div>

      {/* Turnstile widget */}
      <div className="mt-1">
        <Turnstile
          ref={widgetRef}
          siteKey={SITE_KEY}
          onSuccess={(tok) => setToken(tok)}
          onExpire={() => setToken(null)}
          onError={() => setToken(null)}
          // refreshExpired removed for maximum version compatibility
          options={{ theme: "dark" }}
        />
        <p className="mt-1 text-xs text-white/50">This protects FlightQuest from spam.</p>
      </div>

      {/* Status line */}
      {status === "success" && (
        <div className="text-sm text-green-300">Thanks! You’re on the list.</div>
      )}
      {(status === "error" || errorMsg) && (
        <div className="text-sm text-red-300">
          Something went wrong. {errorMsg ? `(${errorMsg})` : "Please try again."}
        </div>
      )}
    </form>
  );
}
