"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { getDictionary } from "@/lib/i18n";
import type { Locale } from "@/types/i18n";

type Dictionary = ReturnType<typeof getDictionary>;

type LanguageSwitcherProps = Readonly<{
  locale: Locale;
  dictionary: Dictionary;
  onNavigate?: () => void;
}>;

export function LanguageSwitcher({ locale, dictionary, onNavigate }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();
  const nextLocale = locale === "en" ? "id" : "en";
  const suffix = (pathname ?? `/${locale}`).replace(/^\/(en|id)(?=\/|$)/, "");
  const href = `/${nextLocale}${suffix}`;

  return (
    <nav className="language-switcher" aria-label={dictionary.language.label}>
      <span aria-current="page">{locale.toUpperCase()}</span>
      <span className="language-switcher__divider" aria-hidden="true">/</span>
      <Link
        href={href}
        aria-label={`${dictionary.language.switchTo} ${nextLocale.toUpperCase()}`}
        onClick={(event) => {
          onNavigate?.();
          if (window.location.hash) {
            event.preventDefault();
            router.push(`${href}${window.location.hash}`, { scroll: false });
          }
        }}
      >
        {nextLocale.toUpperCase()}
      </Link>
    </nav>
  );
}
