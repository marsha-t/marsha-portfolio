"use client"

import Link from "next/link";
import Image from "next/image";
import { useTheme } from "@/hooks/usetheme";

/**
 * Hero section for the homepage
 * 	Background illustration
 * 	+ overlay text
 * 	+ CTA buttons
 */

export default function Hero() {
  const theme = useTheme();
  const imageSrc = theme === "dark" ? "/sunset-no-text.svg" : "/sunrise-no-text.svg";

  return (
    <section className="relative w-full min-h-[calc(100vh-64px)] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <Image
        src={imageSrc}
        alt="Hero illustration"
        fill
        priority
        className="object-cover scale-110 sm:scale-100"
      />

      {/* Overlay content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 gap-4 sm:gap-6 max-w-xl">

        {/* Name */}
        <h1 className="font-semibold tracking-tight text-[var(--text-hero-primary)] drop-shadow-md text-4xl sm:text-5xl md:text-6xl">
          Marsha Teo
        </h1>

        {/* Tagline */}
        <p className="text-[var(--text-hero-secondary)] drop-shadow-md text-sm sm:text-base md:text-lg max-w-xs sm:max-w-lg leading-relaxed">
          Curious about data, software and how things work
        </p>

        {/* CTA */}
        <Link
          href="/projects"
          className="mt-4 px-8 py-3 rounded-full 
          bg-[var(--surface-glass)]
          backdrop-blur-sm 
          border  border-[var(--border-glass)]
          text-[var(--text-primary)] hover:bg-[var(--surface-glass-hover)] 
          transition tracking-wide"
        >
          Explore Projects
        </Link>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[var(--bg-primary)] to-transparent" />
    </section>
  );
}
