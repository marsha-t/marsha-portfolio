import Link from "next/link"

export default function Navbar() {
  return (
    <nav className="flex gap-6 p-6">
      <Link href="/">Home</Link>
      <Link href="/projects">Projects</Link>
      <Link href="/writing">Writing</Link>
      <Link href="/about">About</Link>
    </nav>
  )
}