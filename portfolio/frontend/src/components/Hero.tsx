import { useCallback, useEffect, useRef } from "react";
import { profile } from "../data/profile";
import { useScrollProgress } from "../hooks/useScrollProgress";
import { useReducedMotion } from "../hooks/useReducedMotion";

const clamp = (value: number): number => Math.min(1, Math.max(0, value));
const easeInOut = (t: number): number => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const onProgress = useCallback(
    (progress: number) => {
      const sticky = stickyRef.current;
      const section = sectionRef.current;
      if (!sticky || !section) return;

      // Med redusert bevegelse hopper vi rett mellom de to tilstandene
      const p = reducedMotion ? (progress < 0.5 ? 0 : 1) : progress;

      const grow = easeInOut(clamp(p / 0.7));      // rammen åpner seg helt ved 70 %
      const swap = clamp((p - 0.25) / 0.35);       // portrett -> landskap mellom 25 % og 60 %
      const nameOut = clamp(p / 0.35);             // navnet forsvinner tidlig
      const aboutIn = clamp((p - 0.7) / 0.25);     // "Om meg" kommer til slutt

      sticky.style.setProperty("--grow", grow.toFixed(4));
      sticky.style.setProperty("--swap", swap.toFixed(4));
      sticky.style.setProperty("--name-out", nameOut.toFixed(4));
      sticky.style.setProperty("--about-in", aboutIn.toFixed(4));

      // Forteller Header om den ligger over bildet (hvit tekst) eller ikke
      const overPhoto = grow > 0.9 && section.getBoundingClientRect().bottom > 80;
      document.documentElement.dataset.overPhoto = String(overPhoto);
    },
    [reducedMotion]
  );

  useScrollProgress(sectionRef, onProgress);

  // 3D-effekt: portrettet og navnet følger musa litt, i hver sin retning
  useEffect(() => {
    const sticky = stickyRef.current;
    if (!sticky || reducedMotion) return;
    // Bare på enheter med mus (ikke mobil og nettbrett)
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let frame = 0;

    // Glir mykt mot musa i stedet for å hoppe
    const animate = () => {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      sticky.style.setProperty("--mx", currentX.toFixed(4));
      sticky.style.setProperty("--my", currentY.toFixed(4));

      const stillMoving = Math.abs(targetX - currentX) > 0.001 || Math.abs(targetY - currentY) > 0.001;
      frame = stillMoving ? requestAnimationFrame(animate) : 0;
    };

    const start = () => {
      if (!frame) frame = requestAnimationFrame(animate);
    };

    // Musas posisjon blir et tall fra -1 til 1 i hver retning
    const onPointerMove = (event: PointerEvent) => {
      const rect = sticky.getBoundingClientRect();
      targetX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      targetY = ((event.clientY - rect.top) / rect.height) * 2 - 1;
      start();
    };

    const onPointerLeave = () => {
      targetX = 0;
      targetY = 0;
      start();
    };

    sticky.addEventListener("pointermove", onPointerMove);
    sticky.addEventListener("pointerleave", onPointerLeave);

    return () => {
      sticky.removeEventListener("pointermove", onPointerMove);
      sticky.removeEventListener("pointerleave", onPointerLeave);
      cancelAnimationFrame(frame);
    };
  }, [reducedMotion]);

  const shrink = "(1 - var(--grow))";

  return (
    <section id="top" ref={sectionRef} className="relative h-[220vh]">
      <div
        ref={stickyRef}
        className="sticky top-0 h-dvh overflow-hidden
          [--t:14%] [--r:5%] [--b:8%] [--l:60%]
          max-md:[--t:34%] max-md:[--r:14%] max-md:[--b:5%] max-md:[--l:14%]"
        style={{ ["--grow" as string]: 0, ["--swap" as string]: 0, ["--name-out" as string]: 0, ["--about-in" as string]: 0, ["--mx" as string]: 0, ["--my" as string]: 0 }}
      >
        {/* Bilderamma: starter som et stående portrett til høyre, vokser til hele skjermen */}
        <figure
          className="absolute inset-0 m-0"
          style={{
            clipPath: `inset(calc(${shrink} * var(--t)) calc(${shrink} * var(--r)) calc(${shrink} * var(--b)) calc(${shrink} * var(--l)) round calc(${shrink} * 18px))`,
          }}
        >
          <img
            src={profile.backgroundPhoto}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            style={{ opacity: "var(--swap)", transform: "scale(calc(1.15 - var(--grow) * 0.15))" }}
          />
          <img
            src={profile.photo}
            alt={`Portrett av ${profile.name}`}
            className="absolute object-cover object-top"
            style={{
              // Portrettet holder seg i rammens synlige område i stedet for å zoome inn på hele skjermen
              top: `calc(${shrink} * var(--t))`,
              left: `calc(${shrink} * var(--l))`,
              width: `calc(100% - ${shrink} * (var(--l) + var(--r)))`,
              height: `calc(100% - ${shrink} * (var(--t) + var(--b)))`,
              opacity: "calc(1 - var(--swap))",
              // Litt forstørret, så kantene ikke vises når bildet flytter seg
              scale: "1.08",
              translate: `calc(var(--mx) * -18px * ${shrink}) calc(var(--my) * -14px * ${shrink})`,
            }}
          />
          <div
            className="absolute inset-0 bg-linear-to-t from-ink/90 via-ink/15 to-transparent"
            style={{ opacity: "var(--about-in)" }}
          />
        </figure>

        {/* Navn til venstre */}
        <div
          className="absolute left-5 right-5 top-[12vh] md:left-10 md:right-auto md:top-1/2 md:max-w-[52%] md:-translate-y-1/2"
          style={{ opacity: "calc(1 - var(--name-out))", translate: `calc(var(--name-out) * -6vw + var(--mx) * 12px * ${shrink}) calc(var(--my) * 8px * ${shrink})` }}
        >
          <h1 className="text-[clamp(3rem,9vw,9rem)] font-extrabold leading-[0.85] tracking-[-0.04em] [font-stretch:75%]">
            {profile.name}
          </h1>
          <p className="mt-4 text-lg md:text-xl text-slate-ink">{profile.role}</p>
        </div>

        {/* Om meg over det heldekkende bildet */}
        <div
          className="absolute bottom-[8vh] left-5 right-5 md:left-10 max-w-3xl text-white"
          style={{ opacity: "var(--about-in)", translate: "0 calc((1 - var(--about-in)) * 24px)" }}
        >
          <h2 className="text-[clamp(2.75rem,7vw,6.5rem)] font-extrabold leading-[0.9] tracking-[-0.04em] [font-stretch:75%]">
            Om meg
          </h2>
          <p className="mt-4 text-lg md:text-2xl leading-snug">{profile.about}</p>
          <div className="mt-5 flex gap-3">
            <a href={profile.linkedin} target="_blank" rel="noreferrer" className="rounded-full bg-white px-5 py-2 md:px-6 md:py-3 md:text-lg font-semibold text-ink hover:bg-fog">
              LinkedIn
            </a>
            <a href={profile.github} target="_blank" rel="noreferrer" className="rounded-full border border-white px-5 py-2 md:px-6 md:py-3 md:text-lg font-semibold hover:bg-white/10">
              GitHub
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
