"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/client";
import { type Notice, useNotifications } from "@/lib/useApi";
import { Empty, ErrorBox, PageHead, Skeleton } from "@/components/app/ui";

const TABS = [["all", "All"], ["activities", "Activities"], ["account", "My account"], ["news", "What's new"]] as const;

/** Where a notification leads on the web (same targets as the app). */
const target = (n: Notice) => {
  const d = n.data || {};
  switch (d.screen) {
    case "my_learning": return "/dashboard/courses";
    case "cart": return "/dashboard/explore";
    case "mock_exam": return d.courseId ? `/dashboard/mock-exams/${d.courseId}` : "/dashboard/mock-exams";
    default: return d.courseId ? `/learn/${d.courseId}` : null;
  }
};
const when = (iso: string) =>
  new Date(iso).toLocaleString("en-NG", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });

/** Everything sent to the student, newest first; opening it marks all as read. */
export default function NotificationsPage() {
  const notes = useNotifications();
  const [tab, setTab] = useState<(typeof TABS)[number][0]>("all");

  useEffect(() => {
    if (notes.data?.unread) api("/notifications/read", { method: "PATCH" }).catch(() => {});
  }, [notes.data?.unread]);

  const items = (notes.data?.items || []).filter((n) => tab === "all" || n.type === tab);

  return (
    <>
      <PageHead title="Notifications" sub="Announcements, payment confirmations, replies and rewards." />
      <div className="p-tabs" role="tablist">
        {TABS.map(([k, label]) => (
          <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? "is-active" : undefined} onClick={() => setTab(k)}>{label}</button>
        ))}
      </div>
      {notes.error ? (
        <ErrorBox message={notes.error} onRetry={notes.reload} />
      ) : notes.loading ? (
        <Skeleton h={72} n={5} />
      ) : items.length ? (
        <ul className="p-notes">
          {items.map((n, i) => {
            const href = target(n);
            const body = (
              <>
                <span className={`p-notes__dot p-notes__dot--${n.type}`} aria-hidden="true" />
                <div>
                  <strong>{n.title}</strong>
                  <p>{n.body}</p>
                  <small>{when(n.createdAt)}</small>
                </div>
              </>
            );
            return (
              <li key={n.id || i} className={n.read ? undefined : "is-unread"}>
                {href ? <a href={href}>{body}</a> : <div>{body}</div>}
              </li>
            );
          })}
        </ul>
      ) : (
        <Empty title="You're all caught up">New announcements and replies will appear here.</Empty>
      )}
    </>
  );
}
