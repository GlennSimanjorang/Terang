import Link from "next/link";
import type { getDictionary } from "@/lib/i18n";
import type { Locale } from "@/types/i18n";
import { DesktopNavigation } from "@/components/navigation/DesktopNavigation";
import { LanguageSwitcher } from "@/components/navigation/LanguageSwitcher";
import { MobileMenu } from "@/components/navigation/MobileMenu";

type Dictionary = ReturnType<typeof getDictionary>;

type HeaderProps = Readonly<{
  locale: Locale;
  dictionary: Dictionary;
}>;

export function Header({ locale, dictionary }: HeaderProps) {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link className="wordmark" href={`/${locale}`} aria-label={`TERANG — ${dictionary.homeLabel}`}>
          TERANG<span aria-hidden="true">.</span>
        </Link>
        <DesktopNavigation items={dictionary.navigation.items} label={dictionary.navigation.label} />
        <div className="site-header__controls">
          <LanguageSwitcher locale={locale} dictionary={dictionary} />
          <MobileMenu locale={locale} dictionary={dictionary} />
        </div>
      </div>
    </header>
  );
}
