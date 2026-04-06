import { getContentBySlug, getAllContentMeta } from "@/lib/content";
import Sidebar from "@/components/Sidebar";

export async function generateStaticParams() {
  const posts = getAllContentMeta("projects");

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const project = await getContentBySlug("projects", slug);

  return {
    title: project.title,
  };
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
          <Sidebar
            headings={project.headings}
            meta={
              <>
                {project.timeframe && (
                  <div className="text-neutral-600">{project.timeframe}</div>
                )}

                {project.links && project.links.length > 0 && (
                  <div>
                    <div className="text-neutral-900">Links</div>
                    <ul className="mt-1 space-y-1 list-disc list-inside">
                      {project.links.map((link: any) => (
                        <li key={link.url}>
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-neutral-600 hover:text-neutral-900 underline"
                          >
                            {link.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <div className="font-medium text-neutral-900">Tech</div>
                  <ul className="mt-1 list-disc list-inside text-neutral-600 space-y-1">
                    {project.tech.map((tech: string) => (
                      <li key={tech}>{tech}</li>
                    ))}
                  </ul>
                </div>

                {project.team && project.team > 1 && (
                  <div className="text-neutral-600">
                    <span className="font-medium text-neutral-900">Team:</span>{" "}
                    {project.team}
                  </div>
                )}
              </>
            }
          />
        </aside>
      </div>
    </main>
  );
}
