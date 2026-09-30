import { useCallback, useEffect, useRef, useState } from "react";
import type { IProject } from "../interfaces/IProject";
import ProjectService from "../services/ProjectService";
import ProjectItem from "./ProjectItem";
import { useScrollProgress } from "../hooks/useScrollProgress";
import { useReducedMotion } from "../hooks/useReducedMotion";

const ProjectList = () => {
  const [projects, setProjects] = useState<IProject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [sectionHeight, setSectionHeight] = useState<number>();

  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  // Hent prosjektene én gang når komponenten lastes
  useEffect(() => {
    const fetchProjects = async () => {
      const result = await ProjectService.getAll();
      if (result === null) {
        setError("Prosjektene kunne ikke lastes akkurat nå. Se dem direkte på GitHub.");
      } else {
        setProjects(result);
      }
      setLoading(false);
    };
    fetchProjects();
  }, []);

  // Seksjonen må være like "høy" som rekka er bred, pluss én skjermhøyde
  useEffect(() => {
    if (reducedMotion) return;
    const measure = () => {
      const track = trackRef.current;
      if (!track) return;
      const distance = Math.max(0, track.scrollWidth - window.innerWidth);
      setSectionHeight(distance + window.innerHeight);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [projects, reducedMotion]);

  // Vertikal scroll -> horisontal flytting
  const onProgress = useCallback((progress: number) => {
    const track = trackRef.current;
    if (!track) return;
    const distance = Math.max(0, track.scrollWidth - window.innerWidth);
    track.style.transform = `translate3d(${-progress * distance}px, 0, 0)`;
    if (barRef.current) barRef.current.style.scale = `${progress} 1`;
  }, []);

  useScrollProgress(sectionRef, onProgress, !reducedMotion);

  return (
    <section
      id="prosjekter"
      ref={sectionRef}
      className="relative"
      style={{ height: reducedMotion ? "auto" : sectionHeight }}
      aria-label="Prosjekter"
    >
      <div className={reducedMotion ? "py-20" : "sticky top-0 flex h-dvh flex-col justify-center overflow-hidden"}>
        <div className="flex items-baseline justify-between gap-4 px-5 md:px-10">
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-[-0.03em] [font-stretch:80%]">Prosjekter</h2>
          <p className="text-slate-ink">Hentet fra GitHub</p>
        </div>

        {loading && <p className="px-5 md:px-10 py-10 text-slate-ink">Henter prosjekter …</p>}

        {error && (
          <p className="px-5 md:px-10 py-10">
            {error}{" "}
            <a href="https://github.com/theodorshi/Kristiania" className="underline">Åpne repoet</a>
          </p>
        )}

        <div
          ref={trackRef}
          className={`flex gap-6 md:gap-8 px-5 md:px-10 py-8 ${reducedMotion ? "overflow-x-auto" : "w-max will-change-transform"}`}
        >
          {projects.map((project) => (
            <ProjectItem key={project.name} {...project} />
          ))}
        </div>

        {!reducedMotion && projects.length > 0 && (
          <div className="mx-5 md:mx-10 h-[3px] rounded bg-ink/15" aria-hidden="true">
            <div ref={barRef} className="h-full origin-left scale-x-0 rounded bg-cobalt" />
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectList;
