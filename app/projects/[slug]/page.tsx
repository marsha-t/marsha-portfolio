import { getContentBySlug, getAllContentMeta } from "@/lib/content";
import Sidebar from "@/components/Sidebar";

export async function generateStaticParams() {
  const posts = getAllContentMeta("projects");

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getContentBySlug("projects", slug);

  return (
    <main className="max-w-6xl mx-auto py-16 px-6">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-12">
        {/* Main content */}
        <article
          className="
            prose prose-neutral
            max-w-none
            prose-headings:scroll-mt-24
            prose-img:rounded-lg
            prose-img:mx-auto
            prose-pre:bg-neutral-900
            prose-pre:text-neutral-100
          "
          dangerouslySetInnerHTML={{ __html: project.contentHtml }}
        />
       <aside className="hidden lg:block">
        <Sidebar project={project} />
      </aside>
      </div>
    </main>
  );
}
