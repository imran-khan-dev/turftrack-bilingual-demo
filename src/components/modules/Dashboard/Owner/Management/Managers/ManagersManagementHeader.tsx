/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import ManagementPageHeader from "@/components/shared/ManagementPageHeader";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import ManagerFormDialog from "./ManagerFormDialog";
import { useTranslations } from "next-intl";

const ManagersManagementHeader = ({ ownerView = false }: { ownerView?: boolean }) => {
  const t = useTranslations("owner.managerAccess");
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
    setDialogKey((prev) => prev + 1); 
    setIsDialogOpen(true);
  };

  return (
    <>
      <ManagerFormDialog
        key={dialogKey}
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSuccess={handleSuccess}
      />

      <ManagementPageHeader
        title={ownerView ? t("headerTitle") : "Managers Management"}
        description={ownerView ? t("headerDescription") : "Manage managers records."}
        action={{
          label: ownerView ? t("addManager") : "Add Manager",
          icon: Plus,
          onClick: handleOpenDialog,
        }}
      />
    </>
  );
};

export default ManagersManagementHeader;
