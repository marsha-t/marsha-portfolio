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

      <div className="relative max-w-3xl mx-auto text-center">

        <h2 className="text-3xl font-semibold mb-6">
          Get in Touch
        </h2>

        <p className="text-gray-600 mb-12">
          If you'd like to collaborate, discuss a project, or just say hello
        </p>

        <button
          onClick={copyEmail}
          className="
            border border-gray-200
            px-8 py-4
            rounded-xl
            text-lg font-medium
            bg-white/70
            backdrop-blur-sm
            transition-all duration-200
            hover:border-gray-400
            hover:shadow-md
            active:scale-95
          "
        >
          {email}
        </button>

        <p className="text-sm text-gray-500 mt-4 transition-all duration-200">
          {copied ? "✓ Copied!" : "Click to copy"}
        </p>

      </div>
    </section>
  );
}