/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { formatDistanceToNow } from "date-fns";
import { bn, enUS } from "date-fns/locale";
import {
  Bell,
  Calendar,
  Wallet,
  CheckCheck,
  Trash2,
  Loader2,
} from "lucide-react";
import { useNotificationsContext } from "@/contexts/NotificationsContext";
import { useLocale, useTranslations } from "next-intl";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";

const getNotificationVisual = (type: string) => {
  switch (type) {
    case "WEEKLY_PAYMENT":
      return {
        icon: Wallet,
        bg: "bg-emerald-100",
        iconColor: "text-emerald-600",
      };
    case "GAME_REMINDER":
      return { icon: Calendar, bg: "bg-blue-100", iconColor: "text-blue-600" };
    default:
      return { icon: Bell, bg: "bg-slate-100", iconColor: "text-slate-500" };
  }
};

interface AllNotificationsSheetProps {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  playerView?: boolean;
}

const AllNotificationsSheet = ({
  children,
  open,
  onOpenChange,
  playerView = false,
}: AllNotificationsSheetProps) => {
  const locale = useLocale();
  const t = useTranslations("notifications");
  const playerT = useTranslations("player.notificationList");
  const common = useTranslations("common");
  const message = (key: string) => playerView ? playerT(key) : t(key);
  const {
    data,
    loading,
    loadingMore,
    deletingId,
    unreadCount,
    hasNextPage,
    markAsRead,
    markAllAsRead,
    removeNotification,
    loadMore,
  } = useNotificationsContext();

  const groupedEntries = data?.groupByDate
    ? Object.entries(data.groupByDate)
    : [];
  const isEmpty = groupedEntries.length === 0;

  const handleDelete = (e: React.MouseEvent, notificationId: string) => {
    e.stopPropagation();
    removeNotification(notificationId);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {children && <SheetTrigger asChild>{children}</SheetTrigger>}

      <SheetContent
        side="right"
        className="w-full sm:max-w-md p-0 flex flex-col h-full bg-white border-l border-slate-200"
      >
        {/* HEADER */}
        <SheetHeader className="px-6 py-5 border-b border-slate-100 flex-row items-center justify-between gap-3 space-y-0 shrink-0">
          <div>
            <SheetTitle className="text-lg font-bold text-slate-900">
              {message("title")}
            </SheetTitle>
            <SheetDescription className="text-xs text-slate-400 mt-0.5">
              {playerView
                ? playerT("summary", { total: data?.meta?.total ?? 0, unread: unreadCount })
                : t("summary", { total: data?.meta?.total ?? 0, unread: unreadCount })}
            </SheetDescription>
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllAsRead}
              className="flex items-center gap-1.5 h-9 px-3.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors shrink-0 mr-6"
            >
              <CheckCheck className="h-3.5 w-3.5 text-emerald-700" />
              <span className="text-xs font-bold text-emerald-700">
                {message("markAllRead")}
              </span>
            </button>
          )}
        </SheetHeader>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="py-16 flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-slate-300" />
            </div>
          ) : isEmpty ? (
            <div className="py-16 text-center">
              <Bell className="h-8 w-8 mx-auto text-slate-300 mb-3" />
              <p className="text-sm font-semibold text-slate-500">
                {message("empty")}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {groupedEntries.map(([dateLabel, notifications]) => (
                <div key={dateLabel}>
                  <div className="px-6 pt-4 pb-1.5 bg-slate-50/60">
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                      {dateLabel}
                    </p>
                  </div>

                  {notifications.map((notification) => {
                    const {
                      icon: Icon,
                      bg,
                      iconColor,
                    } = getNotificationVisual(notification.type);
                    const isDeletingThis = deletingId === notification.id;

                    return (
                      <div
                        key={notification.id}
                        onClick={() => markAsRead(notification.id)}
                        className={`group relative px-6 py-4 cursor-pointer hover:bg-slate-50 transition-colors ${
                          !notification.isRead ? "bg-emerald-50/30" : "bg-white"
                        }`}
                      >
                        <div className="flex gap-3 w-full">
                          <div
                            className={`h-11 w-11 rounded-2xl flex items-center justify-center shrink-0 ${bg}`}
                          >
                            <Icon className={`h-4 w-4 ${iconColor}`} />
                          </div>

                          <div className="flex-1 min-w-0 pr-6">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="text-sm font-bold text-slate-900 leading-tight">
                                {notification.title}
                              </h4>
                              {!notification.isRead && (
                                <div className="h-2 w-2 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                              )}
                            </div>

                            <p className="mt-1 text-xs text-slate-500">
                              {notification.message}
                            </p>

                            <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                              {formatDistanceToNow(
                                new Date(notification.createdAt),
                                { addSuffix: true, locale: locale === "bn" ? bn : enUS }
                              )}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => handleDelete(e, notification.id)}
                            disabled={isDeletingThis}
                            className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity h-6 w-6 rounded-full bg-white border border-slate-200 hover:bg-rose-50 hover:border-rose-200 flex items-center justify-center shrink-0"
                            aria-label={message("delete")}
                          >
                            {isDeletingThis ? (
                              <Loader2 className="h-3 w-3 animate-spin text-slate-400" />
                            ) : (
                              <Trash2 className="h-3 w-3 text-slate-400 hover:text-rose-600" />
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FOOTER / LOAD MORE */}
        {hasNextPage && !loading && (
          <div className="p-4 border-t border-slate-100 shrink-0 bg-white">
            <button
              type="button"
              onClick={loadMore}
              disabled={loadingMore}
              className="w-full h-10 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loadingMore ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  {common("loading")}
                </>
              ) : (
                message("loadMore")
              )}
            </button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default AllNotificationsSheet;
