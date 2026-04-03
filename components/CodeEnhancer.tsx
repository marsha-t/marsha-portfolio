"use client";

import React from "react";
import { useEffect } from "react";
import { Copy, Check } from "lucide-react";
import { createRoot } from "react-dom/client";


/**
 * This component runs on the client after render and:
 *  - Finds all <pre> elements (code blocks)
 *  - Wraps each block in a positioned container
 *  - Injects a React "CopyButton" into the DOM using `createRoot`
 *  - Prevents double-wrapping by checking for an existing wrapper
 */
export default function CodeEnhancer() {
  useEffect(() => {
    const blocks = document.querySelectorAll("pre"); // Find all code blocks

    blocks.forEach((pre) => {
      if (pre.parentElement?.classList.contains("code-wrapper")) return;

      const wrapper = document.createElement("div");
      wrapper.className = "code-wrapper relative group";

      pre.parentNode?.insertBefore(wrapper, pre);
      wrapper.appendChild(pre);

      const buttonContainer = document.createElement("div");
      buttonContainer.className =
        "absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition";

      wrapper.appendChild(buttonContainer);

      const root = createRoot(buttonContainer); // create separate & independent React root for each button

      function CopyButton() {
        const [copied, setCopied] = React.useState(false);

        const handleClick = async () => {
          await navigator.clipboard.writeText(pre.innerText); // copy code block to clipboard
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        };

        return (
          <button
            onClick={handleClick}
            className="p-1.5 rounded-md bg-neutral-200 hover:bg-neutral-300 text-neutral-700"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
        );
      }

      root.render(<CopyButton />); // Mount React button into DOM
    });
  }, []);

  return null;
}