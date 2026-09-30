"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { projects, type Project } from "@/lib/content";
import { useInViewAttr } from "@/lib/hooks";
import { Pipeline } from "@/components/ui/Pipeline";
import { ArrowOutIcon, MinusIcon, PlusIcon } from "@/components/ui/Icons";

function Figure({ project, children }: { project: Project; children: ReactNode }) {
  const ref = useInViewAttr<HTMLElement>(0.4);
  return (
    <figure ref={ref} className="fig" data-inview="false">
      <div className="frame bg-surface p-3 sm:p-5">
        <span className="tag absolute left-0 top-0 -translate-y-full">{project.figure}</span>
        {children}
      </div>
      <figcaption className="mt-3 flex flex-wrap items-center justify-between gap-x-6 gap-y-1 text-[0.875rem] leading-[1.45] text-faint">
        <span>{project.figureNote}</span>
        {project.figure === "detection" && (
          <button
            type="button"
            className="link flex min-h-11 cursor-pointer items-center text-muted"
            onClick={() => {
              const el = ref.current;
              if (!el) return;
              // Restart the one-shot animation: drop the flag, flush, set it again.
              el.setAttribute("data-inview", "false");
              void el.getBoundingClientRect();
              el.setAttribute("data-inview", "true");
            }}
          >
            Replay frame
          </button>
        )}
      </figcaption>
    </figure>
  );
}

function ProjectEntry({
  project,
  flip,
  figure,
}: {
  project: Project;
  flip: boolean;
  figure: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [traceKey, setTraceKey] = useState(0);
  const panelId = `${project.id}-study`;

  return (
    <li id={project.id} className="border-t border-line py-14 lg:py-20">
      <div className="grid items-center gap-x-16 gap-y-12 lg:grid-cols-12">
        <div className={`lg:col-span-5 ${flip ? "lg:order-2" : ""}`}>
          <h3 className="text-[length:clamp(1.625rem,3vw,2.375rem)] font-semibold leading-[1.08] tracking-[-0.015em] text-balance [font-stretch:112%]">
            {project.title}
          </h3>
          <p className="mt-2.5 text-[1.0625rem] text-signal">{project.domain}</p>
          <p className="mt-5 max-w-[34rem] text-pretty text-muted">{project.summary}</p>

          <ul className="data mt-6 flex flex-wrap gap-x-4 gap-y-1.5 text-faint" aria-label="Stack">
            {project.stack.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              className="btn btn-solid"
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => {
                if (!open) setTraceKey((k) => k + 1);
                setOpen(!open);
              }}
            >
              {open ? <MinusIcon width={16} height={16} /> : <PlusIcon width={16} height={16} />}
              {open ? "Close case study" : "Open case study"}
            </button>
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noreferrer"
                className="btn btn-frame frame frame-lock"
                aria-label={`Repository for ${project.title} on GitHub (opens in a new tab)`}
              >
                Repository
                <ArrowOutIcon width={16} height={16} />
              </a>
            )}
          </div>
        </div>

        <div className={`lg:col-span-7 ${flip ? "lg:order-1" : ""}`}>
          <Figure project={project}>{figure}</Figure>
        </div>
      </div>

      <div id={panelId} className="reveal" data-open={open} role="region" aria-label={`${project.title} case study`}>
        <div>
          <div className="pt-14">
            <Pipeline
              title="Architecture"
              run={project.run}
              stages={project.stages}
              traceKey={traceKey}
            />

            <div className="mt-12 grid gap-x-16 gap-y-10 lg:grid-cols-12">
              <div className="lg:col-span-6">
                <h4 className="text-[0.9375rem] font-semibold">Implementation</h4>
                <ul className="mt-4 grid gap-3 text-muted">
                  {project.implementation.map((line) => (
                    <li key={line} className="grid grid-cols-[0.75rem_1fr] gap-x-3">
                      <span aria-hidden="true" className="mt-[0.7em] h-px w-3 bg-line-strong" />
                      <span className="text-pretty">{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="lg:col-span-6">
                <h4 className="text-[0.9375rem] font-semibold">Outcome</h4>
                <p className="lead mt-4">{project.outcome}</p>
                {project.notice && (
                  <p className="mt-4 text-[0.9375rem] text-faint">{project.notice}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

/** `figures` are rendered on the server and passed in, keyed by project id. */
export function Projects({ figures }: { figures: Record<string, ReactNode> }) {
  return (
    <section id="projects" aria-labelledby="projects-title" className="section">
      <div className="shell">
        <h2 id="projects-title" className="h2">
          Projects, traced end to end
        </h2>
        <p className="prose mt-6">
          Three systems, each shown as the pipeline it runs. Open a case study to trace it stage
          by stage.
        </p>
        <ol className="mt-12">
          {projects.map((project, i) => (
            <ProjectEntry
              key={project.id}
              project={project}
              flip={i % 2 === 1}
              figure={figures[project.id]}
            />
          ))}
        </ol>
      </div>
    </section>
  );
}
