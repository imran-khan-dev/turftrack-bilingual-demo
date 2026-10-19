"use client";

import { Button } from "@/components/ui/button";
import { Copy, Check, ExternalLink, Link2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export interface BusinessBookingLink {
  businessName: string;
  slug: string;
  url: string;
}

interface PublicBookingLinksProps {
  links: BusinessBookingLink[];
  playerView?: boolean;
  managerView?: boolean;
  ownerView?: boolean;
}

export default function PublicBookingLink({ links, playerView = false, managerView = false, ownerView = false }: PublicBookingLinksProps) {
  const translated = playerView || managerView || ownerView;
  const t = useTranslations("player.bookingLinks");
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const handleCopy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      toast.success(translated ? t("copySuccess") : "Link copied to clipboard");
      setTimeout(() => {
        setCopiedUrl((current) => (current === url ? null : current));
      }, 2000);
    } catch {
      toast.error(translated ? t("copyFailed") : "Failed to copy link");
    }
  };

  if (links.length === 0) {
    return (
      <div className="text-center py-10 bg-slate-50 border border-dashed border-slate-200 rounded-xl">
        <p className="text-xs font-medium text-slate-400">
          {translated ? t("noneAvailable") : "No booking links available"}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
      <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
        <Link2 size={14} className="text-slate-400" />
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          {translated ? t("title") : "Public Booking Links"}
        </h2>
      </div>

      <div className="divide-y divide-slate-100">
        {links.map((link) => {
          const isCopied = copiedUrl === link.url;

          return (
            <div
              key={link.slug}
              className="py-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-800 truncate">
                  {link.businessName}
                </p>
                <p className="text-[11px] text-slate-400 truncate font-mono">
                  {link.url}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(link.url)}
                  className="h-8 rounded-lg border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 gap-1.5"
                >
                  {isCopied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      {translated ? t("copied") : "Copied"}
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      {translated ? t("copy") : "Copy"}
                    </>
                  )}
                </Button>

                {/* Plain <a target="_blank"> — this is what lets a PWA in
                standalone mode hand the navigation off to the system's
                default browser instead of opening inside the app shell. A
                JS-driven window.open() is not reliably honored the same way
                across Android/iOS installed PWAs. */}
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  <Button
                    type="button"
                    size="sm"
                    className="h-8 rounded-lg cursor-pointer bg-slate-900 hover:bg-slate-800 text-white font-semibold gap-1.5"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    {translated ? t("view") : "View"}
                  </Button>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
