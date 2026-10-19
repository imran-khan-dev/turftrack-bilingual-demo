/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Loader2, AlertCircle } from "lucide-react";

import { getBookings } from "@/services/booking/getBookings";

import RefundConfirmModal from "./RefundConfirmModal";
import RefundFilters from "./RefundFilters";
import RefundMobileList from "./RefundMobileList";
import RefundTable from "./RefundTable";
import { settleOverpaidRefund } from "@/services/payment/settleOverpaidRefund";
import { makeRefund } from "@/services/payment/makeRefund";

export default function PendingRefunds({ businesses, managerView = false, ownerView = false }: { businesses: any[]; managerView?: boolean; ownerView?: boolean }) {
  const t = useTranslations("manager.refunds");
  const errorT = useTranslations("errors");
  const translatedView = managerView || ownerView;
  const label = (key: string, fallback: string) => translatedView ? t(key as never) : fallback;
  const [selectedBusinessId, setSelectedBusinessId] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"PENDING" | "HISTORY">("PENDING");
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeConfirmBooking, setActiveConfirmBooking] = useState<any | null>(
    null,
  );
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const limit = 10;

  useEffect(() => {
    setPage(1);
  }, [selectedBusinessId, activeTab]);

  const fetchRefundTelemetry = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const baseFilters: Record<string, any> = {
        ...(selectedBusinessId && { businessId: selectedBusinessId }),
      };

      if (activeTab === "HISTORY") {
        // UNIFIED FETCH: Pull both regular status-based refunds and processed overpayment offsets
        const [resRegularRefunds, resOverpaidSettled] = await Promise.all([
          getBookings({
            ...baseFilters,
            status: "REFUNDED",
            limit: 1000, // Fetch everything
            page: 1, // CRITICAL: Always page 1 to grab the entire dump
            dateField: "cancelledAt",
          }),
          getBookings({
            ...baseFilters,
            isOverPaidRefunded: "true",
            limit: 1000, // Fetch everything
            page: 1, // CRITICAL: Always page 1 to grab the entire dump
            dateField: "updatedAt",
          }),
        ]);

        if (!resRegularRefunds.success || !resOverpaidSettled.success) {
          throw new Error("Could not sync target history refund lists.");
        }

        const formattedRegular = resRegularRefunds.data?.formattedData || [];
        const formattedOverpaid = (
          resOverpaidSettled.data?.formattedData || []
        ).filter((b: any) => Number(b.overPaidRefund || 0) > 0);

        const unifiedHistoryList = [...formattedRegular, ...formattedOverpaid];

        // CLIENT-SIDE PAGINATION: Slice based on the actual visible limit (10)
        const startIndex = (page - 1) * limit;
        setBookings(unifiedHistoryList.slice(startIndex, startIndex + limit));
        setTotalItems(unifiedHistoryList.length);

        // Recalculate pending badge counter
        const [c1, c2] = await Promise.all([
          getBookings({
            ...baseFilters,
            status: "FOR_REFUND",
            limit: 1000,
            page: 1,
          }),
          getBookings({
            ...baseFilters,
            isOverPaidRefunded: "false",
            limit: 1000,
            page: 1,
          }),
        ]);

        const overpaidCount = (c2.data?.formattedData || []).filter(
          (b: any) => Number(b.overPaidRefund || 0) > 0,
        ).length;

        setPendingCount((c1.data?.meta?.total || 0) + overpaidCount);
      } else {
        // --- PENDING TAB ---
        const [resCancelled, resOverpaid] = await Promise.all([
          getBookings({
            ...baseFilters,
            status: "FOR_REFUND",
            limit: 1000,
            page: 1, // CRITICAL: Force page 1
            dateField: "cancelledAt",
          }),
          getBookings({
            ...baseFilters,
            isOverPaidRefunded: "false",
            limit: 1000,
            page: 1, // CRITICAL: Force page 1
            dateField: "createdAt",
          }),
        ]);

        if (!resCancelled.success || !resOverpaid.success) {
          throw new Error("Failed to capture unified refund logs.");
        }

        const formattedCancelled = resCancelled.data?.formattedData || [];
        const formattedOverpaid = (
          resOverpaid.data?.formattedData || []
        ).filter((b: any) => Number(b.overPaidRefund || 0) > 0);

        const unifiedPendingList = [
          ...formattedCancelled,
          ...formattedOverpaid,
        ];

        setPendingCount(unifiedPendingList.length);
        setTotalItems(unifiedPendingList.length);

        // CLIENT-SIDE PAGINATION
        const startIndex = (page - 1) * limit;
        setBookings(unifiedPendingList.slice(startIndex, startIndex + limit));
      }
    } catch (err: any) {
      setError(err.message || errorT("unexpectedNetwork"));
      toast.error(err.message || errorT("unexpectedNetwork"));
    } finally {
      setLoading(false);
    }
  }, [selectedBusinessId, activeTab, page]);

  useEffect(() => {
    fetchRefundTelemetry();
  }, [selectedBusinessId, activeTab, page, fetchRefundTelemetry]);

  const handleExecuteRefund = async (booking: any) => {
    try {
      setProcessingId(booking.id);

      const isCompleted = booking.status === "COMPLETED";

      if (!isCompleted) {
        throw new Error(
          "Refund cannot be processed without booking status COMPLETED.",
        );
      }

      const isOverpaid =
        booking.isOverPaidRefunded === false &&
        Number(booking.overPaidRefund || 0) > 0;

      const response = isOverpaid
        ? await settleOverpaidRefund(booking.id)
        : await makeRefund(booking.id);

      if (!response.success) {
        const responseMessage = (response as any)?.message;
        throw new Error(
          responseMessage || "Failed to finalize transaction execution.",
        );
      }

      // Reset UI confirmation state and display success alerts
      setActiveConfirmBooking(null);
      toast.success(
        isOverpaid
          ? label("settledSuccess", "Overpayment settled successfully!")
          : label("refundSuccess", "Refund processed successfully!"),
      );

      // Re-run standard getBookings sync state loader
      fetchRefundTelemetry();
    } catch (err: any) {
      toast.error(
        err.message || "Failed to complete processing refund request.",
      );
    } finally {
      setProcessingId(null);
    }
  };

  const totalPages = Math.ceil(totalItems / limit);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-5">
      <RefundFilters
        businesses={businesses}
        selectedBusinessId={selectedBusinessId}
        setSelectedBusinessId={setSelectedBusinessId}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingCount={pendingCount}
        loading={loading}
        onRefresh={fetchRefundTelemetry}
        managerView={translatedView}
      />

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-100 text-rose-700 text-xs font-medium rounded-xl flex items-center gap-2">
          <AlertCircle size={14} /> {error}
        </div>
      )}

      {loading ? (
        <div className="w-full h-64 flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-6 h-6 text-emerald-600 animate-spin" />
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            {label("loading", "Syncing operational data logs...")}
          </p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 border border-dashed border-slate-200 rounded-xl">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            {activeTab === "PENDING"
              ? label("emptyPending", "No parameters waiting review")
              : label("emptyHistory", "No settlement history present")}
          </p>
        </div>
      ) : (
        <>
          <RefundMobileList
            bookings={bookings}
            activeTab={activeTab}
            businesses={businesses}
            processingId={processingId}
            onSelectConfirm={setActiveConfirmBooking}
            managerView={translatedView}
          />
          <RefundTable
            bookings={bookings}
            activeTab={activeTab}
            businesses={businesses}
            processingId={processingId}
            onSelectConfirm={setActiveConfirmBooking}
            managerView={translatedView}
          />

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-xs font-medium text-slate-500">
              <span>
                {translatedView ? t("pagination", { page, pages: totalPages, total: totalItems }) : <>Showing page <strong className="text-slate-800">{page}</strong>{" "}of <strong className="text-slate-800">{totalPages}</strong> ({totalItems} records total)</>}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="p-1.5 border border-slate-200 rounded-lg disabled:opacity-50 cursor-pointer"
                >
                  ◀
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages}
                  className="p-1.5 border border-slate-200 rounded-lg disabled:opacity-50 cursor-pointer"
                >
                  ▶
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {activeConfirmBooking && (
        <RefundConfirmModal
          booking={activeConfirmBooking}
          processing={processingId === activeConfirmBooking.id}
          onClose={() => setActiveConfirmBooking(null)}
          onConfirm={handleExecuteRefund}
          managerView={translatedView}
        />
      )}
    </div>
  );
}
