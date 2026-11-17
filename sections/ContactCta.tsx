import Image from "next/image";
import { HandwrittenAnnotation } from "@/components/ui/HandwrittenAnnotation";
import { HandwrittenArrow } from "@/components/ui/HandwrittenArrow";
import type { getDictionary } from "@/lib/i18n";
import type { Locale } from "@/types/i18n";

type ContactCtaProps = Readonly<{
  locale: Locale;
  content: ReturnType<typeof getDictionary>["contactCtaSection"];
  buttonLabel: string;
}>;

const contactImage = "/assets/contact/contact-cta.png";

export function ContactCta({ locale, content, buttonLabel }: ContactCtaProps) {
  return (
    <section
      id="contact"
      className={`contact-cta contact-cta--${locale}`}
      aria-labelledby="contact-cta-heading"
    >
      <div className="contact-cta__media">
        <Image
          className="contact-cta__image"
          src={contactImage}
          alt=""
          fill
          priority
          sizes="(max-width: 850px) calc(100vw - 40px), 100vw"
        />
        <div className="contact-cta__overlay" aria-hidden="true" />
        <HandwrittenArrow className="contact-cta__arrow" />
        <HandwrittenAnnotation className="contact-cta__annotation">
          {content.annotation}
        </HandwrittenAnnotation>
      </div>

      <p className="contact-cta__caption">{content.imageCaption}</p>

      <div className="contact-cta__inner">
        <p className="contact-cta__eyebrow">{content.eyebrow}</p>
        <h2 className="contact-cta__heading" id="contact-cta-heading">
          <span>{content.headingLine1}</span>
          <span>{content.headingLine2}</span>
        </h2>
        <p className="contact-cta__support">{content.description}</p>
        <button className="contact-cta__button" type="button" data-contact-destination="">
          {buttonLabel}
        </button>
      </div>
    </section>
  );
}
