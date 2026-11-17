"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

type IntroductionImageProps = Readonly<{ annotation: string }>;

export function IntroductionImage({ annotation }: IntroductionImageProps) {
  const imageRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: imageRef,
    offset: ["start end", "end start"],
  });
  const prefersReducedMotion = useReducedMotion();
  const scale = useTransform(scrollYProgress, [0, 1], [1, prefersReducedMotion ? 1 : 1.1]);

  return (
    <figure ref={imageRef} className="introduction__image">
      <motion.div className="introduction__image-frame" style={{ scale }}>
        <Image
          src="/assets/introduction/introduction-production-figma.png"
          alt=""
          width={1280}
          height={1024}
          sizes="(max-width: 480px) calc(100vw - 40px), (max-width: 1100px) calc(100vw - 64px), 560px"
          quality={80}
          loading="lazy"
        />
      </motion.div>
      <span className="introduction__annotation" aria-hidden="true">
        {annotation}
      </span>
    </figure>
  );
}
