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
    <section className="relative py-28 px-6 bg-gradient-to-b from-white via-sky-50/40 to-white">
      {/* glow */}
      <div className="absolute inset-0 pointer-events-none flex justify-center">
        <div className="w-[900px] h-[500px] bg-sky-200/20 blur-3xl rounded-full mt-24" />
      </div>

      <div className="relative max-w-5xl mx-auto">
        <h2 className="text-3xl font-semibold mb-4">Featured Projects</h2>

        <p className="text-neutral-600 mb-14">
          Selected projects exploring data, software and how things work
        </p>

        <div className="grid md:grid-cols-2 gap-10">
          {featured.map((project, index) => (
            <ProjectCard
              key={project!.slug}
              title={project!.title}
              description={project!.summary}
              image={project!.image}
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
              group flex items-center justify-center rounded-2xl border
              border-dashed border-neutral-300 bg-neutral-50 p-10
              hover:bg-neutral-100 transition
            "
          >
            <div className="text-center">
              <div className="text-3xl mb-3 group-hover:translate-x-1 transition">
                →
              </div>

              <div className="font-semibold">More Projects</div>

              <p className="text-sm text-neutral-500 mt-1">
                Explore all my work
              </p>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}