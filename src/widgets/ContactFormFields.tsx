"use client";

import { useState } from "react";

interface ContactFormFieldsProps {
  email: string;
}

export function ContactFormFields({ email }: ContactFormFieldsProps) {
  const [sent, setSent] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "");
    const fromEmail = String(data.get("email") ?? "");
    const website = String(data.get("website") ?? "");
    const phone = String(data.get("phone") ?? "");
    const message = String(data.get("message") ?? "");

    const body = [
      `Name: ${name}`,
      `Email: ${fromEmail}`,
      website ? `Website: ${website}` : "",
      phone ? `Phone: ${phone}` : "",
      "",
      message,
    ]
      .filter(Boolean)
      .join("\n");

    window.location.href = `mailto:${email}?subject=${encodeURIComponent(`Contact from ${name}`)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  const inputClass =
    "dl-gem-form-underline w-full py-3 text-sm text-foreground placeholder:text-muted-foreground";

  return (
    <form onSubmit={handleSubmit} className="space-y-6" suppressHydrationWarning>
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Name
          </span>
          <input
            name="name"
            type="text"
            required
            autoComplete="name"
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Email
          </span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Website
          </span>
          <input
            name="website"
            type="url"
            autoComplete="url"
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Phone
          </span>
          <input
            name="phone"
            type="tel"
            autoComplete="tel"
            className={inputClass}
          />
        </label>
      </div>
      <label className="block">
        <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Message
        </span>
        <textarea
          name="message"
          required
          rows={3}
          className={`${inputClass} resize-none`}
        />
      </label>
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          className="dl-gem-form-submit px-8 py-3 text-sm font-semibold uppercase tracking-wide"
        >
          {sent ? "Opening email…" : "Send Message"}
        </button>
      </div>
    </form>
  );
}
