"use client";

import { useEffect, useRef } from "react";

/**
 * Effets globaux : apparition au scroll, compteurs, progression de la frise,
 * halo qui suit le curseur et boutons magnétiques.
 * Tout reste lisible sans JavaScript (la classe `fx` n'est ajoutée qu'ici)
 * et respecte prefers-reduced-motion.
 */
export default function Effects() {
  const halo = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const cleanups: Array<() => void> = [];

    /* Compteurs */
    const counters = Array.from(document.querySelectorAll<HTMLElement>("[data-count]"));
    const runCounter = (el: HTMLElement) => {
      const target = Number(el.dataset.count);
      if (reduce) return;
      const t0 = performance.now();
      const dur = 1400;
      const step = (now: number) => {
        const p = Math.min(1, (now - t0) / dur);
        el.textContent = String(Math.round(target * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    /* Apparition au scroll */
    if (!reduce && "IntersectionObserver" in window) {
      root.classList.add("fx");
      counters.forEach((c) => {
        c.textContent = "0";
      });
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (!e.isIntersecting) return;
            const el = e.target as HTMLElement;
            el.classList.add("in");
            el.querySelectorAll<HTMLElement>("[data-count]").forEach(runCounter);
            if (el.dataset.count) runCounter(el);
            io.unobserve(el);
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
      );
      document.querySelectorAll("[data-rv]").forEach((el) => io.observe(el));
      cleanups.push(() => {
        io.disconnect();
        root.classList.remove("fx");
      });
    }

    /* Progression de la frise du programme */
    const trackers = Array.from(document.querySelectorAll<HTMLElement>("[data-progress]"));
    let ticking = false;
    const update = () => {
      ticking = false;
      const H = window.innerHeight;
      trackers.forEach((el) => {
        const r = el.getBoundingClientRect();
        const p = Math.max(0, Math.min(1, (H * 0.62 - r.top) / r.height));
        el.style.setProperty("--p", p.toFixed(4));
        el.querySelectorAll<HTMLElement>(".tl__day").forEach((d) => {
          d.classList.toggle("lit", d.getBoundingClientRect().top < H * 0.62);
        });
      });
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    cleanups.push(() => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    });

    /* Halo curseur + boutons magnétiques (souris uniquement) */
    if (!reduce && fine) {
      const h = halo.current;
      let raf = 0;
      let tx = 0, ty = 0, x = 0, y = 0;
      const loop = () => {
        x += (tx - x) * 0.14;
        y += (ty - y) * 0.14;
        if (h) h.style.transform = `translate3d(${x - 180}px,${y - 180}px,0)`;
        raf = requestAnimationFrame(loop);
      };
      const move = (e: PointerEvent) => {
        tx = e.clientX;
        ty = e.clientY;
        if (h) h.classList.add("on");
        const btn = (e.target as HTMLElement | null)?.closest<HTMLElement>(".btn");
        document.querySelectorAll<HTMLElement>(".btn.mag").forEach((b) => {
          if (b !== btn) b.style.transform = "";
        });
        if (btn) {
          const r = btn.getBoundingClientRect();
          const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
          const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
          btn.classList.add("mag");
          btn.style.transform = `translate(${(dx * 10).toFixed(1)}px,${(dy * 8).toFixed(1)}px)`;
        }
        if (h) h.classList.toggle("hot", !!(e.target as HTMLElement | null)?.closest("a,button,.hud,.member"));
      };
      const leave = () => halo.current?.classList.remove("on");
      raf = requestAnimationFrame(loop);
      window.addEventListener("pointermove", move, { passive: true });
      document.documentElement.addEventListener("pointerleave", leave);
      cleanups.push(() => {
        cancelAnimationFrame(raf);
        window.removeEventListener("pointermove", move);
        document.documentElement.removeEventListener("pointerleave", leave);
      });
    }

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return <div className="halo" ref={halo} aria-hidden="true" />;
}
