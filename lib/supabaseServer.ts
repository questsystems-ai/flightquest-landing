// lib/supabaseServer.ts
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY; // optional

export const supabaseServer =
  service
    ? createClient(url, service, { auth: { persistSession: false } })
    : createClient(url, anon,   { auth: { persistSession: false } });
