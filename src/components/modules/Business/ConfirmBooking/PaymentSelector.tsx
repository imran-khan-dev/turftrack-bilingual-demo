import { useTranslations } from "next-intl";

interface PaymentSectionProps {
  paymentMode: "FULL" | "TIER" | "LATER";
  setPaymentMode: React.Dispatch<
    React.SetStateAction<"FULL" | "TIER" | "LATER">
  >;
  selectedTier: number | null;
  setSelectedTier: React.Dispatch<React.SetStateAction<number | null>>;
  user: {
    isSpecial?: boolean;
  };
  data: {
    payableAmount: number;
    partialPaymentTier: {
      fullPaymentAvailable: boolean;
      tiers: number[];
    };
  };
}

export function PaymentSection({
  paymentMode,
  setPaymentMode,
  selectedTier,
  setSelectedTier,
  user,
  data,
}: PaymentSectionProps) {
  const t = useTranslations("booking");
  // Check if full payment is explicitly blocked by the business settings
  const isFullPaymentDisabled =
    data.partialPaymentTier?.fullPaymentAvailable === false;

    return (
    <section className="bg-white rounded-[2.5rem] mb-12 md:mb-0 p-8 border border-slate-100 shadow-sm">
      <h2 className="text-xl font-black italic uppercase tracking-tight mb-8">
        {t("paymentOption")}
      </h2>

      <div className="space-y-4">
        {/* FULL PAYMENT */}
        <div
          onClick={() => {
            if (!isFullPaymentDisabled) {
              setPaymentMode("FULL");
            }
          }}
          className={`group rounded-[2rem] border-2 p-6 flex items-center justify-between transition-all ${
            isFullPaymentDisabled
              ? "border-slate-100 bg-slate-50/50 opacity-50 cursor-not-allowed"
              : paymentMode === "FULL"
                ? "border-green-500 bg-green-50/30 shadow-lg cursor-pointer"
                : "border-slate-100 bg-white cursor-pointer"
          }`}
        >
          <div className="flex items-center gap-5">
            <div
              className={`h-12 w-12 rounded-2xl flex items-center justify-center font-black italic text-xl ${
                isFullPaymentDisabled
                  ? "bg-slate-200 text-slate-400"
                  : paymentMode === "FULL"
                    ? "bg-green-500 text-white"
                    : "bg-slate-100 text-slate-400"
              }`}
            >
              ৳
            </div>

            <div>
              <p className="font-black uppercase text-slate-900 tracking-tighter">
                {t("fullPayment")} {" "}
                {isFullPaymentDisabled && (
                  <span className="text-xs text-red-500 font-bold tracking-normal text-slate-400 font-sans normal-case ml-1">
                    ({t("unavailable")})
                  </span>
                )}
              </p>
              <p className="text-[10px] text-slate-400 font-bold uppercase">
                {isFullPaymentDisabled
                  ? t("partialDepositRequired")
                  : t("payEntireAmountNow")}
              </p>
            </div>
          </div>

          <div className="text-right flex items-center gap-4">
            <p className="text-xl font-black italic text-slate-900">
              ৳{data.payableAmount}
            </p>

            <div
              className={`h-6 w-6 rounded-full border-2 flex items-center justify-center ${
                paymentMode === "FULL" && !isFullPaymentDisabled
                  ? "border-green-500 bg-green-500"
                  : "border-slate-200"
              }`}
            >
              {paymentMode === "FULL" && !isFullPaymentDisabled && (
                <div className="h-2 w-2 bg-white rounded-full" />
              )}
            </div>
          </div>
        </div>

        {/* PARTIAL PAYMENT */}
        <div
          className={`rounded-[2rem] border-2 transition-all overflow-hidden ${
            paymentMode === "TIER"
              ? "border-green-500 bg-green-50/30"
              : "border-slate-100 bg-white"
          }`}
        >
          <div
            onClick={() => setPaymentMode("TIER")}
            className="p-6 flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-5">
              <div
                className={`h-12 w-12 rounded-2xl flex items-center justify-center font-black italic text-xl ${
                  paymentMode === "TIER"
                    ? "bg-green-500 text-white"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                %
              </div>

              <div>
                <p className="font-black uppercase text-slate-900 tracking-tighter">
                  {t("partialPayment")}
                </p>
                <p className="text-[10px] text-slate-400 font-bold uppercase">
                  {t("payMinimumTier")}
                </p>
              </div>
            </div>

            <div
              className={`h-6 w-6 rounded-full border-2 flex items-center justify-center ${
                paymentMode === "TIER"
                  ? "border-green-500 bg-green-500"
                  : "border-slate-200"
              }`}
            >
              {paymentMode === "TIER" && (
                <div className="h-2 w-2 bg-white rounded-full" />
              )}
            </div>
          </div>

          {paymentMode === "TIER" && (
            <div className="px-6 pb-8 pt-2 grid grid-cols-2 md:grid-cols-4 gap-3">
              {/*FIX: Mapped out internal .tiers array instead of top-level object */}
              {data.partialPaymentTier?.tiers?.map((tier) => (
                <button
                  key={tier}
                  type="button"
                  onClick={() => setSelectedTier(tier)}
                  className={`rounded-2xl border-2 p-4 text-left cursor-pointer transition-all ${
                    selectedTier === tier
                      ? "border-slate-900 bg-slate-900 text-white shadow-xl"
                      : "border-slate-200 bg-white text-slate-900"
                  }`}
                >
                  <p className="text-[9px] uppercase font-black opacity-60">
                    {t("payNow")}
                  </p>

                  <p className="text-xl font-black italic mt-0.5">৳{tier}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* PAY LATER */}
        {user.isSpecial && (
          <div
            onClick={() => setPaymentMode("LATER")}
            className={`group cursor-pointer rounded-[2rem] border-2 p-6 flex items-center justify-between transition-all ${
              paymentMode === "LATER"
                ? "border-green-500 bg-green-50/30"
                : "border-slate-100 bg-white"
            }`}
          >
            <div className="flex items-center gap-5">
              <div
                className={`h-12 w-12 rounded-2xl flex items-center justify-center font-black italic text-xl ${
                  paymentMode === "LATER"
                    ? "bg-green-500 text-white shadow-lg"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                •
              </div>

              <div>
                <p className="font-black uppercase text-slate-900 tracking-tighter">
                  {t("payLater")}
                </p>

                <p className="text-[10px] text-slate-400 font-bold uppercase italic tracking-widest">
                  {t("vipPrivilege")}
                </p>
              </div>
            </div>

            <div
              className={`h-6 w-6 rounded-full border-2 flex items-center justify-center ${
                paymentMode === "LATER"
                  ? "border-green-500 bg-green-500"
                  : "border-slate-200"
              }`}
            >
              {paymentMode === "LATER" && (
                <div className="h-2 w-2 bg-white rounded-full" />
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
