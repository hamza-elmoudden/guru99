/** European + US/Canada country dial codes for the phone field. Shared by the forms and the server actions. */
export const PHONE_COUNTRIES = [
  { iso: "CA", flag: "🇨🇦", dial: "+1" },
  { iso: "US", flag: "🇺🇸", dial: "+1" },
  { iso: "AL", flag: "🇦🇱", dial: "+355" },
  { iso: "AD", flag: "🇦🇩", dial: "+376" },
  { iso: "AT", flag: "🇦🇹", dial: "+43" },
  { iso: "BY", flag: "🇧🇾", dial: "+375" },
  { iso: "BE", flag: "🇧🇪", dial: "+32" },
  { iso: "BA", flag: "🇧🇦", dial: "+387" },
  { iso: "BG", flag: "🇧🇬", dial: "+359" },
  { iso: "HR", flag: "🇭🇷", dial: "+385" },
  { iso: "CY", flag: "🇨🇾", dial: "+357" },
  { iso: "CZ", flag: "🇨🇿", dial: "+420" },
  { iso: "DK", flag: "🇩🇰", dial: "+45" },
  { iso: "EE", flag: "🇪🇪", dial: "+372" },
  { iso: "FI", flag: "🇫🇮", dial: "+358" },
  { iso: "FR", flag: "🇫🇷", dial: "+33" },
  { iso: "DE", flag: "🇩🇪", dial: "+49" },
  { iso: "GR", flag: "🇬🇷", dial: "+30" },
  { iso: "HU", flag: "🇭🇺", dial: "+36" },
  { iso: "IS", flag: "🇮🇸", dial: "+354" },
  { iso: "IE", flag: "🇮🇪", dial: "+353" },
  { iso: "IT", flag: "🇮🇹", dial: "+39" },
  { iso: "XK", flag: "🇽🇰", dial: "+383" },
  { iso: "LV", flag: "🇱🇻", dial: "+371" },
  { iso: "LI", flag: "🇱🇮", dial: "+423" },
  { iso: "LT", flag: "🇱🇹", dial: "+370" },
  { iso: "LU", flag: "🇱🇺", dial: "+352" },
  { iso: "MT", flag: "🇲🇹", dial: "+356" },
  { iso: "MD", flag: "🇲🇩", dial: "+373" },
  { iso: "MC", flag: "🇲🇨", dial: "+377" },
  { iso: "ME", flag: "🇲🇪", dial: "+382" },
  { iso: "NL", flag: "🇳🇱", dial: "+31" },
  { iso: "MK", flag: "🇲🇰", dial: "+389" },
  { iso: "NO", flag: "🇳🇴", dial: "+47" },
  { iso: "PL", flag: "🇵🇱", dial: "+48" },
  { iso: "PT", flag: "🇵🇹", dial: "+351" },
  { iso: "RO", flag: "🇷🇴", dial: "+40" },
  { iso: "SM", flag: "🇸🇲", dial: "+378" },
  { iso: "RS", flag: "🇷🇸", dial: "+381" },
  { iso: "SK", flag: "🇸🇰", dial: "+421" },
  { iso: "SI", flag: "🇸🇮", dial: "+386" },
  { iso: "ES", flag: "🇪🇸", dial: "+34" },
  { iso: "SE", flag: "🇸🇪", dial: "+46" },
  { iso: "CH", flag: "🇨🇭", dial: "+41" },
  { iso: "UA", flag: "🇺🇦", dial: "+380" },
  { iso: "GB", flag: "🇬🇧", dial: "+44" },
] as const;

export const DEFAULT_PHONE_COUNTRY = "FI";

/**
 * Builds the stored number from the selected country and the typed number.
 * Returns null if the country is not in the list or the number isn't 4–15 digits.
 */
export function formatPhone(iso: string, number: string): string | null {
  const country = PHONE_COUNTRIES.find((c) => c.iso === iso);
  if (!country) return null;
  const digits = number.replace(/[\s\-().]/g, "").replace(/^0+/, "");
  if (!/^\d{4,15}$/.test(digits)) return null;
  return `${country.dial} ${digits}`;
}
