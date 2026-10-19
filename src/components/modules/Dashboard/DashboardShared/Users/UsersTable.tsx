/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import ManagementTable from "@/components/shared/ManagementTable";
import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { getUsersColumns } from "./UsersColumns";
import DeleteOptionModal from "./DeleteOptionModal";
import { User } from "@/types/user";
import { softDeleteUser } from "@/services/user/softDeleteUser";
import { hardDeleteUser } from "@/services/user/hardDeleteUser";
import { toast } from "sonner";
import EditUserModal from "./EditUserModal";
import { useTranslations } from "next-intl";

interface UsersTableProps {
  users: any[];
}

const UsersTable = ({ users }: UsersTableProps) => {
  const t = useTranslations("admin.users");
  const [isPending, startTransition] = useTransition();
  const [deleteUser, setDeleteUser] = useState<User | null>(null);
  const [editUser, setEditUser] = useState<User | null>(null);
  const router = useRouter();

  const handleSoftDelete = async () => {
    if (deleteUser?.id === null || !deleteUser) {
      toast.error(t("selectUserError"));
      return;
    }

    try {
      const result = await softDeleteUser(deleteUser.id);

      if (!result?.success) {
        toast.error(result?.message || t("deleteFailed"));
        return;
      }

      toast.success(t("deleteSuccess"));
      setDeleteUser(null);

      startTransition(() => {
        router.refresh();
      });
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || t("deleteFailed"));
    }
  };

  const handleHardDelete = async () => {
    if (deleteUser?.id === null || !deleteUser) {
      toast.error(t("selectUserError"));
      return;
    }

    try {
      const result = await hardDeleteUser(deleteUser.id);

      if (!result?.success) {
        toast.error(result?.message || t("permanentDeleteFailed"));
        return;
      }

      toast.success(t("permanentDeleteSuccess"));
      setDeleteUser(null);

      startTransition(() => {
        router.refresh();
      });
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || t("permanentDeleteFailed"));
    }
  };

  return (
    <>
      <ManagementTable
        data={users || []}
        columns={getUsersColumns(t)}
        getRowKey={(user) => user.id}
        isRefreshing={isPending}
        onEdit={(user) => {
          setEditUser(user);
        }}
        onDelete={(user) => {
          setDeleteUser(user);
        }}
      />
      <DeleteOptionModal
        open={deleteUser !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteUser(null);
          }
        }}
        itemName={deleteUser?.fullName}
        onSoftDelete={handleSoftDelete}
        onHardDelete={handleHardDelete}
        isDeleting={isPending}
      />

      <EditUserModal
        user={editUser}
        open={editUser !== null}
        onOpenChange={() => setEditUser(null)}
      />
    </>
  );
};

export default UsersTable;
