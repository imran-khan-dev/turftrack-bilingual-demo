import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useTranslations } from "next-intl";

const faqs = [1, 2, 3, 4, 5, 6] as const;

export default function FAQSection() {
  const t = useTranslations("marketing.faq");
  return (
    <section id="faq" className="py-20 md:py-28 bg-slate-50/50 scroll-mt-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            {t("badge")}
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
            {t("title")}
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-500">
            {t("description")}
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-3">
          {faqs.map((faq, idx) => (
            <AccordionItem
              key={idx}
              value={`item-${idx}`}
              className="bg-white border border-slate-200/80 rounded-xl px-5 py-1 shadow-2xs"
            >
              <AccordionTrigger className="text-xs sm:text-sm font-bold text-slate-900 hover:no-underline hover:text-emerald-600">
                {t(`q${faq}`)}
              </AccordionTrigger>
              <AccordionContent className="text-xs text-slate-500 leading-relaxed pt-1 pb-3">
                {t(`a${faq}`)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
