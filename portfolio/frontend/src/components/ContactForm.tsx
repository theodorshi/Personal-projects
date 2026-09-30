import { useState, type ChangeEvent, type FormEvent } from "react";
import type { IContactMessage } from "../interfaces/IContactMessage";
import ContactService from "../services/ContactService";

type Status = "idle" | "sending" | "sent" | "error";

const emptyMessage: IContactMessage = { name: "", email: "", message: "" };

const ContactForm = () => {
  const [newMessage, setNewMessage] = useState<IContactMessage>(emptyMessage);
  const [status, setStatus] = useState<Status>("idle");

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setNewMessage({ ...newMessage, [name]: value });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("sending");

    const success = await ContactService.postMessage(newMessage);

    if (success) {
      setStatus("sent");
      setNewMessage(emptyMessage);
    } else {
      setStatus("error");
    }
  };

  const fieldClasses =
    "mt-2 w-full rounded-md border border-fog/25 bg-white/5 px-4 py-3 text-fog placeholder:text-fog/40 focus:border-fog focus:outline-none";

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm text-fog/70">Navn</span>
          <input
            type="text"
            name="name"
            value={newMessage.name}
            onChange={handleChange}
            required
            maxLength={100}
            autoComplete="name"
            className={fieldClasses}
          />
        </label>
        <label className="block">
          <span className="text-sm text-fog/70">E-post</span>
          <input
            type="email"
            name="email"
            value={newMessage.email}
            onChange={handleChange}
            required
            maxLength={200}
            autoComplete="email"
            className={fieldClasses}
          />
        </label>
      </div>

      <label className="block">
        <span className="text-sm text-fog/70">Melding</span>
        <textarea
          name="message"
          value={newMessage.message}
          onChange={handleChange}
          required
          maxLength={2000}
          rows={5}
          className={`${fieldClasses} resize-y`}
        />
      </label>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={status === "sending"}
          className="rounded-full bg-fog px-6 py-3 font-semibold text-ink hover:bg-white disabled:opacity-60"
        >
          {status === "sending" ? "Sender …" : "Send melding"}
        </button>

        <p aria-live="polite" className="text-fog/80">
          {status === "sent" && "Takk! Meldingen er sendt, og jeg svarer så snart jeg kan."}
          {status === "error" && "Noe gikk galt. Prøv igjen, eller send meg en e-post direkte."}
        </p>
      </div>
    </form>
  );
};

export default ContactForm;
