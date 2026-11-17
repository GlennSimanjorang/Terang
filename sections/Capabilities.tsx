import Image from "next/image";
import { HandwrittenAnnotation } from "@/components/ui/HandwrittenAnnotation";
import { HandwrittenUnderline } from "@/components/ui/HandwrittenUnderline";
import type { getDictionary } from "@/lib/i18n";
import type { Locale } from "@/types/i18n";

type CapabilitiesProps = Readonly<{
  locale: Locale;
  content: ReturnType<typeof getDictionary>["capabilities"];
}>;

const capabilitiesImage = "/assets/capabilities/capabilities-production.png";

export function Capabilities({ locale, content }: CapabilitiesProps) {
  return (
    <section
      id="capabilities"
      className={`capabilities capabilities--${locale}`}
      aria-labelledby="capabilities-heading"
    >
      <div className="capabilities__inner">
        <div className="capabilities__intro">
          <div className="capabilities__copy">
            <p className="capabilities__eyebrow">{content.eyebrow}</p>
            <h2 className="capabilities__heading" id="capabilities-heading">
              <span>{content.headingFirstLine}</span>
              <span>{content.headingSecondLine}</span>
            </h2>
            <p className="capabilities__support">{content.support}</p>
          </div>

          <figure className="capabilities__media">
            <Image
              className="capabilities__image"
              src={capabilitiesImage}
              alt={content.imageAlt}
              fill
              sizes="(max-width: 850px) min(100vw - 48px, 520px), (max-width: 1100px) 42vw, 520px"
              quality={88}
            />
            <HandwrittenAnnotation className="capabilities__annotation">
              {content.annotation}
            </HandwrittenAnnotation>
            <HandwrittenUnderline className="capabilities__underline" />
          </figure>
        </div>

        <ol className="capabilities__steps">
          {content.stages.map((stage, index) => (
            <li className="capabilities__step" key={stage.title}>
              <span className="capabilities__number">{String(index + 1).padStart(2, "0")}</span>
              <h3 className="capabilities__title">{stage.title}</h3>
              <p className="capabilities__description">{stage.description}</p>
              <span
                className={`capabilities__progress${index === content.stages.length - 1 ? " capabilities__progress--final" : ""}`}
                aria-hidden="true"
              />
            </li>
          ))}
        </ol>

        <p className="capabilities__closing">{content.closing}</p>
      </div>
    </section>
  );
}
