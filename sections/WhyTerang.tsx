import type { getDictionary } from "@/lib/i18n";
import type { Locale } from "@/types/i18n";

type WhyTerangProps = Readonly<{
  locale: Locale;
  content: ReturnType<typeof getDictionary>["whyTerang"];
}>;

export function WhyTerang({ locale, content }: WhyTerangProps) {
  return (
    <section
      id="about"
      className={`why-terang why-terang--${locale}`}
      aria-labelledby="why-terang-heading"
    >
      <div className="why-terang__inner">
        <p className="why-terang__eyebrow">{content.eyebrow}</p>
        <h2 className="why-terang__heading" id="why-terang-heading">{content.heading}</h2>
        <div className="why-terang__divider" aria-hidden="true" />

        <div className="why-terang__columns">
          {content.columns.map((column, index) => (
            <article className="why-terang__column" key={column.title}>
              <span className="why-terang__signal" aria-hidden="true" />
              <p className="why-terang__category">{column.category}</p>
              <p className="why-terang__number">{String(index + 1).padStart(2, "0")}</p>
              <h3 className="why-terang__title">{column.title}</h3>
              <p className="why-terang__description">{column.description}</p>
              <p className="why-terang__metadata">{column.metadata}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
