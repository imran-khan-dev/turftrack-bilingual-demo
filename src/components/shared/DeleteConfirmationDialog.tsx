"use client";

import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { useTranslations } from "next-intl";

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  itemName?: string;
  isDeleting?: boolean;
}

const DeleteConfirmationDialog = ({
  open,
  onOpenChange,
  onConfirm,
  title = "Delete Record",
  description,
  itemName,
  isDeleting = false,
}: DeleteConfirmDialogProps) => {
  const t = useTranslations("common");
  return (
    <AlertDialog
      open={open}
      onOpenChange={isDeleting ? undefined : onOpenChange}
    >
      <AlertDialogContent className="max-w-sm p-0 rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
        <AlertDialogHeader className="px-6 pt-6 pb-2 space-y-0">
          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-rose-600 stroke-[2.25]" />
            </div>

            <AlertDialogTitle className="text-base font-bold text-slate-900">
              {title}
            </AlertDialogTitle>

            <AlertDialogDescription className="text-sm text-slate-500 leading-relaxed">
              {description || (
                <>
                  {t("this.will.permanently.remove")} {" "}
                  {itemName ? (
                    <span className="font-semibold text-slate-700">
                      {itemName}
                    </span>
                  ) : (
                    t("this.record")
                  )}
                  . {t("this.action.cannot.be.undone")}
                </>
              )}
            </AlertDialogDescription>
          </div>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex-row gap-2 px-6 py-4 bg-slate-50/70 border-t border-slate-100 sm:justify-center">
          <AlertDialogCancel
            disabled={isDeleting}
            className="flex-1 h-10 mt-0 rounded-xl border-slate-200 text-slate-600 font-semibold hover:bg-slate-100 hover:text-slate-700"
          >
            {t("cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            disabled={isDeleting}
            className="flex-1 h-10 rounded-xl bg-rose-600 text-white font-semibold hover:bg-rose-700 focus:ring-rose-500 disabled:opacity-70 gap-1.5"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t("deleting")}
              </>
            ) : (
              <>
                <Trash2 className="w-3.5 h-3.5" />
                {t("delete")}
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteConfirmationDialog;
