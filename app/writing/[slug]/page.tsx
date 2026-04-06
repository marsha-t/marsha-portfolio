import { getContentBySlug, getAllContentMeta } from "@/lib/content";
import CodeEnhancer from "@/components/CodeEnhancer";
import Sidebar from "@/components/Sidebar";

export async function generateStaticParams() {
  const posts = getAllContentMeta("writing");

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

  const project = await getContentBySlug("writing", slug);

  return {
    title: project.title,
  };
}

export default async function WritingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getContentBySlug("writing", slug);

  return (
    <main className="max-w-6xl mx-auto py-16 px-6">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-12">
        <div>
          <div className="flex items-center justify-between text-sm text-neutral-400 mb-6">
            <a href="/writing" className="hover:text-neutral-700">
              ← Back to Writing
            </a>

            <span>
              {new Date(post.date).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
          {/* Main content */}
          {/* prose-pre: affects <pre> blocks i.e., code blocks
            prose-code: affects <code>: inline and inside <pre> */}
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

              prose-pre:bg-neutral-50
              prose-pre:text-neutral-900
              prose-pre:border-neutral-200
              prose-pre:rounded-xl
              prose-pre:px-5
              prose-pre:py-4
              prose-pre:border

              prose-code:bg-neutral-100
              prose-code:px-1.5
              prose-code:rounded
              prose-code:text-sm
              prose-code:before:content-none
              prose-code:after:content-none
              
              prose-pre:code:bg-transparent

              prose-headings:code:bg-transparent
              prose-headings:code:font-inherit
              prose-headings:code:text-[inherit]
              prose-headings:code:text-base

              
          "
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />
        </div>
        <aside className="hidden lg:block">
          <Sidebar
            headings={post.headings}
            triggerId="scroll-trigger"
            meta={
              <>
                {post.links && post.links.length > 0 && (
                  <div>
                    <div className="text-xs uppercase tracking-wide text-neutral-400 mb-2">
                      Also published on
                    </div>

                    <ul className="space-y-1">
                      {post.links.map((link: any) => (
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
              </>
            }
          />
          {/* {<div className="sticky top-24 space-y-4"> */}

          {/* Cross-posted links */}
          {/* {post.links && post.links.length > 0 && (
              <div className="text-sm">
                <div className="text-neutral-900">
                  Also published on
                </div>

                <ul className="mt-1 space-y-1 list-disc list-inside">
                  {post.links.map((link) => (
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

            <div className="border-t border-neutral-200"></div>

            <TableOfContents headings={post.headings} /> */}
          {/* </div> } */}
        </aside>
      </div>
      <CodeEnhancer />
    </main>
  );
}
