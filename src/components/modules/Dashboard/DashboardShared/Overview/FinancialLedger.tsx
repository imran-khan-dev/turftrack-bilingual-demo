/* eslint-disable @typescript-eslint/no-explicit-any */
import { Coins, Layers, ArrowUpRight, Ban } from "lucide-react";
import { useTranslations } from "next-intl";

interface FinancialLedgerProps {
  loading: boolean;
  stats: any;
}

export default function FinancialLedger({
  loading,
  stats,
}: FinancialLedgerProps) {
  const t = useTranslations("finance");

  const items = [
    {
      key: "earnedRevenue",
      label: t("earnedRevenue"),
      value: stats?.earnedRevenue ?? 0,
      icon: Coins,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
      isLive: false,
      description: t("basedOnCompletedBookings"),
    },
    {
      key: "upcomingRevenue",
      label: t("upcomingRevenue"),
      value: stats?.deferredRevenue ?? 0,
      icon: Layers,
      color: "text-amber-600 bg-amber-50 border-amber-100",
      isLive: true,
      description: t("allFutureRevenuesIgnoreDateFilters"),
    },
    {
      key: "totalOnlineCollection",
      label: t("totalOnlineCollection"),
      value: stats?.netOnlineCollection ?? 0,
      icon: ArrowUpRight,
      color: "text-blue-600 bg-blue-50 border-blue-100",
      isLive: false,
    },
    {
      key: "refundsIssued",
      label: t("refundsIssued"),
      value: stats?.totalRefunds ?? 0,
      icon: Ban,
      color: "text-rose-600 bg-rose-50 border-rose-100",
      isLive: false,
    },
  ];

  return (
    <div className="space-y-3">
      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
        {t("financialLedgerPerformance")}
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((card) => {
          const IconComponent = card.icon;
          return (
            <div
              key={card.key}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 truncate">
                      {card.label}
                    </span>
                    {card.isLive && (
                      <div className="flex items-center gap-1 bg-emerald-50 border border-emerald-100 rounded-full px-1.5 py-0.5 text-[9px] font-bold text-emerald-700 shrink-0">
                        <span className="relative flex h-1 w-1">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-1 w-1 bg-emerald-500"></span>
                        </span>
                        {t("live")}
                      </div>
                    )}
                  </div>
                  <div
                    className={`p-2 rounded-lg border shrink-0 ${card.color}`}
                  >
                    <IconComponent size={14} />
                  </div>
                </div>

                <h3 className="text-2xl font-bold tracking-tight text-slate-900 mt-4">
                  {loading ? (
                    <span className="inline-block w-16 h-6 bg-slate-100 animate-pulse rounded" />
                  ) : (
                    `৳${Number(card.value).toLocaleString()}`
                  )}
                </h3>
              </div>

              {card.description && !loading && (
                <span className="text-[10px] text-slate-400 font-medium mt-2 block">
                  {card.description}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
