import { getContentBySlug, getAllContentMeta } from "@/lib/content";

export async function generateStaticParams() {
  const posts = getAllContentMeta("writing");

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function WritingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getContentBySlug("writing", slug);

  return (
    <article>
      <p>{post.date}</p>
      <div
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />
    </article>
  );
}
