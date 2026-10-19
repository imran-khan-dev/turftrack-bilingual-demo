/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import ManagementTable from "@/components/shared/ManagementTable";
import { useState, useTransition, useEffect } from "react";
import { getDiscountsColumns } from "./PromoDiscountsColumns";
import { togglePromoStatus } from "@/services/discount/togglePromoStatus";
import { useRouter } from "next/navigation";
import UpdatePromoFormDialog from "./UpdatePromoFormDialog";
import { toast } from "sonner";
import { softDeletePromoCode } from "@/services/discount/softDeletePromoCode";
import DeleteConfirmationDialog from "@/components/shared/DeleteConfirmationDialog";
import { useTranslations } from "next-intl";

interface PromoDiscountsTableProps {
  promoCodes: any[];
}

const PromoDiscountsTable = ({ promoCodes }: PromoDiscountsTableProps) => {
  const t = useTranslations("owner.promo");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isDeleting, startDeleteTransition] = useTransition();

  const [selectedPromoId, setSelectedPromoId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [selectedTogglePromoId, setSelectedTogglePromoId] = useState<
    string | null
  >(null);

  const [selectedDeletePromoId, setSelectedDeletePromoId] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (!selectedTogglePromoId) return;

    startTransition(async () => {
      try {
        await togglePromoStatus(selectedTogglePromoId);
        router.refresh();
      } catch (error) {
        console.error("Failed to toggle promo status:", error);
      } finally {
        setSelectedTogglePromoId(null);
      }
    });
  }, [router, selectedTogglePromoId]);

  const handleConfirmDelete = () => {
    if (!selectedDeletePromoId) return;
    const promoId = selectedDeletePromoId;

    startDeleteTransition(async () => {
      try {
        const result = await softDeletePromoCode(promoId);

        if (!result?.success) {
          toast.error(result?.message || t("deleteFailed"));
          return;
        }

        toast.success(result?.message || t("deleted"));
        router.refresh();
      } catch (error) {
        console.error("Failed to delete promo code:", error);
        toast.error(t("deleteFailed"));
      } finally {
        setSelectedDeletePromoId(null);
      }
    });
  };

  return (
    <>
      <ManagementTable
        data={promoCodes || []}
        columns={getDiscountsColumns(t)}
        getRowKey={(promoCode) => promoCode.id}
        onEdit={(promoCode) => {
          setIsDialogOpen(true);
          setSelectedPromoId(promoCode.id);
        }}
        isRefreshing={isPending}
        isBookings={false}
        onActivate={(promo) => setSelectedTogglePromoId(promo.id)}
        onDeactivate={(promo) => setSelectedTogglePromoId(promo.id)}
        onDelete={(promo) => setSelectedDeletePromoId(promo.id)}
      />

      <UpdatePromoFormDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        promoId={selectedPromoId || ""}
        onSuccess={() => setIsDialogOpen(false)}
      />

      <DeleteConfirmationDialog
        open={!!selectedDeletePromoId}
        onOpenChange={(open) => {
          if (!open) setSelectedDeletePromoId(null);
        }}
        onConfirm={handleConfirmDelete}
        title={t("deleteTitle")}
        description={t("deleteConfirm")}
        isDeleting={isDeleting}
      />
    </>
  );
};

export default PromoDiscountsTable;
