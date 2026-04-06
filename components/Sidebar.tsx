"use client";

import { useEffect, useState, ReactNode } from "react";
import TableOfContents from "./TableOfContents";

type SidebarProps = {
  headings: any[];
  meta?: ReactNode;
  triggerId?: string;
};

export default function Sidebar({ headings, meta, triggerId }: SidebarProps) {
  const [showMeta, setShowMeta] = useState(true);

  useEffect(() => {
    
    const target = document.getElementById(triggerId || "hero-image");
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        
        setShowMeta(entry.isIntersecting)
      },
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [triggerId]);

  return (
    <div className="sticky top-24 space-y-8 text-sm">
      {showMeta && meta && (
        <div className="space-y-6">
          {meta}
          <div className="border-t border-neutral-200"></div>
        </div>
      )}

      <TableOfContents headings={headings} />
    </div>
  );
}
