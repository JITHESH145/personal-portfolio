"use client";

import { useMemo, useState } from "react";
import {
  skillGroups,
  skillLinks,
  skills,
  type Skill,
  type SkillGroupId,
} from "@/lib/content";

const byId = new Map(skills.map((s) => [s.id, s]));
const groupLabel = new Map(skillGroups.map((g) => [g.id, g.label]));

const neighbours = new Map<string, string[]>();
for (const [a, b] of skillLinks) {
  neighbours.set(a, [...(neighbours.get(a) ?? []), b]);
  neighbours.set(b, [...(neighbours.get(b) ?? []), a]);
}

// Group is carried by shape as well as position, never by colour alone.
function Marker({ group, size = 5 }: { group: SkillGroupId; size?: number }) {
  if (group === "frameworks") {
    return <rect x={-size} y={-size} width={size * 2} height={size * 2} />;
  }
  if (group === "viz") {
    return (
      <rect x={-size} y={-size} width={size * 2} height={size * 2} transform="rotate(45)" />
    );
  }
  return <circle r={size + 0.5} />;
}

function Glyph({ group, color = "var(--color-signal)" }: { group: SkillGroupId; color?: string }) {
  return (
    <svg width="12" height="12" viewBox="-8 -8 16 16" fill={color} aria-hidden="true" className="shrink-0">
      <Marker group={group} size={4.5} />
    </svg>
  );
}

function labelProps(s: Skill) {
  switch (s.side) {
    case "left":
      return { x: s.x - 20, y: s.y + 5, textAnchor: "end" as const };
    case "top":
      return { x: s.x, y: s.y - 21, textAnchor: "middle" as const };
    case "bottom":
      return { x: s.x, y: s.y + 32, textAnchor: "middle" as const };
    default:
      return { x: s.x + 20, y: s.y + 5, textAnchor: "start" as const };
  }
}

const GHOST_TICKS = "M-14,-8 v-6 h6 M8,-14 h6 v6 M14,8 v6 h-6 M-8,14 h-6 v-6";

export function Skills() {
  const [focus, setFocus] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const [group, setGroup] = useState<SkillGroupId | null>(null);

  const current = focus ?? pinned;
  // The small-screen explorer always has a node in hand; it starts at Python.
  const walker = pinned ?? "python";

  const lit = useMemo(() => {
    if (current) return new Set([current, ...(neighbours.get(current) ?? [])]);
    if (group) return new Set(skills.filter((s) => s.group === group).map((s) => s.id));
    return null;
  }, [current, group]);

  const readout = current
    ? `${byId.get(current)!.label} connects to ${(neighbours.get(current) ?? [])
        .map((id) => byId.get(id)!.label)
        .join(", ")}.`
    : group
      ? `${groupLabel.get(group)}: ${skills
          .filter((s) => s.group === group)
          .map((s) => s.label)
          .join(", ")}.`
      : "Select a skill to see what it connects to.";

  const state = (id: string) =>
    !lit ? "rest" : id === current ? "locked" : lit.has(id) ? "lit" : "dim";

  const pin = (id: string) => {
    setGroup(null);
    setPinned(pinned === id ? null : id);
  };

  return (
    <section id="skills" aria-labelledby="skills-title" className="section">
      <div className="shell">
        <h2 id="skills-title" className="h2">
          Skills, and how they connect
        </h2>

        {/* ---------- Wide screens: the whole graph ---------- */}
        <div className="hidden lg:block">
          <div className="mt-8 flex flex-wrap gap-3" role="group" aria-label="Highlight a group">
            {skillGroups.map((g) => (
              <button
                key={g.id}
                type="button"
                aria-pressed={group === g.id}
                onClick={() => {
                  setPinned(null);
                  setGroup(group === g.id ? null : g.id);
                }}
                className="frame frame-lock flex min-h-11 cursor-pointer items-center gap-2.5 px-3.5 text-[0.875rem] text-muted transition-colors duration-200 hover:text-text aria-pressed:text-lock"
                data-locked={group === g.id}
              >
                <Glyph group={g.id} color="currentColor" />
                {g.label}
              </button>
            ))}
          </div>

          <p className="mt-6 min-h-[1.65em] max-w-[80ch] text-muted" aria-live="polite">
            {readout}
          </p>

          <svg
            viewBox="0 0 1200 660"
            className="mt-2 h-auto w-full"
            role="group"
            aria-label="Skill graph. Each skill is a button; selecting one shows what it connects to."
            onPointerLeave={() => setFocus(null)}
          >
            <g aria-hidden="true">
              {skillLinks.map(([a, b]) => {
                const A = byId.get(a)!;
                const B = byId.get(b)!;
                const on = current !== null && (a === current || b === current);
                const inGroup = !current && lit !== null && lit.has(a) && lit.has(b);
                return (
                  <line
                    key={`${a}-${b}`}
                    x1={A.x}
                    y1={A.y}
                    x2={B.x}
                    y2={B.y}
                    stroke={
                      on
                        ? "var(--color-lock)"
                        : inGroup
                          ? "var(--color-signal)"
                          : "var(--color-line-strong)"
                    }
                    strokeWidth={on ? 1.5 : 1}
                    opacity={lit && !on && !inGroup ? 0.3 : 1}
                    className="transition-[stroke,opacity] duration-200"
                  />
                );
              })}
            </g>
            {skills.map((s) => {
              const st = state(s.id);
              const locked = st === "locked";
              return (
                <g
                  key={s.id}
                  role="button"
                  tabIndex={0}
                  aria-pressed={pinned === s.id}
                  aria-label={`${s.label}, ${groupLabel.get(s.group)}`}
                  onPointerEnter={() => setFocus(s.id)}
                  onFocus={() => setFocus(s.id)}
                  onBlur={() => setFocus(null)}
                  onClick={() => pin(s.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      pin(s.id);
                    }
                  }}
                  opacity={st === "dim" ? 0.32 : 1}
                  className="cursor-pointer outline-none transition-opacity duration-200"
                >
                  <circle cx={s.x} cy={s.y} r="26" fill="transparent" />
                  <g transform={`translate(${s.x} ${s.y})`}>
                    {/* Ghost ticks at rest; a closed box only when locked. */}
                    {locked ? (
                      <rect
                        x="-14"
                        y="-14"
                        width="28"
                        height="28"
                        fill="none"
                        stroke="var(--color-lock)"
                      />
                    ) : (
                      <path d={GHOST_TICKS} fill="none" stroke="var(--color-line-strong)" />
                    )}
                    <g
                      fill={
                        locked
                          ? "var(--color-lock)"
                          : st === "lit"
                            ? "var(--color-text)"
                            : "var(--color-signal)"
                      }
                      className="transition-[fill] duration-200"
                    >
                      <Marker group={s.group} />
                    </g>
                  </g>
                  <text
                    {...labelProps(s)}
                    fontSize="15"
                    stroke="var(--color-ink)"
                    strokeWidth="6"
                    strokeLinejoin="round"
                    paintOrder="stroke"
                    fill={
                      locked
                        ? "var(--color-lock)"
                        : st === "lit"
                          ? "var(--color-text)"
                          : "var(--color-muted)"
                    }
                    className="transition-[fill] duration-200"
                  >
                    {s.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* ---------- Narrow screens: walk the graph one node at a time ---------- */}
        <div className="lg:hidden">
          <p className="prose mt-5">
            One skill is locked at a time. Tap anything it links to and the lock moves there.
          </p>

          <div className="mt-8" aria-live="polite">
            <div className="frame inline-flex min-h-14 items-center gap-3 px-4" data-locked="true">
              <Glyph group={byId.get(walker)!.group} color="var(--color-lock)" />
              <span>
                <span className="block text-[1.25rem] font-semibold leading-tight text-lock [font-stretch:108%]">
                  {byId.get(walker)!.label}
                </span>
                <span className="block text-[0.8125rem] text-muted">
                  {groupLabel.get(byId.get(walker)!.group)}
                </span>
              </span>
            </div>

            <ul className="ml-5" aria-label={`Linked to ${byId.get(walker)!.label}`}>
              {(neighbours.get(walker) ?? []).map((id, i, all) => {
                const n = byId.get(id)!;
                return (
                  <li key={id} className="relative flex items-center pt-2.5">
                    {/* The rail stops at the last branch instead of running past it. */}
                    <span
                      aria-hidden="true"
                      className={`absolute left-0 top-0 w-px bg-lock ${
                        i === all.length - 1 ? "h-[calc(50%+0.3125rem)]" : "h-full"
                      }`}
                    />
                    <span aria-hidden="true" className="h-px w-5 shrink-0 bg-lock" />
                    <button
                      type="button"
                      onClick={() => {
                        setGroup(null);
                        setPinned(id);
                      }}
                      className="frame frame-lock flex min-h-11 cursor-pointer items-center gap-2.5 px-3.5 text-[0.9375rem]"
                    >
                      <Glyph group={n.group} />
                      {n.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="mt-10 grid gap-y-9">
            {skillGroups.map((g) => (
              <div key={g.id}>
                <h3 className="flex items-center gap-2.5 text-[0.9375rem] font-semibold">
                  <Glyph group={g.id} />
                  {g.label}
                </h3>
                <ul className="mt-4 flex flex-wrap gap-x-3 gap-y-3">
                  {skills
                    .filter((s) => s.group === g.id)
                    .map((s) => {
                      const locked = s.id === walker;
                      const linked = (neighbours.get(walker) ?? []).includes(s.id);
                      return (
                        <li key={s.id}>
                          <button
                            type="button"
                            aria-pressed={locked}
                            data-locked={locked}
                            onClick={() => {
                              setGroup(null);
                              setPinned(s.id);
                            }}
                            className="frame frame-lock min-h-11 cursor-pointer px-3.5 text-[0.9375rem] transition-colors duration-200"
                            style={{
                              color: locked
                                ? "var(--color-lock)"
                                : linked
                                  ? "var(--color-text)"
                                  : "var(--color-muted)",
                            }}
                          >
                            {s.label}
                          </button>
                        </li>
                      );
                    })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
