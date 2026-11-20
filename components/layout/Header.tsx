"use client";

import Link from "next/link";
import type { getDictionary } from "@/lib/i18n";
import type { Locale } from "@/types/i18n";
import { DesktopNavigation } from "@/components/navigation/DesktopNavigation";
import { LanguageSwitcher } from "@/components/navigation/LanguageSwitcher";
import { MobileMenu } from "@/components/navigation/MobileMenu";
import { useActiveSection } from "@/components/navigation/useActiveSection";

type Dictionary = ReturnType<typeof getDictionary>;

type HeaderProps = Readonly<{
  locale: Locale;
  dictionary: Dictionary;
}>;

export function Header({ locale, dictionary }: HeaderProps) {
  const activeId = useActiveSection(dictionary.navigation.items);

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link className="wordmark" href={`/${locale}`} aria-label={`TERANG — ${dictionary.homeLabel}`} aria-current={activeId === "home" ? "location" : undefined}>
          TERANG
        </Link>
        <DesktopNavigation items={dictionary.navigation.items} label={dictionary.navigation.label} activeId={activeId} />
        <div className="site-header__controls">
          <LanguageSwitcher locale={locale} dictionary={dictionary} />
          <MobileMenu locale={locale} dictionary={dictionary} activeId={activeId} />
        </div>
        <a className="header-cta" href="#contact">{dictionary.headerCta}</a>
      </div>
    </header>
  );
}
