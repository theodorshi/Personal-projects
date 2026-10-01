import type { ITimelineItem } from "../interfaces/ITimelineItem";

// Hentet fra CV-en. Eldst først, nyest sist.
export const timeline: ITimelineItem[] = [
  {
    id: 1,
    period: "2018 – nå",
    title: "Butikkselger",
    place: "Löplabbet",
    description:
      "Veileder kunder gjennom behovsanalyser for å finne riktig løpesko, gir faglige råd om løping og bidrar til mersalg gjennom god kundeservice.",
    skills: ["Behovsanalyse", "Kundeservice", "Mersalg"],
    current: true,
  },
  {
    id: 2,
    period: "2019 – 2022",
    title: "Bachelor i Entreprenørskap",
    place: "Handelshøyskolen BI",
    description: "Bachelorgrad i entreprenørskap.",
    skills: ["Entreprenørskap", "Forretningsforståelse"],
  },
  {
    id: 3,
    period: "2024",
    title: "B2B telefonsalg",
    place: "Loyalty",
    description:
      "Salg av bredbånd- og telefoniløsninger fra Telenor til bedriftskunder over telefon, med Salesforce som CRM-system for kundeoppfølging.",
    skills: ["B2B-salg", "Salesforce", "Kundeoppfølging"],
  },
  {
    id: 4,
    period: "2024 – 2027",
    title: "Bachelor i IT: Frontend- og mobilutvikling",
    place: "Høyskolen Kristiania",
    description: "Webutvikling, mobilutvikling og programmering, med prosjekter i både frontend og backend.",
    skills: ["TypeScript", "React", "C#", "Java", "Kotlin", "Swift", "Python", "C", "MySQL", "Git"],
    current: true,
  },
];
