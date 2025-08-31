// app/api/signup/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseServer } from "@/lib/supabaseServer";

const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

type Payload = {
  email?: string;
  feedback?: string | null;
  token?: string; // turnstile token from client
};

function hashKey(s: string) {
  const salt = process.env.RATE_SALT ?? "fallback-salt";
  return crypto.createHmac("sha256", salt).update(s).digest("hex");
}

// very basic, in-memory burst limiter (per process)
// For real prod, use Upstash/Redis or Supabase RLS throttling.
const seen = new Map<string, { count: number; ts: number }>();
const WINDOW_MS = 15 * 60 * 1000; // 15 min
const MAX_IN_WINDOW = 8;

function allowRate(ip: string, email: string) {
  const key = hashKey(`${ip}|${email}`);
  const now = Date.now();
  const rec = seen.get(key);
  if (!rec || now - rec.ts > WINDOW_MS) {
    seen.set(key, { count: 1, ts: now });
    return true;
  }
  if (rec.count >= MAX_IN_WINDOW) return false;
  rec.count += 1;
  return true;
}

export async function POST(req: Request) {
  try {
    const { email, feedback, token } = (await req.json()) as Payload;

    if (!email || !token) {
      return NextResponse.json({ ok: false, error: "Missing email or token" }, { status: 400 });
    }

    // Rate limit early
    const ip = (req.headers.get("x-forwarded-for") || "0.0.0.0").split(",")[0].trim();
    if (!allowRate(ip, email)) {
      return NextResponse.json({ ok: false, error: "Too many attempts. Try later." }, { status: 429 });
    }

    // Verify with Turnstile
    const secret = process.env.TURNSTILE_SECRET_KEY;
    if (!secret) {
      return NextResponse.json({ ok: false, error: "Server misconfigured (no secret)" }, { status: 500 });
    }

    const formData = new FormData();
    formData.append("secret", secret);
    formData.append("response", token);
    formData.append("remoteip", ip);

    const verifyRes = await fetch(SITEVERIFY_URL, { method: "POST", body: formData });
    const verifyJson = await verifyRes.json();

    // { success: boolean, "error-codes": string[], ... }
    if (!verifyJson?.success) {
      return NextResponse.json(
        { ok: false, error: "Human verification failed", detail: verifyJson },
        { status: 403 }
      );
    }

    // Insert into Supabase
    const { error } = await supabaseServer
      .from("flightquest_signups")
      .insert([{ email, feedback: (feedback ?? "").trim() || null }]);

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? "Unknown error" }, { status: 500 });
  }
}
