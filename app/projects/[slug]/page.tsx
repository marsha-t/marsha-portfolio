import { getContentBySlug, getAllContentMeta } from "@/lib/content";

export async function generateStaticParams() {
  const posts = getAllContentMeta("writing");

  return posts.map((post) => ({
	slug: post.slug,
  }));
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = await getContentBySlug("projects", slug)

  return (
    <main className="max-w-3xl mx-auto py-16 px-6">
      <h1 className="text-3xl font-bold mb-4">
        {project.title}
      </h1>

      <p className="text-sm text-gray-500 mb-8">
        {project.date}
      </p>

      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: project.contentHtml }}
      />
    </main>
  )
}