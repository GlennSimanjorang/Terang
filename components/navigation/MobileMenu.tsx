"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { LanguageSwitcher } from "@/components/navigation/LanguageSwitcher";
import type { getDictionary } from "@/lib/i18n";
import type { Locale } from "@/types/i18n";

type Dictionary = ReturnType<typeof getDictionary>;

type MobileMenuProps = Readonly<{
  locale: Locale;
  dictionary: Dictionary;
}>;

export function MobileMenu({ locale, dictionary }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      dialog.showModal();
      requestAnimationFrame(() => firstLinkRef.current?.focus());
      return () => {
        document.body.style.overflow = previousOverflow;
      };
    }

    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  return (
    <>
      <button
        className="menu-trigger"
        type="button"
        aria-label={dictionary.navigation.openMenu}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        onClick={() => setIsOpen(true)}
      >
        <span className="menu-trigger__label">Menu</span>
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
          <path d="M3 7h18M3 17h18" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>
      <dialog
        ref={dialogRef}
        id="mobile-menu"
        className="mobile-menu"
        aria-labelledby="mobile-menu-heading"
        onCancel={() => setIsOpen(false)}
        onClose={() => setIsOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setIsOpen(false);
        }}
      >
        <div className="mobile-menu__inner">
          <div className="mobile-menu__topbar">
            <Link className="wordmark" href={`/${locale}`} onClick={() => setIsOpen(false)}>
              TERANG<span aria-hidden="true">.</span>
            </Link>
            <button
              className="menu-close"
              type="button"
              aria-label={dictionary.navigation.closeMenu}
              onClick={() => setIsOpen(false)}
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
                <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>
          </div>
          <div className="mobile-menu__content">
            <h2 id="mobile-menu-heading" className="mobile-menu__heading">
              {dictionary.navigation.menuHeading}
            </h2>
            <nav aria-label={dictionary.navigation.label}>
              <ol className="mobile-menu__links">
                {dictionary.navigation.items.map((item, index) => (
                  <li key={item.id}>
                    <a
                      ref={index === 0 ? firstLinkRef : undefined}
                      href={`#${item.id}`}
                      onClick={() => setIsOpen(false)}
                    >
                      <span className="mobile-menu__number" aria-hidden="true">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span>{item.label}</span>
                      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
                        <path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </div>
          <div className="mobile-menu__footer">
            <LanguageSwitcher
              locale={locale}
              dictionary={dictionary}
              onNavigate={() => setIsOpen(false)}
            />
            <p>{dictionary.navigation.tagline}</p>
          </div>
        </div>
      </dialog>
    </>
  );
}
