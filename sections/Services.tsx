import { ServicesHeading } from "@/sections/ServicesHeading";
import { ServicesCards } from "@/sections/ServicesCards";
import type { getDictionary } from "@/lib/i18n";
import type { Locale } from "@/types/i18n";

type ServicesProps = Readonly<{
  locale: Locale;
  content: ReturnType<typeof getDictionary>["services"];
}>;

export function Services({ locale, content }: ServicesProps) {
  return (
    <section id="services" className={`services services--${locale}`} aria-labelledby="services-heading">
      <div className="services__inner">
        <p className="services__label">{content.label}</p>
        <ServicesHeading locale={locale} heading={content.heading} />
        <p className="services__body services__body--desktop">{content.bodyDesktop}</p>
        <p className="services__body services__body--compact">{content.bodyCompact}</p>
        <ServicesCards content={content} locale={locale} />
      </div>
    </section>
  );
}
