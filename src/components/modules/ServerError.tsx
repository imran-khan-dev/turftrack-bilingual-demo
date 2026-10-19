"use client";

import { RefreshCw, WifiOff } from "lucide-react";
import { useTranslations } from "next-intl";

interface ServerErrorProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

const ServerError = ({ title, message, onRetry }: ServerErrorProps) => {
  const t = useTranslations("errors");
  const common = useTranslations("common");
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="flex min-h-[400px] items-center justify-center px-4">
      <div className="flex max-w-sm flex-col items-center text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
          <WifiOff className="h-6 w-6 text-red-500" strokeWidth={1.75} />
        </div>

        <h2 className="mt-4 text-lg font-semibold text-gray-900">{title ?? t("serverTitle")}</h2>

        <p className="mt-2 text-sm leading-relaxed text-gray-500">{message ?? t("serverDescription")}</p>

        <button
          onClick={handleRetry}
          className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
        >
          <RefreshCw className="h-4 w-4" strokeWidth={2} />
          {common("try.again")}
        </button>
      </div>
    </div>
  );
};

export default ServerError;
