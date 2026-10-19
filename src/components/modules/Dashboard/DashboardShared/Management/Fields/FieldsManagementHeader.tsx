/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import ManagementPageHeader from "@/components/shared/ManagementPageHeader";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import AddFieldFormDialog from "./AddFieldFormDialog";
import { useTranslations } from "next-intl";

const FieldsManagementHeader = ({ businesses, ownerView = false }: { businesses: any; ownerView?: boolean }) => {
  const t = useTranslations("owner.management");
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
      <AddFieldFormDialog
        key={dialogKey}
        open={isDialogOpen}
        onClose={handleCloseDialog}
        onSuccess={handleSuccess}
        businesses={businesses}
        ownerView={ownerView}
      />

      <ManagementPageHeader
        title={ownerView ? t("fieldsTitle") : "Fields Management"}
        description={ownerView ? t("fieldsDescription") : "Manage fields information and details"}
        action={{
          label: ownerView ? t("addField") : "Add Field",
          icon: Plus,
          onClick: handleOpenDialog,
        }}
      />
    </>
  );
};

export default FieldsManagementHeader;
