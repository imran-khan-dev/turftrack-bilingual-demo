import ValidateZiniDebtSettlementClient from "./ValidateZiniPaymentClient";
import { getTranslations } from "@/i18n/server";

interface Props {
  searchParams: Promise<{
    invoiceId?: string | null;
  }>;
}

export async function generateMetadata() {
  const t = await getTranslations("owner.metadata");
  return {
    title: t("settlementTitle"),
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function ValidateZiniPaymentPage({ searchParams }: Props) {
  const { invoiceId } = await searchParams;
  const t = await getTranslations("owner.settlement");

  /**
   * ZiniPay redirects with invoiceId.
   * This is required to verify the payment.
   */
  if (!invoiceId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-6">
        <div className="relative w-full max-w-2xl overflow-hidden rounded-[3rem] border border-slate-100 bg-white p-10 text-center shadow-xl md:p-14">
          <div className="absolute right-0 top-0 -mr-24 -mt-24 h-52 w-52 rounded-full bg-amber-500/5 blur-3xl" />

          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-amber-500">
            {t("paymentError")}
          </p>

          <h1 className="mt-4 text-4xl font-black italic tracking-tight text-slate-900 md:text-6xl">
            {t("invoiceNotFound")}
          </h1>

          <p className="mx-auto mt-5 max-w-lg font-medium leading-relaxed text-slate-500">
            {t("invoiceNotFoundDescription")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-6">
      <ValidateZiniDebtSettlementClient invoiceId={invoiceId} />
    </div>
  );
}
