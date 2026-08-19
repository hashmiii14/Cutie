import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cutie - Play Free Online Games",
  description: "Discover top 100 trending online games on Cutie. Fast, high performance, Poki-style free gaming platform.",
  keywords: ["online games", "free games", "poki games", "cutie games", "html5 games"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="poki-bg-pattern min-h-screen antialiased text-slate-800">
        {children}
      </body>
    </html>
  );
}
