"use client";

import { useState } from "react";
import { Archive, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import DeleteConfirmationDialog from "@/components/shared/DeleteConfirmationDialog";
import { useTranslations } from "next-intl";

type DeleteType = "SOFT" | "HARD" | null;

interface DeleteOptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemName?: string;
  onSoftDelete: () => void;
  onHardDelete: () => void;
  isDeleting?: boolean;
}

export default function DeleteOptionModal({
  open,
  onOpenChange,
  itemName,
  onSoftDelete,
  onHardDelete,
  isDeleting = false,
}: DeleteOptionModalProps) {
  const t = useTranslations("admin.users");
  const [selectedType, setSelectedType] = useState<DeleteType>(null);

  const handleSelect = (type: DeleteType) => {
    setSelectedType(type);
  };

  const closeModal = () => {
    setSelectedType(null);
    onOpenChange(false);
  };

  const handleConfirm = async () => {
    try {
      if (selectedType === "SOFT") await onSoftDelete();
      if (selectedType === "HARD") await onHardDelete();
    } finally {
      // Reset state and notify parent when confirm finishes
      closeModal();
    }
  };

  const handleConfirmOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      closeModal();
    }
  };

  // Derived state: if parent passes open === false, enforce closed state internally
  const isOptionDialogOpen = open && selectedType === null;
  const isConfirmationDialogOpen = open && selectedType !== null;

  return (
    <>
      {/* Step 1: Choose delete type */}
      <Dialog
        open={isOptionDialogOpen}
        onOpenChange={(isOpen) => {
          if (!isOpen) closeModal();
        }}
      >
        <DialogContent className="sm:max-w-sm rounded-2xl p-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle className="text-base font-bold text-slate-900">
              {itemName ? t("deleteTitle", { itemName }) : t("deleteRecordTitle")}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              {t("deleteOptionsDescription")}
            </DialogDescription>
          </DialogHeader>

          <div className="p-6 pt-4 space-y-3">
            <button
              type="button"
              onClick={() => handleSelect("SOFT")}
              className="w-full flex items-start gap-3 rounded-xl border border-slate-200 p-3.5 text-left hover:border-amber-300 hover:bg-amber-50/50 transition-colors"
            >
              <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
                <Archive className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">{t("softDelete")}</p>
                <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                  {t("softDeleteDescription")}
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleSelect("HARD")}
              className="w-full flex items-start gap-3 rounded-xl border border-slate-200 p-3.5 text-left hover:border-rose-300 hover:bg-rose-50/50 transition-colors"
            >
              <div className="w-9 h-9 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0">
                <Trash2 className="w-4 h-4 text-rose-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">{t("hardDelete")}</p>
                <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                  {t("hardDeleteDescription")}
                </p>
              </div>
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Step 2: Confirmation dialog */}
      <DeleteConfirmationDialog
        open={isConfirmationDialogOpen}
        onOpenChange={handleConfirmOpenChange}
        onConfirm={handleConfirm}
        isDeleting={isDeleting}
        title={
          selectedType === "SOFT"
            ? t("confirmSoftDelete")
            : t("confirmHardDelete")
        }
        description={
          selectedType === "SOFT"
            ? t("softDeleteConfirmation", { itemName: itemName || t("defaultRecord") })
            : t("hardDeleteConfirmation", { itemName: itemName || t("defaultRecord") })
        }
      />
    </>
  );
}
