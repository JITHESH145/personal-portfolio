"use client";

import { useEffect, useMemo, useRef } from "react";
import type { RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { buildNetwork, type StageState } from "./system";

// The five-layer network. When an output is locked, the edges and nodes that
// feed it warm from system blue to lime, so the lock reads as a path through
// the model rather than a highlight on one dot.

const nodeVertex = /* glsl */ `
  uniform float uScale;
  attribute float aHeat;
  attribute float aSize;
  varying float vHeat;

  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    vHeat = aHeat;
    gl_PointSize = aSize * (1.0 + aHeat * 0.7) * uScale / -mv.z;
  }
`;

const nodeFragment = /* glsl */ `
  uniform vec3 uCool;
  uniform vec3 uHot;
  varying float vHeat;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float core = 1.0 - smoothstep(0.2, 0.26, d);
    float halo = (1.0 - smoothstep(0.26, 0.5, d)) * 0.28;
    gl_FragColor = vec4(mix(uCool, uHot, vHeat), core + halo);
  }
`;

const COOL = new THREE.Color("#5f80f5");
const HOT = new THREE.Color("#c9f24b");
const EDGE_REST = 0.2;

export function NeuralNetwork({
  scale,
  stage,
  frozen,
}: {
  scale: number;
  stage: RefObject<StageState>;
  frozen: boolean;
}) {
  const net = useMemo(() => buildNetwork(), []);
  const edgeCount = net.edges.length / 2;
  const nodeCount = net.nodes.length / 3;

  const rest = useMemo(
    () => ({ edge: new Float32Array(edgeCount), node: new Float32Array(nodeCount) }),
    [edgeCount, nodeCount],
  );
  const heat = useRef({
    edge: new Float32Array(edgeCount),
    node: new Float32Array(nodeCount),
    settled: false,
    lock: -2,
  });

  const { lines, lineMaterial, points, pointMaterial } = useMemo(() => {
    const linePos = new Float32Array(edgeCount * 6);
    for (let i = 0; i < edgeCount; i++) {
      const a = net.edges[i * 2] * 3;
      const b = net.edges[i * 2 + 1] * 3;
      linePos.set(net.nodes.subarray(a, a + 3), i * 6);
      linePos.set(net.nodes.subarray(b, b + 3), i * 6 + 3);
    }
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.BufferAttribute(linePos, 3));
    lineGeo.setAttribute(
      "color",
      new THREE.BufferAttribute(new Float32Array(edgeCount * 6), 3),
    );
    const lineMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const size = new Float32Array(nodeCount);
    for (let i = 0; i < nodeCount; i++) size[i] = net.layers[i] === 4 ? 9 : 6.5;
    const pointGeo = new THREE.BufferGeometry();
    pointGeo.setAttribute("position", new THREE.BufferAttribute(net.nodes, 3));
    pointGeo.setAttribute("aSize", new THREE.BufferAttribute(size, 1));
    pointGeo.setAttribute(
      "aHeat",
      new THREE.BufferAttribute(new Float32Array(nodeCount), 1),
    );
    const pointMat = new THREE.ShaderMaterial({
      vertexShader: nodeVertex,
      fragmentShader: nodeFragment,
      uniforms: {
        uScale: { value: 1 },
        uCool: { value: COOL.clone().lerp(new THREE.Color("#ffffff"), 0.25) },
        uHot: { value: HOT },
      },
      transparent: true,
      depthWrite: false,
    });
    return {
      lines: lineGeo,
      lineMaterial: lineMat,
      points: pointGeo,
      pointMaterial: pointMat,
    };
  }, [net, edgeCount, nodeCount]);

  useEffect(
    () => () => {
      lines.dispose();
      lineMaterial.dispose();
      points.dispose();
      pointMaterial.dispose();
    },
    [lines, lineMaterial, points, pointMaterial],
  );

  useFrame((_, delta) => {
    pointMaterial.uniforms.uScale.value = scale;
    const h = heat.current;
    const lock = stage.current?.lock ?? -1;
    if (lock !== h.lock) {
      h.lock = lock;
      h.settled = false;
    }
    if (h.settled) return;

    // lock -1 is rest: every edge and node cools back to system blue.
    const targetEdge = lock < 0 ? rest.edge : net.edgeHeat[lock];
    const targetNode = lock < 0 ? rest.node : net.nodeHeat[lock];
    // Frame-rate independent exponential approach.
    const k = frozen ? 1 : 1 - Math.exp(-Math.min(delta, 0.1) * 9);
    const color = lines.getAttribute("color") as THREE.BufferAttribute;
    const nodeHeat = points.getAttribute("aHeat") as THREE.BufferAttribute;
    let moving = 0;

    for (let i = 0; i < edgeCount; i++) {
      const next = h.edge[i] + (targetEdge[i] - h.edge[i]) * k;
      moving = Math.max(moving, Math.abs(targetEdge[i] - next));
      h.edge[i] = next;
      const r = COOL.r * EDGE_REST + (HOT.r * 0.85 - COOL.r * EDGE_REST) * next;
      const g = COOL.g * EDGE_REST + (HOT.g * 0.85 - COOL.g * EDGE_REST) * next;
      const b = COOL.b * EDGE_REST + (HOT.b * 0.85 - COOL.b * EDGE_REST) * next;
      color.setXYZ(i * 2, r, g, b);
      color.setXYZ(i * 2 + 1, r, g, b);
    }
    for (let i = 0; i < nodeCount; i++) {
      const next = h.node[i] + (targetNode[i] - h.node[i]) * k;
      h.node[i] = next;
      nodeHeat.setX(i, next);
    }
    color.needsUpdate = true;
    nodeHeat.needsUpdate = true;
    if (moving < 0.002) h.settled = true;
  });

  return (
    <>
      <lineSegments geometry={lines} material={lineMaterial} frustumCulled={false} />
      <points geometry={points} material={pointMaterial} frustumCulled={false} />
    </>
  );
}
