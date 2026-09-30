import { person } from "@/lib/content";
import { ArrowOutIcon } from "@/components/ui/Icons";

const channels = [
  { label: "Email", value: person.email, href: `mailto:${person.email}`, external: false },
  { label: "GitHub", value: person.githubHandle, href: person.github, external: true },
  { label: "LinkedIn", value: person.linkedinHandle, href: person.linkedin, external: true },
  { label: "Phone", value: person.phone, href: person.phoneHref, external: false },
];

export function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="section flex min-h-[92svh] flex-col justify-center"
    >
      <div className="shell">
        <h2
          id="contact-title"
          className="display max-w-[12ch] text-[length:clamp(2.5rem,7.4vw,5.5rem)]"
        >
          Let&rsquo;s build something intelligent.
        </h2>

        <ul className="mt-14 max-w-[44rem] border-t border-line">
          {channels.map(({ label, value, href, external }) => (
            <li key={label} className="border-b border-line">
              <a
                href={href}
                className="group grid min-h-16 grid-cols-[5.5rem_1fr_auto] items-center gap-x-4 py-3 transition-colors duration-200 hover:text-lock sm:grid-cols-[7rem_1fr_auto]"
                {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
              >
                <span className="text-[0.9375rem] text-muted transition-colors duration-200 group-hover:text-lock">
                  {label}
                </span>
                <span className="break-all text-[length:clamp(1.0625rem,2.2vw,1.5rem)] font-medium leading-[1.2]">
                  {value}
                </span>
                <ArrowOutIcon className="text-faint transition-[color,translate] duration-300 ease-[var(--ease-out-expo)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-lock" />
                {external && <span className="sr-only">(opens in a new tab)</span>}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
