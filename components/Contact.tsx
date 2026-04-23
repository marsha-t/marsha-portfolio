"use client";

import { useState } from "react";

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const email = "marsha.teo@gmail.com";

  const copyEmail = async () => {
    await navigator.clipboard.writeText(email);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <section className="relative py-28 px-6 overflow-hidden">
      <div className="relative max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-semibold mb-6 text-[var(--text-primary)]">Get in Touch</h2>
        <p className="text-[var(--text-secondary)] mb-12">
          If you'd like to collaborate, discuss a project, or just say hello
        </p>
        <button
          onClick={copyEmail}
          className="
            border border-[var(--border-default)]
            px-8 py-4
            rounded-xl
            text-lg font-medium text-[var(--text-secondary)]
            bg-[var(--bg-secondary)]
            backdrop-blur-sm
            transition-all duration-200
            hover:bg-[var(--bg-secondary-hover)]
            active:scale-95
          "
        >
          {email}
        </button>
        <p className="text-sm text-[var(--text-subtle)] mt-4 transition-all duration-200">
          {copied ? "✓ Copied!" : "Click to copy"}
        </p>
      </div>
    </section>
  );
}
