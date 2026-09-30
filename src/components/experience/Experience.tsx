import { roles } from "@/lib/content";
import { Pipeline } from "@/components/ui/Pipeline";

export function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-title" className="section">
      <div className="shell">
        <h2 id="experience-title" className="h2">
          Experience
        </h2>

        <ol className="mt-12">
          {roles.map((role) => (
            <li
              key={role.org}
              className="grid gap-x-16 gap-y-6 border-t border-line py-12 lg:grid-cols-12 lg:py-16"
            >
              <div className="lg:col-span-3">
                <p className="data text-text">{role.period}</p>
                <p className="mt-1 text-[0.9375rem] text-muted">{role.place}</p>
              </div>

              <div className="lg:col-span-9">
                <h3 className="h3">{role.title}</h3>
                <p className="mt-1.5 text-[1.125rem] text-muted">{role.org}</p>

                <ul className="mt-6 grid max-w-[68ch] gap-3 text-muted">
                  {role.points.map((point) => (
                    <li key={point} className="grid grid-cols-[0.75rem_1fr] gap-x-3">
                      <span aria-hidden="true" className="mt-[0.7em] h-px w-3 bg-line-strong" />
                      <span className="text-pretty">{point}</span>
                    </li>
                  ))}
                </ul>

                {role.stack && (
                  <p className="data mt-6 text-faint">
                    <span className="sr-only">Stack: </span>
                    {role.stack.join("  ·  ")}
                  </p>
                )}

                {role.impact && (
                  <div className="mt-8 max-w-[44rem]">
                    <p className="text-[0.9375rem] font-semibold">Resume-stated impact</p>
                    <ul className="mt-3 border-t border-line">
                      {role.impact.map((line) => (
                        <li key={line} className="lead border-b border-line py-4">
                          {line}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {role.pipeline && (
                  <div className="mt-10">
                    <Pipeline
                      title={role.pipeline.caption}
                      run={role.pipeline.run}
                      stages={role.pipeline.stages}
                      autoTrace
                    />
                  </div>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
