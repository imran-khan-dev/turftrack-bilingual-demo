"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { SpecialPricing, SpecialPricingInput } from "@/types/specialPricing";
import SpecialPricingList from "./SpecialPricingList";
import SpecialPricingForm from "./SpecialPricingForm";
import { useSpecialPricings } from "@/hooks/specialPricing/useSpecialPricings";
import { useTranslations } from "next-intl";

interface SpecialPricingModalProps {
  open: boolean;
  onClose: () => void;
  fieldId: string | null;
  fieldName?: string;
}

const SpecialPricingModal = ({
  open,
  onClose,
  fieldId,
  fieldName,
}: SpecialPricingModalProps) => {
  const t = useTranslations("owner.fieldSettings");
  const {
    items,
    isLoading,
    isSaving,
    deletingId,
    addItem,
    updateItem,
    removeItem,
  } = useSpecialPricings(open ? fieldId : null);

  const [editingItem, setEditingItem] = useState<SpecialPricing | null>(null);

  const handleClose = () => {
    setEditingItem(null);
    onClose();
  };

  const handleSubmit = async (data: SpecialPricingInput) => {
    const success = editingItem
      ? await updateItem(editingItem.id, data)
      : await addItem(data);

    if (success && editingItem) {
      setEditingItem(null);
    }
    return success;
  };

  const handleDelete = async (id: string) => {
    await removeItem(id);
    if (editingItem?.id === id) {
      setEditingItem(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[85vh] flex flex-col p-0 border border-slate-200 bg-white rounded-2xl shadow-xl overflow-hidden max-w-lg">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-slate-100">
          <DialogTitle className="text-lg font-bold text-slate-800">
            {fieldName ? t("specialPricingFor", { fieldName }) : t("specialPricing")}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          <SpecialPricingList
            items={items}
            isLoading={isLoading}
            deletingId={deletingId}
            onEdit={setEditingItem}
            onDelete={handleDelete}
          />

          <SpecialPricingForm
            editingItem={editingItem}
            isSaving={isSaving}
            onSubmit={handleSubmit}
            onCancel={() => setEditingItem(null)}
          />
        </div>

        <div className="flex justify-end gap-2 px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="h-10 rounded-xl border-slate-200 text-slate-600 font-semibold hover:bg-slate-100"
          >
            {t("close")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SpecialPricingModal;
