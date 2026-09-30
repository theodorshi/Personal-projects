export interface IProfile {
  name: string;
  role: string;
  about: string;
  photo: string;          // stående portrett (vises til høyre først)
  backgroundPhoto: string; // liggende bilde (fyller skjermen til slutt)
  cv: string;             // PDF i public/cv/
  linkedin: string;
  github: string;
  email?: string;
}
