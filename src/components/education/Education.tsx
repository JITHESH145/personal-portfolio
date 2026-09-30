import { certifications, education } from "@/lib/content";

export function Education() {
  return (
    <section id="education" aria-labelledby="education-title" className="section">
      <div className="shell">
        <h2 id="education-title" className="h2">
          Education
        </h2>

        <div className="mt-12 grid gap-x-16 gap-y-14 border-t border-line pt-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h3 className="h3">{education.degree}</h3>
            <p className="mt-3 text-muted">{education.school}</p>
            <p className="data mt-5 flex flex-wrap gap-x-5 gap-y-1 text-text">
              <span>{education.year}</span>
              <span>{education.score}</span>
            </p>
          </div>

          <div className="lg:col-span-7">
            <h3 id="certifications" className="text-[0.9375rem] font-semibold">
              Certifications
            </h3>
            <ul className="mt-4 border-t border-line">
              {certifications.map((cert) => (
                <li
                  key={cert.title}
                  className="grid gap-x-8 gap-y-1 border-b border-line py-4 sm:grid-cols-[1fr_auto] sm:items-baseline"
                >
                  <div>
                    <p className="text-[1.0625rem] font-medium leading-[1.35]">{cert.title}</p>
                    <p className="mt-0.5 text-[0.9375rem] text-muted">{cert.issuer}</p>
                  </div>
                  <p className="data text-faint sm:text-right">{cert.date}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
