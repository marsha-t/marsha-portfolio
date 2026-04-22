"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sun, Moon } from "lucide-react";

export default function Navbar() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved) {
      setTheme(saved);
      document.documentElement.dataset.theme = saved;
    }
  }, []);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    localStorage.setItem("theme", next);
  }

  return (
    <nav className="sticky top-0 z-50 bg-[var(--background)] border-b border-[var(--border)]">
      <div className="max-w-3xl mx-auto flex justify-center items-center gap-8 py-4 text-sm text-neutral-500">
        {/* links */}
        <div className="flex gap-8 mx-auto text-neutral-500">
          <Link href="/">Home</Link>
          <Link href="/projects">Projects</Link>
          <Link href="/writing">Writing</Link>
          <Link href="/about">About</Link>
        </div>

        {/* toggle */}
        <button
          onClick={toggleTheme}
          className="group absolute right-6 
            text-[var(--muted)] hover:text-[var(--foreground)] transition 
            p-2 rounded-md hover:bg-[var(--card)]"
        >
          <div className="relative w-6 h-6  transition-colors duration-500 ease-in-out">
            <Sun
              className={`text-amber-400 absolute left-0 right-0 transition-all duration-500 ${
                theme === "dark"
                  ? "translate-y-0 opacity-100"
                  : "translate-y-2 opacity-0"
              }`}
            />
            <Moon
              className={`text-slate-400 absolute left-0 right-0 transition-all duration-500 ${
                theme === "dark"
                  ? "-translate-y-2 opacity-0"
                  : "translate-y-0 opacity-100"
              }`}
            />
          </div>
        </button>
      </div>
    </nav>
    // <nav className="sticky top-0 z-50 bg-white border-b border-sky-200/50">
    // <div className="max-w-3xl mx-auto flex justify-center gap-8 py-4 text-sm text-neutral-500">
    //   <Link className="hover:text-slate-800 hover:underline underline-offset-2 transition-colors" href="/">
    //     Home
    //   </Link>
    //   <Link
    //     className="hover:text-slate-800 hover:underline underline-offset-2 transition-colors"
    //     href="/projects"
    //   >
    //     Projects
    //   </Link>
    //   <Link className="hover:text-slate-800 hover:underline underline-offset-2 transition-colors" href="/writing">
    //     Writing
    //   </Link>
    //   <Link className="hover:text-slate-800 hover:underline underline-offset-2 transition-colors" href="/about">
    //     About
    //   </Link>
    // </div>
    // </nav>
  );
}
