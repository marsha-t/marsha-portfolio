import Link from "next/link"
import { getAllContentMeta } from "@/lib/content"

export default function ProjectsPage() {
  const projects = getAllContentMeta("projects")

  return (
    <main className="max-w-3xl mx-auto py-16 px-6">
      <h1 className="text-3xl font-bold mb-8">Projects</h1>

      <div className="space-y-8">
        {projects.map((project) => (
          <article key={project.slug}>
            <h2 className="text-xl font-semibold">
              <Link href={`/projects/${project.slug}`}>
                {project.title}
              </Link>
            </h2>
            <p className="text-sm text-gray-500">
              {project.date}
            </p>
            <p className="mt-2 text-gray-700">
              {project.summary}
            </p>
          </article>
        ))}
      </div>
    </main>
  )
}