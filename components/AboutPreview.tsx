import Link from "next/link";

export default function AboutPreview() {
  return (
    <section className="max-w-3xl mx-auto px-6 py-24">
      <h2 className="text-3xl font-semibold mb-8">About</h2>

      <p className="text-gray-700 leading-relaxed mb-4">
        I'm a programmer currently studying at 42 Abu Dhabi. Before programming,
        I worked as an economist in the Singapore government, where I
        focused on data analysis and public policy.
      </p>

      <p className="text-gray-700 leading-relaxed mb-6">
        Today I'm focused on building software systems, learning machine
        learning, and creating tools that turn ideas into real products.
      </p>

      <Link
        href="/about"
        className="text-sm underline underline-offset-4 hover:opacity-70"
      >
        Read more →
      </Link>
    </section>
  );
}