"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import type { Stage } from "@/lib/content";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { PlayIcon } from "@/components/ui/Icons";

const STEP_MS = 520;

/**
 * A system drawn as the ordered stages it runs through. Tracing sends a signal
 * from the first stage to the last; any stage can also be selected directly.
 */
export function Pipeline({
  title,
  run,
  stages,
  autoTrace = false,
  traceKey,
}: {
  title: string;
  run: string;
  stages: Stage[];
  /** trace once when the pipeline first scrolls into view */
  autoTrace?: boolean;
  /** changing this value starts a trace (used when a case study opens) */
  traceKey?: number;
}) {
  const [cursor, setCursor] = useState(-1);
  const [running, setRunning] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const root = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  const stop = useCallback(() => {
    clearInterval(timer.current);
    timer.current = undefined;
    setRunning(false);
  }, []);

  const trace = useCallback(() => {
    clearInterval(timer.current);
    let i = 0;
    setCursor(0);
    setRunning(true);
    timer.current = setInterval(() => {
      i += 1;
      if (i >= stages.length) {
        stop();
        return;
      }
      setCursor(i);
    }, STEP_MS);
  }, [stages.length, stop]);

  useEffect(() => () => clearInterval(timer.current), []);

  useEffect(() => {
    if (!traceKey || reduced) return;
    const id = setTimeout(trace, 260);
    return () => clearTimeout(id);
  }, [traceKey, reduced, trace]);

  useEffect(() => {
    const el = root.current;
    if (!autoTrace || reduced || !el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        trace();
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [autoTrace, reduced, trace]);

  return (
    <div ref={root}>
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <p className="text-[0.9375rem] font-semibold">{title}</p>
        <button
          type="button"
          onClick={trace}
          disabled={running}
          className="btn btn-frame frame frame-lock min-h-11 px-4 text-[0.8125rem]"
        >
          <PlayIcon width={14} height={14} />
          {run}
        </button>
      </div>

      <ol
        className="mt-6 grid md:grid-cols-[repeat(var(--n),minmax(0,1fr))]"
        style={{ "--n": stages.length } as CSSProperties}
      >
        {stages.map((stage, i) => {
          const reached = cursor >= i;
          const current = cursor === i;
          return (
            <li
              key={stage.name}
              className="stage grid grid-cols-[1.25rem_1fr] gap-x-4 md:block"
              data-passed={cursor > i}
            >
              <div className="flex flex-col items-center md:flex-row">
                <span
                  aria-hidden="true"
                  className="frame frame-sm grid size-5 shrink-0 place-items-center"
                  data-locked={current}
                  data-closed={reached}
                >
                  <span
                    className="size-1.5 transition-colors duration-200"
                    style={{
                      background: reached ? "var(--color-lock)" : "var(--color-line-strong)",
                    }}
                  />
                </span>
                {i < stages.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="stage-link min-h-6 w-px flex-1 md:h-px md:min-h-0 md:w-auto"
                  />
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  stop();
                  setCursor(i);
                }}
                aria-pressed={current}
                className="group block w-full cursor-pointer pb-6 text-left md:mt-4 md:pb-0 md:pr-5"
              >
                <span
                  className="data block uppercase text-muted transition-colors duration-200 group-hover:text-lock"
                  style={{ color: current ? "var(--color-lock)" : reached ? "var(--color-text)" : undefined }}
                >
                  {stage.name}
                </span>
                <span
                  className="mt-1.5 block text-[0.9375rem] leading-[1.45] transition-colors duration-200"
                  style={{ color: reached ? "var(--color-text)" : "var(--color-muted)" }}
                >
                  {stage.detail}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
