import type { FC } from "react";
import type { IProject } from "../interfaces/IProject";

const languageColors: Record<string, string> = {
  Java: "#b45a1c",
  Kotlin: "#7f52ff",
  C: "#3c5a78",
  "C#": "#5c2d91",
  Python: "#2f6f9f",
  HTML: "#d9482b",
  CSS: "#2a4bdb",
  JavaScript: "#b89412",
  TypeScript: "#2f74c0",
};

const ProjectItem: FC<IProject> = ({ name, url, description, languages, fileCount }) => {
  const mainLanguage = languages[0] ?? "Kode";
  const color = languageColors[mainLanguage] ?? "#1a1f2b";

  return (
    <article className="w-[min(78vw,26rem)] shrink-0">
      <a href={url} target="_blank" rel="noreferrer" className="group block">
        <div
          className="flex aspect-[4/5] items-end overflow-hidden rounded-md p-5 text-white"
          style={{ backgroundColor: color }}
        >
          <span className="text-[clamp(3.5rem,9vw,7rem)] font-extrabold leading-none tracking-[-0.05em] [font-stretch:75%] transition-transform duration-300 group-hover:-translate-y-2">
            {mainLanguage}
          </span>
        </div>
        <h3 className="mt-4 text-xl md:text-2xl font-bold tracking-tight group-hover:underline underline-offset-4">
          {name}
        </h3>
      </a>
      <p className="mt-1 max-w-[34ch] leading-relaxed text-slate-ink">{description}</p>
      <ul className="mt-3 flex flex-wrap gap-2" aria-label="Språk">
        {languages.map((language) => (
          <li key={language} className="rounded-full border border-ink/20 px-3 py-0.5 text-sm">
            {language}
          </li>
        ))}
        <li className="px-1 py-0.5 text-sm text-slate-ink">{fileCount} filer</li>
      </ul>
    </article>
  );
};

export default ProjectItem;
