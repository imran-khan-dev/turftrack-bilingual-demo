import CancelClientView from "./CancelDebtSettleClient";
import { getTranslations } from "@/i18n/server";

interface PageProps {
  searchParams: Promise<{
    trnxId?: string;
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

export default async function DebtSettleCancelPage({
  searchParams,
}: PageProps) {
  const { trnxId } = await searchParams;
  return <CancelClientView trnxId={trnxId} />;
}
