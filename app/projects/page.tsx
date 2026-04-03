import { getAllContentMeta } from "@/lib/content";
import ProjectCard from "@/components/ProjectCard";

export default function ProjectsPage() {
  const projects = getAllContentMeta("projects");

  // Split featured vs others
  const featured = projects.filter((p) => p.featured);
  const others = projects.filter((p) => !p.featured);

  // Group non-featured projects by year
  const projectsByYear = others.reduce((acc, project) => {
    const year = project.year || "Other";

    if (!acc[year]) {
      acc[year] = [];
    }

    acc[year].push(project);

    return acc;
  }, {} as Record<string, typeof others>);

  // Sort years descending
  const sortedYears = Object.keys(projectsByYear).sort(
    (a, b) => Number(b) - Number(a)
  );

  return (
    <main className="max-w-6xl mx-auto py-20 px-6">

      {/* Page title */}
      <h1 className="text-4xl font-bold mb-16">
        Projects
      </h1>

      {/* Featured */}
      <section className="mb-24">
        <h2 className="text-2xl font-semibold mb-10">
          Featured
        </h2>

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
      <section>
        <h2 className="text-2xl font-semibold mb-12">
          All Projects
        </h2>

        <div className="space-y-16">
          {sortedYears.map((year) => (
            <div key={year}>

              {/* Year label */}
              <h3 className="text-sm uppercase tracking-wider text-gray-400 mb-6">
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