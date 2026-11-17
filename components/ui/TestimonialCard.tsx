type TestimonialCardProps = Readonly<{
  quoteLabel: string;
  quote: string;
  attribution: string;
}>;

export function TestimonialCard({ quoteLabel, quote, attribution }: TestimonialCardProps) {
  return (
    <figure className="clients-trust__testimonial">
      <p className="clients-trust__quote-label">{quoteLabel}</p>
      <blockquote className="clients-trust__quote">{quote}</blockquote>
      <figcaption className="clients-trust__attribution">{attribution}</figcaption>
    </figure>
  );
}
