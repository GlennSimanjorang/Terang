"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { getDictionary } from "@/lib/i18n";
import type { Locale } from "@/types/i18n";

type ServicesContent = ReturnType<typeof getDictionary>["services"];
type Service = ServicesContent["items"][number];
type Labels = ServicesContent["detail"];

type ServicesDetailModalProps = Readonly<{
  locale: Locale;
  service: Service;
  image: string;
  imageLayoutId?: string;
  number: string;
  sectionLabel: string;
  labels: Labels;
  onClose: () => void;
}>;

const easing = [0.22, 1, 0.36, 1] as const;

export function ServicesDetailModal({
  locale,
  service,
  image,
  imageLayoutId,
  number,
  sectionLabel,
  labels,
  onClose,
}: ServicesDetailModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [isClosing, setIsClosing] = useState(false);
  const reduceMotion = useReducedMotion();
  const duration = reduceMotion ? 0.16 : 0.4;
  const textItemVariants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 9 },
    visible: { opacity: 1, y: 0, transition: { duration: reduceMotion ? 0.16 : 0.28, ease: easing } },
    exit: { opacity: 0, y: reduceMotion ? 0 : 4, transition: { duration: reduceMotion ? 0.12 : 0.18, ease: easing } },
  };
  const textContainerVariants = {
    hidden: {},
    visible: { transition: { delayChildren: reduceMotion ? 0 : 0.14, staggerChildren: reduceMotion ? 0 : 0.055 } },
    exit: { transition: { staggerChildren: reduceMotion ? 0 : 0.025, staggerDirection: -1 } },
  };

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (!dialog.open) dialog.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const frame = requestAnimationFrame(() => closeRef.current?.focus());

    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
      if (dialog.open) dialog.close();
    };
  }, []);

  function finishClose() {
    dialogRef.current?.close();
    onClose();
  }

  function requestClose() {
    setIsClosing(true);
  }

  return (
    <dialog
      ref={dialogRef}
      className={`services-detail services-detail--${locale}`}
      aria-modal="true"
      aria-labelledby="services-detail-title"
      aria-describedby="services-detail-description"
      onCancel={(event) => {
        event.preventDefault();
        requestClose();
      }}
    >
      <div className="services-detail__contents">
        <motion.div
          className="services-detail__backdrop"
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: isClosing ? 0 : 1 }}
          transition={{ duration: reduceMotion ? 0.16 : 0.28, ease: easing }}
          onClick={requestClose}
        />
        <section className="services-detail__panel" aria-label={service.title}>
          <div className="services-detail__media">
            <AnimatePresence onExitComplete={finishClose}>
              {!isClosing && (
                <motion.div
                  className="services-detail__image"
                  key={imageLayoutId ?? "service-image-fallback"}
                  layoutId={imageLayoutId}
                  initial={imageLayoutId ? false : { opacity: 0, scale: reduceMotion ? 1 : 1.025 }}
                  animate={imageLayoutId ? undefined : { opacity: 1, scale: 1 }}
                  exit={imageLayoutId ? undefined : { opacity: 0, scale: 1 }}
                  transition={imageLayoutId ? { layout: { duration, ease: easing } } : { duration, ease: easing }}
                >
                  <Image
                    src={image}
                    alt=""
                    fill
                    sizes={imageLayoutId ? "640px" : "(max-width: 900px) 100vw, 560px"}
                    quality={85}
                    priority
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <motion.div
            className="services-detail__info"
            initial={{ opacity: 0 }}
            animate={{ opacity: isClosing ? 0 : 1 }}
            transition={{ duration: reduceMotion ? 0.16 : 0.28, delay: isClosing ? 0 : reduceMotion ? 0 : 0.04, ease: easing }}
          >
            <motion.div
              className="services-detail__copy"
              variants={textContainerVariants}
              initial="hidden"
              animate={isClosing ? "exit" : "visible"}
            >
              <motion.p className="services-detail__label" variants={textItemVariants}>{sectionLabel}</motion.p>
              <motion.p className="services-detail__number" variants={textItemVariants}>{number}</motion.p>
              <motion.h2 id="services-detail-title" variants={textItemVariants}>{service.title}</motion.h2>
              <motion.p className="services-detail__description" id="services-detail-description" variants={textItemVariants}>
                {service.descriptionDesktop}
              </motion.p>
              <motion.div className="services-detail__capabilities" variants={textItemVariants}>
                <h3>{labels.whatWeDo}</h3>
                <ul>
                  {service.capabilities.map((capability) => <li key={capability}>{capability}</li>)}
                </ul>
              </motion.div>
            </motion.div>
            <button className="services-detail__close" type="button" ref={closeRef} onClick={requestClose}>
              {labels.close}
            </button>
          </motion.div>
        </section>
      </div>
    </dialog>
  );
}
