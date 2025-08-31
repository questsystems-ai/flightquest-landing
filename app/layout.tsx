import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FlightQuest",
  description: "FlightQuest — AI flight labs and STEM adventures",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-night text-white antialiased">{children}</body>
    </html>
  );
}
