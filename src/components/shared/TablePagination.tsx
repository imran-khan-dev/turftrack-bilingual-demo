"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
}

const TablePagination = ({ currentPage, totalPages }: TablePaginationProps) => {
  const router = useRouter();
  const t = useTranslations("common");
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();

  const navigateToPage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());

    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  const changeLimit = (newLimit: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("limit", newLimit);
    params.set("page", "1"); // Reset to first page when changing limit

    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  const currentLimit = searchParams.get("limit") || "10";

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 pt-4 px-1">
      {/* Items per page and Page status indicator */}
      <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500 order-2 sm:order-1">
        <span>
          {t("page.label")} {currentPage} {t("of")} {totalPages || 1}
        </span>

        <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
          <span>{t("items.per.page")}</span>
          <Select
            value={currentLimit}
            onValueChange={changeLimit}
            disabled={isPending}
          >
            <SelectTrigger className="w-[65px] h-8 text-xs font-bold text-slate-700 bg-slate-50 border-green-200 rounded-xl px-2.5 focus:ring-1 focus:ring-green-400 focus:border-green-400 transition-colors cursor-pointer">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl bg-white border-slate-200 shadow-md min-w-[65px]">
              {["5", "10", "20", "50", "100"].map((limit) => (
                <SelectItem
                  key={limit}
                  value={limit}
                  className="text-xs text-slate-800 font-semibold rounded-lg cursor-pointer focus:bg-slate-50 focus:text-slate-900"
                >
                  {limit}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Pagination Action Controls */}
      <div className="flex items-center gap-1.5 order-1 sm:order-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigateToPage(currentPage - 1)}
          disabled={currentPage <= 1 || isPending}
          className="h-8 rounded-xl px-3 text-xs font-semibold border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50"
        >
          <ChevronLeft className="h-3.5 w-3.5 mr-1 stroke-[2.5]" />
          {t("previous")}
        </Button>

        <div className="flex items-center gap-1">
          {Array.from({ length: Math.min(5, totalPages) }, (_, index) => {
            let pageNumber;

            if (totalPages <= 5) {
              pageNumber = index + 1;
            } else if (currentPage <= 3) {
              pageNumber = index + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNumber = totalPages - 4 + index;
            } else {
              pageNumber = currentPage - 2 + index;
            }

            const isActive = pageNumber === currentPage;

            return (
              <Button
                key={pageNumber}
                size="sm"
                onClick={() => navigateToPage(pageNumber)}
                disabled={isPending}
                className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? "bg-slate-900 text-white hover:bg-slate-800 shadow-sm"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {pageNumber}
              </Button>
            );
          })}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => navigateToPage(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0 || isPending}
          className="h-8 rounded-xl px-3 text-xs font-semibold border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50"
        >
          {t("next")}
          <ChevronRight className="h-3.5 w-3.5 ml-1 stroke-[2.5]" />
        </Button>
      </div>
    </div>
  );
};

export default TablePagination;
