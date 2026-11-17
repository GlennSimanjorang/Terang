import type { ReactNode } from "react";

type ClientLogoPlaceholderProps = Readonly<{
  children: ReactNode;
}>;

export function ClientLogoPlaceholder({ children }: ClientLogoPlaceholderProps) {
  return <div className="clients-trust__logo-placeholder">{children}</div>;
}
