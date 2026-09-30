import axios from "axios";
import type { IProject } from "../interfaces/IProject";

const endpoint = "http://localhost:5000/api/projects";

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
