import Image from "next/image";
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

        <figure className="hero__media">
          <picture>
            <source
              media="(max-width: 480px)"
              srcSet="/assets/hero/terang-hero-placeholder-mobile.webp"
            />
            <source
              media="(max-width: 900px)"
              srcSet="/assets/hero/terang-hero-placeholder-tablet.webp"
            />
            <Image
              src="/assets/hero/terang-hero-placeholder-desktop.webp"
              alt={content.imageAlt}
              width={1280}
              height={1024}
              sizes="(max-width: 480px) calc(100vw - 40px), (max-width: 900px) calc(100vw - 64px), 600px"
              quality={82}
              loading="eager"
              fetchPriority="high"
            />
          </picture>
          <span className="hero__annotation" aria-hidden="true">
            <span className="hero__annotation-desktop">{content.annotationDesktop}</span>
            <span className="hero__annotation-tablet">{content.annotationTablet}</span>
            <span className="hero__annotation-mobile">{content.annotationMobile}</span>
          </span>
          <span className="hero__beam hero__beam--one" aria-hidden="true" />
          <span className="hero__beam hero__beam--two" aria-hidden="true" />
        </figure>

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
