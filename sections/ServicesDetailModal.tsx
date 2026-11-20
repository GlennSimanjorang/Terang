"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
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
  const reduceMotion = useReducedMotion();
  const duration = reduceMotion ? 0.16 : 0.4;

  const textItemVariants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 9 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduceMotion ? 0.16 : 0.28, ease: easing },
    },
    exit: {
      opacity: 0,
      y: reduceMotion ? 0 : 4,
      transition: { duration: reduceMotion ? 0.12 : 0.18, ease: easing },
    },
  };
  const textContainerVariants = {
    hidden: {},
    visible: {
      transition: {
        delayChildren: reduceMotion ? 0 : 0.14,
        staggerChildren: reduceMotion ? 0 : 0.055,
      },
    },
    exit: {
      transition: {
        staggerChildren: reduceMotion ? 0 : 0.025,
        staggerDirection: -1 as const,
      },
    },
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

  return (
    <dialog
      ref={dialogRef}
      className={`services-detail services-detail--${locale}`}
      aria-modal="true"
      aria-labelledby="services-detail-title"
      aria-describedby="services-detail-description"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      <div className="services-detail__contents">
        {/* Backdrop — fades in on open, fades out on close */}
        <motion.div
          className="services-detail__backdrop"
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0.16 : 0.22, ease: easing }}
          onClick={onClose}
        />

        {/*
         * Panel shell — background, border, and shadow fade to transparent on exit so the
         * shared-layout image can fly back to its card unobstructed, with no dark
         * rectangle remaining on screen.
         */}
        <motion.section
          className="services-detail__panel"
          aria-label={service.title}
          initial={{
            backgroundColor: "rgb(16, 16, 16)",
            borderColor: "rgb(51, 51, 51)",
            boxShadow: "0 24px 80px rgba(0, 0, 0, 0.42)",
          }}
          animate={{
            backgroundColor: "rgb(16, 16, 16)",
            borderColor: "rgb(51, 51, 51)",
            boxShadow: "0 24px 80px rgba(0, 0, 0, 0.42)",
          }}
          exit={{
            backgroundColor: "rgba(16, 16, 16, 0)",
            borderColor: "rgba(51, 51, 51, 0)",
            boxShadow: "0 24px 80px rgba(0, 0, 0, 0)",
          }}
          transition={{ duration: reduceMotion ? 0.1 : 0.22, ease: easing }}
        >
          {/* Media area — stays opaque during exit so layoutId image can animate */}
          <div className="services-detail__media">
            <motion.div
              className="services-detail__image"
              key={imageLayoutId ?? "service-image-fallback"}
              layoutId={imageLayoutId}
              initial={imageLayoutId ? false : { opacity: 0, scale: reduceMotion ? 1 : 1.025 }}
              animate={imageLayoutId ? undefined : { opacity: 1, scale: 1 }}
              exit={imageLayoutId ? undefined : { opacity: 0, scale: 1 }}
              transition={
                imageLayoutId
                  ? { layout: { duration, ease: easing } }
                  : { duration, ease: easing }
              }
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
          </div>

          {/* Info panel — fades out on close */}
          <motion.div
            className="services-detail__info"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: reduceMotion ? 0.16 : 0.18,
              ease: easing,
            }}
          >
            <motion.div
              className="services-detail__copy"
              variants={textContainerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.p className="services-detail__label" variants={textItemVariants}>
                {sectionLabel}
              </motion.p>
              <motion.p className="services-detail__number" variants={textItemVariants}>
                {number}
              </motion.p>
              <motion.h2 id="services-detail-title" variants={textItemVariants}>
                {service.title}
              </motion.h2>
              <motion.p
                className="services-detail__description"
                id="services-detail-description"
                variants={textItemVariants}
              >
                {service.descriptionDesktop}
              </motion.p>
              <motion.div className="services-detail__capabilities" variants={textItemVariants}>
                <h3>{labels.whatWeDo}</h3>
                <ul>
                  {service.capabilities.map((capability) => (
                    <li key={capability}>{capability}</li>
                  ))}
                </ul>
              </motion.div>
            </motion.div>
            <button
              className="services-detail__close"
              type="button"
              ref={closeRef}
              onClick={onClose}
            >
              {labels.close}
            </button>
          </motion.div>
        </motion.section>
      </div>
    </dialog>
  );
}
