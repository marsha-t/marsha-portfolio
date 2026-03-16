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
        src="/hero-sunrise.svg"
        alt="Sunrise illustration"
        fill
        priority
        className="object-cover"
      />

      {/* Gradient overlay in sky */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-50/40 via-transparent to-transparent pointer-events-none" />

      {/* Sun glow overlay */}
      <div className="absolute inset-0 sun-glow pointer-events-none bg-[radial-gradient(circle_at_50%_55%,rgba(255,255,200,0.25),transparent_70%)]" />

      {/* Animated shimmer */}
      <div className="absolute inset-x-0 bottom-0 h-[40%] pointer-events-none shimmer-layer" />

      {/* Text content */}
      <div className="absolute inset-0 text-center px-6">
        {/* Name in the sun */}
        <h1
          className="absolute left-1/2 -translate-x-1/2 text-5xl font-semibold tracking-tight drop-shadow-sm text-stone-600"
          style={{ top: "44%", fontSize: "clamp(2.8rem, 6vw, 4.8rem" }}
        >
          Marsha Teo
        </h1>

        {/* Tagline below horizon */}
        <p
          className="absolute left-1/2 -translate-x-1/2 text-lg max-w-lg opacity-90 "
          style={{ top: "58%", fontSize: "clamp(1rem, 1.8vw, 1.4rem" }}
        >
          Curious about data, software and how things work
        </p>

        {/* CTA button in sea */}
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

      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
