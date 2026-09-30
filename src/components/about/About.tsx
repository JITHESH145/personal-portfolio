import { about, education, roles } from "@/lib/content";

const current = roles[0];

// What a recruiter scans for first, each line taken from the resume.
const profile = [
  { label: "Current role", value: current.title },
  { label: "Employer", value: `${current.org}, ${current.place}` },
  { label: "Since", value: current.period.split(" – ")[0] },
  { label: "Degree", value: education.degree },
  { label: "Graduated", value: education.year.replace("Graduated ", "") },
  { label: "Foundation", value: about.foundation.join(", ") },
];

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="section">
      <div className="shell grid items-start gap-x-16 gap-y-14 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <h2 id="about-title" className="h2">
            About
          </h2>
          <p className="lead mt-8 max-w-[38rem]">{about.lead}</p>
          <p className="prose mt-5 max-w-[38rem]">{about.body}</p>
        </div>

        <div className="frame bg-surface p-6 sm:p-8 lg:col-span-6 lg:mt-3">
          <span className="tag absolute left-0 top-0 -translate-y-full">
            profile
          </span>
          <dl>
            {profile.map(({ label, value }, i) => (
              <div
                key={label}
                className={`grid gap-x-6 gap-y-0.5 py-3.5 sm:grid-cols-[8.5rem_1fr] ${
                  i ? "border-t border-line" : "pt-0"
                } ${i === profile.length - 1 ? "pb-0" : ""}`}
              >
                <dt className="text-[0.9375rem] text-muted">{label}</dt>
                <dd className="text-pretty font-medium">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
