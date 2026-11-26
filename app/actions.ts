"use server";

import { client } from "@/lib/sanity/client";
import { DEFAULT_LOCALE, getDict, isLocale } from "@/lib/i18n";
import { formatPhone } from "@/lib/phone";

export type FormState = { status: "idle" | "success" | "error"; message: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function field(form: FormData, name: string, max = 200) {
  return String(form.get(name) ?? "").trim().slice(0, max);
}

/** Messages follow the language of the page the form was submitted from. */
function dictFor(form: FormData) {
  const locale = form.get("locale");
  return getDict(isLocale(locale) ? locale : DEFAULT_LOCALE);
}

function validateContact(ui: ReturnType<typeof getDict>, fullname: string, phone: string, email: string): FormState | null {
  if (!fullname || !phone || !email) return { status: "error", message: ui.form.required };
  if (!EMAIL_RE.test(email)) return { status: "error", message: ui.form.invalidEmail };
  return null;
}

/** Combines the country select and the number input into "+48 123456789" (empty if invalid). */
function phoneField(form: FormData) {
  return formatPhone(field(form, "phoneCountry", 2), field(form, "phone", 40)) ?? "";
}

function hasPhone(form: FormData) {
  return field(form, "phone", 40) !== "";
}

/** Creates an `order` document referencing the chosen plan. */
export async function createOrder(_prev: FormState, form: FormData): Promise<FormState> {
  const ui = dictFor(form);
  // Honeypot: real users never fill this hidden field.
  if (field(form, "website")) return { status: "success", message: ui.order.success };

  const fullname = field(form, "fullname");
  const phone = phoneField(form);
  const email = field(form, "email");
  const planId = field(form, "planId", 100);

  if (hasPhone(form) && !phone) return { status: "error", message: ui.form.invalidPhone };
  const invalid = validateContact(ui, fullname, phone, email);
  if (invalid) return invalid;

  try {
    const plan = planId
      ? await client.fetch<{ _id: string } | null>(`*[_type == "plan" && _id == $id][0]{ _id }`, { id: planId })
      : null;
    await client.create({
      _type: "order",
      fullname,
      phone,
      email,
      ...(plan ? { plan: { _type: "reference", _ref: plan._id } } : {}),
    });
    return { status: "success", message: ui.order.success };
  } catch (err) {
    console.error("createOrder failed", err);
    return { status: "error", message: ui.form.failed };
  }
}

/** Creates a `submit` document from the contact form. */
export async function createSubmission(_prev: FormState, form: FormData): Promise<FormState> {
  const ui = dictFor(form);
  if (field(form, "website")) return { status: "success", message: ui.contact.success };

  const fullname = field(form, "fullname");
  const phone = phoneField(form);
  const email = field(form, "email");
  const title = field(form, "title");
  const description = field(form, "description", 5000);

  if (hasPhone(form) && !phone) return { status: "error", message: ui.form.invalidPhone };
  const invalid = validateContact(ui, fullname, phone, email);
  if (invalid) return invalid;
  if (!title) return { status: "error", message: ui.form.required };

  try {
    await client.create({ _type: "submit", fullname, phone, email, title, description });
    return { status: "success", message: ui.contact.success };
  } catch (err) {
    console.error("createSubmission failed", err);
    return { status: "error", message: ui.form.failed };
  }
}
