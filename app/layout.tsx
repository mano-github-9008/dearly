import type { Metadata } from "next";
import "./globals.css";
import { BookOpen, Github } from "lucide-react";

export const metadata: Metadata = {
  title: "Dearly Universal LMS",
  description: "One simple home for courses, videos, and learning materials.",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <header className="topbar">
          <a className="brand" href="/">
            <span className="brand-icon">MS</span>
            <span>
              Dearly<span className="brand-dot">.</span>
            </span>
          </a>
          <nav>
            <a href="/">Explore</a>
            <a href="/admin">Creator studio</a>
          </nav>
          <a className="nav-cta" href="/admin">
            Create course <span>↗</span>
          </a>
        </header>
        {children}
        <footer className="footer">
          <a className="brand footer-brand" href="/">
            <span className="brand-icon">
              <BookOpen size={16} />
            </span>
            Dearly.
          </a>
          <span>One place for everything you learn.</span>
          <span>Built with Next.js + Supabase</span>
        </footer>
      </body>
    </html>
  );
}
