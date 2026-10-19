import { Business } from "@/types/business";
import { useTranslations } from "next-intl";

interface BusinessInfoSectionProps {
  business: Business;
}

const BusinessInfoSection = ({ business }: BusinessInfoSectionProps) => {
  const t = useTranslations("booking");
  return (
    <section className="mt-14">
      <div className="flex items-center gap-4 mb-10">
        <div className="h-14 w-2 rounded-full bg-green-500 shrink-0" />
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
            {t("youAreViewing")}
          </p>
          <h1 className="text-4xl sm:text-5xl font-black italic uppercase tracking-tighter text-slate-900 leading-[0.95]">
            {business.name}
          </h1>
        </div>
      </div>

      <h2 className="text-3xl font-black italic tracking-tighter mb-6 uppercase">
        {t("turfInfo")}
      </h2>

      <div className="space-y-4">
        {/* ABOUT */}
        <details className="group bg-white border-2 border-slate-100 rounded-4xl overflow-hidden hover:border-slate-200 transition-all">
          <summary className="list-none cursor-pointer px-7 py-6 flex items-center justify-between">
            <div>
              <p className="text-lg font-black italic uppercase tracking-tight text-slate-900">
                {t("about")}
              </p>
              <p className="text-[10px] font-bold uppercase text-slate-400 mt-1">
                {t("quickOverview")}
              </p>
            </div>

            <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-open:rotate-45 transition-transform duration-300">
              +
            </div>
          </summary>

          <div className="px-7 pb-7">
            <div className="h-px bg-slate-100 mb-6" />
            <p className="text-sm leading-7 text-slate-600 font-medium">
              {business.aboutDesc || t("noDescriptionProvided")}
            </p>
          </div>
        </details>

        {/* FACILITIES */}
        <details className="group bg-white border-2 border-slate-100 rounded-4xl overflow-hidden hover:border-slate-200 transition-all">
          <summary className="list-none cursor-pointer px-7 py-6 flex items-center justify-between">
            <div>
              <p className="text-lg font-black italic uppercase tracking-tight text-slate-900">
                {t("facilities")}
              </p>
              <p className="text-[10px] font-bold uppercase text-slate-400 mt-1">
                {t("whatWeOffer")}
              </p>
            </div>

            <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-open:rotate-45 transition-transform duration-300">
              +
            </div>
          </summary>

          <div className="px-7 pb-7">
            <div className="h-px bg-slate-100 mb-6" />

            <div className="flex flex-wrap gap-3">
              {business.features?.map((feature) => (
                <span
                  key={feature.title}
                  className="px-4 py-2 rounded-full bg-slate-100 text-[11px] font-black uppercase tracking-wide text-slate-700"
                >
                  {feature.title.toUpperCase()}
                </span>
              ))}
            </div>
          </div>
        </details>

        {/* CONTACT */}
        <details className="group bg-white border-2 border-slate-100 rounded-4xl overflow-hidden hover:border-slate-200 transition-all">
          <summary className="list-none cursor-pointer px-7 py-6 flex items-center justify-between">
            <div>
              <p className="text-lg font-black italic uppercase tracking-tight text-slate-900">
                {t("contactLocation")}
              </p>
              <p className="text-[10px] font-bold uppercase text-slate-400 mt-1">
                {t("reachOutDirections")}
              </p>
            </div>

            <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-open:rotate-45 transition-transform duration-300">
              +
            </div>
          </summary>

          <div className="px-7 pb-7">
            <div className="h-px bg-slate-100 mb-6" />

            <div className="space-y-4">
              <a
                href={`tel:${business.contactNumber}`}
                className="flex items-center justify-between rounded-2xl border border-slate-100 px-5 py-4 hover:border-slate-200 transition-all"
              >
                <div>
                  <p className="text-[10px] uppercase font-black text-slate-400">
                    {t("phone")}
                  </p>
                  <p className="font-bold text-slate-900">
                    {business.contactNumber || t("noPhoneNumberProvided")}
                  </p>
                </div>

                <span className="text-xs font-black uppercase text-green-600">
                  {t("call")}
                </span>
              </a>

              <a
                href={business.googleMapLink || "https://maps.google.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-2xl border border-slate-100 px-5 py-4 hover:border-slate-200 transition-all"
              >
                <div>
                  <p className="text-[10px] uppercase font-black text-slate-400">
                    {t("location")}
                  </p>
                  <p className="font-bold text-slate-900">
                    {business.location || t("noLocationProvided")}
                  </p>
                </div>

                <span className="text-xs font-black uppercase text-green-600">
                  {t("open")}
                </span>
              </a>

              <div className="flex gap-3 pt-2">
                <a
                  href={business.facebookLink || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 rounded-2xl bg-slate-100 hover:bg-slate-200 transition-all py-4 text-center text-[11px] font-black uppercase tracking-wide text-slate-700"
                >
                  {t("facebook")}
                </a>

                <a
                  href={business.instagramLink || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 rounded-2xl bg-slate-100 hover:bg-slate-200 transition-all py-4 text-center text-[11px] font-black uppercase tracking-wide text-slate-700"
                >
                  {t("instagram")}
                </a>
              </div>
            </div>
          </div>
        </details>

        {/* TERMS — unchanged, still driven by business.businessTerms */}
        <details className="group bg-white border-2 border-slate-100 rounded-4xl overflow-hidden hover:border-slate-200 transition-all">
          <summary className="list-none cursor-pointer px-7 py-6 flex items-center justify-between">
            <div>
              <p className="text-lg font-black italic uppercase tracking-tight text-slate-900">
                {t("termsConditions")}
              </p>
              <p className="text-[10px] font-bold uppercase text-slate-400 mt-1">
                {t("termsConditionsOfBusiness", { businessName: business.name })}
              </p>
            </div>

            <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-open:rotate-45 transition-transform duration-300">
              +
            </div>
          </summary>

          <div className="px-7 pb-7">
            <div className="h-px bg-slate-100 mb-6" />

            <ul className="space-y-4">
              {business.businessTerms?.map((term) => (
                <li
                  key={term.id}
                  className="flex gap-3 text-sm text-slate-600 leading-6"
                >
                  <span className="mt-2 h-2 w-2 rounded-full bg-green-500 shrink-0" />
                  <span>{term.title}</span>
                </li>
              ))}
            </ul>
          </div>
        </details>

        {/* REFUND, CANCELLATION & RESCHEDULE POLICY */}
        <details className="group bg-white border-2 border-slate-100 rounded-4xl overflow-hidden hover:border-slate-200 transition-all">
          <summary className="list-none cursor-pointer px-7 py-6 flex items-center justify-between">
            <div>
              <p className="text-lg font-black italic uppercase tracking-tight text-slate-900">
                {t("refundPolicy")}
              </p>
              <p className="text-[10px] font-bold uppercase text-slate-400 mt-1">
                {t("refundPolicyOfBusiness", { businessName: business.name })}
              </p>
            </div>

            <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-open:rotate-45 transition-transform duration-300">
              +
            </div>
          </summary>

          <div className="px-7 pb-7">
            <div className="h-px bg-slate-100 mb-6" />

            <ul className="space-y-4">
              {/* Cancellation */}
              <li className="flex gap-3 text-sm text-slate-600 leading-6">
                <span
                  className={`mt-2 h-2 w-2 rounded-full shrink-0 ${
                    business.allowPlayerCancel ? "bg-green-500" : "bg-slate-300"
                  }`}
                />
                <span>
                  {business.allowPlayerCancel ? (
                    <>
                      {t.rich("cancellationsAllowed", {
                        hours: business.cancelWindowHours,
                        strong: (chunks) => <strong>{chunks}</strong>,
                      })}
                    </>
                  ) : (
                    t("cancellationsNotAllowed")
                  )}
                </span>
              </li>

              {/* Reschedule */}
              <li className="flex gap-3 text-sm text-slate-600 leading-6">
                <span
                  className={`mt-2 h-2 w-2 rounded-full shrink-0 ${
                    business.allowPlayerReschedule
                      ? "bg-green-500"
                      : "bg-slate-300"
                  }`}
                />
                <span>
                  {business.allowPlayerReschedule ? (
                    <>
                      {t.rich("reschedulesAllowed", {
                        hours: business.rescheduleWindowHours,
                        strong: (chunks) => <strong>{chunks}</strong>,
                      })}
                      {business.rescheduleLimitCount ? (
                        <>
                          {t.rich("rescheduleLimit", {
                            count: business.rescheduleLimitCount,
                            strong: (chunks) => <strong>{chunks}</strong>,
                          })}
                        </>
                      ) : null}
                      .
                    </>
                  ) : (
                    t("reschedulingNotAllowed")
                  )}
                </span>
              </li>

              {/* Refund */}
              <li className="flex gap-3 text-sm text-slate-600 leading-6">
                <span
                  className={`mt-2 h-2 w-2 rounded-full shrink-0 ${
                    business.refundAllowed ? "bg-green-500" : "bg-slate-300"
                  }`}
                />
                <span>
                  {business.refundAllowed ? (
                    <>
                      {t.rich("eligibleCancellationRefund", {
                        percent: business.refundPercent,
                        strong: (chunks) => <strong>{chunks}</strong>,
                      })}
                    </>
                  ) : (
                    t("refundsNotAvailable")
                  )}
                </span>
              </li>
            </ul>
          </div>
        </details>
      </div>
    </section>
  );
};

export default BusinessInfoSection;
