import Link from "next/link";
import { getAllContentMeta } from "@/lib/content";

export default function WritingPage() {
  const posts = getAllContentMeta("writing")

  return (
    <main className="max-w-3xl mx-auto py-16 px-6">
      <h1 className="text-3xl font-bold mb-8">Writing</h1>

      <div className="space-y-8">
        {posts.map((post) => (
          <article key={post.slug}>
            <h2 className="text-xl font-semibold">
              <Link href={`/writing/${post.slug}`}>
                {post.title}
              </Link>
            </h2>
            <p className="text-sm text-gray-500">
              {post.date}
            </p>
            <p className="mt-2 text-gray-700">
              {post.summary}
            </p>
          </article>
        ))}
      </div>
    </main>
  )
}