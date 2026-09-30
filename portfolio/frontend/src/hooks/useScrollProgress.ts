import { useEffect, type RefObject } from "react";

// Gir et tall fra 0 til 1: 0 når seksjonen treffer toppen av skjermen,
// 1 når brukeren har scrollet gjennom hele seksjonen.
export function useScrollProgress(
  sectionRef: RefObject<HTMLElement | null>,
  onProgress: (progress: number) => void,
  enabled: boolean = true
) {
  useEffect(() => {
    if (!enabled) return;
    let ticking = false;

    const update = () => {
      ticking = false;
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const distance = rect.height - window.innerHeight;
      const progress = distance <= 0 ? 0 : Math.min(1, Math.max(0, -rect.top / distance));
      onProgress(progress);
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
  }, [sectionRef, onProgress, enabled]);
}
