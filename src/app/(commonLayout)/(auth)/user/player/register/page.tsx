import PlayerRegisterForm from "@/components/modules/Player/Register/PlayerRegisterForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Metadata } from "next";
import { getTranslations } from "@/i18n/server";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("auth");
  return {
    title: t("registerPageTitle"),
    description: t("registerPageDescription"),
    robots: { index: true, follow: true },
  };
}

const PlayerRegisterPage = async ({
  searchParams,
}: {
  searchParams?: Promise<{ redirect?: string }>;
}) => {
  const params = await searchParams;
  const t = await getTranslations("auth");

  return (
    <>
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-xl">
          <Card>
            <CardHeader>
              <CardTitle>{t("create.an.account")}</CardTitle>
              <CardDescription>
                {t("enter.your.information.below.to.create.your.account")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PlayerRegisterForm redirect={params?.redirect} />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default PlayerRegisterPage;
