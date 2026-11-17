type HandwrittenUnderlineProps = Readonly<{ className?: string }>;

export function HandwrittenUnderline({ className = "" }: HandwrittenUnderlineProps) {
  return (
    <span className={`handwritten-underline ${className}`} aria-hidden="true">
      <span className="handwritten-underline__main" />
      <span className="handwritten-underline__tail" />
    </span>
  );
}
