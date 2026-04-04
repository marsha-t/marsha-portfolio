import Link from "next/link";
import Image from "next/image";

/**
 * Hero section for the homepage
 * 	Background illustration
 * 	+ overlay text
 * 	+ CTA buttons
 */

export default function Hero() {
  return (
    <section className="relative w-full min-h-[calc(100vh-64px)] flex flex-col items-center justify-center overflow-hidden">
      {/* Background image */}
      <Image
        src="/sunrise-no-text.svg"
        alt="Sunrise illustration"
        fill
        priority
        className="object-cover"
      />

      <div className="absolute inset-0 text-center px-6">
        {/* Name */}
        <h1
          className="
            absolute left-1/2 -translate-x-1/2
            font-semibold tracking-tight drop-shadow-sm text-stone-700
          "
          style={{
            top: "39%", // base
            fontSize: "clamp(2.5rem, 4vw, 4.2rem)", // smaller vw
          }}
        >
          Marsha Teo
        </h1>

        {/* Tagline */}
        <p
          className="
            absolute left-1/2 -translate-x-1/2
            opacity-90 text-stone-800 whitespace-nowrap
          "
          style={{
            top: "55%",
            fontSize: "clamp(0.95rem, 1.2vw, 1.2rem)",
          }}
        >
          Curious about data, software and how things work
        </p>

        {/* CTA */}
        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{ top: "70%" }}
        >
          <Link
            href="/projects"
            className="px-8 py-3 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-gray-900 hover:bg-white/30 transition tracking-wide"
          >
            Explore Projects
          </Link>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
