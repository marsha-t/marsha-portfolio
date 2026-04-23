import Link from "next/link";
import CopyEmail from "@/components/CopyEmail";

export const metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-20 space-y-20">
      {/* Intro */}
      <section className="max-w-3xl space-y-6">
        <h1 className="text-4xl font-semibold tracking-tight">
          Turning curiosity into software
        </h1>

        <p className="text-lg font-medium">
          I'm Marsha, a programmer studying software engineering at 42 Abu
          Dhabi.
        </p>

        <p className="text-[var(--text-secondary)] leading-relaxed">
          Before learning to program, I worked as a government economist,
          evaluating policy interventions using causal inference and large-scale
          administrative data.
        </p>

        <p className="text-[var(--text-secondary)] leading-relaxed">
          Programming changed something fundamental for me: I can now build the
          things I wish existed. That shift shapes many of the projects I
          explore today.
        </p>

        <p className="text-[var(--text-secondary)] leading-relaxed">
          My background in causal inference and experimentation continues to
          influence how I think about building systems and evaluating ideas. I’m
          particularly interested in systems that combine rigorous analysis with
          practical tools.
        </p>

        <p className="text-[var(--text-secondary)] leading-relaxed">
          Today, I spend much of my time building software while exploring
          machine learning, data science, and developer tools. This website is
          where I share the things I build and the ideas I’m trying to
          understand.
        </p>
      </section>

      {/* Row 1 */}
      <div className="max-w-5xl mx-auto px-6 my-20">
        <div className="h-px bg-[var(--border-accent)]" />
      </div>
      <section className="grid md:grid-cols-3 gap-12">
        {/* Main content */}
        <div className="md:col-span-2 space-y-6">
          <h2 className="text-2xl font-semibold">
            Things I’m Interested in Building
          </h2>

          <p className="text-[var(--text-secondary)] leading-relaxed">
            Programming has made it possible for me to turn ideas into
            prototypes. I have a growing list of things I’d like to explore,
            including:
          </p>

          <ul className="list-disc ml-5 space-y-3 text-[var(--text-secondary)]">
            <li>
              Tools that help people reflect on patterns in their lives through
              personal data
            </li>

            <li>
              Software to make causal reasoning more accessible in everyday
              decision-making
            </li>

            <li>Small tools that solve specific everyday problems</li>
          </ul>
        </div>

        {/* Sidebar */}
        <aside className="bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-xl p-6 text-sm space-y-4">
          <h3 className="font-semibold text-[var(--text-primary)]">Tech Stack</h3>

          <div>
            <p className="font-medium text-[var(--text-primary)]">Languages</p>
            <p className="text-[var(--text-subtle)]">
              C • C++ • Python • JavaScript • TypeScript
            </p>
          </div>

          <div>
            <p className="font-medium text-[var(--text-primary)]">Frameworks</p>
            <p className="text-[var(--text-subtle)]">Next.js • Node.js • Flutter</p>
          </div>

          <div>
            <p className="font-medium text-[var(--text-primary)]">Infrastructure & Tools</p>
            <p className="text-[var(--text-subtle)]">Docker • Git • Tailwind • Prisma</p>
          </div>

          <div>
            <p className="font-medium text-[var(--text-primary)]">Data & AI</p>
            <p className="text-[var(--text-subtle)]">pandas • scikit-learn • Stata</p>
          </div>
        </aside>
      </section>

      {/* Row 2 */}
      <div className="max-w-5xl mx-auto px-6 my-20">
        <div className="h-px bg-[var(--border-accent)]" />
      </div>
      <section className="grid md:grid-cols-3 gap-12">
        {/* Main */}
        <div className="md:col-span-2 space-y-6">
          <h2 className="text-2xl font-semibold">Outside of Coding</h2>

          <p className="text-[var(--text-secondary)]">I enjoy:</p>

          <ul className="list-disc ml-5 space-y-2 text-[var(--text-secondary)]">
            <li>Brazilian Jiu-Jitsu</li>
            <li>Jigsaw puzzles</li>
            <li>Travel</li>
          </ul>
        </div>

        {/* Sidebar */}
        <aside className="bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-xl p-6 text-sm space-y-4">
          <h3 className="font-semibold text-[var(--text-primary)]">Explore My Work Elsewhere</h3>

          <ul className="space-y-3">
            <li>
              <p className="text-[var(--text-primary)]">
                Code and projects
              </p>
              <Link
                href="https://github.com/marsha-t"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--text-subtle)] underline hover:text-[var(--text-hover)]"
              >
                GitHub
              </Link>
            </li>

            <li>
              <p className="text-[var(--text-primary)]">
                Writing
              </p>
              <Link
                href="https://medium.com/@marshateo"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--text-subtle)] underline hover:text-[var(--text-hover)]"
              >
                Medium
              </Link>{" "}
              ·{" "}
              <Link
                href="https://dev.to/marshateo"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--text-subtle)] underline hover:text-[var(--text-hover)]"
              >
                Dev.to
              </Link>
            </li>

            <li>
              <p className="text-[var(--text-primary)]">
                Professional background
              </p>
              <Link
                href="https://linkedin.com/in/marshateo"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--text-subtle)] underline hover:text-[var(--text-hover)]"
              >
                LinkedIn
              </Link>
            </li>
          </ul>

          <div className="pt-2">
            <p className="text-[var(--text-primary)]">
              Best way to reach me: <CopyEmail email="marsha.teo@gmail.com" />
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}
