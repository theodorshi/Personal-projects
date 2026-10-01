import type { FC } from "react";
import type { ITechnology } from "../interfaces/ITechnology";

const TechItem: FC<ITechnology> = ({ name, path, color }) => {
  return (
    <li
      className="group flex shrink-0 items-center gap-3 px-8 md:px-12 text-ink/60 transition-colors duration-300 hover:text-ink"
      style={{ ["--brand" as string]: color }}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-8 w-8 md:h-10 md:w-10 fill-current transition-colors duration-300 group-hover:fill-[var(--brand)]"
        aria-hidden="true"
      >
        <path d={path} />
      </svg>
      <span className="whitespace-nowrap text-lg md:text-2xl font-semibold">{name}</span>
    </li>
  );
};

export default TechItem;
