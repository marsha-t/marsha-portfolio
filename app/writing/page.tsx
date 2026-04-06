import Link from "next/link";
import { getAllContentMeta } from "@/lib/content";

export const metadata = {
  title: "Writing",
};

export default function WritingPage() {
  const posts = getAllContentMeta("writing");

  return (
    <main className="max-w-3xl mx-auto py-20 px-6">
      <h1 className="text-4xl font-bold mb-4">Writing</h1>
      <p className="mt-3 text-neutral-600 max-w-2xl ">
        Writing to understand how things work
      </p>
      <div className="space-y-6">
        {posts.map((post) => (
          <article
            className="py-8 border-b border-sky-200/50 last:border-none"
            key={post.slug}
          >
            <h2 className="text-2xl font-semibold">
              <Link
                href={`/writing/${post.slug}`}
                className="hover:underline transition"
              >
                {post.title}
              </Link>
            </h2>
            <p className="mt-2 text-sm text-gray-500">{new Date(post.date).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}</p>
            <p className="mt-2 text-gray-700">{post.summary}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
