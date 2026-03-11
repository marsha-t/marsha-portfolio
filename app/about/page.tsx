import Link from "next/link"

export default function AboutPage() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-20 space-y-20">

      {/* Intro */}
      <section className="max-w-3xl space-y-6">
        <h1 className="text-4xl font-semibold tracking-tight">
          Turning curiosity into software
        </h1>

        <p className="text-lg font-medium">
          I'm Marsha, a programmer studying software engineering at 42 Abu Dhabi.
        </p>

        <p className="text-neutral-700 leading-relaxed">
          Before programming, I worked as a government economist, using data to
          evaluate interventions across different policy areas.
        </p>

        <p className="text-neutral-700 leading-relaxed">
          Programming changed something fundamental for me: 
          I can now build the things I wish existed. 
          That shift shapes many of the projects I explore today.
          I’m particularly interested in systems that combine rigorous analysis with practical tools, 
          and I spend much of my time building software while exploring machine learning, data science, and developer tools. 
        </p>

        <p className="text-neutral-700 leading-relaxed">
          This website is where I share the things I build and the ideas I’m
          trying to understand.
        </p>
      </section>

      {/* Row 1 */}
      <section className="grid md:grid-cols-3 gap-12">

        {/* Main content */}
        <div className="md:col-span-2 space-y-6">
          <h2 className="text-2xl font-semibold">
            Things I’m Interested in Building
          </h2>

          <p className="text-neutral-700 leading-relaxed">
            Programming has made it possible for me to turn ideas into prototypes.
            I have a growing list of things I’d like to explore, including:
          </p>

          <ul className="list-disc ml-5 space-y-3 text-neutral-700">
            <li>
              Tools that help people reflect on patterns in their lives through
              personal data
            </li>

            <li>
              Software to make causal reasoning more accessible in everyday
              decision-making
            </li>

            <li>
              Small tools that solve specific everyday problems
            </li>
          </ul>
        </div>

        {/* Sidebar */}
        <aside className="bg-neutral-50 border border-neutral-200 rounded-xl p-6 text-sm space-y-4">
          <h3 className="font-semibold">Tech Stack</h3>

          <div>
            <p className="font-medium">Languages</p>
            <p className="text-neutral-600">
              C • C++ • Python • JavaScript • TypeScript
            </p>
          </div>

          <div>
            <p className="font-medium">Frameworks</p>
            <p className="text-neutral-600">
              Next.js • Node.js • Flutter
            </p>
          </div>

          <div>
            <p className="font-medium">Infrastructure & Tools</p>
            <p className="text-neutral-600">
              Docker • Git • Tailwind • Prisma
            </p>
          </div>

          <div>
            <p className="font-medium">Data & AI</p>
            <p className="text-neutral-600">
              pandas • scikit-learn • Stata
            </p>
          </div>
        </aside>
      </section>

      {/* Row 2 */}
      <section className="grid md:grid-cols-3 gap-12">

        {/* Main */}
        <div className="md:col-span-2 space-y-6">
          <h2 className="text-2xl font-semibold">
            Outside of Coding
          </h2>

          <p className="text-neutral-700">
            I enjoy:
          </p>

          <ul className="list-disc ml-5 space-y-2 text-neutral-700">
            <li>Brazilian Jiu-Jitsu</li>
            <li>Jigsaw puzzles</li>
            <li>Travel</li>
          </ul>
        </div>

        {/* Sidebar */}
        <aside className="bg-neutral-50 border border-neutral-200 rounded-xl p-6 text-sm space-y-4">
          <h3 className="font-semibold">Elsewhere</h3>

          <p className="text-neutral-600">
            You can explore more of my work here:
          </p>

          <ul className="space-y-2">
            <li>
              <Link
                href="https://github.com"
                className="underline hover:no-underline"
              >
                GitHub
              </Link>{" "}
              — code and projects
            </li>

            <li>
              <Link
                href="https://medium.com"
                className="underline hover:no-underline"
              >
                Medium
              </Link>{" "}
              — longer technical writing
            </li>

            <li>
              <Link
                href="https://linkedin.com"
                className="underline hover:no-underline"
              >
                LinkedIn
              </Link>{" "}
              — professional background
            </li>
          </ul>

          <div className="pt-2">
            <p className="font-medium">Best way to reach me</p>
            <p className="text-neutral-700">
              marsha.teo@gmail.com
            </p>
          </div>
        </aside>
      </section>

    </main>
  )
}