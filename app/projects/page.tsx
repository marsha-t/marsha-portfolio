import { getAllContentMeta } from "@/lib/content";
import ProjectCard from "@/components/ProjectCard";

export const metadata = {
  title: "Projects",
};

export default function ProjectsPage() {
  const projects = getAllContentMeta("projects");

  // Split featured
  const featured = projects.filter((p) => p.featured);

  const allProjects = projects;
  // Group projects by year
  const projectsByYear = allProjects.reduce(
    (acc, project) => {
      const year = project.year || "Other";

      if (!acc[year]) {
        acc[year] = [];
      }

      acc[year].push(project);

      return acc;
    },
    {} as Record<string, typeof allProjects>,
  );

  Object.values(projectsByYear).forEach((projects) => {
    projects.sort((a, b) => Number(b.featured) - Number(a.featured));
  });

  // Sort years descending
  const sortedYears = Object.keys(projectsByYear).sort(
    (a, b) => Number(b) - Number(a),
  );

  return (
    <main className="max-w-5xl mx-auto py-20 px-6">
      {/* Page title */}
      <h1 className="text-4xl font-bold mb-4 text-[var(--text-primary)]">Projects</h1>
      <p className="mt-3 mb-8 text-[var(--text-muted)] max-w-2xl ">
        A collection of things I’ve built
      </p>

      {/* Featured */}
      <section className="mb-24">
        <h2 className="text-2xl font-semibold mb-10 text-[var(--text-primary)]">Featured</h2>

        <div className="grid gap-12">
          {featured.map((project) => (
            <ProjectCard
              key={project.slug}
              title={project.title}
              description={project.summary}
              image={project.image}
              imagePosition={project.imagePosition}
              href={`/projects/${project.slug}`}
              tech={project.tech}
              variant="featured"
            />
          ))}
        </div>
      </section>

      {/* Timeline */}
      <div className="max-w-5xl mx-auto px-6 my-20">
        <div className="h-px bg-[var(--border-accent)]" />
      </div>
      <section>
        <h2 className="text-2xl font-semibold mb-10 text-[var(--text-primary)]">All Projects</h2>

        <div className="relative  space-y-20">
          <div className="absolute left-2 top-0 bottom-0 w-px bg-[var(--border-accent)]" />
          {sortedYears.map((year) => (
            <div key={year} className="relative pl-8">
              
              {/* dot */}
              <div
                className="
                absolute left-2 top-1
                w-2.5 h-2.5
                -translate-x-1/2
                bg-[var(--border-accent-strong)]
                rounded-full
              "
              />

              {/* year */}
              <h3 className="ml-6 mb-4 text-sm uppercase tracking-wider text-gray-400">
                {year}
              </h3>

              <div className="grid md:grid-cols-2 gap-8">
                {projectsByYear[year].map((project) => (
                  <ProjectCard
                    key={project.slug}
                    title={project.title}
                    description={project.summary}
                    image={project.image}
                    imagePosition={project.imagePosition}
                    href={`/projects/${project.slug}`}
                    tech={project.tech}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
