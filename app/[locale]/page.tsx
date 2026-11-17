import { Header } from "@/components/layout/Header";
import { Hero } from "@/sections/Hero";
import { Introduction } from "@/sections/Introduction";
import { Services } from "@/sections/Services";
import { SelectedProjects } from "@/sections/SelectedProjects";
import { Capabilities } from "@/sections/Capabilities";
import { WhyTerang } from "@/sections/WhyTerang";
import { ClientsTrust } from "@/sections/ClientsTrust";
import { ContactCta } from "@/sections/ContactCta";
import { Footer } from "@/sections/Footer";
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
        <SelectedProjects locale={locale} content={dictionary.selectedProjects} />
        <Capabilities locale={locale} content={dictionary.capabilities} />
        <WhyTerang locale={locale} content={dictionary.whyTerang} />
        <ClientsTrust locale={locale} content={dictionary.clientsTrust} />
        <ContactCta locale={locale} content={dictionary.contactCtaSection} buttonLabel={dictionary.hero.contactCta} />
        {dictionary.navigation.items.filter((item) => item.id !== "services" && item.id !== "work" && item.id !== "about" && item.id !== "contact").map((item) => (
          <section
            key={item.id}
            id={item.id}
            className="section-placeholder"
            aria-label={item.label}
          />
        ))}
      </main>
      <Footer locale={locale} dictionary={dictionary} />
    </>
  );
}
