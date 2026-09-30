"use client";

import { useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { buildNetwork, mulberry32 } from "./system";

// Signals travelling along the network's edges, always from input to output.

const vertex = /* glsl */ `
  uniform float uTime;
  uniform float uScale;
  attribute vec3 aStart;
  attribute vec3 aEnd;
  attribute vec2 aPhase; // phase, speed
  varying float vAlpha;

  void main() {
    float t = fract(aPhase.x + uTime * aPhase.y);
    vec4 mv = modelViewMatrix * vec4(mix(aStart, aEnd, t), 1.0);
    gl_Position = projectionMatrix * mv;
    vAlpha = sin(t * 3.14159);
    gl_PointSize = 3.4 * uScale / -mv.z;
  }
`;

const fragment = /* glsl */ `
  uniform vec3 uColor;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float disc = 1.0 - smoothstep(0.15, 0.5, d);
    gl_FragColor = vec4(uColor, disc * vAlpha);
  }
`;

export function DataFlow({
  count,
  scale,
  frozen,
}: {
  count: number;
  scale: number;
  frozen: boolean;
}) {
  const { geometry, material } = useMemo(() => {
    const net = buildNetwork();
    const rand = mulberry32(311);
    const edgeCount = net.edges.length / 2;
    const start = new Float32Array(count * 3);
    const end = new Float32Array(count * 3);
    const phase = new Float32Array(count * 2);
    for (let i = 0; i < count; i++) {
      const e = Math.floor(rand() * edgeCount);
      const a = net.edges[e * 2] * 3;
      const b = net.edges[e * 2 + 1] * 3;
      start.set(net.nodes.subarray(a, a + 3), i * 3);
      end.set(net.nodes.subarray(b, b + 3), i * 3);
      phase[i * 2] = rand();
      phase[i * 2 + 1] = 0.16 + rand() * 0.16;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    geo.setAttribute("aStart", new THREE.BufferAttribute(start, 3));
    geo.setAttribute("aEnd", new THREE.BufferAttribute(end, 3));
    geo.setAttribute("aPhase", new THREE.BufferAttribute(phase, 2));
    const mat = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      uniforms: {
        uTime: { value: 7 },
        uScale: { value: 1 },
        uColor: { value: new THREE.Color("#dfe7ff") },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    return { geometry: geo, material: mat };
  }, [count]);

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  useFrame(({ clock }) => {
    material.uniforms.uScale.value = scale;
    if (!frozen) material.uniforms.uTime.value = 7 + clock.elapsedTime;
  });

  return <points geometry={geometry} material={material} frustumCulled={false} />;
}
