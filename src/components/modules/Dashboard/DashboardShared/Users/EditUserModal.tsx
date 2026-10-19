/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useActionState, useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User } from "@/types/user";
import updateUserByAdmin from "@/services/user/updateUserByAdmin";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

interface EditUserModalProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const initialState = {
  success: false,
  message: null,
};

export default function EditUserModal({
  user,
  open,
  onOpenChange,
}: EditUserModalProps) {
  const t = useTranslations("admin.users");
  const common = useTranslations("common");
  const [state, formAction, isPending] = useActionState(
    updateUserByAdmin,
    initialState,
  );

  const router = useRouter();

  const processedStateRef = useRef(state);

  const getPresentationMessage = useCallback((message: string) => {
    switch (message) {
      case "User ID is required": return t("userIdRequired");
      case "No changes detected.": return t("noChanges");
      case "Failed to update user": return t("updateFailed");
      case "User updated successfully": return t("updateSuccess");
      case "Failed to update profile. Please try again.": return t("updateProfileFailed");
      default: return message;
    }
  }, [t]);

  useEffect(() => {
    // Only fire toast if state has changed and has a message
    if (state !== processedStateRef.current && state?.message) {
      processedStateRef.current = state;

      if (state.success) {
        toast.success(getPresentationMessage(state.message));
        onOpenChange(false);
        router.refresh();
      } else {
        toast.error(getPresentationMessage(state.message));
      }
    }
  }, [state, onOpenChange, router, getPresentationMessage]);

  if (!user) return null;

  const defaultStatus = user.isActive || "INACTIVE";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl p-6">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-lg font-bold text-slate-900">
            {t("editTitle")}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            {t("editDescription")}
          </DialogDescription>
        </DialogHeader>

        {/* key={user.id} forces React to reset all inner state when user changes */}
        <form
          key={user.id}
          action={formAction}
          encType="multipart/form-data"
          className="space-y-4 pt-2"
        >
          {/* Hidden input to pass user ID to Server Action */}
          <input type="hidden" name="id" value={user.id} />

          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">
              {t("fullName")}
            </label>
            <input
              type="text"
              name="fullName"
              defaultValue={user.fullName || ""}
              required
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
            />
          </div>

          {/* Club Name & Photo Upload Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">
                {t("clubName")}
              </label>
              <input
                type="text"
                name="clubName"
                defaultValue={user.clubName || ""}
                placeholder={t("notAvailable")}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">
                {t("profilePhoto")}
              </label>
              <input
                type="file"
                name="file"
                accept="image/*"
                className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer border border-slate-200 rounded-lg p-1 focus:outline-none"
              />
            </div>
          </div>

          {/* Hidden original values for comparison */}
          <input
            type="hidden"
            name="_original_fullName"
            value={user.fullName || ""}
          />
          <input
            type="hidden"
            name="_original_clubName"
            value={user.clubName || ""}
          />
          <input
            type="hidden"
            name="_original_address"
            value={(user as any).address || ""}
          />
          <input
            type="hidden"
            name="_original_isActive"
            value={defaultStatus}
          />

          <input
            type="hidden"
            name="_original_isVerified"
            value={(user as any).isVerified}
          />

          <input
            type="hidden"
            name="_original_isPhoneVerified"
            value={(user as any).isPhoneVerified}
          />

          {/* Address & Status Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">
              {t("address")}
              </label>
              <input
                type="text"
                name="address"
                defaultValue={(user as any).address || ""}
                placeholder={t("enterAddress")}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">
              {t("status")}
              </label>
              <Select name="isActive" defaultValue={defaultStatus}>
                <SelectTrigger className="w-full rounded-lg border-slate-200 text-sm">
                  <SelectValue placeholder={t("selectStatus")} />
                </SelectTrigger>

                <SelectContent className="bg-white">
                  <SelectItem
                    value="ACTIVE"
                    className="cursor-pointer focus:bg-slate-50"
                  >
                    {t("active")}
                  </SelectItem>

                  <SelectItem
                    value="INACTIVE"
                    className="cursor-pointer focus:bg-slate-50"
                  >
                    {t("inactive")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Checkboxes */}
          <div className="pt-2 grid grid-cols-2 gap-2 border-t border-slate-100">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
              <input
                type="checkbox"
                name="isVerified"
                value="true"
                defaultChecked={user.isVerified}
                className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400"
              />
              <input type="hidden" name="isVerified" value="false" />
              {t("identityVerified")}
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
              <input
                type="checkbox"
                name="isPhoneVerified"
                value="true"
                defaultChecked={user.isPhoneVerified}
                className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400"
              />
              <input type="hidden" name="isPhoneVerified" value="false" />
              {t("phoneVerified")}
            </label>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="rounded-lg px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
            >
              {common("cancel")}
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-50 transition-colors"
            >
              {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {t("saveChanges")}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
