import type { ReactNode } from "react";

type HandwrittenAnnotationProps = Readonly<{
  children: ReactNode;
  className?: string;
}>;

export function HandwrittenAnnotation({ children, className = "" }: HandwrittenAnnotationProps) {
  return (
    <span className={`handwritten-annotation ${className}`} aria-hidden="true">
      {children}
    </span>
  );
}
