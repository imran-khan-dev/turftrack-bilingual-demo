"use client";

import { logoutUser } from "@/services/auth/logout";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";

const LogoutButton = () => {
  const t = useTranslations("auth");
  const handleLogout = async () => {
    await logoutUser();
  };
  return (
    <Button variant={"destructive"} onClick={handleLogout}>
      {t("logout")}
    </Button>
  );
};

export default LogoutButton;
