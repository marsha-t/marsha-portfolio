"use client";

import { useState } from "react";

export default function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <>
      <button
        onClick={handleCopy}
        className="underline hover:no-underline transition text-[var(--text-subtle)]"
      >
        {email}
      </button>

      <span className="text-[var(--text-faint)] text-sm ml-2">
        {copied ? "Copied" : "Click to copy"}
      </span>
    </>
  );
}