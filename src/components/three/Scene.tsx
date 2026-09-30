"use client";

import { useEffect, useMemo, useRef } from "react";
import type { RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { DataFlow } from "./DataFlow";
import { NeuralNetwork } from "./NeuralNetwork";
import { ParticleField } from "./ParticleField";
import { buildNetwork, TIERS, type StageState, type Tier } from "./system";

interface SceneProps {
  tier: Tier;
  /** reduced motion: draw one still frame and redraw only on input */
  frozen: boolean;
  /** false while the stage is scrolled out of view */
  active: boolean;
  stage: RefObject<StageState>;
  labels: RefObject<(HTMLDivElement | null)[]>;
  onReady: () => void;
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

function System({ tier, frozen, stage, labels }: Omit<SceneProps, "active" | "onReady">) {
  const group = useRef<THREE.Group>(null);
  const size = useThree((s) => s.size);
  const dpr = useThree((s) => s.viewport.dpr);
  const invalidate = useThree((s) => s.invalidate);
  const net = useMemo(() => buildNetwork(), []);
  const point = useMemo(() => new THREE.Vector3(), []);
  const ease = useRef({ rx: 0, ry: 0 });
  const cfg = TIERS[tier];

  // Point sizes are authored in CSS pixels at the camera's resting distance.
  const scale = 14 * dpr * clamp(size.height / 900, 0.75, 1.15);

  // Where the system sits: right of the text on wide screens, above it on narrow ones.
  const layout = useMemo(() => {
    const aspect = size.width / size.height;
    if (aspect < 0.8) return { x: -0.55, y: 2.9, s: 0.36 };
    if (aspect < 1.25) return { x: 0.7, y: 1.7, s: 0.68 };
    return { x: 1.45, y: 0.35, s: 0.8 };
  }, [size.width, size.height]);

  useEffect(() => {
    if (!frozen) return;
    const redraw = () => invalidate();
    window.addEventListener("pointermove", redraw, { passive: true });
    window.addEventListener("scroll", redraw, { passive: true });
    redraw();
    return () => {
      window.removeEventListener("pointermove", redraw);
      window.removeEventListener("scroll", redraw);
    };
  }, [frozen, invalidate, layout]);

  useFrame(({ camera, clock }, delta) => {
    const g = group.current;
    const s = stage.current;
    if (!g || !s) return;

    const pointerRecent = performance.now() - s.pointerAt < 4000;
    const follow = pointerRecent && !frozen;
    const nx = follow ? (s.px / size.width - 0.5) * 2 : 0;
    const ny = follow ? (s.py / size.height - 0.5) * 2 : 0;
    const k = frozen ? 1 : 1 - Math.exp(-Math.min(delta, 0.1) * 3.2);
    ease.current.ry += (nx * 0.12 - ease.current.ry) * k;
    ease.current.rx += (ny * 0.07 - ease.current.rx) * k;

    // Scrolling travels the camera into the system; at the contact section
    // the system returns, turned to a new angle.
    const leave = s.scroll * (1 - s.contact);
    g.rotation.set(
      0.06 + ease.current.rx,
      -0.34 + ease.current.ry + leave * 0.5 + s.contact * 0.75,
      0,
    );
    g.position.set(layout.x - leave * 1.1 + s.contact * layout.s * 2.6, layout.y + leave * 0.5, 0);
    g.scale.setScalar(layout.s);
    camera.position.z = 14 - leave * 2.2;
    g.updateMatrixWorld();
    camera.updateMatrixWorld();

    // Track the output nodes with their DOM labels and find the one nearest the pointer.
    let nearest = 0;
    let nearestDistance = Infinity;
    const els = labels.current ?? [];
    net.outputs.forEach((node, i) => {
      point.fromArray(net.nodes, node * 3).applyMatrix4(g.matrixWorld).project(camera);
      const x = (point.x * 0.5 + 0.5) * size.width;
      const y = (-point.y * 0.5 + 0.5) * size.height;
      const el = els[i];
      if (el) {
        el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
        if (!el.dataset.placed) el.dataset.placed = "true";
      }
      const d = Math.hypot(x - s.px, y - s.py);
      if (d < nearestDistance) {
        nearestDistance = d;
        nearest = i;
      }
    });

    // Attention follows the pointer; with no pointer it scans the outputs in turn.
    // Away from the hero nothing is labelled, so nothing is locked and the path cools.
    const labelled = s.scroll < 0.5 && s.contact === 0;
    const lock = !labelled
      ? -1
      : pointerRecent
        ? nearest
        : frozen
          ? 1
          : Math.floor(clock.elapsedTime / 2.8) % net.outputs.length;
    if (lock !== s.lock) {
      s.lock = lock;
      els.forEach((el, i) => {
        if (el) el.dataset.locked = i === lock ? "true" : "false";
      });
    }
  });

  return (
    <group ref={group}>
      <ParticleField count={cfg.particles} scale={scale} frozen={frozen} />
      <NeuralNetwork scale={scale} stage={stage} frozen={frozen} />
      <DataFlow count={cfg.pulses} scale={scale} frozen={frozen} />
    </group>
  );
}

export default function Scene({ tier, frozen, active, stage, labels, onReady }: SceneProps) {
  const cfg = TIERS[tier];
  return (
    <Canvas
      dpr={[1, cfg.maxDpr]}
      camera={{ fov: 40, position: [0, 0, 14], near: 0.1, far: 60 }}
      gl={{ antialias: cfg.antialias, alpha: true, powerPreference: "high-performance" }}
      frameloop={frozen ? "demand" : active ? "always" : "never"}
      onCreated={onReady}
      style={{ pointerEvents: "none" }}
      aria-hidden="true"
    >
      <System tier={tier} frozen={frozen} stage={stage} labels={labels} />
    </Canvas>
  );
}
