/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import InputFieldError from "@/components/shared/InputFieldError";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getUserInfo } from "@/services/auth/getUserFromToken";
import createManager from "@/services/staff/createManager";
import {
  getAccessibleBusinesses,
  AccessibleBusiness,
} from "@/utils/getAccessibleBusinesses";
import { ImagePlus, X, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import {
  useActionState,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { toast } from "sonner";
import { redirect } from "next/navigation";
import { useTranslations } from "next-intl";

interface IManagerFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type ManagerState = {
  success: boolean;
  message?: string;
  formData?: FormData;
};

const ManagerFormDialog = ({
  open,
  onClose,
  onSuccess,
}: IManagerFormDialogProps) => {
  const t = useTranslations("owner.managerAccess");
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [state, formAction, isPending] = useActionState<ManagerState, FormData>(
    createManager,
    { success: false },
  );

  const prevStateRef = useRef(state);

  const [businesses, setBusinesses] = useState<AccessibleBusiness[]>([]);
  const [businessId, setBusinessId] = useState("");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const passwordMismatch =
    confirmPassword.length > 0 && password !== confirmPassword;

  // Load businesses accessible to the current user
  useEffect(() => {
    if (!open) return;
    (async () => {
      const result = await getUserInfo();

      if (result.status === "error" || result.status === "unauthenticated")
        return redirect("/login");

      const user = result.user;
      setBusinesses(getAccessibleBusinesses(user));
    })();
  }, [open]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    if (file) {
      const url = URL.createObjectURL(file);
      setPhotoPreview(url);
    } else {
      setPhotoPreview(null);
    }
  };

  const handleRemoveFile = () => {
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClose = useCallback(() => {
    formRef.current?.reset();
    setBusinessId("");
    setFullName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirmPassword(false);
    setPhone("");
    setAddress("");
    setPhotoPreview(null);
    onClose();
  }, [onClose]);

  // Handle server actions sync
  useEffect(() => {
    if (state === prevStateRef.current) return;
    prevStateRef.current = state;
    if (state?.success) {
      toast.success(state.message || t("registered"));
      Promise.resolve().then(() => {
        handleClose();
        onSuccess();
      });
    } else if (state?.message && !state.success) {
      toast.error(state.message);
    }
  }, [state, onSuccess, handleClose]);

  // Revoke object URL on unmount / change to avoid memory leaks
  useEffect(() => {
    return () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview);
    };
  }, [photoPreview]);

  const handleFormAction = (formData: FormData) => {
    if (password !== confirmPassword) {
      toast.error(t("passwordMismatch"));
      return;
    }
    formAction(formData);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] flex flex-col p-0 border border-slate-200 bg-white rounded-2xl shadow-xl overflow-hidden max-w-lg">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-slate-100">
          <DialogTitle className="text-lg font-bold text-slate-800">
            {t("registerTitle")}
          </DialogTitle>
        </DialogHeader>

        <form
          ref={formRef}
          action={handleFormAction}
          className="flex flex-col flex-1 min-h-0"
        >
          <input type="hidden" name="businessId" value={businessId} />

          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {/* Business Dropdown */}
            <Field className="space-y-1.5">
              <FieldLabel
                htmlFor="businessId"
                className="text-xs font-semibold text-slate-600"
              >
                {t("business")}
              </FieldLabel>
              <Select value={businessId} onValueChange={setBusinessId}>
                <SelectTrigger
                  id="businessId"
                  className="h-10 w-full rounded-xl border-slate-200 bg-slate-50 text-slate-700 font-medium px-3 focus:ring-1 focus:ring-green-500 hover:bg-slate-100/50 transition-colors"
                >
                  <SelectValue placeholder={t("selectBusiness")} />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-200 shadow-lg bg-white p-1">
                  {businesses.map((b) => (
                    <SelectItem
                      key={b.id}
                      value={b.id}
                      className="text-sm rounded-lg focus:bg-slate-50 focus:text-slate-900 cursor-pointer"
                    >
                      {b.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <InputFieldError field="businessId" state={state} />
            </Field>

            {/* Full Name */}
            <Field className="space-y-1.5">
              <FieldLabel
                htmlFor="fullName"
                className="text-xs font-semibold text-slate-600"
              >
                {t("fullName")}
              </FieldLabel>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                placeholder={t("fullName")}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="h-10 rounded-xl border-slate-200 focus:ring-1 focus:ring-green-500"
              />
              <InputFieldError field="fullName" state={state} />
            </Field>

            {/* Email + Phone */}
            <div className="grid grid-cols-2 gap-4">
              <Field className="space-y-1.5">
                <FieldLabel
                  htmlFor="email"
                  className="text-xs font-semibold text-slate-600"
                >
                  {t("email")}
                </FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="manager@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-10 rounded-xl border-slate-200 focus:ring-1 focus:ring-green-500"
                />
                <InputFieldError field="email" state={state} />
              </Field>

              <Field className="space-y-1.5">
                <FieldLabel
                  htmlFor="phone"
                  className="text-xs font-semibold text-slate-600"
                >
                  {t("phone")}
                </FieldLabel>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="01XXXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-10 rounded-xl border-slate-200 focus:ring-1 focus:ring-green-500"
                />
                <InputFieldError field="phone" state={state} />
              </Field>
            </div>

            {/* Password + Confirm Password */}
            <div className="grid grid-cols-2 gap-4">
              <Field className="space-y-1.5">
                <FieldLabel
                  htmlFor="password"
                  className="text-xs font-semibold text-slate-600"
                >
                  {t("password")}
                </FieldLabel>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-10 rounded-xl border-slate-200 focus:ring-1 focus:ring-green-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <InputFieldError field="password" state={state} />
              </Field>

              <Field className="space-y-1.5">
                <FieldLabel
                  htmlFor="confirmPassword"
                  className="text-xs font-semibold text-slate-600"
                >
                  {t("confirmPassword")}
                </FieldLabel>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-10 rounded-xl border-slate-200 focus:ring-1 focus:ring-green-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {passwordMismatch ? (
                  <p className="text-xs font-medium text-rose-600">
                    {t("passwordMismatch")}
                  </p>
                ) : (
                  <InputFieldError field="confirmPassword" state={state} />
                )}
              </Field>
            </div>

            {/* Address */}
            <Field className="space-y-1.5">
              <FieldLabel
                htmlFor="address"
                className="text-xs font-semibold text-slate-600"
              >
                {t("address")}
              </FieldLabel>
              <Input
                id="address"
                name="address"
                type="text"
                placeholder={t("addressExample")}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="h-10 rounded-xl border-slate-200 focus:ring-1 focus:ring-green-500"
              />
              <InputFieldError field="address" state={state} />
            </Field>

            {/* Photo Upload (single file only) */}
            <Field className="space-y-1.5">
              <FieldLabel
                htmlFor="file"
                className="text-xs font-semibold text-slate-600"
              >
                {t("profilePhoto")}
              </FieldLabel>

              {photoPreview ? (
                <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-200 group">
                  <Image
                    src={photoPreview}
                    width={100}
                    height={100}
                    alt={t("preview")}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 rounded-full p-0.5 text-white transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="file"
                  className="flex flex-col items-center justify-center gap-1 w-20 h-20 rounded-xl border border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100/70 cursor-pointer transition-colors text-slate-400"
                >
                  <ImagePlus className="w-5 h-5" />
                  <span className="text-[10px] font-medium">{t("upload")}</span>
                </label>
              )}

              <input
                ref={fileInputRef}
                id="file"
                name="file"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <InputFieldError field="file" state={state} />
            </Field>
          </div>

          <div className="flex justify-end gap-2 px-6 py-4 border-t border-slate-100 bg-slate-50/50">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isPending}
              className="h-10 rounded-xl border-slate-200 text-slate-600 font-semibold hover:bg-slate-100"
            >
              {t("cancel")}
            </Button>
            <Button
              type="submit"
              disabled={isPending || passwordMismatch}
              className="h-10 rounded-xl bg-slate-900 font-semibold text-white hover:bg-slate-800 transition-colors px-5"
            >
              {isPending ? t("registering") : t("submit")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ManagerFormDialog;
