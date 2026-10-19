import FailedClientView from "./FailedBookingClient";
import { getTranslations } from "@/i18n/server";
interface PageProps {
  searchParams: Promise<{
    trnxId?: string;
    message?: string;
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

export default async function FailedPage({ searchParams }: PageProps) {
  const { trnxId, message } = await searchParams;
  return <FailedClientView trnxId={trnxId} message={message} />;
}
