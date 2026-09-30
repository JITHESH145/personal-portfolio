"use client";

import { useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { mulberry32 } from "./system";

// Data moving through the system. Each point enters scattered on the left,
// tightens as it passes through the network, and leaves as part of an ordered
// lattice on the right. The whole path is computed on the GPU.

const vertex = /* glsl */ `
  uniform float uTime;
  uniform float uScale;
  attribute vec4 aSeed;   // phase, speed, scatter angle, scatter radius
  attribute vec2 aGrid;   // lattice site this point settles into
  attribute float aSize;
  varying float vAlpha;
  varying float vOrder;

  void main() {
    float u = fract(aSeed.x + uTime * aSeed.y);
    float x = mix(-11.0, 9.0, u);

    float wob = uTime * 0.22 + aSeed.x * 40.0;
    float angle = aSeed.z + sin(wob) * 0.4;
    vec2 chaos = vec2(cos(angle), sin(angle + cos(wob * 0.8) * 0.3))
      * (0.5 + aSeed.w * 3.5);

    float inNet = smoothstep(-6.5, -3.4, x);
    float ordered = smoothstep(3.6, 5.4, x);

    vec2 yz = mix(chaos, chaos * 0.52, inNet);
    yz = mix(yz, aGrid, ordered);

    // Past the output layer points step from site to site instead of sliding.
    float cell = 0.5;
    float stepped = (floor(x / cell) + smoothstep(0.62, 1.0, fract(x / cell))) * cell;
    x = mix(x, stepped, ordered);

    vec4 mv = modelViewMatrix * vec4(x, yz.x, yz.y, 1.0);
    gl_Position = projectionMatrix * mv;

    float fade = smoothstep(0.0, 0.1, u) * (1.0 - smoothstep(0.9, 1.0, u));
    vAlpha = fade * mix(0.62, 1.0, ordered);
    vOrder = ordered;
    gl_PointSize = aSize * mix(1.0, 1.35, ordered) * uScale / -mv.z;
  }
`;

const fragment = /* glsl */ `
  uniform vec3 uRaw;
  uniform vec3 uOrdered;
  varying float vAlpha;
  varying float vOrder;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float disc = 1.0 - smoothstep(0.28, 0.5, d);
    gl_FragColor = vec4(mix(uRaw, uOrdered, vOrder), disc * vAlpha);
  }
`;

export function ParticleField({
  count,
  scale,
  frozen,
}: {
  count: number;
  scale: number;
  frozen: boolean;
}) {
  const { geometry, material } = useMemo(() => {
    const rand = mulberry32(977);
    const seed = new Float32Array(count * 4);
    const grid = new Float32Array(count * 2);
    const size = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      seed[i * 4] = rand();
      seed[i * 4 + 1] = 0.012 + rand() * 0.012;
      seed[i * 4 + 2] = rand() * Math.PI * 2;
      seed[i * 4 + 3] = Math.pow(rand(), 0.7);
      grid[i * 2] = (Math.floor(rand() * 9) - 4) * 0.5;
      grid[i * 2 + 1] = (Math.floor(rand() * 5) - 2) * 0.5;
      size[i] = 2.2 + rand() * 2.2;
    }
    const geo = new THREE.BufferGeometry();
    // Positions are computed in the shader; this attribute only sets the draw count.
    geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    geo.setAttribute("aSeed", new THREE.BufferAttribute(seed, 4));
    geo.setAttribute("aGrid", new THREE.BufferAttribute(grid, 2));
    geo.setAttribute("aSize", new THREE.BufferAttribute(size, 1));
    const mat = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      uniforms: {
        uTime: { value: 40 },
        uScale: { value: 1 },
        uRaw: { value: new THREE.Color("#4f6fe8") },
        uOrdered: { value: new THREE.Color("#b9c8ff") },
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
    if (!frozen) material.uniforms.uTime.value = 40 + clock.elapsedTime;
  });

  return <points geometry={geometry} material={material} frustumCulled={false} />;
}
