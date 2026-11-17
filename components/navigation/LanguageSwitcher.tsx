"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Fragment } from "react";
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
  const suffix = (pathname ?? `/${locale}`).replace(/^\/(en|id)(?=\/|$)/, "");

  return (
    <nav className="language-switcher" aria-label={dictionary.language.label}>
      {(["id", "en"] as const).map((target, index) => (
        <Fragment key={target}>
          {index > 0 && <span className="language-switcher__divider" aria-hidden="true">/</span>}
          {target === locale ? (
            <span aria-current="page">{target.toUpperCase()}</span>
          ) : (
            <Link
              href={`/${target}${suffix}`}
              aria-label={`${dictionary.language.switchTo} ${target.toUpperCase()}`}
              onClick={(event) => {
                onNavigate?.();
                if (window.location.hash) {
                  event.preventDefault();
                  router.push(`/${target}${suffix}${window.location.hash}`, { scroll: false });
                }
              }}
            >
              {target.toUpperCase()}
            </Link>
          )}
        </Fragment>
      ))}
    </nav>
  );
}
