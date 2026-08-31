"use client";

import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast, Toaster } from "sonner";
import { useNotifications } from "@/hooks/queries/useCommunication";
import type { StudentPromotionNotification } from "@/lib/api/communication";
import { queryKeys } from "@/lib/api/keys";

const STORAGE_KEY = "heightt:handled-academic-notifications";

function isPromotionData(
  data: unknown,
): data is StudentPromotionNotification {
  if (!data || typeof data !== "object") return false;
  const event = (data as { event?: unknown }).event;
  return event === "STUDENT_PROMOTED" || event === "STUDENT_GRADUATED";
}

export function AcademicNotificationListener() {
  const queryClient = useQueryClient();
  const { data: notifications = [] } = useNotifications({ limit: 20 });
  const handledIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    try {
      const savedIds = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "[]");
      if (Array.isArray(savedIds)) handledIds.current = new Set(savedIds);
    } catch {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    const academicNotifications = notifications.filter(
      (notification) =>
        !notification.read &&
        !handledIds.current.has(notification.id) &&
        isPromotionData(notification.data),
    );

    if (!academicNotifications.length) return;

    for (const notification of academicNotifications) {
      handledIds.current.add(notification.id);
      const data = notification.data as StudentPromotionNotification;

      if (data.event === "STUDENT_PROMOTED") {
        toast.success(
          `Congratulations! You have been promoted from ${data.previousLevel} to ${data.currentLevel} for the ${data.currentSession} academic session.`,
          { duration: 10_000 },
        );
      } else {
        toast.success(
          `You completed ${data.previousLevel} in the ${data.previousSession} academic session. Your academic status is now Graduated.`,
          { duration: 10_000 },
        );
      }
    }

    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(Array.from(handledIds.current).slice(-100)),
      );
    } catch {
      // Notifications still work when browser storage is unavailable.
    }

    void Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.user.current }),
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all }),
      queryClient.invalidateQueries({ queryKey: ["academic-records"] }),
      queryClient.invalidateQueries({ queryKey: ["promotion-history"] }),
      queryClient.invalidateQueries({ queryKey: ["academic-sessions"] }),
      queryClient.invalidateQueries({ queryKey: ["notifications"] }),
      queryClient.invalidateQueries({ queryKey: queryKeys.finance.myDues }),
    ]);
  }, [notifications, queryClient]);

  return <Toaster richColors position="top-center" />;
}
