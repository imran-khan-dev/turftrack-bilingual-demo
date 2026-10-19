/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { createContext, useContext, ReactNode } from "react";
import { useNotifications, NotificationsData } from "@/hooks/useNotifications";

interface NotificationsContextValue {
  data: NotificationsData | null;
  loading: boolean;
  loadingMore: boolean;
  deletingId: string | null;
  unreadCount: number;
  hasNextPage: boolean;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  loadMore: () => void;
  refetch: () => void;
}

const NotificationsContext = createContext<NotificationsContextValue | null>(
  null,
);

export const NotificationsProvider = ({
  userId,
  playerView = false,
  children,
}: {
  userId?: string;
  playerView?: boolean;
  children: ReactNode;
}) => {
  const value = useNotifications(userId, { limit: 20, paginated: true, playerView });

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotificationsContext = () => {
  const ctx = useContext(NotificationsContext);
  if (!ctx) {
    throw new Error(
      "useNotificationsContext must be used within a NotificationsProvider",
    );
  }
  return ctx;
};
