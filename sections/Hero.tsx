import { HeroMedia } from "@/sections/HeroMedia";
import type { getDictionary } from "@/lib/i18n";
import type { Locale } from "@/types/i18n";

type HeroProps = Readonly<{
  locale: Locale;
  content: ReturnType<typeof getDictionary>["hero"];
}>;

export function Hero({ locale, content }: HeroProps) {
  return (
    <section className={`hero hero--${locale}`} aria-labelledby="hero-title">
      <div className="hero__layout">
        <p className="hero__eyebrow">{content.eyebrow}</p>
        <span className="hero__media-label">{content.mediaLabel}</span>

        <HeroMedia
          imageAlt={content.imageAlt}
          annotationDesktop={content.annotationDesktop}
          annotationTablet={content.annotationTablet}
          annotationMobile={content.annotationMobile}
        />

        <p className="hero__caption hero__caption--desktop">{content.captionDesktop}</p>
        <div className="hero__copy">
          <h1 className="hero__title" id="hero-title">
            <span className="hero__title-line">
              <span className="hero__word">WE</span>{" "}
              <span className="hero__word">SHAPE</span>
            </span>
            <span className="hero__title-line">
              <span className="hero__word">THE</span>{" "}
              <span className="hero__word">LIGHT.</span>
            </span>
          </h1>
          <p className="hero__body hero__body--desktop">{content.bodyDesktop}</p>
          <p className="hero__body hero__body--responsive">{content.bodyResponsive}</p>
          <div className="hero__actions">
            <a className="hero__button hero__button--primary" href="#work">
              {content.workCta}
            </a>
            <a className="hero__button hero__button--secondary" href="#contact">
              {content.contactCta}
            </a>
          </div>
          <a className="hero__scroll" href="#introduction">
            {content.scrollCue}
          </a>
        </div>
        <p className="hero__caption hero__caption--responsive">{content.captionResponsive}</p>
        <span className="hero__bottom-rule" aria-hidden="true" />
      </div>
    </section>
  );
}
