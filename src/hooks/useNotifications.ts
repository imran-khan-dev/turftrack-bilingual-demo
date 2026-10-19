/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getNotifications } from "@/services/notifications/getNotifications";
import { markNotificationRead } from "@/services/notifications/markNotificationRead";
import { markAllNotificationsRead } from "@/services/notifications/markAllNotificationsRead";
import { deleteNotification } from "@/services/notifications/deleteNotification";
import { getSocket } from "@/lib/socket-io";
import { toast } from "sonner";
import { useLocale, useTranslations } from "next-intl";

export interface NotificationItem {
    id: string;
    title: string;
    message: string;
    type: string;
    metadata?: Record<string, any>;
    isRead: boolean;
    createdAt: string;
}

export interface NotificationsData {
    meta: {
        page: number;
        limit: number;
        total: number;
        unreadCount: number;
        hasNextPage: boolean;
    };
    groupByDate: Record<string, NotificationItem[]>;
    allNotifications: NotificationItem[];
}

const todayLabel = (locale: string) =>
    new Date().toLocaleDateString(locale === "bn" ? "bn-BD" : "en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });

const mergeGroupByDate = (
    prevGroups: Record<string, NotificationItem[]>,
    newGroups: Record<string, NotificationItem[]>,
) => {
    const merged: Record<string, NotificationItem[]> = { ...prevGroups };
    Object.entries(newGroups).forEach(([date, items]) => {
        merged[date] = [...(merged[date] || []), ...items];
    });
    return merged;
};

interface UseNotificationsOptions {
    limit?: number;
    paginated?: boolean;
    playerView?: boolean;
}

export const useNotifications = (
    userId?: string,
    options: UseNotificationsOptions = {},
) => {
    const { limit = 15, paginated = false, playerView = false } = options;
    const locale = useLocale();
    const t = useTranslations("notifications");
    const playerT = useTranslations("player.notificationList");
    const message = useCallback(
        (key: string) => playerView ? playerT(key) : t(key),
        [playerView, playerT, t],
    );

    const [data, setData] = useState<NotificationsData | null>(null);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const socketRef = useRef<ReturnType<typeof getSocket> | null>(null);

    const fetchPage = useCallback(
        async (pageNum: number, append: boolean) => {
            if (append) {
                setLoadingMore(true);
            } else {
                setLoading(true);
            }

            const res = await getNotifications({ page: pageNum, limit });

            if (res.success) {
                setData((prev) => {
                    if (!append || !prev) return res.data;

                    return {
                        meta: res.data.meta,
                        groupByDate: mergeGroupByDate(prev.groupByDate, res.data.groupByDate),
                        allNotifications: [...prev.allNotifications, ...res.data.allNotifications],
                    };
                });
            } else {
                toast.error(res.message || message("loadFailed"));
            }

            setLoading(false);
            setLoadingMore(false);
        },
        [limit, message],
    );

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchPage(1, false);
        }, 0);
        return () => clearTimeout(timer);
    }, [fetchPage]);

    const loadMore = useCallback(() => {
        if (!paginated) return;
        const nextPage = page + 1;
        setPage(nextPage);
        fetchPage(nextPage, true);
    }, [paginated, page, fetchPage]);

    const refetch = useCallback(() => {
        setPage(1);
        fetchPage(1, false);
    }, [fetchPage]);

    useEffect(() => {
        if (!userId) return;

        const socket = getSocket(userId);
        socketRef.current = socket;

        if (!socket.connected) {
            socket.connect();
        }

        const handleNewNotification = (incoming: Partial<NotificationItem>) => {
            const newItem: NotificationItem = {
                id: incoming.id || `temp-${Date.now()}`,
                title: incoming.title || message("newNotification"),
                message: incoming.message || "",
                type: incoming.type || "GENERAL",
                metadata: incoming.metadata,
                isRead: false,
                createdAt: incoming.createdAt || new Date().toISOString(),
            };

            setData((prev) => {
                const label = todayLabel(locale);

                if (!prev) {
                    return {
                        meta: { page: 1, limit, total: 1, unreadCount: 1, hasNextPage: false },
                        groupByDate: { [label]: [newItem] },
                        allNotifications: [newItem],
                    };
                }

                const existingToday = prev.groupByDate[label] || [];

                return {
                    ...prev,
                    meta: {
                        ...prev.meta,
                        total: prev.meta.total + 1,
                        unreadCount: prev.meta.unreadCount + 1,
                    },
                    groupByDate: {
                        [label]: [newItem, ...existingToday],
                        ...prev.groupByDate,
                    },
                    allNotifications: [newItem, ...prev.allNotifications],
                };
            });

            toast.message(newItem.title, { description: newItem.message });
        };

        socket.on("NEW_NOTIFICATION", handleNewNotification);

        return () => {
            socket.off("NEW_NOTIFICATION", handleNewNotification);
        };
    }, [userId, limit, playerView, message, locale]);

    const markAsRead = useCallback(
        (notificationId: string) => {
            setData((prev) => {
                if (!prev) return prev;
                const target = prev.allNotifications.find((n) => n.id === notificationId);
                if (!target || target.isRead) return prev;

                return {
                    ...prev,
                    meta: { ...prev.meta, unreadCount: Math.max(0, prev.meta.unreadCount - 1) },
                    groupByDate: Object.fromEntries(
                        Object.entries(prev.groupByDate).map(([date, items]) => [
                            date,
                            items.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n)),
                        ]),
                    ),
                    allNotifications: prev.allNotifications.map((n) =>
                        n.id === notificationId ? { ...n, isRead: true } : n,
                    ),
                };
            });

            markNotificationRead(notificationId).then((res) => {
                if (!res.success) {
                    toast.error(res.message || message("markFailed"));
                    refetch();
                }
            });
        },
        [refetch, message],
    );

    const markAllAsRead = useCallback(() => {
        setData((prev) => {
            if (!prev || prev.meta.unreadCount === 0) return prev;
            return {
                ...prev,
                meta: { ...prev.meta, unreadCount: 0 },
                groupByDate: Object.fromEntries(
                    Object.entries(prev.groupByDate).map(([date, items]) => [
                        date,
                        items.map((n) => ({ ...n, isRead: true })),
                    ]),
                ),
                allNotifications: prev.allNotifications.map((n) => ({ ...n, isRead: true })),
            };
        });

        markAllNotificationsRead().then((res) => {
            if (res.success) {
                toast.success(message("markAllSuccess"));
            } else {
                toast.error(res.message || message("markAllFailed"));
                refetch();
            }
        });
    }, [refetch, message]);

    const removeNotification = useCallback((notificationId: string) => {
        setDeletingId(notificationId);

        deleteNotification(notificationId).then((res) => {
            if (res.success) {
                setData((prev) => {
                    if (!prev) return prev;
                    return {
                        ...prev,
                        groupByDate: Object.fromEntries(
                            Object.entries(prev.groupByDate)
                                .map(([date, items]) => [date, items.filter((n) => n.id !== notificationId)])
                                .filter(([, items]) => (items as NotificationItem[]).length > 0),
                        ),
                        allNotifications: prev.allNotifications.filter((n) => n.id !== notificationId),
                    };
                });
            } else {
                toast.error(res.message || message("deleteFailed"));
            }
            setDeletingId(null);
        });
    }, [message]);

    return {
        data,
        loading,
        loadingMore,
        deletingId,
        unreadCount: data?.meta?.unreadCount ?? 0,
        hasNextPage: data?.meta?.hasNextPage ?? false,
        markAsRead,
        markAllAsRead,
        removeNotification,
        loadMore,
        refetch,
    };
};
