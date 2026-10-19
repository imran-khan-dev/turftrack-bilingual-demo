import {
  CalendarCheck,
  UserCheck,
  Clock,
  Layers,
  CircleDollarSign,
  CreditCard,
  BarChart3,
  Smartphone,
  Sparkles,
} from "lucide-react";
import { useTranslations } from "next-intl";

const featureGroups = [
  {
    category: "booking",
    features: [
      {
        name: "onlineWalkIn",
        icon: CalendarCheck,
        desc: "onlineWalkInDescription",
      },
      {
        name: "availability",
        icon: Clock,
        desc: "availabilityDescription",
      },
      {
        name: "cancellations",
        icon: UserCheck,
        desc: "cancellationsDescription",
      },
    ],
  },
  {
    category: "fieldPricing",
    features: [
      {
        name: "multipleFields",
        icon: Layers,
        desc: "multipleFieldsDescription",
      },
      {
        name: "dynamicRates",
        icon: CircleDollarSign,
        desc: "dynamicRatesDescription",
      },
    ],
  },
  {
    category: "financeOps",
    features: [
      {
        name: "payments",
        icon: CreditCard,
        desc: "paymentsDescription",
      },
      {
        name: "analytics",
        icon: BarChart3,
        desc: "analyticsDescription",
      },
    ],
  },
  {
    category: "customerExperience",
    features: [
      {
        name: "publicPage",
        icon: Smartphone,
        desc: "publicPageDescription",
      },
      {
        name: "confirmations",
        icon: Sparkles,
        desc: "confirmationsDescription",
      },
    ],
  },
];

export default function FeaturesSection() {
  const t = useTranslations("marketing.features");
  return (
    <section
      id="features"
      className="py-20 md:py-28 bg-slate-900 text-white scroll-mt-20"
    >
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            {t("badge")}
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-3">
            {t("title")}
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-400">
            {t("description")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {featureGroups.map((group) => (
            <div
              key={group.category}
              className="bg-slate-950/60 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-6 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  {t(group.category)}
                </h3>
                <div className="space-y-5">
                  {group.features.map((feat) => {
                    const Icon = feat.icon;
                    return (
                      <div key={feat.name} className="flex gap-4 items-start">
                        <div className="h-9 w-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 shrink-0">
                          <Icon className="w-4 h-4 text-emerald-400" />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-slate-100">
                            {t(feat.name)}
                          </h4>
                          <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                            {t(feat.desc)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
