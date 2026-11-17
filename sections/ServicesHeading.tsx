"use client";

import { useAnimate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import type { Locale } from "@/types/i18n";

const headingWords = {
  en: ["WHAT", "WE", "DO."],
  id: ["LAYANAN", "KAMI."],
} as const;

const timings = {
  desktop: {
    en: { start: 2.35, duration: 0.444444, stagger: 0.177778 },
    id: { start: 2.35, duration: 0.571429, stagger: 0.228571 },
  },
  compact: {
    en: { start: 2.2, duration: 0.416667, stagger: 0.166667 },
    id: { start: 2.2, duration: 0.535714, stagger: 0.214286 },
  },
} as const;

type ServicesHeadingProps = Readonly<{ locale: Locale; heading: string }>;

export function ServicesHeading({ locale, heading }: ServicesHeadingProps) {
  const [scope, animate] = useAnimate();
  const isInView = useInView(scope, { once: true, amount: 0.5 });
  const prefersReducedMotion = useReducedMotion();
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 900px)");
    const update = () => setIsCompact(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!isInView || prefersReducedMotion || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timing = timings[isCompact ? "compact" : "desktop"][locale];
    const words: NodeListOf<HTMLElement> | undefined = (scope.current as HTMLHeadingElement | null)
      ?.querySelectorAll(".services__word");
    words?.forEach((word, index) => {
      animate(word, { opacity: [0, 1], y: [18, 0] }, {
        duration: timing.duration,
        delay: timing.start + index * timing.stagger,
        ease: [0, 0, 0.58, 1],
      });
    });
  }, [animate, isCompact, isInView, locale, prefersReducedMotion, scope]);

  return (
    <h2 className="services__heading" id="services-heading" ref={scope} aria-label={heading}>
      {headingWords[locale].map((word) => (
        <span className="services__word" key={word}>
          {word}
        </span>
      ))}
    </h2>
  );
}
