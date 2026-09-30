import { profile } from "../data/profile";
import ContactForm from "./ContactForm";

const Contact = () => {
  const linkClasses = "underline underline-offset-4 hover:text-white";

  return (
    <footer id="kontakt" className="bg-ink px-5 md:px-10 pt-24 pb-10 text-fog">
      <div className="grid gap-14 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div>
          <h2 className="text-[clamp(2.5rem,8vw,7rem)] font-extrabold leading-[0.9] tracking-[-0.04em] [font-stretch:75%]">
            Ta kontakt
          </h2>
          <p className="mt-6 max-w-[36ch] text-lg leading-relaxed text-fog/80">
            Send meg en melding her, eller last ned CV-en min.
          </p>

          <a
            href={profile.cv}
            download
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-cobalt px-6 py-3 font-semibold text-white hover:bg-cobalt/85"
          >
            Last ned CV (PDF)
            <span aria-hidden="true">↓</span>
          </a>

          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-lg">
            {profile.email && (
              <a href={`mailto:${profile.email}`} className={linkClasses}>{profile.email}</a>
            )}
            <a href={profile.linkedin} target="_blank" rel="noreferrer" className={linkClasses}>LinkedIn</a>
            <a href={profile.github} target="_blank" rel="noreferrer" className={linkClasses}>GitHub</a>
          </div>
        </div>

        <ContactForm />
      </div>

      <p className="mt-20 text-sm text-fog/60">© {new Date().getFullYear()} {profile.name}</p>
    </footer>
  );
};

export default Contact;
