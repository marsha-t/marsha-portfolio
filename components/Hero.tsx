import Link from "next/link";
import Image from "next/image";

/**
 * Hero section for the homepage
 * 	Background illustration
 * 	+ CTA buttons
 */

export default function Hero() {
  return (
    <section className="relative w-full min-h-[calc(100vh-64px)] flex flex-col items-center justify-center overflow-hidden">
      {/* Background image */}
      <Image
        src="/sunrise.svg"
        alt="Sunrise illustration"
        fill
        priority
        className="object-cover"
      />

      <div className="absolute inset-0 text-center px-6">
        {/* CTA button */}
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
