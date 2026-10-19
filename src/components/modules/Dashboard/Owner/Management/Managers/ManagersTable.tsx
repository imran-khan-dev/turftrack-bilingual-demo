/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import ManagementTable from "@/components/shared/ManagementTable";
import { useTransition, useState } from "react";
import { toast } from "sonner";
import { getManagersColumns } from "./ManagersColumns";
import { toggleStaffStatus } from "@/services/staff/toggleStaffStatus";
import { useRouter } from "next/navigation";
import DeleteConfirmationDialog from "@/components/shared/DeleteConfirmationDialog"; // adjust path
import { hardDeleteManager } from "@/services/staff/hardDeleteManager";
import { useTranslations } from "next-intl";

interface PatientsTableProps {
  managers: any[];
  ownerView?: boolean;
}

const ManagersTable = ({ managers, ownerView = false }: PatientsTableProps) => {
  const t = useTranslations("owner.managerAccess");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDeleteClick = (manager: any) => {
    setDeleteTarget(manager);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;

    startTransition(async () => {
      // const res = await updateStaffAccess(deleteTarget.id, { isRemoved: true });
      const res = await hardDeleteManager(deleteTarget.id);

      if (res.success) {
        toast.success(ownerView ? t("removed") : "Manager removed successfully");
      } else {
        toast.error(res.message || (ownerView ? t("removeFailed") : "Failed to remove manager"));
      }

      setIsDeleteDialogOpen(false);
      setDeleteTarget(null);
      router.refresh();
    });
  };

  const handleToggleStatus = (manager: any) => {
    if (isPending) return;
    const action = manager.isActive === "ACTIVE" ? "deactivate" : "activate";

    startTransition(async () => {
      const res = await toggleStaffStatus(manager.id);

      if (res.success) {
        toast.success(ownerView ? (action === "deactivate" ? t("deactivated") : t("activated")) : `Manager ${action}d successfully`);
      } else {
        toast.error(res.message || (ownerView ? t(action === "deactivate" ? "deactivateFailed" : "activateFailed") : `Failed to ${action} manager`));
      }
      router.refresh();
    });
  };

  return (
    <>
      <ManagementTable
        data={managers || []}
        columns={getManagersColumns(t)}
        getRowKey={(manager) => manager.id}
        onDelete={handleDeleteClick}
        onActivate={(manager) => handleToggleStatus(manager)}
        onDeactivate={(manager) => handleToggleStatus(manager)}
        isRefreshing={isPending}
        isFields={false}
      />

      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          setIsDeleteDialogOpen(open);
          if (!open) setDeleteTarget(null);
        }}
        onConfirm={handleConfirmDelete}
        title={ownerView ? t("removeTitle") : "Remove Manager"}
        itemName={deleteTarget?.user?.fullName}
        isDeleting={isPending}
      />
    </>
  );
};

export default ManagersTable;
