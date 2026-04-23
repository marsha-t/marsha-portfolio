"use client";

import { useEffect, useState } from "react";

interface Heading {
  text: string;
  id: string;
}

export default function TableOfContents({ headings }: { headings: Heading[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-40% 0px -55% 0px",
      },
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  return (
    <div className="space-y-2">
      <div className="text-xs uppercase tracking-wide text-[var(--text-faint)] mb-2">
        On this page
      </div>

      <ul className="space-y-1 text-sm">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              className={`block pl-3 border-l-2 transition-colors ${
                activeId === heading.id
                  ? "border-[var(--text-primary)] text-[var(--text-primary)] font-medium"
                  : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-hover)]"
              }`}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
