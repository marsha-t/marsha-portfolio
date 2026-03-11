import Link from "next/link"

/**
 * Footer displayed across the site.
 * Contains navigation, social links, and attribution.
 * Designed as a lightweight personal brand footer.
 */
export default function Footer() {
  return (
    <footer className="mt-24 border-t border-gray-200">
      <div className="max-w-5xl mx-auto px-6 py-12 grid gap-8 md:grid-cols-3 text-sm text-gray-600">
        
        {/* Brand */}
        <div>
          <p className="font-semibold text-gray-900">Marsha Teo</p>
          <p className="mt-2">
            Curious about data, software and how things work
          </p>
        </div>

        {/* Navigation */}
        <div>
          <p className="font-semibold text-gray-900 mb-3">Explore</p>
          <ul className="space-y-2">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/projects">Projects</Link></li>
            <li><Link href="/writing">Writing</Link></li>
            <li><Link href="/about">About</Link></li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <p className="font-semibold text-gray-900 mb-3">Elsewhere</p>
          <ul className="space-y-2">
            <li>
              <a
                href="https://github.com/marsha-t"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </li>

            <li>
              <a
                href="https://linkedin.com/in/marshateo"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
            </li>

            {/* <li>
              <a
                href="https://medium.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Medium
              </a>
            </li>

            <li>
              <a
                href="https://dev.to/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Dev.to
              </a>
            </li> */}
          </ul>
        </div>

      </div>

      <div className="text-center text-xs text-gray-400 pb-6">
        © {new Date().getFullYear()} Marsha Teo
      </div>
    </footer>
  )
}