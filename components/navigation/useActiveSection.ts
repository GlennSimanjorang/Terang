"use client";

import { useEffect, useState } from "react";

type NavigationItem = Readonly<{ id: string; label: string }>;

export function useActiveSection(items: readonly NavigationItem[]) {
  const [activeId, setActiveId] = useState("home");

  useEffect(() => {
    const sections = items.flatMap(({ id }) => {
      const section = document.getElementById(id);
      return section ? [{ id, section }] : [];
    });
    const introduction = document.getElementById("introduction");
    const about = sections.find(({ id }) => id === "about");
    if (introduction && about) sections.push({ id: "about", section: introduction });
    sections.sort((a, b) =>
      a.section.compareDocumentPosition(b.section) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1,
    );

    const header = document.querySelector(".site-header");
    const headerHeight = header?.getBoundingClientRect().height ?? 0;
    const observer = new IntersectionObserver((entries) => {
      if (window.scrollY <= 1) {
        setActiveId("home");
        return;
      }

      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
        setActiveId(items.at(-1)?.id ?? "home");
        return;
      }

      const line = header?.getBoundingClientRect().height ?? 0;
      const entering = entries.filter((entry) => entry.isIntersecting && entry.boundingClientRect.top >= line);
      if (entering.length) {
        const targets = new Set(entering.map((entry) => entry.target));
        const target = sections.filter(({ section }) => targets.has(section)).at(-1)?.section;
        setActiveId(sections.find(({ section }) => section === target)?.id ?? "home");
        return;
      }
      const current = [...sections].reverse().find(({ section }) => section.getBoundingClientRect().top <= line + 2);
      setActiveId(current?.id ?? "home");
    }, {
      rootMargin: `-${headerHeight}px 0px -${Math.max(0, window.innerHeight - headerHeight - 2)}px 0px`,
    });

    sections.forEach(({ section }) => observer.observe(section));
    const updateAtEnds = () => {
      if (window.scrollY <= 1) setActiveId("home");
      else if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
        setActiveId(items.at(-1)?.id ?? "home");
      }
    };
    window.addEventListener("scroll", updateAtEnds, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", updateAtEnds);
    };
  }, [items]);

  return activeId;
}
