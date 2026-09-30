import type { CSSProperties } from "react";
import { person } from "@/lib/content";
import { GithubIcon, LinkedinIcon, MailIcon, PhoneIcon } from "@/components/ui/Icons";

// Keeps "data-driven" on one line instead of breaking at its hyphen.
const [summaryHead, summaryTail] = person.summary.split("data-driven");

const order = (i: number) => ({ "--i": i }) as CSSProperties;

const social = [
  { label: "GitHub", href: person.github, icon: GithubIcon, external: true },
  { label: "LinkedIn", href: person.linkedin, icon: LinkedinIcon, external: true },
  { label: "Email", href: `mailto:${person.email}`, icon: MailIcon, external: false },
  { label: "Phone", href: person.phoneHref, icon: PhoneIcon, external: false },
];

export function Hero() {
  return (
    <section
      id="home"
      aria-labelledby="hero-name"
      className="relative flex min-h-svh flex-col justify-end pb-[clamp(2rem,6vh,4.5rem)] pt-[calc(var(--nav-h)+1.5rem)]"
    >
      {/* Keeps the type legible where the data field passes behind it. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(0deg,var(--color-ink)_8%,transparent_62%)] md:bg-[linear-gradient(80deg,var(--color-ink)_12%,transparent_58%)]"
      />

      <div className="shell relative">
        <h1 id="hero-name" className="display">
          {person.nameLines.map((line, i) => (
            <span key={line} className="rise-line">
              <span style={order(i)}>{line}</span>
            </span>
          ))}
        </h1>

        <p
          className="settle mt-5 max-w-[22ch] text-[length:clamp(1.25rem,2.2vw,1.75rem)] font-medium leading-[1.15] [font-stretch:108%] md:max-w-none"
          style={order(0)}
        >
          {person.role}
        </p>

        <p className="settle lead mt-4 max-w-[34rem] text-muted" style={order(1)}>
          {summaryHead}
          <span className="whitespace-nowrap">data-driven</span>
          {summaryTail}
        </p>

        <div className="settle mt-8 flex flex-wrap gap-3" style={order(2)}>
          <a href="#projects" className="btn btn-solid">
            View Projects
          </a>
          <a href="#contact" className="btn btn-frame frame frame-lock">
            Let&rsquo;s Connect
          </a>
        </div>

        <ul
          className="settle -ml-2 mt-7 flex flex-wrap gap-x-2 text-[0.9375rem] text-muted"
          style={order(3)}
        >
          {social.map(({ label, href, icon: Glyph, external }) => (
            <li key={label}>
              <a
                href={href}
                className="flex min-h-11 items-center gap-2 px-2 transition-colors duration-200 hover:text-lock"
                {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
              >
                <Glyph />
                <span>{label}</span>
                {external && <span className="sr-only">(opens in a new tab)</span>}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
