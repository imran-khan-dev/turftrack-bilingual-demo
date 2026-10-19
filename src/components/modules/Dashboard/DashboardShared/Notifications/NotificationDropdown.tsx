/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { useRouter } from "next/navigation";
import { IAuthUser } from "@/types/user";
import { useNotificationsContext } from "@/contexts/NotificationsContext";
import AllNotificationsSheet from "./AllNotificationsSheet";
import { useLocale, useTranslations } from "next-intl";

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

interface NotificationDropdownProps {
  userInfo: IAuthUser;
}

export default function NotificationDropdown({
  userInfo,
}: NotificationDropdownProps) {
  const router = useRouter();
  const locale = useLocale();
  const userRole = userInfo?.role?.toLowerCase();
  const playerView = userInfo?.role === "PLAYER";
  const t = useTranslations("notifications");
  const playerT = useTranslations("player.notificationList");
  const message = (key: string) => playerView ? playerT(key) : t(key);

  const {
    data,
    loading,
    deletingId,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <AllNotificationsSheet playerView={playerView}>
          <button className="relative h-11 w-11 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 transition-all duration-200 flex items-center justify-center cursor-pointer">
            <Bell className="h-5 w-5 text-slate-700" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-emerald-100 text-[10px] font-black text-slate-900 flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>
        </AllNotificationsSheet>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-[min(360px,calc(100vw-16px))] sm:w-[400px] p-0 overflow-hidden rounded-2xl sm:rounded-[1.5rem] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.12)]"
      >
        <div className="px-6 py-5 border-b border-slate-100">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                {message("center")}
              </p>
              <h3 className="text-lg font-black italic uppercase tracking-tight text-slate-900">
                {message("title")}
              </h3>
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="flex items-center gap-1 h-7 px-3 rounded-full bg-emerald-100 hover:bg-emerald-200 transition-colors shrink-0 cursor-pointer"
              >
                <CheckCheck className="h-3 w-3 text-emerald-700" />
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700">
                  {message("markAllRead")}
                </span>
              </button>
            )}
          </div>
        </div>

        <div className="h-[400px] overflow-y-auto divide-y divide-slate-100 scrollbar-thin scrollbar-thumb-slate-200">
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-slate-300" />
            </div>
          ) : isEmpty ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <Bell className="h-8 w-8 text-slate-300 mb-3" />
              <p className="text-sm font-semibold text-slate-500">
                {message("empty")}
              </p>
            </div>
          ) : (
            <div>
              {groupedEntries.map(([dateLabel, notifications]) => (
                <div key={dateLabel}>
                  <div className="px-6 pt-3 pb-1 bg-slate-50/60 sticky top-0 z-10 backdrop-blur-sm">
                    <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
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
                        className={`group relative px-4 py-3 sm:px-6 sm:py-4 cursor-pointer hover:bg-slate-50 transition-colors ${
                          !notification.isRead ? "bg-emerald-50/30" : "bg-white"
                        }`}
                      >
                        <div className="flex gap-3 w-full">
                          <div
                            className={`h-9 w-9 sm:h-11 sm:w-11 rounded-2xl flex items-center justify-center shrink-0 ${bg}`}
                          >
                            <Icon className={`h-4 w-4 ${iconColor}`} />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="text-xs sm:text-sm font-black text-slate-900 leading-tight pr-4">
                                {notification.title}
                              </h4>
                              {!notification.isRead && (
                                <div className="h-2 w-2 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                              )}
                            </div>

                            <p className="mt-1 text-[11px] sm:text-xs text-slate-500 line-clamp-2">
                              {notification.message}
                            </p>

                            <p className="mt-2 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                            {formatDistanceToNow(
                              new Date(notification.createdAt),
                              { addSuffix: true, locale: locale === "bn" ? bn : enUS },
                            )}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => handleDelete(e, notification.id)}
                            disabled={isDeletingThis}
                            className="absolute top-3 right-3 sm:top-4 sm:right-4 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity h-6 w-6 rounded-full bg-white border border-slate-200 hover:bg-rose-50 hover:border-rose-200 flex items-center justify-center shrink-0 cursor-pointer"
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

        <div className="border-t border-slate-100 p-4 bg-white">
          <button
            type="button"
            onClick={() =>
              router.push(`/${userRole}/dashboard/all-notifications`)
            }
            className="w-full h-12 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black italic uppercase tracking-[0.15em] transition-all duration-200 cursor-pointer"
          >
            {message("viewAll")}
          </button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
