"use client";

interface QueueItem {
  mode: "USER_VERIFICATION" | "BUSINESS_VERIFICATION" | "BKASH_VERIFICATION";
  number: string;
  label: string;
  isVerified: boolean;
}

interface VerificationQueueListProps {
  dynamicQueue: QueueItem[];
  currentMode: string;
  isAllVerified: boolean;
}

export default function VerificationQueueList({
  dynamicQueue,
  currentMode,
  isAllVerified,
}: VerificationQueueListProps) {
  return (
    <div className="space-y-3">
      {dynamicQueue.map((item, idx) => {
        const isCurrent = item.mode === currentMode && !isAllVerified;
        const isDone =
          item.isVerified ||
          dynamicQueue.findIndex((s) => s.mode === currentMode) > idx;

        return (
          <div
            key={item.mode}
            className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
              isCurrent
                ? "bg-white border-green-200 shadow-sm"
                : isAllVerified && item.isVerified
                  ? "bg-emerald-50/40 border-emerald-100"
                  : "border-transparent opacity-60"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 border transition-all ${
                isDone || (isAllVerified && item.isVerified)
                  ? "bg-emerald-500 border-emerald-500 text-white"
                  : isCurrent
                    ? "bg-green-500 border-green-500 text-slate-900"
                    : "bg-white border-slate-300 text-slate-400"
              }`}
            >
              {isDone || (isAllVerified && item.isVerified) ? "✓" : idx + 1}
            </div>

            <div>
              <h4
                className={`text-[11px] font-black uppercase tracking-wider ${
                  isCurrent || isAllVerified
                    ? "text-slate-900"
                    : "text-slate-400"
                }`}
              >
                {item.label}
              </h4>
              <p className="text-xs text-slate-500 font-medium">
                {item.number}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
