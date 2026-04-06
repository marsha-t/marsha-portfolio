"use client";

import { useEffect, useState } from "react";
import TableOfContents from "./TableOfContents";
import { ContentWithHtml } from "@/lib/content";

type SidebarProps = {
  project: ContentWithHtml;
};

export default function Sidebar({ project }: SidebarProps) {
  const [showMeta, setShowMeta] = useState(true);

  useEffect(() => {
    const hero = document.getElementById("hero-image");

    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowMeta(entry.isIntersecting);
      },
      {
        rootMargin: "-80px 0px 0px 0px",
      },
    );

    observer.observe(hero);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="sticky top-24 space-y-8 text-sm">
      {showMeta && (
        <div className="space-y-4">
          {project.timeframe && (
            <div className="text-neutral-600">{project.timeframe}</div>
          )}

          {project.links && project.links.length > 0 && (
            <div>
              <div className="text-neutral-900">Links</div>

              <ul className="mt-1 space-y-1 list-disc list-inside">
                {project.links.map((link: any) => (
                  <li key={link.url}>
                    <a
                      href={link.url}
                      className="text-neutral-600 hover:text-neutral-900 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <div className="font-medium text-neutral-900">Tech</div>

            <ul className="mt-1 list-disc list-inside text-neutral-600 space-y-1">
              {project.tech.map((tech: string) => (
                <li key={tech}>{tech}</li>
              ))}
            </ul>
          </div>

          {project.team && project.team > 1 && (
            <div className="text-neutral-600">
              <span className="font-medium text-neutral-900">Team:</span>{" "}
              {project.team}
            </div>
          )}

          <div className="border-t border-neutral-200"></div>
        </div>
      )}

      <TableOfContents headings={project.headings} />
    </div>
  );
}
