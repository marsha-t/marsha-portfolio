import Hero from "@/components/Hero";
import FeaturedProjects from "@/components/FeaturedProjects";
import CurrentFocus from "@/components/CurrentFocus";
import AboutPreview from "@/components/AboutPreview";
import Contact from "@/components/Contact";

export const metadata = {
  title: "Marsha Teo",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedProjects />
      <div className="max-w-5xl mx-auto px-6 my-20">
        <div className="h-px bg-[var(--border-accent)]" />
      </div>
      <CurrentFocus />
      <div className="max-w-5xl mx-auto px-6 my-20">
        <div className="h-px bg-[var(--border-accent)]" />
      </div>
      <AboutPreview />
      <div className="max-w-5xl mx-auto px-6 my-20">
        <div className="h-px bg-[var(--border-accent)]" />
      </div>
      <Contact />
    </>
  );
}
