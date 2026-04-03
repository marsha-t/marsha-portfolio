import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="border-b border-sky-200/50">
      <div className="max-w-3xl mx-auto flex justify-center gap-8 py-4 text-sm text-neutral-500">
        <Link className="hover:text-slate-800 hover:underline underline-offset-2 transition-colors" href="/">
          Home
        </Link>
        <Link
          className="hover:text-slate-800 hover:underline underline-offset-2 transition-colors"
          href="/projects"
        >
          Projects
        </Link>
        <Link className="hover:text-slate-800 hover:underline underline-offset-2 transition-colors" href="/writing">
          Writing
        </Link>
        <Link className="hover:text-slate-800 hover:underline underline-offset-2 transition-colors" href="/about">
          About
        </Link>
      </div>
    </nav>
  );
}
