/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Edit,
  Eye,
  Loader2,
  MoreHorizontal,
  Receipt,
  Trash,
  XCircle,
  CalendarDays,
  CheckCircle2,
  AlertTriangle,
  DollarSign,
  CreditCard,
  Coins,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useTransition } from "react";
import { useTranslations } from "next-intl";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

export interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  className?: string;
  sortKey?: string;
}

interface ManagementTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onView?: (row: T, isBookings: boolean) => void;
  onInvoice?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onCancelBooking?: (row: T) => void;
  onRescheduleBooking?: (row: T) => void;
  onActivate?: (row: T) => void;
  onDeactivate?: (row: T) => void;
  onSpecialPricing?: (row: T) => void;
  onToggleSpecial?: (row: T) => void;
  onRecordPayment?: (row: T) => void; // ADDED
  onSettleFee?: (row: T) => void; // ADDED
  getRowKey: (row: T) => string;
  emptyMessage?: string;
  isRefreshing?: boolean;
  isBookings?: boolean;
  isFields?: boolean;
  isPlayers?: boolean;
}

function ManagementTable<T>({
  data = [],
  columns = [],
  onView,
  onInvoice,
  onEdit,
  onDelete,
  onCancelBooking,
  onRescheduleBooking,
  onActivate,
  onDeactivate,
  onSpecialPricing,
  onToggleSpecial,
  onRecordPayment, // ADDED
  onSettleFee, // ADDED
  getRowKey,
  emptyMessage,
  isRefreshing = false,
  isBookings = false,
  isFields = false,
  isPlayers = false,
}: ManagementTableProps<T>) {
  const t = useTranslations("common");
  const resolvedEmptyMessage = emptyMessage ?? t("noRecordsFound");
  const hasActions =
    onView ||
    (isBookings && (onInvoice || onCancelBooking || onRescheduleBooking)) ||
    (!isBookings && (onActivate || onDeactivate || onEdit)) ||
    (isFields && onSpecialPricing) ||
    (isPlayers && onToggleSpecial) ||
    onRecordPayment ||
    onSettleFee ||
    onDelete;

  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const currentSortBy = searchParams.get("sortBy") || "";
  const currentSortOrder = searchParams.get("sortOrder") || "desc";

  const handleSort = (sortKey: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (currentSortBy === sortKey) {
      const newOrder = currentSortOrder === "asc" ? "desc" : "asc";
      params.set("sortOrder", newOrder);
    } else {
      params.set("sortBy", sortKey);
      params.set("sortOrder", "desc");
    }

    params.set("page", "1");

    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  const getSortIcon = (sortKey?: string) => {
    if (!sortKey) return null;

    if (currentSortBy !== sortKey) {
      return (
        <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 text-slate-400 stroke-[2]" />
      );
    }

    return currentSortOrder === "asc" ? (
      <ArrowUp className="ml-1.5 h-3.5 w-3.5 text-green-600 stroke-[2.5]" />
    ) : (
      <ArrowDown className="ml-1.5 h-3.5 w-3.5 text-green-600 stroke-[2.5]" />
    );
  };

  const ActionMenu = ({ item }: { item: T }) => {
    const isItemActive = (item as any)?.isActive === true || "ACTIVE";

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 sm:h-7 sm:w-7 rounded-xl border border-slate-100 sm:border-transparent p-0 text-slate-400 hover:text-slate-700 hover:bg-slate-100 focus-visible:ring-1 focus-visible:ring-green-400 transition-all"
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">{t("open.menu")}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="rounded-xl border-slate-200 shadow-md bg-white min-w-[170px]"
        >
          {onView && (
            <DropdownMenuItem
              onClick={() => onView(item, isBookings)}
              className="text-xs text-slate-700 font-semibold rounded-lg cursor-pointer focus:bg-slate-50 focus:text-slate-900 gap-2"
            >
              <Eye className="h-3.5 w-3.5 text-slate-400 stroke-[2]" />
              {t("view.details")}
            </DropdownMenuItem>
          )}

          {/* Record Payment Action */}
          {onRecordPayment && (
            <DropdownMenuItem
              onClick={() => onRecordPayment(item)}
              className="text-xs text-emerald-600 font-bold rounded-lg cursor-pointer focus:bg-emerald-50 focus:text-emerald-700 gap-2"
            >
              <CreditCard className="h-3.5 w-3.5 text-emerald-500 stroke-[2.5]" />
              {t("record.payment")}
            </DropdownMenuItem>
          )}

          {/* Settle Fee Action */}
          {onSettleFee && (
            <DropdownMenuItem
              onClick={() => onSettleFee(item)}
              className="text-xs text-rose-600 font-bold rounded-lg cursor-pointer focus:bg-rose-50 focus:text-rose-700 gap-2"
            >
              <Coins className="h-3.5 w-3.5 text-rose-500 stroke-[2.5]" />
              {t("settle.fee")}
            </DropdownMenuItem>
          )}

          {isBookings && onInvoice && (
            <DropdownMenuItem
              onClick={() => onInvoice(item)}
              className="text-xs text-slate-700 font-semibold rounded-lg cursor-pointer focus:bg-slate-50 focus:text-slate-900 gap-2"
            >
              <Receipt className="h-3.5 w-3.5 text-slate-400 stroke-[2]" />
              {t("view.invoice")}
            </DropdownMenuItem>
          )}

          {isBookings && onRescheduleBooking && (
            <DropdownMenuItem
              onClick={() => onRescheduleBooking(item)}
              className="text-xs text-slate-700 font-semibold rounded-lg cursor-pointer focus:bg-slate-50 focus:text-slate-900 gap-2"
            >
              <CalendarDays className="h-3.5 w-3.5 text-slate-400 stroke-[2]" />
              {t("reschedule")}
            </DropdownMenuItem>
          )}

          {/* Special Pricing Action Hook for Field Rows */}
          {isFields && onSpecialPricing && (
            <DropdownMenuItem
              onClick={() => onSpecialPricing(item)}
              className="text-xs text-emerald-600 font-bold rounded-lg cursor-pointer focus:bg-emerald-50 focus:text-emerald-700 gap-2"
            >
              <DollarSign className="h-3.5 w-3.5 text-emerald-500 stroke-[2.5]" />
              Special Pricing
            </DropdownMenuItem>
          )}

          {/* Toggle special status for Player Rows */}
          {isPlayers && onToggleSpecial && (
            <DropdownMenuItem
              onClick={() => onToggleSpecial(item)}
              className="text-xs font-bold rounded-lg cursor-pointer text-slate-700 focus:bg-slate-50 focus:text-slate-900"
            >
              {t("toggle.special")}
            </DropdownMenuItem>
          )}

          {onEdit && !isBookings && (
            <DropdownMenuItem
              onClick={() => onEdit(item)}
              className="text-xs text-slate-700 font-semibold rounded-lg cursor-pointer focus:bg-slate-50 focus:text-slate-900 gap-2"
            >
              <Edit className="h-3.5 w-3.5 text-slate-400 stroke-[2]" />
              {t("edit.record")}
            </DropdownMenuItem>
          )}

          {!isBookings && onActivate && !isItemActive && (
            <DropdownMenuItem
              onClick={() => onActivate(item)}
              className="text-xs text-emerald-600 font-semibold rounded-lg cursor-pointer focus:bg-emerald-50 focus:text-emerald-700 gap-2"
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 stroke-[2]" />
              {t("activate")}
            </DropdownMenuItem>
          )}

          {!isBookings && onDeactivate && isItemActive && (
            <DropdownMenuItem
              onClick={() => onDeactivate(item)}
              className="text-xs text-amber-600 font-semibold rounded-lg cursor-pointer focus:bg-amber-50 focus:text-amber-700 gap-2"
            >
              <AlertTriangle className="h-3.5 w-3.5 text-amber-500 stroke-[2]" />
              {t("deactivate")}
            </DropdownMenuItem>
          )}

          {isBookings && onCancelBooking && (
            <DropdownMenuItem
              onClick={() => onCancelBooking(item)}
              className="text-xs text-amber-600 font-semibold rounded-lg cursor-pointer focus:bg-amber-50 focus:text-amber-700 gap-2"
            >
              <XCircle className="h-3.5 w-3.5 text-amber-500 stroke-[2]" />
              Cancel Booking
            </DropdownMenuItem>
          )}

          {onDelete && (
            <DropdownMenuItem
              onClick={() => onDelete(item)}
              className="text-xs text-red-600 font-semibold rounded-lg cursor-pointer focus:bg-red-50 focus:text-red-700 gap-2"
            >
              <Trash className="h-3.5 w-3.5 text-red-400 stroke-[2]" />
              {t("delete")}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <div className="relative w-full">
      {/* Refreshing Overlay */}
      {isRefreshing && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex items-center justify-center z-10 rounded-2xl">
          <div className="flex flex-col items-center gap-2 bg-white px-6 py-4 rounded-xl border border-slate-100 shadow-sm">
            <Loader2 className="h-5 w-5 animate-spin text-green-600 stroke-[2.5]" />
            <p className="text-xs font-bold text-slate-700">
              {t("updating.live.records")}
            </p>
          </div>
        </div>
      )}

      {/* 1. Mobile View */}
      <div className="block sm:hidden space-y-3">
        {data.length === 0 ? (
          <div className="text-center py-12 text-xs font-semibold text-slate-400 bg-white border border-slate-200 rounded-2xl shadow-sm">
            {resolvedEmptyMessage}
          </div>
        ) : (
          data.map((item) => (
            <div
              key={getRowKey(item)}
              className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3 relative"
            >
              {hasActions && (
                <div className="absolute top-3 right-3">
                  <ActionMenu item={item} />
                </div>
              )}

              <div className="grid grid-cols-2 gap-x-2 gap-y-3 pr-8">
                {columns.map((col, idx) => (
                  <div key={idx} className="space-y-0.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      {col.header}
                    </span>
                    <div
                      className={`text-xs font-bold text-slate-800 break-words ${col.className || ""}`}
                    >
                      {typeof col.accessor === "function"
                        ? col.accessor(item)
                        : String(item[col.accessor] ?? "-")}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* 2. Desktop View */}
      <div className="hidden sm:block rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/70 border-b border-slate-200">
            <TableRow className="hover:bg-transparent">
              {columns?.map((column, colIndex) => (
                <TableHead
                  key={colIndex}
                  className={`h-10 text-xs font-bold text-slate-500 uppercase tracking-wider px-4 ${column.className || ""}`}
                >
                  {column.sortKey ? (
                    <button
                      type="button"
                      onClick={() => handleSort(column.sortKey!)}
                      className="flex items-center hover:text-slate-900 transition-colors cursor-pointer font-bold uppercase select-none outline-none focus-visible:text-slate-900"
                    >
                      {column.header}
                      {getSortIcon(column.sortKey)}
                    </button>
                  ) : (
                    column.header
                  )}
                </TableHead>
              ))}
              {hasActions && (
                <TableHead className="h-10 text-xs font-bold text-slate-500 uppercase tracking-wider px-4 text-right w-[80px]">
                  {t("actions")}
                </TableHead>
              )}
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (hasActions ? 1 : 0)}
                  className="text-center py-12 text-xs font-semibold text-slate-400 bg-white"
                >
                {resolvedEmptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              data?.map((item) => (
                <TableRow
                  key={getRowKey(item)}
                  className="border-b border-slate-100 hover:bg-slate-50/40 transition-colors group"
                >
                  {columns.map((col, idx) => (
                    <TableCell
                      key={idx}
                      className={`px-4 py-3 text-xs font-semibold text-slate-700 max-w-[240px] truncate ${col.className || ""}`}
                    >
                      {typeof col.accessor === "function"
                        ? col.accessor(item)
                        : String(item[col.accessor] ?? "-")}
                    </TableCell>
                  ))}
                  {hasActions && (
                    <TableCell className="px-4 py-3 text-right">
                      <ActionMenu item={item} />
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default ManagementTable;
