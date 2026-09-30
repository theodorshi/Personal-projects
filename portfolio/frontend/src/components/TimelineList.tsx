import { useEffect, useRef } from "react";
import { timeline } from "../data/timeline";
import TimelineItem from "./TimelineItem";
import { useReducedMotion } from "../hooks/useReducedMotion";

const TimelineList = () => {
  const listRef = useRef<HTMLOListElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  // Linja fylles opp etter hvert som du scroller nedover
  useEffect(() => {
    const fill = fillRef.current;
    if (!fill) return;
    if (reducedMotion) {
      fill.style.scale = "1 1";
      return;
    }

    let ticking = false;
    const update = () => {
      ticking = false;
      const list = listRef.current;
      if (!list) return;
      const rect = list.getBoundingClientRect();
      const progress = (window.innerHeight * 0.6 - rect.top) / rect.height;
      fill.style.scale = `1 ${Math.min(1, Math.max(0, progress))}`;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reducedMotion]);

  return (
    <section id="kompetanse" className="px-5 md:px-10 py-24 md:py-32" aria-labelledby="kompetanse-tittel">
      <div className="grid gap-12 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div className="md:sticky md:top-28 md:self-start">
          <h2
            id="kompetanse-tittel"
            className="text-4xl md:text-6xl font-extrabold leading-[0.9] tracking-[-0.03em] [font-stretch:80%]"
          >
            Kompetanse
          </h2>
          <p className="mt-5 max-w-[36ch] text-lg leading-relaxed text-slate-ink">
            Fra salg og forretning til kode. Hvert steg har gitt meg noe jeg tar med inn i utviklingsarbeidet.
          </p>
        </div>

        <div className="relative">
          {/* Selve linja: grå bakgrunn og blå fyll */}
          <div className="absolute left-0 top-2 bottom-2 w-0.5 -translate-x-1/2 bg-ink/15" aria-hidden="true">
            <div ref={fillRef} className="h-full w-full origin-top scale-y-0 bg-cobalt" />
          </div>

          <ol ref={listRef} className="relative">
            {timeline.map((item) => (
              <TimelineItem key={item.id} {...item} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};

export default TimelineList;
