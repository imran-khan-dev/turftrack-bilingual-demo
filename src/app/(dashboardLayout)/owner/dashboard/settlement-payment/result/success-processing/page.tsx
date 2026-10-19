/* eslint-disable @typescript-eslint/no-explicit-any */

interface SuccessPageProps {
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

export default async function SuccessProcessingPage({
  searchParams,
}: SuccessPageProps) {
  const { trnxId } = await searchParams;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <h1 className="text-2xl font-bold text-green-600">
        Success Debt Settled
      </h1>
      {trnxId && (
        <p className="mt-2 text-sm text-gray-600">
          Transaction ID:{" "}
          <span className="font-mono text-gray-900">{trnxId}</span>
        </p>
      )}
    </main>
  );
}
import { getTranslations } from "@/i18n/server";
