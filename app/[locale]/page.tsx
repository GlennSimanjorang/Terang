import { Header } from "@/components/layout/Header";
import { Hero } from "@/sections/Hero";
import { Introduction } from "@/sections/Introduction";
import { Services } from "@/sections/Services";
import { getDictionary } from "@/lib/i18n";
import { isLocale } from "@/types/i18n";
import { notFound } from "next/navigation";

type PageProps = Readonly<{
  params: Promise<{ locale: string }>;
}>;

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dictionary = getDictionary(locale);

  return (
    <>
      <Header locale={locale} dictionary={dictionary} />
      <main id="main-content" className="navigation-stage">
        <Hero locale={locale} content={dictionary.hero} />
        <Introduction locale={locale} content={dictionary.introduction} />
        <Services locale={locale} content={dictionary.services} />
        {dictionary.navigation.items.filter((item) => item.id !== "services").map((item) => (
          <section
            key={item.id}
            id={item.id}
            className="section-placeholder"
            aria-label={item.label}
          />
        ))}
      </main>
    </>
  );
}
