"use client";

import ManagementPageHeader from "@/components/shared/ManagementPageHeader";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import PromoFormDialog from "./PromoFormDialog";
import { useTranslations } from "next-intl";

const PromoManagementHeader = () => {
  const t = useTranslations("owner.promo");
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSuccess = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  //force remount to reset state of form
  const [dialogKey, setDialogKey] = useState(0);

  const handleOpenDialog = () => {
    setDialogKey((prev) => prev + 1); // Force remount
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <>
      <PromoFormDialog
        key={dialogKey}
        open={isDialogOpen}
        onClose={handleCloseDialog}
        onSuccess={handleSuccess}
      />

      <ManagementPageHeader
        title={t("headerTitle")}
        description={t("headerDescription")}
        action={{
          label: t("addPromo"),
          icon: Plus,
          onClick: handleOpenDialog,
        }}
      />
    </>
  );
};

export default PromoManagementHeader;
