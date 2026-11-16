import en from "@/locales/en.json";
import id from "@/locales/id.json";
import type { Locale } from "@/types/i18n";

const dictionaries = { en, id } as const;

export function getDictionary(locale: Locale) {
  return dictionaries[locale];
}
