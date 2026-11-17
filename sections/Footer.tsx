import Link from "next/link";
import { Fragment } from "react";
import { LanguageSwitcher } from "@/components/navigation/LanguageSwitcher";
import type { getDictionary } from "@/lib/i18n";
import type { Locale } from "@/types/i18n";

type FooterProps = Readonly<{
  locale: Locale;
  dictionary: ReturnType<typeof getDictionary>;
}>;

const footerDestinations = ["work", "capabilities", "about", "contact"] as const;

export function Footer({ locale, dictionary }: FooterProps) {
  const content = dictionary.footer;

  return (
    <footer className={`site-footer site-footer--${locale}`}>
      <div className="site-footer__inner">
        <div className="site-footer__top-row">
          <Link className="site-footer__wordmark" href={`/${locale}`} aria-label={`TERANG — ${dictionary.homeLabel}`}>
            TERANG
          </Link>
          <nav className="site-footer__navigation" aria-label={content.navigationLabel}>
            <div className="site-footer__navigation-desktop">
              {content.navigation.map((label, index) => (
                <a href={`#${footerDestinations[index]}`} key={label}>{label}</a>
              ))}
            </div>
            <div className="site-footer__navigation-responsive">
              {[0, 2].map((startIndex) => (
                <div className="site-footer__navigation-row" key={startIndex}>
                  {content.navigation.slice(startIndex, startIndex + 2).map((label, rowIndex) => {
                    const index = startIndex + rowIndex;
                    return (
                      <Fragment key={label}>
                        {rowIndex > 0 && <span aria-hidden="true">/</span>}
                        <a href={`#${footerDestinations[index]}`}>{label}</a>
                      </Fragment>
                    );
                  })}
                </div>
              ))}
            </div>
          </nav>
        </div>

        <div className="site-footer__middle-row">
          <address className="site-footer__contact">
            <span>{content.contactTitle}</span>
            {content.contactDetails.map((detail) => <span key={detail}>{detail}</span>)}
          </address>

          <nav className="site-footer__social" aria-label={content.socialLabel}>
            {content.socialLinks.map((social, index) => (
              <span className="site-footer__social-item" key={social.label}>
                {social.url ? (
                  <a href={social.url} target="_blank" rel="noreferrer">{social.label}</a>
                ) : (
                  <span>{social.label}</span>
                )}
                {index < content.socialLinks.length - 1 && <span aria-hidden="true"> / </span>}
              </span>
            ))}
          </nav>

          <div className="site-footer__language">
            <LanguageSwitcher locale={locale} dictionary={dictionary} />
          </div>
        </div>

        <div className="site-footer__divider" aria-hidden="true" />

        <div className="site-footer__bottom-row">
          <p className="site-footer__copyright">{content.copyright}</p>
          <p className="site-footer__tagline">{content.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
