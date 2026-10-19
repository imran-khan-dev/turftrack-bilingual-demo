import { ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";

interface Business {
  contactNumber?: string;
  googleMapLink?: string;
  location?: string;
}

interface BusinessAccessDeniedProps {
  business: Business;
}

const BusinessAccessDenied = ({ business }: BusinessAccessDeniedProps) => {
  const t = useTranslations("booking");
  return (
    <div className="container mx-auto px-6 py-12">
      <div className="relative overflow-hidden rounded-[3rem] border border-red-100 bg-white shadow-sm">
        {/* glow */}
        <div className="absolute -top-20 -right-20 h-52 w-52 rounded-full bg-red-500/10 blur-3xl" />

        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 p-8 lg:p-12">
          {/* LEFT */}
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 mb-6">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />

              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-600">
                {t("accessRestricted")}
              </span>
            </div>

            <h1 className="text-4xl lg:text-6xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">
              {t("accessDenied")}
            </h1>

            <p className="mt-6 max-w-xl text-sm lg:text-base leading-7 text-slate-500 font-medium">
              {t("businessAccessDeniedDescription")}
            </p>

            <div className="mt-10 space-y-4">
              {/* PHONE */}
              <a
                href={`tel:${business.contactNumber}`}
                className="group flex items-center justify-between rounded-[1.8rem] border border-slate-200 bg-slate-50/70 px-5 py-5 transition-all hover:border-green-300 hover:bg-white"
              >
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    {t("contactBusiness")}
                  </p>

                  <p className="mt-1 text-lg font-black tracking-tight text-slate-900">
                    {business.contactNumber || t("noNumberAvailable")}
                  </p>
                </div>

                <div className="h-12 w-12 rounded-2xl bg-green-500 flex items-center justify-center text-white shadow-lg shadow-green-500/20 group-hover:scale-105 transition-transform">
                  {t("call")}
                </div>
              </a>

              {/* MAP */}
              <a
                href={business.googleMapLink || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between rounded-[1.8rem] border border-slate-200 bg-slate-50/70 px-5 py-5 transition-all hover:border-slate-300 hover:bg-white"
              >
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    {t("turfLocation")}
                  </p>

                  <p className="mt-1 text-lg font-black tracking-tight text-slate-900">
                    {business.location || t("locationUnavailable")}
                  </p>
                </div>

                <div className="h-12 w-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
                  {t("map")}
                </div>
              </a>
            </div>
          </div>

          {/* RIGHT VISUAL */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative flex items-center justify-center h-52 w-52 rounded-[3rem] bg-red-50 border border-red-100">
              <div className="absolute inset-6 rounded-[2rem] border border-red-200 border-dashed" />

              <div className="relative z-10 flex h-24 w-24 items-center justify-center rounded-[2rem] bg-red-500 shadow-[0_20px_50px_rgba(239,68,68,0.35)]">
                <ShieldCheck size={42} className="text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessAccessDenied;
