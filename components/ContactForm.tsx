"use client";

import { useActionState } from "react";
import { createSubmission, type FormState } from "@/app/actions";
import type { Dict, Locale } from "@/lib/i18n";
import { PhoneField } from "@/components/PhoneField";
import { btnPrimary, fieldInput, fieldTextarea, fieldLabel, formCard, formGrid, formMsgErr, formMsgOk, honeypot } from "@/lib/ui";

const initial: FormState = { status: "idle", message: "" };

export function ContactForm({ locale, labels }: { locale: Locale; labels: Dict["contact"] }) {
  const ui = { contact: labels };
  const [state, action, pending] = useActionState(createSubmission, initial);

  if (state.status === "success") {
    return (
      <div className={formCard}>
        <p className={formMsgOk} role="status">
          {state.message}
        </p>
      </div>
    );
  }

  return (
    <div className={formCard}>
      <h2 className="sr-only">{ui.contact.title}</h2>
      <form action={action} className={formGrid}>
        <input type="hidden" name="locale" value={locale} />
        <div className={honeypot} aria-hidden>
          <label>
            Website <input type="text" name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
        <div>
          <label className={fieldLabel} htmlFor="c-fullname">{ui.contact.fullname} *</label>
          <input className={fieldInput} id="c-fullname" name="fullname" required autoComplete="name" maxLength={200} />
        </div>
        <PhoneField id="c-phone" label={ui.contact.phone} codeLabel={ui.contact.phoneCode} />
        <div>
          <label className={fieldLabel} htmlFor="c-email">{ui.contact.email} *</label>
          <input className={fieldInput} id="c-email" name="email" type="email" required autoComplete="email" maxLength={200} />
        </div>
        <div>
          <label className={fieldLabel} htmlFor="c-title">{ui.contact.subject} *</label>
          <input className={fieldInput} id="c-title" name="title" required maxLength={200} />
        </div>
        <div>
          <label className={fieldLabel} htmlFor="c-description">{ui.contact.message}</label>
          <textarea className={fieldTextarea} id="c-description" name="description" maxLength={5000} />
        </div>

        {state.status === "error" && (
          <p className={formMsgErr} role="alert">
            {state.message}
          </p>
        )}

        <button type="submit" className={`${btnPrimary} mt-1 w-full`} disabled={pending}>
          {pending ? ui.contact.sending : ui.contact.submit}
        </button>
      </form>
    </div>
  );
}
