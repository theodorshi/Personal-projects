import axios from "axios";
import type { IContactMessage } from "../interfaces/IContactMessage";

const contactEndpoint = `${import.meta.env.VITE_API_URL}/api/contact`;

const postMessage = async (newMessage: IContactMessage): Promise<boolean> => {
  try {
    const result = await axios.post(contactEndpoint, newMessage);
    return result.status === 201;
  } catch (error) {
    console.error("Klarte ikke å sende meldingen:", error);
    return false;
  }
};

export default { postMessage };
