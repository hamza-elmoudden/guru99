"use client";

import { DEFAULT_PHONE_COUNTRY, PHONE_COUNTRIES } from "@/lib/phone";
import { fieldInput, fieldLabel, fieldSelect } from "@/lib/ui";

type Props = { id: string; label: string; codeLabel: string };

/** Country dial-code select (Finland by default) + local number input. */
export function PhoneField({ id, label, codeLabel }: Props) {
  return (
    <div>
      <label className={fieldLabel} htmlFor={id}>{label} *</label>
      <div className="flex items-stretch gap-2">
        <select
          className={fieldSelect}
          name="phoneCountry"
          defaultValue={DEFAULT_PHONE_COUNTRY}
          aria-label={codeLabel}
          autoComplete="tel-country-code"
        >
          {PHONE_COUNTRIES.map((c) => (
            <option key={c.iso} value={c.iso} className="bg-bg">
              {c.flag} {c.dial}
            </option>
          ))}
        </select>
        <input
          className={`${fieldInput} min-w-0 flex-1`}
          id={id}
          name="phone"
          type="tel"
          inputMode="tel"
          required
          autoComplete="tel-national"
          pattern="[0-9 ]{4,20}"
          maxLength={20}
          placeholder="123 456 789"
          onInput={(e) => {
            // Digits and spaces only; the country code comes from the select.
            const el = e.currentTarget;
            const clean = el.value.replace(/[^\d ]/g, "");
            if (clean !== el.value) el.value = clean;
          }}
        />
      </div>
    </div>
  );
}
