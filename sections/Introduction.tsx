import { IntroductionImage } from "@/sections/IntroductionImage";
import type { getDictionary } from "@/lib/i18n";
import type { Locale } from "@/types/i18n";

type IntroductionProps = Readonly<{
  locale: Locale;
  content: ReturnType<typeof getDictionary>["introduction"];
}>;

export function Introduction({ locale, content }: IntroductionProps) {
  return (
    <section
      id="introduction"
      className={`introduction introduction--${locale}`}
      aria-labelledby="introduction-heading"
    >
      <div className="introduction__inner">
        <p className="introduction__label">{content.label}</p>
        <h2 className="introduction__heading" id="introduction-heading">
          <span className="introduction__word">{content.headingFirst}</span>{" "}
          <span className="introduction__word">{content.headingSecond}</span>
        </h2>
        <p className="introduction__body introduction__body--desktop">
          {content.bodyDesktop}
        </p>
        <p className="introduction__body introduction__body--tablet">
          {content.bodyTablet}
        </p>
        <p className="introduction__body introduction__body--mobile">
          {content.bodyMobile}
        </p>
        <IntroductionImage annotation={content.annotation} />
        <p className="introduction__caption">{content.captionResponsive}</p>
        <p className="introduction__capabilities">{content.capabilities}</p>
        <a className="introduction__cta" href="#about">
          {content.cta}
        </a>
      </div>
    </section>
  );
}
