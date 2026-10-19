"use client";

import { loginUser } from "@/services/auth/loginUser";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "../ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import InputFieldError from "../shared/InputFieldError";
import { Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";

const LoginForm = ({ redirect }: { redirect?: string }) => {
  const t = useTranslations("auth");
  const [state, formAction, isPending] = useActionState(loginUser, null);

  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (state && !state.success && state.message) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <form action={formAction} className="space-y-5">
      {redirect && <input type="hidden" name="redirect" value={redirect} />}

      <FieldGroup className="space-y-4">
        {/* Email or Phone */}
        <Field>
          <FieldLabel
            htmlFor="emailOrPhone"
            className="text-xs font-semibold text-slate-700"
          >
            {t("email.or.phone.number")}
          </FieldLabel>
          <Input
            id="emailOrPhone"
            name="emailOrPhone"
            type="text"
            value={emailOrPhone}
            onChange={(e) => setEmailOrPhone(e.target.value)}
            placeholder={t("m.example.com.or.8801800000000")}
            className="h-10 text-xs border-slate-200 rounded-lg focus-visible:ring-emerald-500"
          />
          <InputFieldError field="emailOrPhone" state={state} />
        </Field>

        {/* Password */}
        <Field>
          <div className="flex items-center justify-between mb-1">
            <FieldLabel
              htmlFor="password"
              className="text-xs font-semibold text-slate-700"
            >
              {t("password")}
            </FieldLabel>
            <Link
              href="/forgot-password"
              className="text-xs font-medium text-emerald-600 hover:text-emerald-500 transition-colors"
            >
              {t("forgot.password.question")}
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("enter.your.password")}
              className="h-10 text-xs border-slate-200 rounded-lg focus-visible:ring-emerald-500 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer focus:outline-none"
              aria-label={showPassword ? t("hidePassword") : t("showPassword")}
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

        {/* Submit CTA */}
        <div className="pt-2">
          <Button
            type="submit"
            disabled={isPending}
            className="w-full h-10 bg-black hover:bg-slate-800 cursor-pointer text-white font-semibold text-xs tracking-wide rounded-lg shadow-sm transition-all"
          >
            {isPending ? t("signingIn") : t("login")}
          </Button>
        </div>

        {/* Footer Link */}
        <FieldDescription className="text-center text-xs text-slate-500 pt-2">
          {t("don.t.have.an.account")} {" "}
          <Link
            href="/user/player/register"
            className="font-semibold text-emerald-600 hover:text-emerald-500 transition-colors"
          >
            {t("sign.up")}
          </Link>
        </FieldDescription>
      </FieldGroup>
    </form>
  );
};

export default LoginForm;
