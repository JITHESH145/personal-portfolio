"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { systemOutputs } from "@/lib/content";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { buildNetwork, type StageState, type Tier } from "@/components/three/system";

// The 3D system is split into its own chunk and only requested once the page
// is idle, so the name and the first action never wait on WebGL.
const Scene = dynamic(() => import("@/components/three/Scene"), { ssr: false });

type Mode = "pending" | "webgl" | "static";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smoothstep = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

function detect(): { mode: Mode; tier: Tier } {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    if (!gl) return { mode: "static", tier: "low" };
  } catch {
    return { mode: "static", tier: "low" };
  }
  const width = window.innerWidth;
  const cores = navigator.hardwareConcurrency ?? 8;
  let tier: Tier = width < 640 ? "low" : width < 1024 ? "mid" : "high";
  if (cores <= 4 && tier === "high") tier = "mid";
  return { mode: "webgl", tier };
}

/** The same network, drawn flat, for browsers without WebGL. */
function StaticSystem() {
  const net = buildNetwork();
  const px = (i: number) => net.nodes[i * 3] + net.nodes[i * 3 + 2] * 0.28;
  const py = (i: number) => -net.nodes[i * 3 + 1];
  const edges = [];
  for (let i = 0; i < net.edges.length; i += 2) {
    const a = net.edges[i];
    const b = net.edges[i + 1];
    edges.push(
      <line key={i} x1={px(a)} y1={py(a)} x2={px(b)} y2={py(b)} />,
    );
  }
  return (
    <svg
      viewBox="-5.4 -3.6 14.4 7.2"
      className="absolute right-0 top-[8%] h-auto w-full md:top-[14%] md:w-[68%]"
    >
      <g stroke="var(--color-signal-deep)" strokeWidth="0.015" opacity="0.7">
        {edges}
      </g>
      {Array.from(net.layers, (layer, i) => (
        <circle
          key={i}
          cx={px(i)}
          cy={py(i)}
          r={layer === 4 ? 0.09 : 0.065}
          fill="var(--color-signal)"
        />
      ))}
      {net.outputs.map((node, i) => (
        <text
          key={node}
          x={px(node) + 0.3}
          y={py(node) + 0.08}
          fontSize="0.24"
          fontFamily="var(--font-mono)"
          fill="var(--color-muted)"
        >
          {systemOutputs[i]}
        </text>
      ))}
    </svg>
  );
}

export function SystemStage() {
  const wrap = useRef<HTMLDivElement>(null);
  const labels = useRef<(HTMLDivElement | null)[]>([]);
  const stage = useRef<StageState>({
    scroll: 0,
    contact: 0,
    px: -9999,
    py: -9999,
    pointerAt: -Infinity,
    lock: -1,
  });
  const [setup, setSetup] = useState<{ mode: Mode; tier: Tier }>({
    mode: "pending",
    tier: "high",
  });
  const [active, setActive] = useState(true);
  const [ready, setReady] = useState(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const start = () => setSetup(detect());
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(start, { timeout: 700 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(start, 150);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    const s = stage.current;
    let frame = 0;

    const measure = () => {
      frame = 0;
      const home = document.getElementById("home");
      const contact = document.getElementById("contact");
      const vh = window.innerHeight;
      s.scroll = home ? clamp01(window.scrollY / (home.offsetHeight * 0.85)) : 1;
      s.contact = contact
        ? // Stays out until Contact owns a third of the viewport, so it never sits behind Education.
          clamp01((vh - contact.getBoundingClientRect().top - vh * 0.33) / (vh * 0.5))
        : 0;
      const presence = Math.max(1 - smoothstep(0.4, 1, s.scroll), s.contact * 0.42);
      const el = wrap.current;
      if (el) {
        el.style.opacity = presence.toFixed(3);
        el.dataset.labels = s.scroll < 0.5 && s.contact === 0 ? "on" : "off";
      }
      setActive(presence > 0.01);
    };
    const queue = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      s.px = e.clientX;
      s.py = e.clientY;
      s.pointerAt = performance.now();
    };

    measure();
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
      window.removeEventListener("pointermove", move);
    };
  }, []);

  const onReady = useCallback(() => setReady(true), []);

  return (
    <div
      ref={wrap}
      aria-hidden="true"
      data-labels="on"
      className="group/stage pointer-events-none fixed inset-0 z-0"
    >
      {setup.mode === "static" && <StaticSystem />}
      {setup.mode === "webgl" && (
        <div
          className="absolute inset-0 transition-opacity duration-[1400ms] ease-[var(--ease-out-expo)]"
          style={{ opacity: ready ? 1 : 0 }}
        >
          <Scene
            tier={setup.tier}
            frozen={reduced}
            active={active}
            stage={stage}
            labels={labels}
            onReady={onReady}
          />
          <div className="absolute inset-0 transition-opacity duration-300 group-data-[labels=off]/stage:opacity-0">
            {systemOutputs.map((label, i) => (
              <div
                key={label}
                ref={(el) => {
                  labels.current[i] = el;
                }}
                className="sys-label"
                data-locked="false"
              >
                <span className="frame sys-box" />
                <span className="sys-tag">{label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
