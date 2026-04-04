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

            prose-h1:text-4xl
            prose-h2:text-2xl
            prose-h3:text-xl

            [&_h1_a]:no-underline
            [&_h2_a]:no-underline
            [&_h3_a]:no-underline
            
            [&_h1_a:hover]:underline
            [&_h2_a:hover]:underline
            [&_h3_a:hover]:underline

            [&_h1_a]:font-bold
            [&_h2_a]:font-bold
            [&_h3_a]:font-semibold

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

// [&_h1>a]:font-bold
            // [&_h2>a]:font-bold
            // [&_h3>a]:font-semibold
