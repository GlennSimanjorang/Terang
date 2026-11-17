import Image from "next/image";
import type { getDictionary } from "@/lib/i18n";
import type { Locale } from "@/types/i18n";

type SelectedProjectsProps = Readonly<{
  locale: Locale;
  content: ReturnType<typeof getDictionary>["selectedProjects"];
}>;

const projects = [
  { id: "live-concert", image: "/assets/projects/selected-project-live-concert.png", className: "selected-projects__item--featured" },
  { id: "brand-experience", image: "/assets/projects/selected-project-brand-experience.png", className: "selected-projects__item--brand" },
  { id: "technical-team", image: "/assets/projects/selected-project-technical-team.png", className: "selected-projects__item--team" },
  { id: "technical-production", image: "/assets/projects/selected-project-technical-production.png", className: "selected-projects__item--production" },
] as const;

export function SelectedProjects({ locale, content }: SelectedProjectsProps) {
  const renderProject = (index: number) => {
    const project = projects[index];
    const item = content.items[index];
    if (!project || !item) return null;

    return (
      <article className={`selected-projects__item ${project.className}`} key={project.id}>
        <div className="selected-projects__media">
          <Image
            className="selected-projects__image"
            src={project.image}
            alt={item.imageAlt}
            fill
            sizes={index === 0
              ? "(max-width: 680px) calc(100vw - 40px), (max-width: 1100px) 58vw, 760px"
              : "(max-width: 680px) calc(100vw - 40px), (max-width: 1100px) 36vw, 400px"}
            quality={88}
          />
          {index < 3 && (
            <span className={`selected-projects__annotation selected-projects__annotation--${project.id}`} aria-hidden="true">
              {item.annotation}
            </span>
          )}
          {index === 0 && (
            <>
              <svg
                className="selected-projects__marker-strokes"
                viewBox="0 0 74.44 59.895"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path d="M37 6 H57 V26" />
                <path d="M8.6 23.4 L45.4 60.2" />
              </svg>
              <span className="selected-projects__marker-circle" aria-hidden="true" />
            </>
          )}
        </div>
        <h3 className="selected-projects__title">{item.title}</h3>
        <p className="selected-projects__category">{item.category}</p>
      </article>
    );
  };

  return (
    <section id="work" className={`selected-projects selected-projects--${locale}`} aria-labelledby="selected-projects-heading">
      <div className="selected-projects__inner">
        <p className="selected-projects__eyebrow">{content.eyebrow}</p>
        <h2 className="selected-projects__heading" id="selected-projects-heading">
          {content.heading}
        </h2>
        <a className="selected-projects__all" href="#selected-projects-grid">
          {content.viewAll}<span aria-hidden="true">↗</span>
        </a>

        <div className="selected-projects__grid" id="selected-projects-grid">
          {renderProject(0)}
          <div className="selected-projects__rail">
            {renderProject(1)}
            <div className="selected-projects__lower-grid">
              {renderProject(2)}
              {renderProject(3)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
