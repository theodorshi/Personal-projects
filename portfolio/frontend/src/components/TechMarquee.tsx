import { technologies } from "../data/technologies";
import TechItem from "./TechItem";
import { useReducedMotion } from "../hooks/useReducedMotion";

const TechMarquee = () => {
  const reducedMotion = useReducedMotion();
  // Lista gjentas, så den alltid er bredere enn skjermen
  const items = reducedMotion ? technologies : [...technologies, ...technologies];

  return (
    <section className="border-y border-ink/10 py-14 md:py-20" aria-labelledby="teknologier-tittel">
      <h2 id="teknologier-tittel" className="px-5 md:px-10 text-sm font-semibold uppercase tracking-[0.15em] text-slate-ink">
        Teknologier jeg jobber med
      </h2>

      {/* Kantene tones ut, så logoene glir inn og ut i stedet for å kuttes */}
      <div
        className="mt-8 overflow-hidden"
        style={{
          maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          WebkitMaskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        }}
      >
        {/* To like lister etter hverandre. Animasjonen flytter alt 50 % mot venstre
            og starter på nytt – da står den andre lista akkurat der den første startet. */}
        <div className="flex w-max animate-marquee hover:[animation-play-state:paused] motion-reduce:w-full motion-reduce:animate-none">
          <ul className="flex motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-6">
            {items.map((technology, index) => (
              <TechItem key={`${technology.name}-${index}`} {...technology} />
            ))}
          </ul>
          {!reducedMotion && (
            <ul className="flex" aria-hidden="true">
              {items.map((technology, index) => (
                <TechItem key={`kopi-${technology.name}-${index}`} {...technology} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
};

export default TechMarquee;
