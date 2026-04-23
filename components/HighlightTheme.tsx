"use client";

import { useEffect } from "react";

export default function HighlightTheme() {
  useEffect(() => {
    function applyTheme() {
      const existing = document.getElementById("hljs-theme");
      if (existing) existing.remove();

      const link = document.createElement("link");
      link.id = "hljs-theme";
      link.rel = "stylesheet";

      const isDark =
        document.documentElement.getAttribute("data-theme") === "dark";

      link.href = isDark ? "/hljs/github-dark.css" : "/hljs/github.css";
      document.head.appendChild(link);
    }
    applyTheme();
    const observer = new MutationObserver(applyTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
