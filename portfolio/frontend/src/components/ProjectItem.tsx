import { useRef, type FC, type PointerEvent } from "react";
import type { IProject } from "../interfaces/IProject";
import { languageColors, fallbackColor } from "../data/languageColors";
import { useReducedMotion } from "../hooks/useReducedMotion";
import CodePreview from "./CodePreview";

const ProjectItem: FC<IProject> = ({ name, url, description, languageShares, fileCount, previewFile, codePreview }) => {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const reducedMotion = useReducedMotion();

  const mainLanguage = languageShares[0]?.name ?? "Kode";
  const mainColor = languageColors[mainLanguage] ?? fallbackColor;
  // "Algoritmer og datastrukturer (Java)" -> "Algoritmer og datastrukturer"
  const displayName = name.replace(/\s*\(.*?\)\s*$/, "");

  // Kortet vipper svakt etter musa
  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    const card = cardRef.current;
    if (!card || reducedMotion || event.pointerType !== "mouse") return;
    const rect = card.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
    card.style.setProperty("--tilt-x", x.toFixed(3));
    card.style.setProperty("--tilt-y", y.toFixed(3));
    card.style.setProperty("--lift", "1");
  };

  const handlePointerLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty("--tilt-x", "0");
    card.style.setProperty("--tilt-y", "0");
    card.style.setProperty("--lift", "0");
  };

  return (
    <article
      className="group w-[min(80vw,26rem)] shrink-0 [perspective:1000px]"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <a
        ref={cardRef}
        href={url}
        target="_blank"
        rel="noreferrer"
        aria-label={`${displayName} – se koden på GitHub`}
        className="relative block overflow-hidden rounded-xl bg-ink text-fog shadow-[0_20px_40px_-24px_rgba(26,31,43,0.6)] transition-[transform,box-shadow] duration-200 ease-out group-hover:shadow-[0_30px_60px_-24px_rgba(26,31,43,0.75)]"
        style={{
          transform:
            "rotateX(calc(var(--tilt-y, 0) * -5deg)) rotateY(calc(var(--tilt-x, 0) * 7deg)) translateY(calc(var(--lift, 0) * -6px))",
        }}
      >
        {/* Fane med filnavnet, som i en editor */}
        <div className="flex items-center justify-between border-b border-fog/10 px-4 py-2.5">
          <span
            className="border-b-2 pb-0.5 font-mono text-xs text-fog/80"
            style={{ borderColor: mainColor }}
          >
            {previewFile || displayName}
          </span>
          <span className="flex items-center gap-2 text-xs text-fog/60">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: mainColor }} />
            {mainLanguage}
          </span>
        </div>

        {/* Koden, eller språknavnet hvis vi ikke fant noen kodefil */}
        <div className="relative h-[min(15rem,30vh)] px-2 pt-3">
          {codePreview ? (
            <CodePreview code={codePreview} />
          ) : (
            <div className="flex h-full items-end p-3">
              <span className="text-5xl md:text-6xl font-extrabold leading-none tracking-[-0.04em] [font-stretch:75%] break-all" style={{ color: mainColor }}>
                {mainLanguage}
              </span>
            </div>
          )}

          {/* Toner ut nederst, og viser lenketeksten ved hover */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-ink via-ink/85 to-transparent" />
          <span className="absolute bottom-4 left-4 translate-y-2 text-sm font-semibold opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
            Se koden på GitHub →
          </span>
        </div>
      </a>

      <h3 className="mt-4 text-xl md:text-2xl font-bold tracking-tight">{displayName}</h3>
      <p className="mt-1 max-w-[36ch] leading-relaxed text-slate-ink">{description}</p>

      {/* Språkfordeling som én delt stripe, som på GitHub */}
      {languageShares.length > 0 && (
        <div className="mt-4">
          <div className="flex h-1.5 overflow-hidden rounded-full bg-ink/10" aria-hidden="true">
            {languageShares.map((share) => (
              <span
                key={share.name}
                style={{ width: `${share.percent}%`, backgroundColor: languageColors[share.name] ?? fallbackColor }}
              />
            ))}
          </div>
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-ink" aria-label="Språkfordeling">
            {languageShares.map((share) => (
              <li key={share.name} className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: languageColors[share.name] ?? fallbackColor }} />
                {share.name} <span className="tabular-nums text-slate-ink/70">{share.percent} %</span>
              </li>
            ))}
            <li className="text-slate-ink/70">{fileCount} filer</li>
          </ul>
        </div>
      )}
    </article>
  );
};

export default ProjectItem;
