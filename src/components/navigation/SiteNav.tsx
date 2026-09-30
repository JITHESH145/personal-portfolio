"use client";

import { useEffect, useRef, useState } from "react";
import { person, sections } from "@/lib/content";

export function SiteNav() {
  const [active, setActive] = useState<string>("home");
  const header = useRef<HTMLElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const marker = useRef<HTMLSpanElement>(null);
  const menu = useRef<HTMLDialogElement>(null);

  // The section crossing the middle of the viewport is the active one.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    for (const { id } of sections) {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, []);

  // The active frame travels between links instead of blinking from one to the next.
  useEffect(() => {
    const place = () => {
      const link = list.current?.querySelector<HTMLElement>(`[data-id="${active}"]`);
      const box = marker.current;
      if (!link || !box) return;
      box.style.width = `${link.offsetWidth}px`;
      box.style.translate = `${link.offsetLeft}px 0`;
      box.style.opacity = "1";
    };
    place();
    document.fonts?.ready.then(place);
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [active]);

  useEffect(() => {
    const onScroll = () => {
      if (header.current) {
        header.current.dataset.scrolled = window.scrollY > 24 ? "true" : "false";
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      ref={header}
      data-scrolled="false"
      className="fixed inset-x-0 top-0 z-40 border-b border-transparent transition-[background-color,border-color] duration-300 data-[scrolled=true]:border-line data-[scrolled=true]:bg-ink"
    >
      <nav aria-label="Primary" className="shell flex h-[var(--nav-h)] items-center justify-between">
        <a
          href="#home"
          aria-label={`${person.name}, back to top`}
          className="-ml-2 flex min-h-11 items-center px-2 text-[0.9375rem] font-bold uppercase tracking-[0.04em] [font-stretch:125%]"
        >
          JSP
        </a>

        <div className="relative hidden lg:block">
          <span
            ref={marker}
            aria-hidden="true"
            data-locked="true"
            className="frame absolute left-0 top-1/2 -mt-[1.125rem] h-9 opacity-0 transition-[translate,opacity] duration-500 ease-[var(--ease-out-expo)]"
          />
          <ul ref={list} className="relative flex">
            {sections.map(({ id, label }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  data-id={id}
                  aria-current={active === id ? "true" : undefined}
                  className="flex min-h-11 items-center px-3.5 text-[0.875rem] tracking-[0.01em] text-muted transition-colors duration-200 hover:text-text aria-[current]:text-text"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <button
          type="button"
          className="btn btn-frame frame frame-lock -mr-1 min-h-11 px-4 lg:hidden"
          aria-haspopup="dialog"
          onClick={() => menu.current?.showModal()}
        >
          Menu
        </button>
      </nav>

      <dialog ref={menu} className="menu" aria-label="Site menu">
        <div className="shell flex h-full flex-col">
          <div className="flex h-[var(--nav-h)] shrink-0 items-center justify-between">
            <span className="text-[0.9375rem] font-bold uppercase tracking-[0.04em] [font-stretch:125%]">
              JSP
            </span>
            <button
              type="button"
              className="btn btn-frame frame frame-lock -mr-1 min-h-11 px-4"
              onClick={() => menu.current?.close()}
            >
              Close
            </button>
          </div>
          <ul className="flex flex-1 flex-col justify-center gap-1 pb-10">
            {sections.map(({ id, label }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  aria-current={active === id ? "true" : undefined}
                  onClick={() => menu.current?.close()}
                  className="flex min-h-14 items-center text-[length:clamp(1.75rem,8vw,2.5rem)] font-semibold leading-none tracking-[-0.01em] text-muted [font-stretch:116%] aria-[current]:text-lock"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <p className="data pb-8 text-faint">{person.email}</p>
        </div>
      </dialog>
    </header>
  );
}
