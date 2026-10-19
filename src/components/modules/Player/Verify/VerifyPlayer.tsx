/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import PlayerVerifyForm from "@/components/modules/Player/Verify/VerifyPlayerForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { deleteUnverifiedUser } from "@/services/auth/handleAbortAction";
import { sendOtp } from "@/services/auth/sendOtp";
import { verifyOtpAction } from "@/services/auth/verifyOtpAction";
import { useTranslations } from "next-intl";

interface VerifyPlayerProps {
  user: {
    id: string;
    phone: string;
  };
  redirect?: string;
}

const VerifyPlayer = ({ user, redirect }: VerifyPlayerProps) => {
  const t = useTranslations("auth");
  const phone = user?.phone || "";
  const backendUrl = process.env.NEXT_PUBLIC_BASE_API_URL;

  const handleVerifyAction = async (otpCode: string) => {
    try {
      await verifyOtpAction({
        purpose: "USER_VERIFICATION",
        code: otpCode,
      });
      return { success: true, redirect };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  };

  const handleResendAction = async () => {
    try {
      const result = await sendOtp({
        purpose: "USER_VERIFICATION",
      });

      return { success: true, secondsRemaining: result.data.secondsRemaining };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  };

  const handleAbortAction = async () => {
    try {
      const result = await deleteUnverifiedUser(user.id);

      if (!result.success) {
        throw new Error(result.message);
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  };

  return (
    <>
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-xl">
          <Card>
            <CardHeader>
              <CardTitle>{t("verify.your.account")}</CardTitle>
            </CardHeader>
            <CardContent>
              <PlayerVerifyForm
                initialPhone={phone}
                onVerifyAction={handleVerifyAction}
                onResendAction={handleResendAction}
                onAbortAction={handleAbortAction}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default VerifyPlayer;
