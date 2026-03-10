import Link from "next/link";
import Image from "next/image";

type ProjectCardProps = {
  title: string;
  description: string;
  image: string;
  href: string;
  tech: string[];
  className?: string;
  variant?: "default" | "featured";
};

export default function ProjectCard({
  title,
  description,
  image,
  href,
  tech,
  className = "",
  variant = "default",
}: ProjectCardProps) {
  const imageHeight =
    variant === "featured" ? "h-[280px]" : "h-[180px]";

  const titleSize =
    variant === "featured" ? "text-2xl" : "text-lg";

  return (
    <Link href={href} className={`group block ${className}`}>
      <div
        className="
        bg-white/70
        backdrop-blur-sm
        rounded-2xl
        overflow-hidden
        shadow-sm
        border border-neutral-200
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-lg
      "
      >
        {/* Image */}
        <div className="relative overflow-hidden">
          <Image
            src={image}
            alt={title}
            width={1200}
            height={700}
            className={`
              w-full
              ${imageHeight}
              object-cover
              transition-transform
              duration-500
              group-hover:scale-105
            `}
          />

          <div
            className="
            absolute inset-0
            bg-gradient-to-t
            from-black/10
            to-transparent
            pointer-events-none
          "
          />
        </div>

        {/* Content */}
        <div className="p-7">
          <h3 className={`${titleSize} font-semibold text-neutral-900`}>
            {title}
          </h3>

          <p className="text-neutral-600 mt-2 leading-relaxed text-sm">
            {description}
          </p>

          {/* Tech badges */}
          <div className="flex flex-wrap gap-2 mt-4">
            {tech.map((t) => (
              <span
                key={t}
                className="
                text-xs
                bg-neutral-100
                text-neutral-700
                px-3
                py-1
                rounded-full
              "
              >
                {t}
              </span>
            ))}
          </div>

          <div className="mt-5 text-sm font-medium text-sky-600">
            View project →
          </div>
        </div>
      </div>
    </Link>
  );
}