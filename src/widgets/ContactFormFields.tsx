"use client";

import { useActionState } from "react";

import {
  initialContactFormState,
  submitContactForm,
} from "@/app/actions/contact";

interface ContactFormFieldsProps {
  email: string;
}

export function ContactFormFields({ email }: ContactFormFieldsProps) {
  const [state, formAction, pending] = useActionState(
    submitContactForm,
    initialContactFormState,
  );

  const inputClass =
    "dl-gem-form-underline w-full py-3 text-sm text-black placeholder:text-black/45";

  return (
    <form action={formAction} className="space-y-6" suppressHydrationWarning>
      <div className="sr-only" aria-hidden>
        <label>
          Company
          <input name="company" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-black/70">
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
          <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-black/70">
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
          <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-black/70">
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
          <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-black/70">
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
        <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-black/70">
          Message
        </span>
        <textarea
          name="message"
          required
          rows={3}
          className={`${inputClass} resize-none`}
        />
      </label>

      {state.message ? (
        <p
          role="status"
          className={`text-sm ${state.ok ? "text-black/80" : "text-red-800"}`}
        >
          {state.message}
        </p>
      ) : null}

      <div className="flex flex-col items-end gap-2 pt-2 sm:flex-row sm:justify-between">
        <p className="text-xs text-black/55">
          Or email{" "}
          <a href={`mailto:${email}`} className="underline">
            {email}
          </a>
        </p>
        <button
          type="submit"
          disabled={pending}
          className="dl-gem-form-submit px-8 py-3 text-sm font-semibold uppercase tracking-wide disabled:opacity-60"
        >
          {pending ? "Sending…" : state.ok ? "Sent" : "Send Message"}
        </button>
      </div>
    </form>
  );
}
