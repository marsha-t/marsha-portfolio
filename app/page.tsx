import Hero from "@/components/Hero";
import FeaturedProjects from "@/components/FeaturedProjects";
import CurrentFocus from "@/components/CurrentFocus";
import AboutPreview from "@/components/AboutPreview";
import Contact from "@/components/Contact";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedProjects />
      <div className="max-w-5xl mx-auto px-6 my-20">
        <div className="h-px bg-sky-200/50" />
      </div>
      <CurrentFocus />
      <div className="max-w-5xl mx-auto px-6 my-20">
        <div className="h-px bg-sky-200/50" />
      </div>
      <AboutPreview />
      <div className="max-w-5xl mx-auto px-6 my-20">
        <div className="h-px bg-sky-200/50" />
      </div>
      <Contact />
    </>
  );
}
