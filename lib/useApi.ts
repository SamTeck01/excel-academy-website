"use client";
import { useCallback, useEffect, useState } from "react";
import { api, useStore } from "./client";

export type Loadable<T> = { data?: T; error?: string; loading: boolean; reload: () => void };

/** Loads an API path as the signed-in student; re-runs when they change. */
export function useApi<T>(path: string | null, pick: (body: any) => T): Loadable<T> {
  const { user } = useStore();
  const [data, setData] = useState<T>(),
    [error, setError] = useState<string>(),
    [loading, setLoading] = useState(true),
    [tick, setTick] = useState(0);

  useEffect(() => {
    if (!path || !user) return;
    let live = true;
    setLoading(true);
    setError(undefined);
    api(path)
      .then((b) => live && setData(pick(b)))
      .catch((e) => live && setError((e as Error).message))
      .finally(() => live && setLoading(false));
    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, user?.uid, tick]);

  return { data, error, loading, reload: useCallback(() => setTick((t) => t + 1), []) };
}

export type MyCourse = {
  id: string;
  _id?: string;
  title: string;
  thumbnail: string;
  program?: string;
  level?: string;
  lessonCount?: number;
  enrolledAt?: string | null;
  progress?: { percentage?: number; lessons_completed?: number; total_lessons?: number };
};
export const useMyCourses = () =>
  useApi<MyCourse[]>("/students/my-courses", (b) => ((b.AllCourses || []) as MyCourse[]).map((c) => ({ ...c, id: String(c.id || c._id) })));

export type Notice = { id?: string; title: string; body: string; type: string; createdAt: string; read: boolean; data?: Record<string, string> };
export const useNotifications = () =>
  useApi<{ items: Notice[]; unread: number }>("/notifications", (b) => ({ items: b.data?.items || [], unread: b.data?.unread || 0 }));
