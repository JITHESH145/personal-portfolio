"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

export function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}

/**
 * Sets data-inview on the element while it is on screen. Writes the attribute
 * directly so figures can start and pause their CSS animation without a render.
 */
export function useInViewAttr<T extends Element>(threshold = 0.35, onEnter?: () => void) {
  const ref = useRef<T>(null);
  const enter = useRef(onEnter);
  useEffect(() => {
    enter.current = onEnter;
  });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        el.setAttribute("data-inview", entry.isIntersecting ? "true" : "false");
        if (entry.isIntersecting) enter.current?.();
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return ref;
}
