import type { CSSProperties } from "react";
import { mulberry32 } from "@/components/three/system";
import type { FigureKind } from "@/lib/content";

// Three authored illustrations, one per project. Each is a diagram of the
// technique, drawn from synthetic data, and is labelled as such on the page.

const W = 560;
const H = 360;
const mono = { fontFamily: "var(--font-mono)", fontSize: 11 } as const;
const order = (i: number) => ({ "--i": i }) as CSSProperties;

function Chip({ x, y, text, locked = false }: { x: number; y: number; text: string; locked?: boolean }) {
  const width = text.length * 6.7 + 12;
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width={width} height="18" fill={locked ? "var(--color-lock)" : "var(--color-raised)"} />
      <text x="6" y="12.5" {...mono} fill={locked ? "var(--color-on-lock)" : "var(--color-muted)"}>
        {text}
      </text>
    </g>
  );
}

function Ticks({ x, y, w, h, color }: { x: number; y: number; w: number; h: number; color: string }) {
  const t = 7;
  return (
    <path
      d={`M${x},${y + t} v${-t} h${t} M${x + w - t},${y} h${t} v${t} M${x + w},${y + h - t} v${t} h${-t} M${x + t},${y + h} h${-t} v${-t}`}
      fill="none"
      stroke={color}
      strokeWidth="1"
    />
  );
}

/* ---------- Retrieval: a query and its nearest neighbours ---------- */

function buildRetrieval() {
  const rand = mulberry32(4117);
  const centres = [
    [130, 110],
    [400, 95],
    [330, 235],
    [140, 270],
    [475, 280],
  ];
  const points = centres.flatMap(([cx, cy]) =>
    Array.from({ length: 15 }, () => {
      const a = rand() * Math.PI * 2;
      const r = Math.sqrt(rand()) * 62;
      return [cx + Math.cos(a) * r * 1.15, cy + Math.sin(a) * r * 0.85] as [number, number];
    }),
  );
  const query: [number, number] = [248, 176];
  const ranked = points
    .map((p, i) => ({ i, d: Math.hypot(p[0] - query[0], p[1] - query[1]) }))
    .sort((a, b) => a.d - b.d);
  const top = ranked.slice(0, 5);
  return { points, query, top: new Set(top.map((t) => t.i)), radius: top[4].d + 10 };
}

function RetrievalFigure() {
  const { points, query, top, radius } = buildRetrieval();
  let drawn = 0;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full">
      <circle
        cx={query[0]}
        cy={query[1]}
        r={radius}
        fill="none"
        stroke="var(--color-line-strong)"
        strokeDasharray="3 5"
      />
      {points.map(([x, y], i) =>
        top.has(i) ? (
          <line
            key={`l${i}`}
            x1={query[0]}
            y1={query[1]}
            x2={x}
            y2={y}
            stroke="var(--color-lock)"
            strokeWidth="1.25"
            pathLength={1}
            data-draw
            style={order(drawn++)}
          />
        ) : null,
      )}
      {points.map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r={top.has(i) ? 4 : 2.6}
          fill={top.has(i) ? "var(--color-text)" : "var(--color-signal)"}
          opacity={top.has(i) ? 1 : 0.7}
        />
      ))}
      <rect x={query[0] - 5} y={query[1] - 5} width="10" height="10" fill="var(--color-lock)" />
      <Ticks x={query[0] - 13} y={query[1] - 13} w={26} h={26} color="var(--color-lock)" />
      <Chip x={query[0] + 18} y={query[1] - 34} text="query" locked />
      <Chip x={query[0] - 50} y={query[1] + radius + 8} text="nearest entries" />
    </svg>
  );
}

/* ---------- Detection: boxes on a frame ---------- */

function Car({ x, y, w = 62, h = 28, label }: { x: number; y: number; w?: number; h?: number; label?: boolean }) {
  return (
    <>
      <rect x={x} y={y} width={w} height={h} fill="var(--color-line-strong)" />
      <rect x={x + w * 0.28} y={y + 4} width={w * 0.4} height={h - 8} fill="var(--color-raised)" />
      {label && (
        <g>
          <rect
            x={x - 7}
            y={y - 7}
            width={w + 14}
            height={h + 14}
            fill="none"
            stroke="var(--color-signal)"
            strokeWidth="1"
          />
          <Chip x={x - 7} y={y - 25} text="vehicle" />
        </g>
      )}
    </>
  );
}

function DetectionFigure() {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full">
      <rect width={W} height={H} fill="var(--color-surface)" />
      {[120, 240].map((y) => (
        <line
          key={y}
          x1="0"
          x2={W}
          y1={y}
          y2={y}
          stroke="var(--color-line-strong)"
          strokeWidth="2"
          strokeDasharray="26 22"
        />
      ))}

      <g className="cruise" style={{ "--from": "-70px", "--to": "90px" } as CSSProperties}>
        <Car x={70} y={46} label />
      </g>
      <g className="cruise" style={{ "--from": "80px", "--to": "-60px" } as CSSProperties}>
        <Car x={400} y={286} label />
      </g>

      {/* Two vehicles meet in the middle lane. Before contact each carries its
          own box; after, one box covers both and is classed as a crash. */}
      <g className="car-a">
        <Car x={216} y={166} />
        <g className="crash-off">
          <rect x={209} y={159} width={76} height={42} fill="none" stroke="var(--color-signal)" strokeWidth="1" />
          <Chip x={209} y={141} text="vehicle" />
        </g>
      </g>
      <g className="car-b-move">
        <g className="car-b">
          <Car x={272} y={160} />
        </g>
        <g className="crash-off">
          <rect x={265} y={153} width={76} height={42} fill="none" stroke="var(--color-signal)" strokeWidth="1" />
          <Chip x={265} y={135} text="vehicle" />
        </g>
      </g>

      <g className="crash-on">
        <rect x={204} y={142} width={142} height={66} fill="none" stroke="var(--color-lock)" strokeWidth="1.5" />
        <Chip x={204} y={124} text="crash" locked />
      </g>
    </svg>
  );
}

/* ---------- Backtest: a synthetic series with a Supertrend line ---------- */

function buildBacktest() {
  const rand = mulberry32(8831);
  const n = 120;
  const price: number[] = [];
  let p = 100;
  for (let i = 0; i < n; i++) {
    const drift = i < 34 ? 0.35 : i < 62 ? -0.5 : i < 96 ? 0.45 : -0.3;
    p += drift + (rand() - 0.5) * 2.4;
    price.push(p);
  }
  // Supertrend on closes: a band that trails price and flips when price crosses it.
  const mult = 2.6;
  let atr = 1.2;
  let up = price[0] - mult * atr;
  let down = price[0] + mult * atr;
  let rising = true;
  const trend: { value: number; rising: boolean }[] = [];
  const flips: number[] = [];
  for (let i = 0; i < n; i++) {
    if (i > 0) atr += (Math.abs(price[i] - price[i - 1]) - atr) / 10;
    const lower = price[i] - mult * atr;
    const upper = price[i] + mult * atr;
    up = rising ? Math.max(up, lower) : lower;
    down = rising ? upper : Math.min(down, upper);
    if (rising && price[i] < up) {
      rising = false;
      down = upper;
      flips.push(i);
    } else if (!rising && price[i] > down) {
      rising = true;
      up = lower;
      flips.push(i);
    }
    trend.push({ value: rising ? up : down, rising });
  }
  const all = [...price, ...trend.map((t) => t.value)];
  const lo = Math.min(...all);
  const hi = Math.max(...all);
  const sx = (i: number) => 24 + (i / (n - 1)) * (W - 48);
  const sy = (v: number) => 36 + (1 - (v - lo) / (hi - lo)) * (H - 84);

  const segments: { d: string; rising: boolean }[] = [];
  let start = 0;
  for (let i = 1; i <= n; i++) {
    if (i === n || trend[i].rising !== trend[start].rising) {
      segments.push({
        rising: trend[start].rising,
        d: trend
          .slice(start, i)
          .map((t, j) => `${j ? "L" : "M"}${sx(start + j).toFixed(1)},${sy(t.value).toFixed(1)}`)
          .join(" "),
      });
      start = i;
    }
  }
  return {
    priceD: price.map((v, i) => `${i ? "L" : "M"}${sx(i).toFixed(1)},${sy(v).toFixed(1)}`).join(" "),
    segments,
    flips: flips.map((i) => ({ x: sx(i), y: sy(price[i]) })),
  };
}

function BacktestFigure() {
  const { priceD, segments, flips } = buildBacktest();
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full">
      {[0, 1, 2, 3].map((i) => (
        <line
          key={i}
          x1="24"
          x2={W - 24}
          y1={36 + (i * (H - 84)) / 3}
          y2={36 + (i * (H - 84)) / 3}
          stroke="var(--color-line)"
        />
      ))}
      {segments.map((seg, i) => (
        <path
          key={i}
          d={seg.d}
          fill="none"
          stroke={seg.rising ? "var(--color-signal)" : "var(--color-faint)"}
          strokeWidth="1.5"
          strokeDasharray={seg.rising ? undefined : "4 4"}
        />
      ))}
      <path
        d={priceD}
        fill="none"
        stroke="var(--color-text)"
        strokeWidth="1.5"
        strokeLinejoin="round"
        pathLength={1}
        data-draw
      />
      {flips.map((f, i) => (
        <g key={i}>
          <rect x={f.x - 4} y={f.y - 4} width="8" height="8" fill="var(--color-lock)" />
          <Ticks x={f.x - 11} y={f.y - 11} w={22} h={22} color="var(--color-lock)" />
        </g>
      ))}
      {flips[0] && <Chip x={flips[0].x + 16} y={flips[0].y - 30} text="trend flip" locked />}

      <g transform={`translate(24 ${H - 22})`} {...mono} fill="var(--color-muted)">
        <line x1="0" x2="22" y1="-4" y2="-4" stroke="var(--color-text)" strokeWidth="1.5" />
        <text x="30">series</text>
        <line x1="92" x2="114" y1="-4" y2="-4" stroke="var(--color-signal)" strokeWidth="1.5" />
        <text x="122">Supertrend, rising</text>
        <line x1="262" x2="284" y1="-4" y2="-4" stroke="var(--color-faint)" strokeWidth="1.5" strokeDasharray="4 4" />
        <text x="292">Supertrend, falling</text>
      </g>
    </svg>
  );
}

export function ProjectFigure({ kind }: { kind: FigureKind }) {
  if (kind === "retrieval") return <RetrievalFigure />;
  if (kind === "detection") return <DetectionFigure />;
  return <BacktestFigure />;
}
