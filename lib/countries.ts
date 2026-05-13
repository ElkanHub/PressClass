// lib/countries.ts — Africa-first country list with default currencies.
// Used by onboarding country/currency selectors and payment routing.

export interface Country {
  code: string;       // ISO-3166 alpha-2
  name: string;
  currency: string;   // ISO-4217
  flag: string;       // Emoji
  dialCode: string;
}

export const AFRICAN_COUNTRIES: Country[] = [
  { code: "GH", name: "Ghana",         currency: "GHS", flag: "🇬🇭", dialCode: "+233" },
  { code: "NG", name: "Nigeria",       currency: "NGN", flag: "🇳🇬", dialCode: "+234" },
  { code: "KE", name: "Kenya",         currency: "KES", flag: "🇰🇪", dialCode: "+254" },
  { code: "ZA", name: "South Africa",  currency: "ZAR", flag: "🇿🇦", dialCode: "+27"  },
  { code: "UG", name: "Uganda",        currency: "UGX", flag: "🇺🇬", dialCode: "+256" },
  { code: "TZ", name: "Tanzania",      currency: "TZS", flag: "🇹🇿", dialCode: "+255" },
  { code: "RW", name: "Rwanda",        currency: "RWF", flag: "🇷🇼", dialCode: "+250" },
  { code: "ET", name: "Ethiopia",      currency: "ETB", flag: "🇪🇹", dialCode: "+251" },
  { code: "EG", name: "Egypt",         currency: "EGP", flag: "🇪🇬", dialCode: "+20"  },
  { code: "MA", name: "Morocco",       currency: "MAD", flag: "🇲🇦", dialCode: "+212" },
  { code: "CM", name: "Cameroon",      currency: "XAF", flag: "🇨🇲", dialCode: "+237" },
  { code: "CI", name: "Côte d'Ivoire", currency: "XOF", flag: "🇨🇮", dialCode: "+225" },
  { code: "SN", name: "Senegal",       currency: "XOF", flag: "🇸🇳", dialCode: "+221" },
  { code: "ZM", name: "Zambia",        currency: "ZMW", flag: "🇿🇲", dialCode: "+260" },
  { code: "ZW", name: "Zimbabwe",      currency: "USD", flag: "🇿🇼", dialCode: "+263" },
  { code: "BW", name: "Botswana",      currency: "BWP", flag: "🇧🇼", dialCode: "+267" },
  { code: "NA", name: "Namibia",       currency: "NAD", flag: "🇳🇦", dialCode: "+264" },
  { code: "MW", name: "Malawi",        currency: "MWK", flag: "🇲🇼", dialCode: "+265" },
  { code: "MZ", name: "Mozambique",    currency: "MZN", flag: "🇲🇿", dialCode: "+258" },
  { code: "SL", name: "Sierra Leone",  currency: "SLE", flag: "🇸🇱", dialCode: "+232" },
  { code: "LR", name: "Liberia",       currency: "LRD", flag: "🇱🇷", dialCode: "+231" },
  { code: "GM", name: "Gambia",        currency: "GMD", flag: "🇬🇲", dialCode: "+220" },
  { code: "BJ", name: "Benin",         currency: "XOF", flag: "🇧🇯", dialCode: "+229" },
  { code: "TG", name: "Togo",          currency: "XOF", flag: "🇹🇬", dialCode: "+228" },
  { code: "BF", name: "Burkina Faso",  currency: "XOF", flag: "🇧🇫", dialCode: "+226" },
  { code: "ML", name: "Mali",          currency: "XOF", flag: "🇲🇱", dialCode: "+223" },
  { code: "NE", name: "Niger",         currency: "XOF", flag: "🇳🇪", dialCode: "+227" },
];

export const OTHER_COUNTRY: Country = {
  code: "XX", name: "Other", currency: "USD", flag: "🌍", dialCode: "",
};

export const ALL_COUNTRIES: Country[] = [...AFRICAN_COUNTRIES, OTHER_COUNTRY];

export function getCountry(code: string): Country | undefined {
  return ALL_COUNTRIES.find((c) => c.code === code);
}
