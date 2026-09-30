import { useEffect, useRef, useState, type FC } from "react";
import type { ITimelineItem } from "../interfaces/ITimelineItem";
import { useReducedMotion } from "../hooks/useReducedMotion";

const TimelineItem: FC<ITimelineItem> = ({ period, title, place, description, skills, current }) => {
  const itemRef = useRef<HTMLLIElement>(null);
  const reducedMotion = useReducedMotion();
  const [visible, setVisible] = useState<boolean>(reducedMotion);

  // Tar inn punktet når det kommer inn i skjermbildet
  useEffect(() => {
    if (reducedMotion) {
      setVisible(true);
      return;
    }
    const item = itemRef.current;
    if (!item) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -15% 0px" }
    );
    observer.observe(item);
    return () => observer.disconnect();
  }, [reducedMotion]);

  return (
    <li
      ref={itemRef}
      className={`relative pl-10 md:pl-14 pb-16 last:pb-0 transition-all duration-700 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      {/* Punktet på linja */}
      <span
        className={`absolute left-0 top-1.5 -translate-x-1/2 rounded-full border-2 border-fog ${
          current ? "h-5 w-5 bg-cobalt ring-4 ring-cobalt/20" : "h-4 w-4 bg-ink"
        }`}
        aria-hidden="true"
      />

      <p className="text-sm font-semibold tabular-nums tracking-wide text-slate-ink">
        {period}
        {current && <span className="ml-3 rounded-full bg-cobalt px-2.5 py-0.5 text-xs text-white">Nå</span>}
      </p>
      <h3 className="mt-2 text-2xl md:text-3xl font-bold tracking-tight">{title}</h3>
      <p className="text-slate-ink">{place}</p>
      <p className="mt-3 max-w-[48ch] leading-relaxed">{description}</p>

      <ul className="mt-4 flex flex-wrap gap-2" aria-label={`Kompetanse fra ${title}`}>
        {skills.map((skill) => (
          <li
            key={skill}
            className={`rounded-full px-3 py-1 text-sm ${
              current ? "bg-ink text-fog" : "border border-ink/20"
            }`}
          >
            {skill}
          </li>
        ))}
      </ul>
    </li>
  );
};

export default TimelineItem;
