"use client";

import { cn } from "@/lib/utils";
import { TrendingUp } from "lucide-react";
import { useTranslations } from "next-intl";

interface TopBusiness {
  businessId: string;
  name: string;
  bookings: number;
  revenue: number;
}

interface TopSpender {
  userId: string;
  fullName: string;
  bookings: number;
  spending: number;
}

interface FrequentPlayer {
  userId: string;
  fullName: string;
  bookings: number;
  revenue: number;
}

interface DashboardData {
  topBusinesses: TopBusiness[];
  topSpenders: TopSpender[];
  frequentPlayers: FrequentPlayer[];
}

interface PerformanceDashboardProps {
  data: DashboardData;
}

function RankRow({
  rank,
  title,
  subtitle,
  subtitleClassName = "text-slate-400",
  amount,
}: {
  rank: number;
  title: string;
  subtitle: string;
  subtitleClassName?: string;
  amount: string;
}) {
  return (
    <div className="flex items-center justify-between py-3 px-2 rounded-xl hover:bg-slate-50/60 transition-colors">
      <div className="flex items-center gap-3 min-w-0 pr-2">
        <span className="text-[11px] font-bold text-slate-400 bg-slate-50 border border-slate-100 rounded-lg h-6 w-6 flex items-center justify-center shrink-0">
          {String(rank).padStart(2, "0")}
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-800 truncate">
            {title}
          </p>
          <span
            className={cn(
              "text-[11px] font-medium block mt-0.5",
              subtitleClassName,
            )}
          >
            {subtitle}
          </span>
        </div>
      </div>
      <div className="text-right shrink-0">
        <span className="text-sm font-bold text-slate-900">{amount}</span>
      </div>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="text-center py-10 bg-slate-50 border border-dashed border-slate-200 rounded-xl">
      <p className="text-xs font-medium text-slate-400">{label}</p>
    </div>
  );
}

export default function PerformanceDashboard({ data }: PerformanceDashboardProps) {
  const t = useTranslations("owner.finance");
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "BDT",
      maximumFractionDigits: 0,
    })
      .format(amount)
      .replace("BDT", "৳")
      .trim();
  };

  return (
    <div className="w-full space-y-6">
         {/* Metric Cards Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Card 1: Top Businesses */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
            <TrendingUp size={14} className="text-emerald-500" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              {t("topBusinesses")}
            </h2>
          </div>
          <div className="divide-y divide-slate-100/60">
            {data.topBusinesses.length === 0 ? (
              <EmptyState label={t("noBusinessData")} />
            ) : (
              data.topBusinesses.map((biz, index) => (
                <RankRow
                  key={biz.businessId}
                  rank={index + 1}
                  title={biz.name}
                  subtitle={t("bookingCount", { count: biz.bookings })}
                  amount={formatCurrency(biz.revenue)}
                />
              ))
            )}
          </div>
        </div>

        {/* Card 2: Top Spenders */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
            <TrendingUp size={14} className="text-blue-500" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              {t("topSpenders")}
            </h2>
          </div>
          <div className="divide-y divide-slate-100/60">
            {data.topSpenders.length === 0 ? (
              <EmptyState label={t("noSpenderData")} />
            ) : (
              data.topSpenders.map((spender, index) => (
                <RankRow
                  key={spender.userId}
                  rank={index + 1}
                  title={spender.fullName}
                  subtitle={t("bookingCount", { count: spender.bookings })}
                  amount={formatCurrency(spender.spending)}
                />
              ))
            )}
          </div>
        </div>

        {/* Card 3: Frequent Players */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
            <TrendingUp size={14} className="text-amber-500" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              {t("frequentPlayers")}
            </h2>
          </div>
          <div className="divide-y divide-slate-100/60">
            {data.frequentPlayers.length === 0 ? (
              <EmptyState label={t("noRegularPlayerData")} />
            ) : (
              data.frequentPlayers.map((player, index) => (
                <RankRow
                  key={player.userId}
                  rank={index + 1}
                  title={player.fullName}
                  subtitle={t("matchesPlayed", { count: player.bookings })}
                  subtitleClassName="text-emerald-600"
                  amount={formatCurrency(player.revenue)}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
