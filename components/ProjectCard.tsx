import Link from "next/link";
import Image from "next/image";

type ProjectCardProps = {
  title: string;
  description: string;
  image: string;
  imageDark?: string;
  imagePosition?: string;
  href: string;
  tech: string[];
  className?: string;
  variant?: "default" | "featured";
};

export default function ProjectCard({
  title,
  description,
  image,
  imageDark,
  imagePosition,
  href,
  tech,
  className = "",
  variant = "default",
}: ProjectCardProps) {
  const imageHeight =
    variant === "featured" ? "h-[280px]" : "h-[180px]";

  const titleSize =
    variant === "featured" ? "text-2xl" : "text-lg";
  
    const position = imagePosition || "object-cover";
  return (
    <Link href={href} className={`group block ${className}`}>
      <div
        className="
        bg-[var(--bg-primary)]
        backdrop-blur-sm
        rounded-2xl
        overflow-hidden
        shadow-sm
        border border-[var(--border-default)]
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-lg
        flex flex-col h-full
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
              ${position}
              transition-transform
              duration-500
              group-hover:scale-105
              ${imageDark ? "block dark:hidden": "block"}
            `}
          />
          {imageDark && (
            <Image
            src={imageDark}
            alt={title}
            width={1200}
            height={700}
            className={`
              w-full
              ${imageHeight}
              ${position}
              transition-transform
              duration-500
              group-hover:scale-105
              hidden dark:block
            `}
          />
          )}
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
        <div className="p-7 flex flex-col flex-1">
          <h3 className={`${titleSize} font-semibold text-[var(--text-primary)]`}>
            {title} 
          </h3>

          <p className="text-[var(--text-muted)] mt-2 leading-relaxed text-sm line-clamp-3">
            {description}
          </p>

          {/* Tech badges */}
          <div className="flex flex-wrap gap-2 mt-4">
            {tech.map((t) => (
              <span
                key={t}
                className="
                text-xs
                bg-[var(--bg-secondary)]
                text-[var(--text-secondary)]
                px-3
                py-1
                rounded-full
              "
              >
                {t}
              </span>
            ))}
          </div>

          <div className="mt-auto pt-5 text-sm font-medium text-[var(--text-primary)] underline">
            View project →
          </div>
        </div>
      </div>
    </Link>
  );
}