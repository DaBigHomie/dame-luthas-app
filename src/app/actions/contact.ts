"use server";

import {
  isMigratedAvailable,
  loadMigrated,
} from "@/shared/lib/migrated/content";

export interface ContactFormState {
  ok: boolean;
  message: string;
}

const EMPTY: ContactFormState = { ok: false, message: "" };

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function resolveContactTo(): string {
  if (process.env.CONTACT_TO) return process.env.CONTACT_TO;
  if (isMigratedAvailable()) {
    return loadMigrated().site.contact.email;
  }
  return "dameluthas@gmail.com";
}

export async function submitContactForm(
  _prev: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const website = String(formData.get("website") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const honeypot = String(formData.get("company") ?? "").trim();

  if (honeypot) {
    return { ok: true, message: "Thanks — your message was sent." };
  }

  if (!name || !email || !message) {
    return { ok: false, message: "Name, email, and message are required." };
  }

  if (!isValidEmail(email)) {
    return { ok: false, message: "Enter a valid email address." };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = resolveContactTo();
  const from =
    process.env.RESEND_FROM ?? "Dame Luthas Consulting <onboarding@resend.dev>";

  const text = [
    `Name: ${name}`,
    `Email: ${email}`,
    phone ? `Phone: ${phone}` : "",
    website ? `Website: ${website}` : "",
    "",
    message,
  ]
    .filter(Boolean)
    .join("\n");

  if (!apiKey) {
    return {
      ok: false,
      message:
        "Email delivery is not configured yet. Use the phone or email on this page to reach us directly.",
    };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: email,
      subject: `Contact from ${name}`,
      text,
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    console.error("Resend error:", response.status, detail);
    return {
      ok: false,
      message: "Could not send your message. Please try again or email us directly.",
    };
  }

  return { ok: true, message: "Thanks — your message was sent." };
}

export { EMPTY as initialContactFormState };
