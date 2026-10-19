"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

const LogoutSuccessToast = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const t = useTranslations("auth");

  useEffect(() => {
    if (searchParams.get("loggedOut") === "true") {
      toast.success(t("logoutSuccess"));

      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete("loggedOut");
      router.replace(newUrl.toString());
    }
  }, [searchParams, router, t]);
  return null;
};

export default LogoutSuccessToast;
