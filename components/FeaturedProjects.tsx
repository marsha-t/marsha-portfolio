import ProjectCard from "./ProjectCard";
import Link from "next/link";

export default function FeaturedProjects() {
  return (
    <section
      className="
      relative
      py-28
      px-6
      bg-gradient-to-b
      from-white
      via-sky-50/40
      to-white
    "
    >
      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none flex justify-center">
        <div
          className="
          w-[900px]
          h-[500px]
          bg-sky-200/20
          blur-3xl
          rounded-full
          mt-24
        "
        />
      </div>

      <div className="relative max-w-5xl mx-auto">
        <h2 className="text-3xl font-semibold mb-4">
          Featured Projects
        </h2>

        <p className="text-neutral-600 mb-14">
          Selected projects exploring data, software and how things work
        </p>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Transcendence */}
          <ProjectCard
            title="Transcendence"
            description="Full-stack multiplayer Pong platform featuring real-time gameplay, authentication, tournaments, and user dashboards"
            image="/projects/transcendence.png"
            href="/projects/transcendence"
            tech={[
              "Node.js",
              "WebSockets",
              "Docker",
              "PostgreSQL",
            ]}
            variant="featured"
            className="md:col-span-2"
          />

          {/* Webserv */}
          <ProjectCard
            title="Webserv"
            description="HTTP server built in C++ implementing core parts of the HTTP/1.1 specification"
            image="/projects/webserv.png"
            href="/projects/webserv"
            tech={[
              "C++",
              "HTTP",
              "Networking",
            ]}
          />

          {/* More projects */}
          <Link
            href="/projects"
            className="
            group
            flex
            items-center
            justify-center
            rounded-2xl
            border
            border-dashed
            border-neutral-300
            bg-neutral-50
            p-10
            hover:bg-neutral-100
            transition
          "
          >
            <div className="text-center">
              <div className="text-3xl mb-3 group-hover:translate-x-1 transition">
                →
              </div>

              <div className="font-semibold">
                More Projects
              </div>

              <p className="text-sm text-neutral-500 mt-1">
                Explore all my work
              </p>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}