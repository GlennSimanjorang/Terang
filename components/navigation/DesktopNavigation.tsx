"use client";

import { useEffect, useState } from "react";

type NavigationItem = Readonly<{ id: string; label: string }>;

type DesktopNavigationProps = Readonly<{
  items: readonly NavigationItem[];
  label: string;
}>;

export function DesktopNavigation({ items, label }: DesktopNavigationProps) {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const updateActive = () => setActiveId(window.location.hash.slice(1));
    updateActive();
    window.addEventListener("hashchange", updateActive);
    return () => window.removeEventListener("hashchange", updateActive);
  }, []);

  return (
    <nav className="desktop-navigation" aria-label={label}>
      {items.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          aria-current={activeId === item.id ? "location" : undefined}
          onClick={() => setActiveId(item.id)}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}
