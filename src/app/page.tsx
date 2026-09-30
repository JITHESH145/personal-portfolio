import { About } from "@/components/about/About";
import { Contact } from "@/components/contact/Contact";
import { Education } from "@/components/education/Education";
import { Experience } from "@/components/experience/Experience";
import { Hero } from "@/components/hero/Hero";
import { SystemStage } from "@/components/hero/SystemStage";
import { SiteNav } from "@/components/navigation/SiteNav";
import { ProjectFigure } from "@/components/projects/figures";
import { Projects } from "@/components/projects/Projects";
import { Skills } from "@/components/skills/Skills";
import { person, projects } from "@/lib/content";
import { siteDescription, siteUrl } from "@/lib/site";

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: person.name,
  jobTitle: person.role,
  description: siteDescription,
  url: siteUrl,
  email: `mailto:${person.email}`,
  sameAs: [person.github, person.linkedin],
};

export default function Home() {
  const figures = Object.fromEntries(
    projects.map((p) => [p.id, <ProjectFigure key={p.id} kind={p.figure} />]),
  );

  return (
    <>
      <a
        href="#about"
        className="btn btn-solid fixed left-4 top-4 z-50 -translate-y-24 focus-visible:translate-y-0"
      >
        Skip to content
      </a>
      <SystemStage />
      <SiteNav />
      <main className="relative z-10">
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects figures={figures} />
        <Education />
        <Contact />
      </main>
      <footer className="relative z-10 border-t border-line">
        <div className="shell flex flex-wrap items-center justify-between gap-x-8 gap-y-2 py-6 text-[0.875rem] text-faint">
          <p>
            &copy; {new Date().getFullYear()} {person.name}
          </p>
          <a href="#home" className="link flex min-h-11 items-center">
            Back to top
          </a>
        </div>
      </footer>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
    </>
  );
}
