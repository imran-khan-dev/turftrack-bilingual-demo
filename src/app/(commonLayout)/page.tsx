import HeroSection from "@/components/modules/Home/HeroSection";
import HowItWorksSection from "@/components/modules/Home/HowItWorksSection";
import FeaturesSection from "@/components/modules/Home/FeaturesSection";
import ProductShowcaseSection from "@/components/modules/Home/ProductShowcaseSection";
import BookingExperienceSection from "@/components/modules/Home/BookingExperienceSection";
import MobileAppSection from "@/components/modules/Home/MobileAppSection";
import PricingSection from "@/components/modules/Home/PricingSection";
import WhyTurfTrackSection from "@/components/modules/Home/WhyTurfTrackSection";
import FAQSection from "@/components/modules/Home/FAQSection";
import FinalCTASection from "@/components/modules/Home/FinalCTASection";
import AboutSection from "@/components/modules/Home/AboutSection";
import { getTranslations } from "@/i18n/server";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata.home");
  return {
    title: t("title"),
    description: t("description"),
    openGraph: { title: t("socialTitle"), description: t("socialDescription"), type: "website" },
    twitter: { card: "summary_large_image", title: t("socialTitle"), description: t("socialDescription") },
  };
}

export default function Home() {
  return (
    <main className="w-full bg-white text-slate-900 overflow-x-hidden">
      {/* 1. Hero */}
      <HeroSection />

      <AboutSection />

      {/* 2. How It Works (id="how-it-works") */}
      <HowItWorksSection />

      {/* 3. Features (id="features") */}
      <FeaturesSection />

      {/* 4. Product Showcase */}
      <ProductShowcaseSection />

      {/* 5. Customer Booking Experience */}
      <BookingExperienceSection />

      {/* 6. Mobile App */}
      <MobileAppSection />

      {/* 7. Pricing (id="pricing") */}
      <PricingSection />

      {/* 8. Why Turf Track */}
      <WhyTurfTrackSection />

      {/* 9. FAQ (id="faq") */}
      <FAQSection />

      {/* 10. Final CTA */}
      <FinalCTASection />
    </main>
  );
}
