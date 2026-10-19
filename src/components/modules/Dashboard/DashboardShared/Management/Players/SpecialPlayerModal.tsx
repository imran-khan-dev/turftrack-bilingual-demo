/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";

import { toast } from "sonner";
import { makePlayerSpecial } from "@/services/user/makePlayerSpecial";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface Business {
  id: string;
  name: string;
}

interface SpecialPlayerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  businesses: Business[];
  isManual: boolean;
  player?: {
    id: string;
    phone: string;
    fullName?: string;
    isSpecialInScope?: boolean; // ADDED: used to show accurate current-state context in row mode
  } | null;
  onSuccess?: () => void;
  managerView?: boolean;
}

export default function SpecialPlayerModal({
  open,
  onOpenChange,
  businesses,
  isManual,
  player,
  onSuccess,
  managerView = false,
}: SpecialPlayerModalProps) {
  const t = useTranslations("manager.playerActions");
  const label = (key: string, fallback: string) => managerView ? t(key as never) : fallback;
  const [businessId, setBusinessId] = useState<string>("");
  const [manualPhone, setManualPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setBusinessId("");
    setManualPhone("");
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) resetForm();
    onOpenChange(nextOpen);
  };

  const handleSubmit = async () => {
    if (!businessId) {
      toast.error(label("selectBusinessError", "Please select a business."));
      return;
    }

    if (isManual) {
      const trimmedPhone = manualPhone.trim();

      if (!trimmedPhone) {
        toast.error(label("phoneError", "Please enter a phone number."));
        return;
      }

      setIsSubmitting(true);

      try {
        const result = await makePlayerSpecial({
          phone: trimmedPhone,
          businessId,
          isManual,
        });

        if (result?.success) {
          toast.success(label("manualSuccess", "Player marked as special."));
          onSuccess?.();
          handleOpenChange(false);
        } else {
          toast.error(
            (result as any)?.errorSources?.[0]?.message ||
              result?.message ||
              label("error", "Something went wrong."),
          );
        }
      } catch (error: any) {
        toast.error(error?.message || label("updateFailed", "Failed to update special status."));
      } finally {
        setIsSubmitting(false);
      }
    } else {
      if (!player?.id) {
        toast.error(label("playerError", "No player selected. Please try again."));
        return;
      }

      setIsSubmitting(true);

      try {
        const result = await makePlayerSpecial({
          id: player.id,
          businessId,
        });

        if (result?.success) {
          toast.success(label("updateSuccess", "Special status updated."));
          onSuccess?.();
          handleOpenChange(false);
        } else {
          toast.error(result?.message || label("error", "Something went wrong."));
        }
      } catch (error: any) {
        toast.error(error?.message || label("updateFailed", "Failed to update special status."));
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-bold text-slate-900">
            {label(isManual ? "manualTitle" : "toggleTitle", isManual ? "Manual Special Entry" : "Toggle Special Status")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Business Selector */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-600">
              {label("business", "Business")}
            </Label>
            <Select value={businessId} onValueChange={setBusinessId}>
              <SelectTrigger className="w-full h-9 text-xs">
                <SelectValue placeholder={label("selectBusiness", "Select a business")} />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {businesses.map((b) => (
                  <SelectItem
                    className="focus:bg-slate-50 text-xs"
                    key={b.id}
                    value={b.id}
                  >
                    {b.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isManual ? (
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-600">
                {label("phone", "Player Phone Number")}
              </Label>
              <Input
                value={manualPhone}
                onChange={(e) => setManualPhone(e.target.value)}
                placeholder={label("phoneExample", "e.g. 01871624233")}
                className="h-9 text-xs"
              />
            </div>
          ) : (
            player && (
              <div className="rounded-xl bg-slate-50 border border-slate-200 px-3 py-2.5 space-y-1">
                <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wide">
                  {label("targetPlayer", "Target Player")}
                </p>
                <p className="text-xs font-bold text-slate-800">
                  {player.fullName || label("unnamed", "Unnamed")} · {player.phone}
                </p>
                {/* ADDED: shows current state so the toggle's effect is predictable */}
                {player.isSpecialInScope !== undefined && (
                  <p className="text-[11px] text-slate-500">
                    {label("currently", "Currently:")}{" "}
                    <span className="font-semibold">
                      {label(player.isSpecialInScope ? "special" : "notSpecial", player.isSpecialInScope ? "Special" : "Not Special")}
                    </span>
                  </p>
                )}
              </div>
            )
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isSubmitting}
          >
            {label("cancel", "Cancel")}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-black hover:bg-black/80 text-white"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isManual ? (
              label("makeSpecial", "Make Special")
            ) : (
              label("confirm", "Confirm Toggle")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
