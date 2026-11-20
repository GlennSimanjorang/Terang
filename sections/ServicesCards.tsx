"use client";

import Image from "next/image";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ServicesDetailModal } from "@/sections/ServicesDetailModal";
import type { getDictionary } from "@/lib/i18n";
import type { Locale } from "@/types/i18n";

const serviceImages = [
  "/assets/services/service-concept-creative-direction.png",
  "/assets/services/service-event-management.png",
  "/assets/services/service-technical-production.png",
  "/assets/services/service-stage-audiovisual.png",
] as const;

type ServicesContent = ReturnType<typeof getDictionary>["services"];

type ServicesCardsProps = Readonly<{ content: ServicesContent; locale: Locale }>;

export function ServicesCards({ content, locale }: ServicesCardsProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [canShareImage, setCanShareImage] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion();
  const selected = selectedIndex === null ? null : content.items[selectedIndex];
  const shareImage = canShareImage && !reduceMotion;

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1101px)");
    const update = () => setCanShareImage(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  function closeModal() {
    setSelectedIndex(null);
  }

  return (
    <LayoutGroup id={`terang-services-${locale}`}>
      <div className="services__grid">
        {content.items.map((item, index) => (
          <article className="services__card" key={item.title}>
            <span className="services__number">{String(index + 1).padStart(2, "0")}</span>
            <h3 className="services__card-title">{item.title}</h3>
            <span className="services__divider" aria-hidden="true" />
            <p className="services__description services__description--desktop">{item.descriptionDesktop}</p>
            <p className="services__description services__description--compact">{item.descriptionCompact}</p>
            <p className="services__explore">
              {content.explore}<span aria-hidden="true">→</span>
            </p>
            <motion.div
              className="services__image"
              layoutId={shareImage ? `service-image-${index}` : undefined}
              transition={{ layout: reduceMotion ? { duration: 0 } : { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }}
            >
              <Image src={serviceImages[index]} alt="" fill sizes="640px" quality={85} loading="lazy" />
            </motion.div>
            <button
              className="services__card-trigger"
              type="button"
              aria-haspopup="dialog"
              aria-label={`${content.detail.openDetails}: ${item.title}`}
              onClick={(event) => {
                triggerRef.current = event.currentTarget;
                setSelectedIndex(index);
              }}
            />
          </article>
        ))}
      </div>
      {/*
       * AnimatePresence intercepts the unmount so the modal's exit animations
       * (backdrop fade, panel background fade, layoutId image flight back to card)
       * fully complete before the <dialog> is removed from the DOM.
       */}
      <AnimatePresence onExitComplete={() => triggerRef.current?.focus()}>
        {selected && selectedIndex !== null && (
          <ServicesDetailModal
            key={selectedIndex}
            locale={locale}
            service={selected}
            image={serviceImages[selectedIndex]}
            imageLayoutId={shareImage ? `service-image-${selectedIndex}` : undefined}
            number={String(selectedIndex + 1).padStart(2, "0")}
            sectionLabel={content.label}
            labels={content.detail}
            onClose={closeModal}
          />
        )}
      </AnimatePresence>
    </LayoutGroup>
  );
}
