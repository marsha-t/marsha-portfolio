import Link from "next/link"

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-[var(--border-accent)]">
      <div className="max-w-5xl mx-auto px-6 py-12 grid gap-8 md:grid-cols-3 text-sm text-gray-600">
        
        {/* Brand */}
        <div>
          <p className="font-semibold text-[var(--text-primary)]">Marsha Teo</p>
          <p className="mt-2 text-[var(--text-muted)]">
            Curious about data, software and how things work
          </p>
        </div>

        {/* Navigation */}
        <div>
          <p className="font-semibold text-[var(--text-primary)] mb-3">Explore</p>
          <ul className="space-y-2">
            <li>
              <Link className="text-[var(--text-muted)] hover:text-[var(--text-hover)] hover:underline underline-offset-2 transition-colors" href="/">
                Home
              </Link>
            </li>
            <li>
              <Link className="text-[var(--text-muted)] hover:text-[var(--text-hover)] hover:underline underline-offset-2 transition-colors" href="/projects">
                Projects
              </Link>
            </li>
            <li>
              <Link className="text-[var(--text-muted)] hover:text-[var(--text-hover)] hover:underline underline-offset-2 transition-colors" href="/writing">
                Writing
              </Link>
            </li>
            <li>
              <Link className="text-[var(--text-muted)] hover:text-[var(--text-hover)] hover:underline underline-offset-2 transition-colors" href="/about">
                About
              </Link>
            </li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <p className="font-semibold mb-3 text-[var(--text-primary)]">Elsewhere</p>
          <ul className="space-y-2">
            <li>
              <a
                href="https://github.com/marsha-t"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--text-muted)] hover:text-[var(--text-hover)] hover:underline underline-offset-2 transition-colors"
              >
                GitHub
              </a>
            </li>

            <li>
              <a
                href="https://linkedin.com/in/marshateo"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--text-muted)] hover:text-[var(--text-hover)] hover:underline underline-offset-2 transition-colors"
              >
                LinkedIn
              </a>
            </li>

            <li>
              <a
                href="https://medium.com/@marshateo"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--text-muted)] hover:text-[var(--text-hover)] hover:underline underline-offset-2 transition-colors"
              >
                Medium
              </a>
            </li>

            <li>
              <a
                href="https://dev.to/marshateo"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--text-muted)] hover:text-[var(--text-hover)] hover:underline underline-offset-2 transition-colors"
              >
                Dev.to
              </a>
            </li>
          </ul>
        </div>

      </div>

      <div className="text-center text-xs text-[var(--text-muted)] pb-6">
        © {new Date().getFullYear()} Marsha Teo
      </div>
    </footer>
  )
}