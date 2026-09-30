// Geometry for the hero system. Pure and deterministic so the WebGL scene and
// the static SVG fallback draw the same network.

export type Tier = "low" | "mid" | "high";

export const TIERS: Record<
  Tier,
  { particles: number; pulses: number; maxDpr: number; antialias: boolean }
> = {
  low: { particles: 700, pulses: 36, maxDpr: 1.5, antialias: false },
  mid: { particles: 1500, pulses: 64, maxDpr: 1.5, antialias: true },
  high: { particles: 2800, pulses: 96, maxDpr: 1.75, antialias: true },
};

export function mulberry32(seed: number) {
  let s = seed;
  return () => {
    s += 0x6d2b79f5;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const LAYER_X = [-4, -2, 0, 2, 4];
const LAYER_COUNT = [7, 10, 12, 9, 5];
const LAYER_RADIUS = [2.3, 2.7, 2.9, 2.3, 0];
const OUTPUT_LAYER = LAYER_X.length - 1;

export interface Network {
  /** xyz per node */
  nodes: Float32Array;
  layers: Uint8Array;
  /** node index pairs, source then target */
  edges: Uint16Array;
  /** node indices of the output layer, top to bottom */
  outputs: number[];
  /** per output: how strongly each edge feeds it, 0..1 */
  edgeHeat: Float32Array[];
  /** per output: how strongly each node feeds it, 0..1 */
  nodeHeat: Float32Array[];
}

let cached: Network | null = null;

export function buildNetwork(): Network {
  if (cached) return cached;
  const rand = mulberry32(20240);
  const pos: number[] = [];
  const layerOf: number[] = [];
  const byLayer: number[][] = [];

  LAYER_COUNT.forEach((count, layer) => {
    const ids: number[] = [];
    for (let i = 0; i < count; i++) {
      let x = LAYER_X[layer];
      let y: number;
      let z: number;
      if (layer === OUTPUT_LAYER) {
        // Outputs sit in a clean column so their labels never collide.
        y = (2 - i) * 0.95;
        z = i % 2 ? 0.3 : -0.3;
      } else {
        const angle = (i / count) * Math.PI * 2 + rand() * 0.6;
        const r = LAYER_RADIUS[layer] * (0.42 + 0.58 * Math.sqrt(rand()));
        x += (rand() - 0.5) * 0.5;
        y = Math.sin(angle) * r * 0.95;
        z = Math.cos(angle) * r * 0.8;
      }
      ids.push(pos.length / 3);
      pos.push(x, y, z);
      layerOf.push(layer);
    }
    byLayer.push(ids);
  });

  const dist = (a: number, b: number) =>
    Math.hypot(
      pos[a * 3] - pos[b * 3],
      pos[a * 3 + 1] - pos[b * 3 + 1],
      pos[a * 3 + 2] - pos[b * 3 + 2],
    );

  const edgeList: [number, number][] = [];
  const has = new Set<string>();
  const link = (a: number, b: number) => {
    const key = `${a}-${b}`;
    if (has.has(key)) return;
    has.add(key);
    edgeList.push([a, b]);
  };

  for (let layer = 0; layer < OUTPUT_LAYER; layer++) {
    const next = byLayer[layer + 1];
    for (const a of byLayer[layer]) {
      const near = [...next].sort((p, q) => dist(a, p) - dist(a, q));
      link(a, near[0]);
      link(a, near[1]);
      if (layer < OUTPUT_LAYER - 1) {
        link(a, near[2 + Math.floor(rand() * (near.length - 2))]);
      }
    }
    // No orphan targets: every node is fed by something.
    for (const b of next) {
      if (edgeList.some(([, t]) => t === b)) continue;
      const near = [...byLayer[layer]].sort((p, q) => dist(b, p) - dist(b, q));
      link(near[0], b);
    }
  }

  const nodeCount = pos.length / 3;
  const outputs = byLayer[OUTPUT_LAYER];
  // Two layers back is enough to read as a path; further and the whole net lights.
  const falloff = [1, 0.55];

  const edgeHeat: Float32Array[] = [];
  const nodeHeat: Float32Array[] = [];
  for (const out of outputs) {
    const eh = new Float32Array(edgeList.length);
    const nh = new Float32Array(nodeCount);
    nh[out] = 1;
    let frontier = new Set<number>([out]);
    for (let depth = 0; depth < falloff.length && frontier.size; depth++) {
      const nextFrontier = new Set<number>();
      edgeList.forEach(([a, b], i) => {
        if (!frontier.has(b)) return;
        eh[i] = Math.max(eh[i], falloff[depth]);
        nh[a] = Math.max(nh[a], falloff[depth] * 0.7);
        nextFrontier.add(a);
      });
      frontier = nextFrontier;
    }
    edgeHeat.push(eh);
    nodeHeat.push(nh);
  }

  cached = {
    nodes: new Float32Array(pos),
    layers: new Uint8Array(layerOf),
    edges: new Uint16Array(edgeList.flat()),
    outputs,
    edgeHeat,
    nodeHeat,
  };
  return cached;
}

/** State shared between the DOM stage and the render loop. Mutated, never re-rendered. */
export interface StageState {
  /** hero scroll progress, 0 at top, 1 when the hero has left */
  scroll: number;
  /** contact section presence, 0..1 */
  contact: number;
  /** pointer in viewport pixels */
  px: number;
  py: number;
  /** performance.now() of the last mouse move, or -Infinity */
  pointerAt: number;
  /** index of the locked output */
  lock: number;
}
