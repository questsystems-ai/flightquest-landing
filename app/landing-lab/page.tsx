import { redirect } from "next/navigation";

// Server component: don't add "use client"
export default function LandingLabPage() {
  redirect("https://landing-lab.vercel.app/becky");
}
