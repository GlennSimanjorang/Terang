import { ClientLogoPlaceholder } from "@/components/ui/ClientLogoPlaceholder";
import { TestimonialCard } from "@/components/ui/TestimonialCard";
import type { getDictionary } from "@/lib/i18n";
import type { Locale } from "@/types/i18n";

type ClientsTrustProps = Readonly<{
  locale: Locale;
  content: ReturnType<typeof getDictionary>["clientsTrust"];
}>;

export function ClientsTrust({ locale, content }: ClientsTrustProps) {
  return (
    <section
      id="clients-trust"
      className={`clients-trust clients-trust--${locale}`}
      aria-labelledby="clients-trust-heading"
    >
      <div className="clients-trust__inner">
        <p className="clients-trust__eyebrow">{content.eyebrow}</p>
        <h2 className="clients-trust__heading" id="clients-trust-heading">{content.heading}</h2>
        <p className="clients-trust__introduction">{content.introduction}</p>
        <p className="clients-trust__logos-label">{content.logosLabel}</p>

        <div className="clients-trust__logos" aria-label={content.logosLabel}>
          {content.logos.map((logo) => (
            <ClientLogoPlaceholder key={logo}>{logo}</ClientLogoPlaceholder>
          ))}
        </div>

        <div className="clients-trust__proof">
          <TestimonialCard
            quoteLabel={content.quoteLabel}
            quote={content.quote}
            attribution={content.attribution}
          />
          <p className="clients-trust__note">{content.note}</p>
        </div>
      </div>
    </section>
  );
}
