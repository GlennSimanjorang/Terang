type HandwrittenArrowProps = Readonly<{
  className?: string;
}>;

export function HandwrittenArrow({ className = "" }: HandwrittenArrowProps) {
  return (
    <span className={`handwritten-arrow ${className}`} aria-hidden="true">
      <span className="handwritten-arrow__diagonal-wrap">
        <span className="handwritten-arrow__diagonal" />
      </span>
      <span className="handwritten-arrow__head-horizontal" />
      <span className="handwritten-arrow__head-vertical" />
    </span>
  );
}
