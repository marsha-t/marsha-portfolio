import { getAllContentMeta } from "@/lib/content";
import ProjectCard from "./ProjectCard";
import Link from "next/link";

export default function FeaturedProjects() {
  const projects = getAllContentMeta("projects");

  // Curated order
  const featuredSlugs = ["transcendence", "webserv"];

  const featured = featuredSlugs
    .map((slug) => projects.find((p) => p.slug === slug))
    .filter(Boolean);

  return (
    <section className="relative py-28 px-6 ">
      <div className="relative max-w-5xl mx-auto">
        <h2 className="text-3xl font-semibold mb-4 text-[var(--text-primary)]">Featured Projects</h2>

        <p className="text-[var(--text-muted)] mb-14">
          Selected projects exploring data, software and how things work
        </p>

        <div className="grid md:grid-cols-2 gap-10">
          {featured.map((project, index) => (
            <ProjectCard
              key={project!.slug}
              title={project!.title}
              description={project!.summary}
              image={project!.image}
              imagePosition={project!.imagePosition}
              href={`/projects/${project!.slug}`}
              tech={project!.tech}
              variant={index === 0 ? "featured" : undefined}
              className={index === 0 ? "md:col-span-2" : ""}
            />
          ))}

          {/* More projects */}
          <Link
            href="/projects"
            className="
              group block
              rounded-2xl
              border border-[var(--border-default)]
              bg-[var(--bg-primary)] backdrop-blur-sm
              p-10
              transition-all duration-300
              hover:-translate-y-1 hover:shadow-lg
            "
          >
            <div className="relative flex flex-col items-center justify-center text-center h-full ">
              {/* Arrow */}
              <div className="
                text-3xl mb-4
                transition-all duration-300
                group-hover:translate-x-2 group-hover:scale-110
              ">
                →
              </div>

              {/* Title */}
              <div className="font-semibold text-[var(--text-primary)]">
                More Projects
              </div>

              {/* Subtitle */}
              <p className="text-sm text-[var(--text-muted)] mt-1">
                Explore all my work
              </p>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
