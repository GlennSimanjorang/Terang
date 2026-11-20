
"use client";

import Image from "next/image";
import { motion, useMotionValue } from "motion/react";
import React, { useRef } from "react";

type HeroMediaProps = Readonly<{
  imageAlt: string;
  annotationDesktop: string;
  annotationTablet: string;
  annotationMobile: string;
}>;

export function HeroMedia({
  imageAlt,
  annotationDesktop,
  annotationTablet,
  annotationMobile,
}: HeroMediaProps) {
  const zoom = useMotionValue(1);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinchStart = useRef<{ distance: number; zoom: number } | null>(null);

  const distance = () => {
    const [first, second] = [...pointers.current.values()];
    return first && second ? Math.hypot(first.x - second.x, first.y - second.y) : 0;
  };

  const startPinch = () => {
    const currentDistance = distance();
    pinchStart.current = currentDistance > 0 ? { distance: currentDistance, zoom: zoom.get() } : null;
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "touch") return;
    event.currentTarget.setPointerCapture(event.pointerId);
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointers.current.size === 2) startPinch();
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!pointers.current.has(event.pointerId)) return;
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointers.current.size < 2 || !pinchStart.current) return;
    const currentDistance = distance();
    if (!currentDistance) return;
    zoom.set(Math.min(2, Math.max(1, pinchStart.current.zoom * currentDistance / pinchStart.current.distance)));
  };

  const handlePointerEnd = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!pointers.current.delete(event.pointerId)) return;
    if (pointers.current.size >= 2) startPinch();
    else pinchStart.current = null;
  };

  return (
    <figure className="hero__media">
      <div
        className="hero__image-zoom"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
      >
        <motion.div className="hero__image-zoom-content" style={{ scale: zoom }}>
          <picture>
            <source
              media="(max-width: 480px)"
              srcSet="/assets/hero/terang-hero-placeholder-mobile.webp"
            />
            <source
              media="(max-width: 900px)"
              srcSet="/assets/hero/terang-hero-placeholder-tablet.webp"
            />
            <Image
              src="/assets/hero/terang-hero-placeholder-desktop.webp"
              alt={imageAlt}
              width={1280}
              height={1024}
              sizes="(max-width: 480px) calc(100vw - 40px), (max-width: 900px) calc(100vw - 64px), 600px"
              quality={82}
              loading="eager"
              fetchPriority="high"
            />
          </picture>
        </motion.div>
      </div>

      <span className="hero__annotation" aria-hidden="true">
        <span className="hero__annotation-desktop">{annotationDesktop}</span>
        <span className="hero__annotation-tablet">{annotationTablet}</span>
        <span className="hero__annotation-mobile">{annotationMobile}</span>
      </span>

      <span className="hero__beam hero__beam--one" aria-hidden="true" />
      <span className="hero__beam hero__beam--two" aria-hidden="true" />
    </figure>
  );
}
