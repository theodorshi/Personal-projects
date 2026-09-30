import { profile } from "../data/profile";

const Header = () => {
  const linkClasses = "text-sm md:text-base hover:underline underline-offset-4";

  return (
    <header className="site-header fixed inset-x-0 top-0 z-20 flex items-center justify-between gap-4 px-5 py-3 md:px-10 text-ink transition-colors duration-300 bg-fog/85 backdrop-blur-md">
      <a href="#top" className="whitespace-nowrap font-bold tracking-tight">{profile.name}</a>
      <nav className="flex items-center gap-4 md:gap-5" aria-label="Hovedmeny">
        <a href="#prosjekter" className={linkClasses}>Prosjekter</a>
        <a href="#kompetanse" className={`${linkClasses} hidden sm:inline`}>Kompetanse</a>
        <a href="#kontakt" className={`${linkClasses} hidden sm:inline`}>Kontakt</a>
        <a href={profile.linkedin} target="_blank" rel="noreferrer" className={`${linkClasses} hidden md:inline`}>LinkedIn</a>
        <a href={profile.github} target="_blank" rel="noreferrer" className={`${linkClasses} hidden md:inline`}>GitHub</a>
        <a
          href={profile.cv}
          download
          className="cv-button whitespace-nowrap rounded-full bg-ink px-4 py-1.5 text-sm font-semibold text-fog transition-colors hover:bg-cobalt"
        >
          Last ned CV
        </a>
      </nav>
    </header>
  );
};

export default Header;
