import axios from "axios";
import type { IProject } from "../interfaces/IProject";

// Adressen til backend settes i .env-filer (lokalt) og i Vercel (på nett)
const endpoint = `${import.meta.env.VITE_API_URL}/api/projects`;

const getAll = async (): Promise<IProject[] | null> => {
  try {
    const response = await axios.get<IProject[]>(endpoint);
    return response.data;
  } catch (error) {
    console.error("Klarte ikke å hente prosjekter:", error);
    return null;
  }
};

export default { getAll };
