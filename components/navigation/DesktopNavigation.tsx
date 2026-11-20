"use client";

type NavigationItem = Readonly<{ id: string; label: string }>;

type DesktopNavigationProps = Readonly<{
  items: readonly NavigationItem[];
  label: string;
  activeId: string;
}>;

export function DesktopNavigation({ items, label, activeId }: DesktopNavigationProps) {
  return (
    <nav className="desktop-navigation" aria-label={label}>
      {items.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          aria-current={activeId === item.id ? "location" : undefined}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}
